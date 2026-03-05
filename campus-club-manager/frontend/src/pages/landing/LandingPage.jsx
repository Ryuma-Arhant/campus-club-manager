import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, Calendar, Award, ArrowRight, BookOpen, Zap, Star, Sparkles } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] },
});

const features = [
  { icon: BookOpen, title: 'Browse Clubs', description: 'Explore campus clubs across every category — tech, arts, sports, and more.', color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', border: 'hover:border-[#FBBF24]/30' },
  { icon: Users, title: 'Join & Connect', description: 'Request membership, meet fellow students, and build your campus network.', color: 'text-accent', bg: 'bg-accent/10', border: 'hover:border-accent/30' },
  { icon: Calendar, title: 'Attend Events', description: 'RSVP to workshops, competitions, exhibitions, and social events.', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'hover:border-[#3B82F6]/30' },
  { icon: Award, title: 'Lead & Grow', description: 'Take on roles like President, Secretary, or Treasurer and build leadership skills.', color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', border: 'hover:border-[#FBBF24]/30' },
];

const stats = [
  { value: '50+', label: 'Active Clubs', icon: BookOpen },
  { value: '1,200+', label: 'Students', icon: Users },
  { value: '300+', label: 'Events Hosted', icon: Calendar },
  { value: '3', label: 'User Roles', icon: Shield },
];

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-px h-px rounded-full ${i % 3 === 0 ? 'bg-accent/50' : i % 3 === 1 ? 'bg-[#FBBF24]/50' : 'bg-[#3B82F6]/50'}`}
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -50, -100], scale: [0, 1.5, 0] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="border-b border-border/50 bg-surface/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-neon/40"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold font-mono text-text-primary tracking-tight">Campus<span className="text-gradient">Club</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors px-4 py-2">Sign in</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary text-sm px-5 h-9 min-h-0">Get started</Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.04] via-transparent to-[#3B82F6]/[0.03]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#3B82F6]/[0.06] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#FBBF24]/[0.05] rounded-full blur-[80px]" />
        <Particles />

        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div {...fadeUp(0.2)}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8 border backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.1))', borderColor: 'rgba(251,191,36,0.25)', color: '#FBBF24' }}>
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>
              Campus Life, Reimagined
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp(0.4)}
            className="text-5xl sm:text-6xl lg:text-8xl font-black text-text-primary mb-6 leading-[1.05] tracking-tight"
          >
            Discover. Join.{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient">Lead.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.6)}
            className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The all-in-one platform for campus clubs. Find your community, attend events, and build leadership skills that last.
          </motion.p>

          <motion.div {...fadeUp(0.8)} className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary px-8 py-3.5 text-base gap-2 shadow-neon">
                Get started free <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="btn-secondary px-8 py-3.5 text-base">Sign in</Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(251,191,36,0.4)' }}
                className="bg-surface/60 backdrop-blur-sm border border-border/60 rounded-xl p-4 cursor-default transition-all hover:shadow-neon/20"
              >
                <Icon className="w-4 h-4 text-accent/60 mx-auto mb-2" />
                <p className="text-2xl font-black text-text-primary font-mono">{value}</p>
                <p className="text-text-secondary text-xs mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="text-gradient text-sm font-semibold tracking-wider uppercase">Features</span>
          <h2 className="text-4xl font-bold text-text-primary mt-3 mb-4">Everything you need</h2>
          <p className="text-text-secondary max-w-lg mx-auto">One platform for students, club admins, and university administrators.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`card ${border} cursor-default group relative overflow-hidden hover:shadow-neon/10`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </motion.div>
                <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-border/50 bg-gradient-to-b from-surface/30 to-background">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gradient-hot text-sm font-semibold tracking-wider uppercase">Roles</span>
            <h2 className="text-4xl font-bold text-text-primary mt-3 mb-4">Built for everyone</h2>
            <p className="text-text-secondary">Three roles, one seamless experience.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Star, role: 'Student', desc: 'Browse and join clubs, RSVP to events, track memberships, and explore campus life.', color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', gradient: 'from-[#FBBF24]/20' },
              { icon: Shield, role: 'Club Admin', desc: 'Manage your club, review member requests, organize events, and assign roles.', color: 'text-accent', bg: 'bg-accent/10', gradient: 'from-accent/20' },
              { icon: Award, role: 'Super Admin', desc: 'Approve clubs, manage admins, view system-wide analytics, and oversee the platform.', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', gradient: 'from-[#3B82F6]/20' },
            ].map(({ icon: Icon, role, desc, color, bg, gradient }, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="card hover:border-accent/20 transition-all duration-300 group relative overflow-hidden hover:shadow-neon/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{role}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.04] via-transparent to-[#3B82F6]/[0.04]" />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-4">Ready to get involved?</h2>
            <p className="text-text-secondary mb-10 text-lg">Join the campus community and start building connections that last.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary px-10 py-3.5 text-base gap-2 shadow-neon">
                Create your free account <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <p className="text-text-secondary text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8 bg-surface/20">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent/60" />
            <span className="text-text-secondary text-sm">Campus Club Manager</span>
          </div>
          <p className="text-text-secondary text-sm">&copy; 2026 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
