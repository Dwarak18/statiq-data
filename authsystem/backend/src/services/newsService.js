/**
 * STATIQONE Global Insurance Intelligence - News Service
 * Requirements: R2 (Global Insurance Intelligence News Feed)
 * Aggregates RSS/Atom feeds from 4 major global insurance publications:
 *   1. Insurance Journal (USA)
 *   2. Reinsurance News (Global)
 *   3. The Insurer (Europe/Asia)
 *   4. Business Insurance (USA)
 *
 * Provides:
 *   - Resilient XML/RSS parser with multi-feed fallback
 *   - Contextual regional classifier (USA, Europe, Asia, Global)
 *   - PostgreSQL schema persistence (`news_articles`, `news_feed_sources`) with GUID hash deduplication
 *   - In-memory hot cache fallback when database is disconnected
 *   - 15-minute background auto-refresh cron
 *   - Tier-gated queries (Free: max 3 per region; Monthly/Annual/Admin: full feed)
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');
const { SEED_ARTICLES, SEED_FEED_SOURCES, computeHash } = require('../data/seedNews');

// Attempt to load database pool, with graceful fallback
let dbPool = null;
try {
  dbPool = require('../db/pool');
} catch (e) {
  console.warn('[NewsService] Database pool not initialized, using memory store.');
}

const FEED_CONFIGS = [
  {
    id: 'insurance-journal',
    name: 'Insurance Journal',
    sourceCode: 'IJ',
    url: 'https://www.insurancejournal.com/rss/news/',
    fallbackUrl: 'https://www.insurancejournal.com/rss/news/national/',
    defaultRegion: 'USA',
    defaultCategory: 'Property & Casualty',
  },
  {
    id: 'reinsurance-news',
    name: 'Reinsurance News',
    sourceCode: 'RN',
    url: 'https://www.reinsurancene.ws/feed/',
    fallbackUrl: 'https://www.reinsurancene.ws/feed/?paged=1',
    defaultRegion: 'Global',
    defaultCategory: 'Reinsurance & ILS',
  },
  {
    id: 'the-insurer',
    name: 'The Insurer',
    sourceCode: 'TI',
    url: 'https://www.theinsurer.com/feed/',
    fallbackUrl: 'https://www.theinsurer.com/rss/',
    defaultRegion: 'Europe',
    defaultCategory: 'Specialty Lines',
  },
  {
    id: 'business-insurance',
    name: 'Business Insurance',
    sourceCode: 'BI',
    url: 'https://www.businessinsurance.com/section/rss?feed=rss',
    fallbackUrl: 'https://www.businessinsurance.com/rss',
    defaultRegion: 'USA',
    defaultCategory: 'Commercial Lines',
  },
];

// Fallback high-resolution editorial photography by category/region
const DEFAULT_IMAGES = {
  USA: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  Europe: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  Asia: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
  Global: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
};

// In-Memory Storage & Hot Cache
const memoryStore = {
  articles: new Map(), // guidHash -> Article Object
  sourcesStatus: new Map(), // sourceId -> Status Object
  lastRefreshedAt: new Date().toISOString(),
  isRefreshing: false,
  refreshTimer: null,
};

// Populate initial memory store from seeds
SEED_ARTICLES.forEach((art) => {
  memoryStore.articles.set(art.guidHash, { ...art });
});

FEED_CONFIGS.forEach((feed) => {
  memoryStore.sourcesStatus.set(feed.id, {
    id: feed.id,
    name: feed.name,
    sourceCode: feed.sourceCode,
    url: feed.url,
    region: feed.defaultRegion,
    status: 'healthy',
    lastFetchedAt: new Date().toISOString(),
    lastError: null,
    articleCount: SEED_ARTICLES.filter((a) => a.sourceCode === feed.sourceCode).length,
  });
});

/**
 * Clean & Unescape HTML and XML strings
 */
function cleanXmlText(str) {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, ' ') // Strip HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract image URL from enclosure, media tags, or raw description HTML
 */
function extractImageUrl(itemXml, descriptionRaw, region) {
  // 1. Enclosure url
  const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enclosureMatch && enclosureMatch[1]) return enclosureMatch[1];

  // 2. Media thumbnail / content
  const mediaMatch = itemXml.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch && mediaMatch[1]) return mediaMatch[1];

  // 3. Img src in description
  const imgMatch = (descriptionRaw || itemXml).match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) return imgMatch[1];

  // 4. Default by region
  return DEFAULT_IMAGES[region] || DEFAULT_IMAGES.Global;
}

/**
 * Contextual Regional Classifier
 */
function classifyRegion(feedDefaultRegion, title, description) {
  const text = `${title} ${description}`.toLowerCase();

  const asiaRegex = /\b(india|indian|indians|irdai|gic re|gi council|china|chinese|japan|japanese|singapore|hong kong|apac|asia|asian|tokyo marine|ping an|lic|niva bupa|star health|icici lombard|tata aig|general insurance council|bancassurance|korea|taiwan|asean|mas|malaysia|thailand|indonesia|vietnam|beijing|shanghai|mumbai|tokyo|delhi|bengaluru|seoul)\b/gi;
  const europeRegex = /\b(uk|london market|lloyd's|lloyds|munich re|swiss re|zurich|allianz|scor|eiopa|solvency ii|solvency 2|europe|european|germany|german|france|french|bermuda|pra|fca|generali|hiscox|beazley|lancashire|hannover re|continental|paris|frankfurt|madrid|milan|amsterdam)\b/gi;
  const usaRegex = /\b(us|usa|united states|fema|naic|california|florida|texas|new york|sec|am best|medicare|state farm|allstate|chubb|travelers|berkshire|aig|marsh|aon|willis|wsia|gulf coast|florida citizens|louisiana|carolina)\b/gi;
  const globalRegex = /\b(global|catastrophe bond|cat bond|ils|treaty renewal|worldwide|cop30|climate risk|retrocession|monte carlo|artemis|world bank|imf|multinational)\b/gi;

  const asiaMatches = text.match(asiaRegex) || [];
  const europeMatches = text.match(europeRegex) || [];
  const usaMatches = text.match(usaRegex) || [];
  const globalMatches = text.match(globalRegex) || [];

  let asiaScore = asiaMatches.length * 2;
  let europeScore = europeMatches.length * 2;
  let usaScore = usaMatches.length * 2;
  let globalScore = globalMatches.length * 2;

  if (feedDefaultRegion === 'Asia') asiaScore += 1;
  if (feedDefaultRegion === 'Europe') europeScore += 1;
  if (feedDefaultRegion === 'USA') usaScore += 1;
  if (feedDefaultRegion === 'Global') globalScore += 1;

  if (asiaScore > europeScore && asiaScore > usaScore && asiaScore > globalScore) return 'Asia';
  if (europeScore > asiaScore && europeScore > usaScore && europeScore > globalScore) return 'Europe';
  if (usaScore > asiaScore && usaScore > europeScore && usaScore > globalScore) return 'USA';
  if (globalScore > asiaScore && globalScore > europeScore && globalScore > usaScore) return 'Global';

  const maxScore = Math.max(asiaScore, europeScore, usaScore, globalScore);
  if (maxScore > 1) {
    if (asiaScore === maxScore) return 'Asia';
    if (europeScore === maxScore) return 'Europe';
    if (usaScore === maxScore) return 'USA';
    if (globalScore === maxScore) return 'Global';
  }

  return feedDefaultRegion || 'Global';
}

/**
 * Category Classifier based on keywords
 */
function classifyCategory(title, description, defaultCategory) {
  const text = `${title} ${description}`.toLowerCase();
  if (/\b(reinsurance|retrocession|ils|cat bond|treaty|quota share|monter carlo|artemis)\b/i.test(text)) {
    return 'Reinsurance & ILS';
  }
  if (/\b(solvency|irdai|eiopa|naic|sec|fema|regulatory|compliance|pra|fca|directive)\b/i.test(text)) {
    return 'Regulatory & Risk';
  }
  if (/\b(health|life|sahi|mediclaim|hospitalization|morbidity|mortality)\b/i.test(text)) {
    return 'Health & Solvency';
  }
  if (/\b(cyber|ransomware|edr|mfa|directors|casualty|liability|d&o|e&o|mass tort)\b/i.test(text)) {
    return 'Commercial Lines';
  }
  if (/\b(property|catastrophe|wildfire|hurricane|flood|homeowners|inland|hail)\b/i.test(text)) {
    return 'Property & Casualty';
  }
  return defaultCategory || 'Insurance Intelligence';
}

/**
 * HTTP/HTTPS Fetch with timeout and user-agent
 */
function fetchHttp(url, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) STATIQONE/1.0 NewsBot/1.0',
          'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
        },
        timeout: timeoutMs,
      },
      (res) => {
        // Follow redirect once
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchHttp(res.headers.location, timeoutMs).then(resolve).catch(reject);
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }

        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    });

    req.on('error', (err) => reject(err));
  });
}

/**
 * Pure Node.js XML/RSS/Atom Item Extractor
 */
function parseRssXml(xmlString, feedConfig) {
  const articles = [];
  if (!xmlString || typeof xmlString !== 'string') return articles;

  // Match RSS <item> tags or Atom <entry> tags
  const isAtom = /<feed[^>]*xmlns/i.test(xmlString) && /<entry/i.test(xmlString);
  const tagRegex = isAtom ? /<entry[\s\S]*?<\/entry>/gi : /<item[\s\S]*?<\/item>/gi;
  const items = xmlString.match(tagRegex) || [];

  for (const itemXml of items) {
    try {
      // 1. Title
      const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = cleanXmlText(titleMatch ? titleMatch[1] : '');
      if (!title) continue;

      // 2. Link
      let link = '';
      if (isAtom) {
        const linkMatch = itemXml.match(/<link[^>]+href=["']([^"']+)["']/i);
        link = linkMatch ? linkMatch[1] : '';
      } else {
        const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        link = linkMatch ? cleanXmlText(linkMatch[1]) : '';
      }
      if (!link) {
        const guidMatch = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i);
        if (guidMatch && guidMatch[1].startsWith('http')) link = cleanXmlText(guidMatch[1]);
      }
      if (!link) continue;

      // 3. Guid
      const guidMatch = itemXml.match(/<(?:guid|id)[^>]*>([\s\S]*?)<\/(?:guid|id)>/i);
      const guid = guidMatch ? cleanXmlText(guidMatch[1]) : link;

      // 4. Description / Content
      const descMatch = itemXml.match(/<(?:description|summary|content:encoded|content)[^>]*>([\s\S]*?)<\/(?:description|summary|content:encoded|content)>/i);
      const rawDesc = descMatch ? descMatch[1] : '';
      const description = cleanXmlText(rawDesc).slice(0, 450);

      // 5. PubDate
      const dateMatch = itemXml.match(/<(?:pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|published|updated|dc:date)>/i);
      let pubDate = new Date();
      if (dateMatch && dateMatch[1]) {
        const parsed = new Date(cleanXmlText(dateMatch[1]));
        if (!isNaN(parsed.getTime())) pubDate = parsed;
      }

      // 6. Author
      const authorMatch = itemXml.match(/<(?:dc:creator|author|creator)[^>]*>([\s\S]*?)<\/(?:dc:creator|author|creator)>/i);
      const author = cleanXmlText(authorMatch ? authorMatch[1] : feedConfig.name);

      // 7. Region & Category Classification
      const region = classifyRegion(feedConfig.defaultRegion, title, description);
      const category = classifyCategory(title, description, feedConfig.defaultCategory);

      // 8. Image URL
      const imageUrl = extractImageUrl(itemXml, rawDesc, region);

      // 9. Hash & ID
      const guidHash = computeHash(guid, link, title);
      const id = crypto.randomUUID ? crypto.randomUUID() : guidHash.slice(0, 36);

      articles.push({
        id,
        guidHash,
        source: feedConfig.name,
        sourceCode: feedConfig.sourceCode,
        title,
        description: description || `${feedConfig.name} market report and intelligence overview.`,
        link,
        pubDate: pubDate.toISOString(),
        region,
        category,
        author: author || feedConfig.name,
        imageUrl,
        fetchedAt: new Date().toISOString(),
      });
    } catch (e) {
      // Skip malformed item
    }
  }

  return articles;
}

/**
 * Initialize Database Tables
 */
async function initDatabaseSchema() {
  if (!dbPool) return;
  try {
    const client = await dbPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS news_articles (
            id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            guid_hash           CHAR(64) NOT NULL UNIQUE,
            source              VARCHAR(100) NOT NULL,
            source_code         VARCHAR(30) NOT NULL,
            title               TEXT NOT NULL,
            description         TEXT,
            link                TEXT NOT NULL,
            pub_date            TIMESTAMPTZ NOT NULL,
            region              VARCHAR(20) NOT NULL DEFAULT 'Global',
            category            VARCHAR(100) DEFAULT 'Insurance Intelligence',
            image_url           TEXT,
            author              VARCHAR(150),
            fetched_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
            created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_news_region_pubdate ON news_articles (region, pub_date DESC);
        CREATE INDEX IF NOT EXISTS idx_news_source_code ON news_articles (source_code);
        CREATE INDEX IF NOT EXISTS idx_news_guid_hash ON news_articles (guid_hash);

        CREATE TABLE IF NOT EXISTS news_feed_sources (
            id                  VARCHAR(50) PRIMARY KEY,
            name                VARCHAR(100) NOT NULL,
            source_code         VARCHAR(30) NOT NULL,
            url                 TEXT NOT NULL,
            region              VARCHAR(20) NOT NULL,
            status              VARCHAR(20) NOT NULL DEFAULT 'healthy',
            last_fetched_at     TIMESTAMPTZ,
            last_error          TEXT,
            article_count       INTEGER DEFAULT 0
        );
      `);

      // Seed initial sources in DB if table is empty
      for (const feed of FEED_CONFIGS) {
        await client.query(
          `INSERT INTO news_feed_sources (id, name, source_code, url, region, status, last_fetched_at)
           VALUES ($1, $2, $3, $4, $5, 'healthy', now())
           ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url, last_fetched_at = now()`,
          [feed.id, feed.name, feed.sourceCode, feed.url, feed.defaultRegion]
        );
      }

      // Seed initial articles if DB is empty
      const { rows } = await client.query('SELECT count(*) as cnt FROM news_articles');
      if (parseInt(rows[0].cnt, 10) === 0) {
        for (const art of SEED_ARTICLES) {
          await client.query(
            `INSERT INTO news_articles (guid_hash, source, source_code, title, description, link, pub_date, region, category, image_url, author)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             ON CONFLICT (guid_hash) DO NOTHING`,
            [art.guidHash, art.source, art.sourceCode, art.title, art.description, art.link, art.pubDate, art.region, art.category, art.imageUrl, art.author]
          );
        }
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('[NewsService] DB schema init note:', err.message);
  }
}

/**
 * Persist article to DB or update
 */
async function persistArticleToDb(article) {
  if (!dbPool) return;
  try {
    await dbPool.query(
      `INSERT INTO news_articles (guid_hash, source, source_code, title, description, link, pub_date, region, category, image_url, author, fetched_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now())
       ON CONFLICT (guid_hash) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         region = EXCLUDED.region,
         category = EXCLUDED.category,
         fetched_at = now()`,
      [article.guidHash, article.source, article.sourceCode, article.title, article.description, article.link, article.pubDate, article.region, article.category, article.imageUrl, article.author]
    );
  } catch (e) {
    // Graceful fallback to memory store
  }
}

/**
 * Fetch a single RSS feed with fallback URL support
 */
async function fetchFeed(feedConfig) {
  let xmlData = null;
  let fetchError = null;

  try {
    xmlData = await fetchHttp(feedConfig.url, 6000);
  } catch (err1) {
    console.warn(`[NewsService] Primary feed failed for ${feedConfig.name}: ${err1.message}, trying fallback URL...`);
    if (feedConfig.fallbackUrl) {
      try {
        xmlData = await fetchHttp(feedConfig.fallbackUrl, 6000);
      } catch (err2) {
        fetchError = err2.message;
      }
    } else {
      fetchError = err1.message;
    }
  }

  const currentStatus = memoryStore.sourcesStatus.get(feedConfig.id) || {
    id: feedConfig.id,
    name: feedConfig.name,
    sourceCode: feedConfig.sourceCode,
    url: feedConfig.url,
    region: feedConfig.defaultRegion,
  };

  if (fetchError || !xmlData) {
    currentStatus.status = 'degraded';
    currentStatus.lastError = fetchError || 'Empty feed response';
    currentStatus.lastFetchedAt = new Date().toISOString();
    memoryStore.sourcesStatus.set(feedConfig.id, currentStatus);
    return { feedConfig, articles: [], error: fetchError };
  }

  const articles = parseRssXml(xmlData, feedConfig);

  currentStatus.status = 'healthy';
  currentStatus.lastError = null;
  currentStatus.lastFetchedAt = new Date().toISOString();
  currentStatus.articleCount = articles.length || currentStatus.articleCount;
  memoryStore.sourcesStatus.set(feedConfig.id, currentStatus);

  return { feedConfig, articles, error: null };
}

/**
 * Aggregate All Feeds (Concurrent, Graceful Fallback)
 */
async function fetchAndCacheAllFeeds() {
  if (memoryStore.isRefreshing) {
    return {
      success: true,
      message: 'Refresh already in progress',
      lastRefreshed: memoryStore.lastRefreshedAt,
    };
  }

  memoryStore.isRefreshing = true;
  console.log('[NewsService] Starting 15-minute multi-feed aggregation cycle...');

  try {
    const results = await Promise.allSettled(FEED_CONFIGS.map((config) => fetchFeed(config)));
    let newArticlesCount = 0;

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.articles) {
        for (const art of result.value.articles) {
          if (!memoryStore.articles.has(art.guidHash)) {
            newArticlesCount++;
          }
          memoryStore.articles.set(art.guidHash, art);
          // Persist to PostgreSQL in background
          persistArticleToDb(art).catch(() => {});
        }
      }
    }

    memoryStore.lastRefreshedAt = new Date().toISOString();
    console.log(`[NewsService] Refresh cycle complete. Added ${newArticlesCount} new articles. Total cached: ${memoryStore.articles.size}`);

    return {
      success: true,
      newArticlesCount,
      totalCached: memoryStore.articles.size,
      lastRefreshed: memoryStore.lastRefreshedAt,
      sources: Array.from(memoryStore.sourcesStatus.values()),
    };
  } catch (err) {
    console.error('[NewsService] Refresh cycle encountered an issue:', err);
    return {
      success: false,
      error: err.message,
      totalCached: memoryStore.articles.size,
      lastRefreshed: memoryStore.lastRefreshedAt,
    };
  } finally {
    memoryStore.isRefreshing = false;
  }
}

/**
 * Query Filtered News Articles with Tier-Gating Enforcement
 *
 * Free Tier:
 *   - Maximum 3 items per region. Additional items are marked with isLocked = true and masked.
 *
 * Monthly / Annual / Admin Tier:
 *   - Full unrestricted feed access.
 */
async function getNewsArticles({
  region = 'all',
  source = 'all',
  search = '',
  limit = 20,
  offset = 0,
  page = 1,
  userTier = 'free',
  userRole = 'user',
} = {}) {
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const parsedPage = Math.max(1, parseInt(page, 10) || Math.floor((parseInt(offset, 10) || 0) / parsedLimit) + 1);
  const parsedOffset = (parsedPage - 1) * parsedLimit;

  // Determine active tier
  const isPaidOrAdmin = ['monthly', 'annual', 'admin'].includes(userTier) || userRole === 'admin';
  const effectiveTier = isPaidOrAdmin ? (userTier === 'free' ? 'monthly' : userTier) : 'free';

  let allArticles = [];

  // Try DB query first if available
  if (dbPool) {
    try {
      let query = 'SELECT * FROM news_articles WHERE 1=1';
      const params = [];

      if (region && region.toLowerCase() !== 'all') {
        params.push(region);
        query += ` AND LOWER(region) = LOWER($${params.length})`;
      }

      if (source && source.toLowerCase() !== 'all') {
        params.push(source);
        query += ` AND (LOWER(source_code) = LOWER($${params.length}) OR LOWER(source) = LOWER($${params.length}))`;
      }

      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length} OR author ILIKE $${params.length})`;
      }

      query += ' ORDER BY pub_date DESC';

      const { rows } = await dbPool.query(query, params);
      allArticles = rows.map((r) => ({
        id: r.id,
        guidHash: r.guid_hash,
        source: r.source,
        sourceCode: r.source_code,
        title: r.title,
        description: r.description,
        link: r.link,
        pubDate: r.pub_date ? new Date(r.pub_date).toISOString() : new Date().toISOString(),
        region: r.region,
        category: r.category,
        author: r.author,
        imageUrl: r.image_url,
      }));
    } catch (dbErr) {
      console.warn('[NewsService] Database query error, using memory store:', dbErr.message);
      allArticles = Array.from(memoryStore.articles.values());
    }
  } else {
    allArticles = Array.from(memoryStore.articles.values());
  }

  // If DB returned 0, ensure we use memory store / seed data
  if (allArticles.length === 0) {
    allArticles = Array.from(memoryStore.articles.values());
  }

  // Calculate overall regional distribution counts
  const regionCounts = {
    all: allArticles.length,
    USA: allArticles.filter((a) => a.region === 'USA').length,
    Europe: allArticles.filter((a) => a.region === 'Europe').length,
    Asia: allArticles.filter((a) => a.region === 'Asia').length,
    Global: allArticles.filter((a) => a.region === 'Global').length,
  };

  // In-memory filter if not using DB results
  let filtered = allArticles;
  if (region && region.toLowerCase() !== 'all') {
    filtered = filtered.filter((a) => a.region.toLowerCase() === region.toLowerCase());
  }
  if (source && source.toLowerCase() !== 'all') {
    filtered = filtered.filter(
      (a) => a.sourceCode.toLowerCase() === source.toLowerCase() || a.source.toLowerCase() === source.toLowerCase()
    );
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (a) =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        (a.author && a.author.toLowerCase().includes(q))
    );
  }

  // Sort descending by publication date
  filtered.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const totalMatching = filtered.length;

  // Apply Tier-Gating
  let resultArticles = [];
  const FREE_TIER_LIMIT_PER_REGION = 3;

  if (isPaidOrAdmin) {
    // Paid / Admin: Unlocked full feed with pagination
    resultArticles = filtered.slice(parsedOffset, parsedOffset + parsedLimit).map((a) => ({
      ...a,
      isLocked: false,
    }));
  } else {
    // Free Tier: Gated
    if (region && region.toLowerCase() !== 'all') {
      // Single region selected: return max 3 unlocked, mark subsequent as locked
      resultArticles = filtered.slice(0, FREE_TIER_LIMIT_PER_REGION).map((a) => ({
        ...a,
        isLocked: false,
      }));
    } else {
      // 'All' regions selected: enforce max 3 items for EACH region
      const regionalBuckets = { USA: 0, Europe: 0, Asia: 0, Global: 0 };
      const allowed = [];

      for (const art of filtered) {
        const reg = art.region || 'Global';
        if ((regionalBuckets[reg] || 0) < FREE_TIER_LIMIT_PER_REGION) {
          regionalBuckets[reg] = (regionalBuckets[reg] || 0) + 1;
          allowed.push({ ...art, isLocked: false });
        }
      }
      resultArticles = allowed;
    }
  }

  return {
    success: true,
    articles: resultArticles,
    total: totalMatching,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(totalMatching / parsedLimit) || 1,
    tier: effectiveTier,
    isGated: !isPaidOrAdmin,
    allowedPerRegion: FREE_TIER_LIMIT_PER_REGION,
    regionCounts,
    lastRefreshed: memoryStore.lastRefreshedAt,
    sources: Array.from(memoryStore.sourcesStatus.values()),
  };
}

/**
 * Get Source Health & Refreshed Timestamps
 */
function getSourcesStatus() {
  return {
    success: true,
    lastRefreshed: memoryStore.lastRefreshedAt,
    refreshIntervalMinutes: 15,
    sources: Array.from(memoryStore.sourcesStatus.values()),
    totalArticlesCached: memoryStore.articles.size,
  };
}

/**
 * Initialize News Service on Server Startup
 */
async function initNewsService() {
  console.log('[NewsService] Initializing Global Insurance News Service...');
  try {
    await initDatabaseSchema();
  } catch (err) {
    console.warn('[NewsService] Schema init warning:', err.message);
  }

  // Prime feeds initially
  fetchAndCacheAllFeeds().catch((err) => {
    console.warn('[NewsService] Initial feed aggregation note:', err.message);
  });

  // Schedule 15-minute background refresh
  if (memoryStore.refreshTimer) clearInterval(memoryStore.refreshTimer);
  memoryStore.refreshTimer = setInterval(() => {
    fetchAndCacheAllFeeds().catch((e) => console.error('[NewsService] Cron error:', e));
  }, 15 * 60 * 1000);

  console.log('[NewsService] Background 15-minute cron registered.');
}

module.exports = {
  initNewsService,
  fetchAndCacheAllFeeds,
  getNewsArticles,
  getSourcesStatus,
  classifyRegion,
  classifyCategory,
  cleanXmlText,
  parseRssXml,
  memoryStore,
};
