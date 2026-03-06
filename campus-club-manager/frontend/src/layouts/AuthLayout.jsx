import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, Zap, Sparkles } from 'lucide-react';

const features = [
  { icon: Users, text: 'Join and manage campus clubs', color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
  { icon: Calendar, text: 'Discover and RSVP to events', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
  { icon: Award, text: 'Take on leadership roles', color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10' },
];

function FloatingParticle({ delay, x, y }) {
  return (
    <motion.div
      className={`absolute w-1 h-1 rounded-full ${delay % 3 === 0 ? 'bg-accent/30' : delay % 3 === 1 ? 'bg-[#FBBF24]/30' : 'bg-[#3B82F6]/30'}`}
      style={{ top: `${y}%`, left: `${x}%` }}
      animate={{ opacity: [0, 0.6, 0], y: [0, -30, -60], scale: [0, 1, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay: delay * 0.4, ease: 'easeOut' }}
    />
  );
}

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface/80 backdrop-blur-xl border-r border-border/60 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] via-transparent to-[#3B82F6]/[0.04]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/[0.07] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-[#FBBF24]/[0.05] rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i} x={Math.random() * 100} y={Math.random() * 100} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-neon/40"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold font-mono text-text-primary tracking-tight">Campus<span className="text-gradient">Club</span></span>
          </Link>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.1))', borderColor: 'rgba(251,191,36,0.25)', color: '#FBBF24' }}>
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                <Sparkles className="w-3 h-3" />
              </motion.div>
              Welcome to CampusClub
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">
              Your campus life,<br />
              <span className="text-gradient">organized.</span>
            </h1>
            <p className="text-text-secondary text-lg mb-10 leading-relaxed">
              The all-in-one platform to browse clubs, attend events, and manage your campus community.
            </p>
          </motion.div>

          <div className="space-y-3">
            {features.map(({ icon: Icon, text, color, bg }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 group cursor-default"
              >
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-text-secondary group-hover:text-text-primary transition-colors">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted text-sm relative"
        >
          &copy; 2026 Campus Club Manager
        </motion.p>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.02] to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-full max-w-md relative"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold font-mono text-text-primary text-sm tracking-tight">Campus<span className="text-gradient">Club</span></span>
          </div>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
