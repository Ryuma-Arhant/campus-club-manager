import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, TrendingUp, UserCheck, Clock, BarChart3 } from 'lucide-react';
import { getStats } from '../../api/adminApi.js';
import Loader from '../../components/Loader.jsx';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function SystemStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Users', value: stats?.total_users, icon: Users, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-neon-cyan/10' },
    { label: 'Total Clubs', value: stats?.total_clubs, icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10', glow: 'shadow-neon/10' },
    { label: 'Approved Clubs', value: stats?.approved_clubs, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/10', glow: 'shadow-green-500/10' },
    { label: 'Pending Clubs', value: stats?.pending_clubs, icon: Clock, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-[#FBBF24]/10' },
    { label: 'Total Events', value: stats?.total_events, icon: Calendar, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', glow: 'shadow-neon-pink/10' },
    { label: 'Upcoming Events', value: stats?.upcoming_events, icon: TrendingUp, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-neon-cyan/10' },
    { label: 'Active Memberships', value: stats?.total_memberships, icon: Users, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', glow: 'shadow-neon-pink/10' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">System Statistics</h1>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            <BarChart3 className="w-5 h-5 text-[#FBBF24]" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Platform-wide data overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, glow }, i) => (
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
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 + i * 0.07 }}
              >
                {value ?? 0}
              </motion.p>
              <p className="text-text-secondary text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {stats?.popular_clubs?.length > 0 && (
        <motion.div variants={item} className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Most Popular Clubs</h2>
          <div className="space-y-2.5">
            {stats.popular_clubs.map((club, i) => (
              <motion.div
                key={club.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all cursor-default group"
              >
                <span className="text-muted font-mono text-sm w-6 text-center">#{i + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 text-accent" />
                </div>
                <span className="text-text-primary font-medium text-sm flex-1 group-hover:text-accent transition-colors">{club.name}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-accent/20 rounded-full overflow-hidden w-24">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (club.member_count / (stats?.total_memberships || 1)) * 100 * 3)}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                    />
                  </div>
                  <span className="text-text-secondary text-xs font-mono w-20 text-right">{club.member_count} members</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
