import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, Clock, ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { getStats } from '../../api/adminApi.js';
import Loader from '../../components/Loader.jsx';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-neon-cyan/10' },
    { label: 'Total Clubs', value: stats?.total_clubs || 0, icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10', glow: 'shadow-neon/10' },
    { label: 'Pending Clubs', value: stats?.pending_clubs || 0, icon: Clock, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-[#FBBF24]/10' },
    { label: 'Total Events', value: stats?.total_events || 0, icon: Calendar, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', glow: 'shadow-neon-pink/10' },
    { label: 'Active Members', value: stats?.total_memberships || 0, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', glow: 'shadow-green-500/10' },
    { label: 'Upcoming Events', value: stats?.upcoming_events || 0, icon: Calendar, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-neon-cyan/10' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Super Admin Dashboard</h1>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Shield className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>
        <p className="text-text-secondary">System-wide overview and management.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg, glow }, i) => (
          <motion.div
            key={label}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`card flex items-center gap-4 hover:border-accent/20 transition-all cursor-default shadow-lg ${glow}`}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className={`w-6 h-6 ${color}`} />
            </motion.div>
            <div>
              <motion.p
                className="text-2xl font-bold text-text-primary font-mono"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 + i * 0.08 }}
              >
                {value}
              </motion.p>
              <p className="text-text-secondary text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {stats?.pending_clubs > 0 && (
        <motion.div
          variants={item}
          className="card border-[#FBBF24]/30 hover:border-[#FBBF24]/50 transition-colors"
          whileHover={{ scale: 1.005 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center"
              >
                <Clock className="w-5 h-5 text-[#FBBF24]" />
              </motion.div>
              <div>
                <p className="text-text-primary font-medium">{stats.pending_clubs} club(s) awaiting approval</p>
                <p className="text-text-secondary text-sm">Review and approve new club applications.</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/super-admin/approvals" className="btn-primary px-4 flex items-center gap-2 text-sm">
                Review <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}

      {stats?.popular_clubs?.length > 0 && (
        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Most Popular Clubs</h2>
            <Link to="/super-admin/clubs" className="text-accent text-sm hover:underline flex items-center gap-1 group">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats.popular_clubs.map((club, i) => (
              <motion.div
                key={club.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(34,197,94,0.05)' }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all cursor-default group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted font-mono text-sm w-6 text-center">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-text-primary font-medium text-sm group-hover:text-accent transition-colors">{club.name}</span>
                </div>
                <span className="text-text-secondary text-sm font-mono bg-secondary/80 px-2.5 py-0.5 rounded-full">{club.member_count} members</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
