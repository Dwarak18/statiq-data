import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, type Easing } from 'motion/react';
import { Layout } from '@/components/layout/Layout';
import {
  Code2, Globe, Server, BarChart2,
  Lightbulb, Megaphone, Database, Building2, Package,
  Users, Handshake, ArrowRight, CheckCircle2,
  MonitorSmartphone, CloudCog, BrainCircuit,
  ShieldCheck, TrendingUp, Mail,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';

// ─────────────────── Data ───────────────────

const SERVICES = [
  {
    icon: Code2,
    title: 'Software Development',
    desc: 'Custom software, mobile applications, web portals, and analytical platforms designed, built, and maintained.',
  },
  {
    icon: CloudCog,
    title: 'Cloud & Data Infrastructure',
    desc: 'Managed services, cloud data pipelines, system integration, high-throughput REST/WebSocket feeds, and operational support.',
  },
  {
    icon: Globe,
    title: 'Platforms & Digital Media',
    desc: 'Operation and management of data-intensive portals, financial research interfaces, and quantitative content surfaces.',
  },
  {
    icon: BarChart2,
    title: 'Market Research & Analytics',
    desc: 'Macroeconomic modeling, cross-market correlation studies, public financial data ingestion, and bespoke synthesis reporting.',
  },
  {
    icon: BrainCircuit,
    title: 'Quantitative R&D',
    desc: 'Experimental development in domain-specific financial language synthesis, automated filing parsers, and statistical anomaly detection.',
  },
  {
    icon: Lightbulb,
    title: 'Strategic Advisory',
    desc: 'Data architecture consulting, regulatory disclosures navigation, point-in-time time-series modeling, and institutional strategy.',
  },
  {
    icon: Megaphone,
    title: 'Institutional Publishing',
    desc: 'Automated executive briefings, regulatory filing digests, and verifiable disclosure distribution platforms.',
  },
  {
    icon: Database,
    title: 'Data Feeds & Lineage',
    desc: 'Primary source ingestion, ISO-8601 normalization, cryptographic audit verification, and Parquet/Excel pipeline exports.',
  },
];

const CAPABILITIES = [
  { icon: MonitorSmartphone, label: 'Web Applications' },
  { icon: Server, label: 'Cloud Infrastructure' },
  { icon: ShieldCheck, label: 'Regulatory Compliance' },
  { icon: TrendingUp, label: 'Quantitative Analytics' },
  { icon: Handshake, label: 'Institutional Advisory' },
  { icon: Users, label: 'Specialist Training' },
  { icon: Package, label: 'API Licensing' },
  { icon: Building2, label: 'Enterprise Deployments' },
];

const STATS = [
  { value: 13, suffix: '+', label: 'Core Business Verticals' },
  { value: 22, suffix: '+', label: 'Ancillary Capabilities' },
  { value: 100, suffix: '%', label: 'Client-Centric Approach' },
  { value: 360, suffix: '°', label: 'Digital Coverage' },
];

const WHY_US = [
  'End-to-end software lifecycle management from ideation to maintenance',
  'Research-driven decision making with real data intelligence',
  'Scalable cloud and managed IT infrastructure solutions',
  'Strategic consulting with measurable business outcomes',
  'Digital media expertise spanning content, advertising & platforms',
  'Compliance-first approach with transparent governance',
];

// ─────────────────── Animated Counter ───────────────────

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-mono text-3xl sm:text-4xl font-bold text-[#20201E] tabular-nums">
      {count}{suffix}
    </span>
  );
}

// ─────────────────── Main Component ───────────────────

export function Advertising() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as Easing } },
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative bg-[#F7F6F2] border-b border-[#DEDDD7] py-20 sm:py-28"
      >
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <SectionLabel text="Enterprise Solutions & Advisory" />

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#20201E] leading-[1.1]">
              Technology solutions for research, data, and{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                digital platforms
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-[#4F4E49] max-w-2xl mx-auto leading-relaxed">
              From custom data engineering and cloud pipelines to market research intelligence and bespoke institutional platforms — we build reliable, verified technology systems.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const elem = document.getElementById('contact');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-semibold"
              >
                Talk to our team
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const elem = document.getElementById('services');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-semibold border-[#DEDDD7] text-[#20201E] hover:border-[#B9684E]/50"
              >
                Explore services
              </Button>
            </div>

            {/* Capability pill row */}
            <div className="pt-10 flex items-center justify-center gap-2 flex-wrap max-w-3xl mx-auto">
              {CAPABILITIES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] border border-[#DEDDD7] bg-white text-[#4F4E49] text-xs font-medium"
                >
                  <Icon className="h-3.5 w-3.5 text-[#B9684E]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-[#DEDDD7] bg-white px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#DEDDD7]">
          {STATS.map((s) => (
            <div key={s.label} className="pt-4 md:pt-0 space-y-1">
              <AnimatedCounter target={s.value} suffix={s.suffix} />
              <p className="text-[#73726C] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="bg-[#F7F6F2] px-4 py-24 sm:px-6 lg:px-8 border-b border-[#DEDDD7]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[#B9684E] text-xs font-mono font-medium uppercase tracking-wider mb-3">
              Capabilities
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#20201E] tracking-tight mb-4">
              Our Core{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                service offerings
              </span>
            </h2>
            <p className="text-[#4F4E49] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              A comprehensive suite of technology and business services designed to meet the evolving
              needs of modern enterprises, institutions, and organizations.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {SERVICES.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-[8px] border border-[#DEDDD7] bg-white p-6 cursor-pointer transition-all duration-200 shadow-xs hover:border-[#20201E] hover:shadow-sm"
                >
                  <div className="mb-4 inline-flex items-center justify-center h-10 w-10 rounded-[6px] bg-[#F7F6F2] border border-[#DEDDD7] group-hover:border-[#B9684E]/40 group-hover:bg-[#B9684E]/10 transition-colors">
                    <Icon className="h-5 w-5 text-[#B9684E]" />
                  </div>
                  <h3 className="font-heading font-semibold text-sm text-[#20201E] mb-2 group-hover:text-[#B9684E] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-[#4F4E49] text-xs leading-relaxed">
                    {svc.desc}
                  </p>
                  <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#B9684E] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ABOUT / MISSION SECTION */}
      <section id="about" className="bg-white border-b border-[#DEDDD7] px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-[#B9684E] text-xs font-mono font-medium uppercase tracking-wider mb-4">
              Our Mission
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#20201E] mb-6 leading-tight tracking-tight">
              Empowering businesses through{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                intelligent technology
              </span>
            </h2>
            <p className="text-[#4F4E49] text-sm sm:text-base leading-relaxed mb-6">
              We are a full-service technology and business solutions company committed to delivering
              innovative, scalable, and reliable services. From software development to strategic
              consultancy, we partner with organizations across industries to drive digital
              transformation and sustainable growth.
            </p>
            <p className="text-[#4F4E49] text-sm sm:text-base leading-relaxed mb-8">
              Our multidisciplinary approach combines deep technical expertise with research-backed
              business intelligence — ensuring every solution we deliver creates measurable value
              and competitive advantage.
            </p>
            <ul className="space-y-3">
              {WHY_US.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-[#20201E]">
                  <CheckCircle2 className="h-4 w-4 text-[#657B6C] mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-[12px] border border-[#DEDDD7] bg-[#F7F6F2] p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Code2, label: 'Software Dev', color: 'text-[#B9684E]' },
                  { icon: CloudCog, label: 'Cloud & IT', color: 'text-[#3B82F6]' },
                  { icon: BarChart2, label: 'Analytics', color: 'text-[#657B6C]' },
                  { icon: BrainCircuit, label: 'AI & R&D', color: 'text-[#8B5CF6]' },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-[8px] border border-[#DEDDD7] bg-white p-4 shadow-2xs"
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-xs font-semibold text-[#20201E]">{label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Project Delivery Rate', pct: 97 },
                  { label: 'Client Satisfaction', pct: 99 },
                  { label: 'On-time Completion', pct: 94 },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#4F4E49]">{label}</span>
                      <span className="font-mono text-[#20201E] font-semibold tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#E5E4DE] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        className="h-full rounded-full bg-[#B9684E]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 rounded-[6px] border border-[#DEDDD7] bg-white px-4 py-2.5 shadow-sm">
              <div className="text-[11px] font-mono text-[#B9684E] font-semibold tracking-wider uppercase">Verified</div>
              <div className="text-[11px] text-[#73726C]">Across Industries</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section id="process" className="bg-[#F7F6F2] px-4 py-24 sm:px-6 lg:px-8 border-b border-[#DEDDD7]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[#B9684E] text-xs font-mono font-medium uppercase tracking-wider mb-3">
              Our Process
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#20201E] tracking-tight mb-4">
              How We{' '}
              <span className="font-serif italic font-normal text-[#B9684E]">
                deliver excellence
              </span>
            </h2>
            <p className="text-[#4F4E49] max-w-xl mx-auto text-sm leading-relaxed">
              A proven, structured approach that ensures quality, transparency, and on-time delivery
              at every stage of engagement.
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { step: '01', title: 'Discover', desc: 'Deep dive into your requirements, goals, and existing ecosystem to craft a tailored strategy.' },
                { step: '02', title: 'Design', desc: 'Architect scalable solutions with clear milestones, technology stacks, and resource plans.' },
                { step: '03', title: 'Develop', desc: 'Agile execution with continuous integration, testing, and stakeholder feedback loops.' },
                { step: '04', title: 'Deploy & Support', desc: 'Smooth launch, training, monitoring, and ongoing support to ensure lasting success.' },
              ].map(({ step, title, desc }) => (
                <motion.div
                  key={step}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className="relative group rounded-[8px] border border-[#DEDDD7] bg-white p-6 hover:border-[#20201E] transition-all shadow-xs"
                >
                  <div className="font-mono text-3xl font-bold text-[#DEDDD7] group-hover:text-[#B9684E]/50 transition-colors mb-4 select-none tabular-nums">
                    {step}
                  </div>
                  <h3 className="font-heading font-semibold text-base text-[#20201E] mb-2">{title}</h3>
                  <p className="text-[#4F4E49] text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SERVED */}
      <section className="border-b border-[#DEDDD7] bg-white px-4 py-16 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="text-xs font-mono text-[#73726C] uppercase tracking-wider">
              Industries We Serve
            </span>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2.5"
          >
            {[
              'Banking & Finance', 'Healthcare & Pharma', 'Retail & E-Commerce',
              'Education & EdTech', 'Government & Public Sector', 'Manufacturing',
              'Logistics & Supply Chain', 'Media & Entertainment', 'Real Estate',
              'Energy & Utilities', 'Startups & SMEs', 'NGOs & Non-Profits',
            ].map((industry) => (
              <motion.span
                key={industry}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#DEDDD7] bg-[#F7F6F2] text-[#4F4E49] text-xs font-medium hover:border-[#20201E] hover:text-[#20201E] transition-all cursor-default shadow-2xs"
              >
                {industry}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#F7F6F2] px-4 py-20 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[14px] border border-[#DEDDD7] bg-white p-10 sm:p-14 text-center overflow-hidden shadow-sm"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#DEDDD7] bg-[#F7F6F2] text-[#B9684E] text-xs font-mono font-medium uppercase tracking-wider mb-6">
                <Handshake className="h-3.5 w-3.5" />
                Partner With Us
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#20201E] mb-4 leading-tight tracking-tight">
                Ready to build something{' '}
                <span className="font-serif italic font-normal text-[#B9684E]">
                  extraordinary?
                </span>
              </h2>
              <p className="text-[#4F4E49] text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Whether you need a custom software solution, market research insights, cloud
                infrastructure, or end-to-end digital transformation — we're here to make it happen.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#contact"
                  id="cta-start-project"
                  className="group flex items-center gap-2 px-7 py-3 rounded-[8px] bg-[#20201E] text-white font-medium text-sm hover:bg-[#33322E] transition-all shadow-sm"
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#about"
                  id="cta-learn-more"
                  className="text-sm font-medium text-[#73726C] hover:text-[#20201E] transition-colors underline underline-offset-4"
                >
                  Learn More About Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="border-t border-[#DEDDD7] bg-white px-4 py-20 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-[8px] border border-[#DEDDD7] bg-[#F7F6F2] mb-6 mx-auto">
              <Mail className="h-5 w-5 text-[#B9684E]" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#20201E] mb-3 tracking-tight">
              Let's Start a Conversation
            </h2>
            <p className="text-[#4F4E49] text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Tell us about your project or business challenge. Our team will get back to you within
              24 hours with a tailored approach.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-[6px] border border-[#657B6C]/30 bg-[#657B6C]/10 text-[#657B6C] text-sm font-medium"
              >
                <CheckCircle2 className="h-5 w-5" />
                Thank you! We will be in touch soon.
              </motion.div>
            ) : (
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  id="contact-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email"
                  required
                  className="flex-1 h-11 px-4 rounded-[6px] border border-[#DEDDD7] bg-[#F7F6F2] text-[#20201E] text-sm placeholder:text-[#999891] focus:outline-none focus:border-[#20201E] focus:bg-white transition-colors"
                />
                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="h-11 px-6 rounded-[6px] bg-[#20201E] text-white font-medium text-sm hover:bg-[#33322E] transition-all shrink-0 shadow-sm"
                >
                  Get in Touch
                </button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-[#73726C]">
              No spam. Your information is private and secure.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
