const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

/**
 * GET /api/health
 * Database-aware health inspection endpoint.
 * Returns HTTP 200 when database connectivity is healthy,
 * or HTTP 503 when the database is unreachable or degraded.
 */
async function handleHealthCheck(req, res) {
  const requestStart = Date.now();
  try {
    const dbStart = Date.now();
    await pool.query('SELECT 1');
    const dbLatency = Date.now() - dbStart;

    return res.status(200).json({
      status: 'ok',
      service: 'statiqone-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'connected',
        latencyMs: dbLatency,
        latency_ms: dbLatency,
      },
      latency_ms: dbLatency,
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (err) {
    const totalLatency = Date.now() - requestStart;
    return res.status(503).json({
      status: 'degraded',
      service: 'statiqone-backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'disconnected',
        error: err.message,
      },
      latency_ms: totalLatency,
      error: 'database_unavailable',
    });
  }
}

router.get('/', handleHealthCheck);
router.get('/health', handleHealthCheck);

module.exports = router;
module.exports.handleHealthCheck = handleHealthCheck;
module.exports.router = router;
