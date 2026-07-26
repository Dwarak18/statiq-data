import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, type Easing } from 'motion/react';
import { Layout } from '@/components/layout/Layout';
import {
  Code2, Globe, Server, Cpu, BarChart2, BookOpen,
  Lightbulb, Megaphone, Database, Building2, Package,
  Users, Handshake, ArrowRight, CheckCircle2, Zap,
  ChevronDown, MonitorSmartphone, CloudCog, BrainCircuit,
  ShieldCheck, TrendingUp, Mail,
} from 'lucide-react';

// ─────────────────── Data ───────────────────

const SERVICES = [
  {
    icon: Code2,
    title: 'Software Development',
    desc: 'Custom software, mobile apps, web portals, and digital platforms — designed, built, and maintained end-to-end.',
    color: 'from-[#C8A45D]/20 to-transparent',
    border: 'hover:border-[#C8A45D]/50',
  },
  {
    icon: CloudCog,
    title: 'IT-Enabled & Cloud Services',
    desc: 'Managed services, cloud support, system integration, networking, and technical support for seamless operations.',
    color: 'from-[#4A90D9]/20 to-transparent',
    border: 'hover:border-[#4A90D9]/50',
  },
  {
    icon: Globe,
    title: 'Platforms & Digital Media',
    desc: 'Operate and manage websites, web portals, online platforms, and digital media properties for commercial or non-commercial use.',
    color: 'from-[#7B5EA7]/20 to-transparent',
    border: 'hover:border-[#7B5EA7]/50',
  },
  {
    icon: BarChart2,
    title: 'Market Research & Analytics',
    desc: 'Consumer behavior studies, data collection, public opinion polling, analytics, and comprehensive reporting services.',
    color: 'from-[#2ECC71]/20 to-transparent',
    border: 'hover:border-[#2ECC71]/50',
  },
  {
    icon: BrainCircuit,
    title: 'R&D & Innovation',
    desc: 'Research and experimental development in social sciences, information technology, digital systems, and business processes.',
    color: 'from-[#E67E22]/20 to-transparent',
    border: 'hover:border-[#E67E22]/50',
  },
  {
    icon: Lightbulb,
    title: 'Business Consultancy',
    desc: 'Strategic advisory, digital transformation, branding support, market intelligence, and operational support services.',
    color: 'from-[#E74C3C]/20 to-transparent',
    border: 'hover:border-[#E74C3C]/50',
  },
  {
    icon: Megaphone,
    title: 'Digital Media & Publishing',
    desc: 'Content development, online advertising support, digital communication, and online information platform operations.',
    color: 'from-[#1ABC9C]/20 to-transparent',
    border: 'hover:border-[#1ABC9C]/50',
  },
  {
    icon: Database,
    title: 'Data & Statistical Services',
    desc: 'Collection, compilation, analysis, publication, and dissemination of statistical and commercial information digitally.',
    color: 'from-[#C8A45D]/20 to-transparent',
    border: 'hover:border-[#C8A45D]/50',
  },
];

const CAPABILITIES = [
  { icon: MonitorSmartphone, label: 'Mobile & Web Apps' },
  { icon: Server, label: 'Hosting & Infrastructure' },
  { icon: ShieldCheck, label: 'Security & Compliance' },
  { icon: TrendingUp, label: 'Growth Analytics' },
  { icon: Handshake, label: 'Strategic Partnerships' },
  { icon: Users, label: 'Talent & Training' },
  { icon: Package, label: 'IP & Licensing' },
  { icon: Building2, label: 'Multi-Office Operations' },
];

const STATS = [
  { value: 13, suffix: '+', label: 'Core Business Verticals' },
  { value: 22, suffix: '+', label: 'Ancillary Capabilities' },
  { value: 100, suffix: '%', label: 'Client-Centric Approach' },
  { value: 360, suffix: '\u00b0', label: 'Digital Coverage' },
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
    <span ref={ref} className="font-mono text-4xl sm:text-5xl font-extrabold text-[#C8A45D]">
      {count}{suffix}
    </span>
  );
}

// ─────────────────── Floating Orb ───────────────────

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse ${className}`}
    />
  );
}

// ─────────────────── Main Component ───────────────────

export function Advertising() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);

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
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as Easing } },
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#09090B] px-4 pt-20 pb-16"
      >
        {/* Ambient orbs */}
        <FloatingOrb className="w-[600px] h-[600px] bg-[#C8A45D] top-[-100px] left-[-200px]" />
        <FloatingOrb className="w-[500px] h-[500px] bg-[#4A90D9] bottom-[-100px] right-[-150px]" />
        <FloatingOrb className="w-[300px] h-[300px] bg-[#7B5EA7] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A45D_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        {/* Top/bottom border glow */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8A45D]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8A45D]/40 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/10 text-[#C8A45D] text-xs font-mono font-semibold uppercase tracking-widest mb-8"
          >
            <Zap className="h-3.5 w-3.5" />
            Full-Spectrum Digital & IT Company
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
          >
            Technology That{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A45D] via-[#E3C47A] to-[#C8A45D]">
                Transforms
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-[#C8A45D]/0 via-[#C8A45D]/80 to-[#C8A45D]/0" />
            </span>{' '}
            Your Business
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg sm:text-xl text-[#A3A3A3] max-w-3xl mx-auto leading-relaxed mb-10"
          >
            From custom software and cloud infrastructure to market intelligence and digital media —
            we deliver end-to-end technology solutions that accelerate growth, drive efficiency,
            and create lasting impact for businesses worldwide.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="#services"
              id="hero-cta-services"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C8A45D] text-black font-bold text-sm hover:bg-[#E3C47A] transition-all shadow-[0_0_30px_#C8A45D40] hover:shadow-[0_0_50px_#C8A45D60]"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              id="hero-cta-contact"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[#2A2A2A] bg-[#111111] text-white font-semibold text-sm hover:border-[#C8A45D]/40 transition-all"
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center gap-1 text-[#A3A3A3] text-xs"
          >
            <span className="font-mono uppercase tracking-widest text-[10px]">Discover More</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </motion.div>
        </div>

        {/* Capability pill row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute bottom-8 left-0 right-0 overflow-hidden px-4"
        >
          <div className="flex items-center justify-center gap-3 flex-wrap max-w-4xl mx-auto">
            {CAPABILITIES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A2A2A] bg-[#111111]/80 text-[#A3A3A3] text-[11px] font-medium backdrop-blur-sm"
              >
                <Icon className="h-3 w-3 text-[#C8A45D]" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-[#2A2A2A] bg-[#111111] px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="space-y-1">
              <AnimatedCounter target={s.value} suffix={s.suffix} />
              <p className="text-[#A3A3A3] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="bg-[#09090B] px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[#C8A45D] text-xs font-mono font-bold uppercase tracking-widest mb-3">
              What We Do
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Our Core{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A45D] to-[#E3C47A]">
                Service Offerings
              </span>
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
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
                  whileHover={{ y: -6, scale: 1.02 }}
                  onHoverStart={() => setActiveService(idx)}
                  onHoverEnd={() => setActiveService(null)}
                  className={`relative group rounded-2xl border border-[#2A2A2A] bg-[#111111] p-6 cursor-pointer transition-all duration-300 overflow-hidden ${svc.border}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${svc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10 mb-4 inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#C8A45D]/30 transition-colors">
                    <Icon className="h-5 w-5 text-[#C8A45D]" />
                  </div>
                  <h3 className="relative z-10 font-heading font-bold text-sm text-white mb-2 group-hover:text-[#E3C47A] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="relative z-10 text-[#A3A3A3] text-xs leading-relaxed">
                    {svc.desc}
                  </p>
                  <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#C8A45D] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ABOUT / MISSION SECTION */}
      <section id="about" className="bg-[#111111] border-y border-[#2A2A2A] px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-[#C8A45D] text-xs font-mono font-bold uppercase tracking-widest mb-4">
              Our Mission
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              Empowering Businesses Through{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A45D] to-[#E3C47A]">
                Intelligent Technology
              </span>
            </h2>
            <p className="text-[#A3A3A3] text-sm sm:text-base leading-relaxed mb-6">
              We are a full-service technology and business solutions company committed to delivering
              innovative, scalable, and reliable services. From software development to strategic
              consultancy, we partner with organizations across industries to drive digital
              transformation and sustainable growth.
            </p>
            <p className="text-[#A3A3A3] text-sm sm:text-base leading-relaxed mb-8">
              Our multidisciplinary approach combines deep technical expertise with research-backed
              business intelligence — ensuring every solution we deliver creates measurable value
              and competitive advantage.
            </p>
            <ul className="space-y-3">
              {WHY_US.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-[#F5F5F5]">
                  <CheckCircle2 className="h-4 w-4 text-[#C8A45D] mt-0.5 shrink-0" />
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
            <div className="relative rounded-2xl border border-[#2A2A2A] bg-[#171717] p-8 shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C8A45D]/5 to-transparent pointer-events-none" />

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Code2, label: 'Software Dev', color: 'text-[#C8A45D]' },
                  { icon: CloudCog, label: 'Cloud & IT', color: 'text-[#4A90D9]' },
                  { icon: BarChart2, label: 'Analytics', color: 'text-[#2ECC71]' },
                  { icon: BrainCircuit, label: 'AI & R&D', color: 'text-[#7B5EA7]' },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111] p-4"
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-xs font-semibold text-white">{label}</span>
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
                      <span className="text-[#A3A3A3]">{label}</span>
                      <span className="font-mono text-[#C8A45D] font-bold">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#2A2A2A] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#C8A45D] to-[#E3C47A]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 rounded-xl border border-[#C8A45D]/30 bg-[#111111] px-4 py-3 shadow-xl">
              <div className="text-xs font-mono text-[#C8A45D] font-bold">TRUSTED</div>
              <div className="text-[11px] text-[#A3A3A3]">Across Industries</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section id="process" className="bg-[#09090B] px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[#C8A45D] text-xs font-mono font-bold uppercase tracking-widest mb-3">
              Our Process
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
              How We{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A45D] to-[#E3C47A]">
                Deliver Excellence
              </span>
            </h2>
            <p className="text-[#A3A3A3] max-w-xl mx-auto text-sm leading-relaxed">
              A proven, structured approach that ensures quality, transparency, and on-time delivery
              at every stage of engagement.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-[#C8A45D]/0 via-[#C8A45D]/30 to-[#C8A45D]/0 hidden lg:block" />

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
                  whileHover={{ y: -4 }}
                  className="relative group rounded-2xl border border-[#2A2A2A] bg-[#111111] p-6 hover:border-[#C8A45D]/40 transition-all"
                >
                  <div className="font-mono text-4xl font-extrabold text-[#2A2A2A] group-hover:text-[#C8A45D]/20 transition-colors mb-4 select-none">
                    {step}
                  </div>
                  <h3 className="font-heading font-bold text-base text-white mb-2">{title}</h3>
                  <p className="text-[#A3A3A3] text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SERVED */}
      <section className="border-y border-[#2A2A2A] bg-[#111111] px-4 py-16 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-widest">
              Industries We Serve
            </span>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
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
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-full border border-[#2A2A2A] bg-[#171717] text-[#A3A3A3] text-xs font-medium hover:border-[#C8A45D]/40 hover:text-[#C8A45D] transition-all cursor-default"
              >
                {industry}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#09090B] px-4 py-24 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl border border-[#C8A45D]/20 bg-gradient-to-br from-[#171717] to-[#111111] p-10 sm:p-14 text-center overflow-hidden shadow-[0_0_60px_#C8A45D15]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#C8A45D10_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/10 text-[#C8A45D] text-xs font-mono font-bold uppercase tracking-widest mb-6">
                <Handshake className="h-3.5 w-3.5" />
                Partner With Us
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                Ready to Build Something{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A45D] via-[#E3C47A] to-[#C8A45D]">
                  Extraordinary?
                </span>
              </h2>
              <p className="text-[#A3A3A3] text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                Whether you need a custom software solution, market research insights, cloud
                infrastructure, or end-to-end digital transformation — we're here to make it happen.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#contact"
                  id="cta-start-project"
                  className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#C8A45D] text-black font-bold text-sm hover:bg-[#E3C47A] transition-all shadow-[0_0_30px_#C8A45D30]"
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#about"
                  id="cta-learn-more"
                  className="text-sm font-semibold text-[#C8A45D] hover:text-[#E3C47A] transition-colors underline underline-offset-4"
                >
                  Learn More About Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="border-t border-[#2A2A2A] bg-[#111111] px-4 py-20 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-[#2A2A2A] bg-[#171717] mb-6 mx-auto">
              <Mail className="h-5 w-5 text-[#C8A45D]" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Let's Start a Conversation
            </h2>
            <p className="text-[#A3A3A3] text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Tell us about your project or business challenge. Our team will get back to you within
              24 hours with a tailored approach.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-[#2ECC71]/30 bg-[#2ECC71]/10 text-[#2ECC71] text-sm font-semibold"
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
                  className="flex-1 h-12 px-4 rounded-xl border border-[#2A2A2A] bg-[#171717] text-white text-sm placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#C8A45D]/50 transition-colors"
                />
                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="h-12 px-7 rounded-xl bg-[#C8A45D] text-black font-bold text-sm hover:bg-[#E3C47A] transition-all shrink-0 shadow-[0_0_20px_#C8A45D30]"
                >
                  Get in Touch
                </button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-[#A3A3A3]">
              No spam. Your information is private and secure.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
