import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, ArrowRight, Settings, Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { getPendingMembers, getClubMembers } from '../../api/memberApi.js';
import { getClubEvents } from '../../api/eventApi.js';
import { getClubs } from '../../api/clubApi.js';
import Loader from '../../components/Loader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ClubAdminDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClubs().then(res => {
      const adminClub = (res.data || []).find(c => c.admin_id === user?.id);
      if (adminClub) {
        setClub(adminClub);
        return Promise.all([
          getPendingMembers(adminClub.id),
          getClubMembers(adminClub.id),
          getClubEvents(adminClub.id),
        ]);
      }
      return [{ data: [] }, { data: [] }, { data: [] }];
    }).then(([p, m, e]) => {
      setPending(p.data || []);
      setMembers(m.data || []);
      setEvents((e.data || []).filter(ev => ev.status === 'upcoming').slice(0, 4));
    }).finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Members', value: members.filter(m => m.status === 'approved').length, icon: Users, color: 'text-accent', bg: 'bg-accent/10', glow: 'shadow-neon/10' },
    { label: 'Pending Requests', value: pending.length, icon: Clock, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', glow: 'shadow-neon-pink/10' },
    { label: 'Upcoming Events', value: events.length, icon: Calendar, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-neon-cyan/10' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Club Admin Dashboard</h1>
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
            <Sparkles className="w-5 h-5 text-accent" />
          </motion.div>
        </div>
        {club && (
          <p className="text-text-secondary">
            Managing: <span className="text-accent font-medium">{club.name}</span>
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 + i * 0.1 }}
              >
                {value}
              </motion.p>
              <p className="text-text-secondary text-sm">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={item} className="flex gap-3 flex-wrap">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/club-admin/events/create" className="btn-primary flex items-center gap-2 px-5 text-sm">
            <Calendar className="w-4 h-4" /> Create Event
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/club-admin/settings" className="btn-secondary flex items-center gap-2 px-5 text-sm">
            <Settings className="w-4 h-4" /> Club Settings
          </Link>
        </motion.div>
      </motion.div>

      {pending.length > 0 && (
        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Pending Requests</h2>
            <Link to="/club-admin/requests" className="text-accent text-sm hover:underline flex items-center gap-1 group">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-2">
            {pending.slice(0, 3).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FBBF24]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-[#FBBF24] text-xs font-bold">{m.user_name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium text-sm">{m.user_name}</p>
                    <p className="text-text-secondary text-xs">{m.user_email}</p>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Upcoming Events</h2>
          <Link to="/club-admin/events" className="text-accent text-sm hover:underline flex items-center gap-1 group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-text-secondary text-sm">No upcoming events. <Link to="/club-admin/events/create" className="text-accent hover:underline">Create one</Link></p>
        ) : (
          <div className="space-y-2">
            {events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all group cursor-default"
              >
                <div>
                  <p className="text-text-primary font-medium text-sm group-hover:text-accent transition-colors">{e.title}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{formatDateTime(e.event_date)}</p>
                </div>
                <StatusBadge status={e.status} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
