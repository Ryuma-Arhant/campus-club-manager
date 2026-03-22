import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight, Zap } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { getMyMemberships } from '../../api/memberApi.js';
import { getEvents } from '../../api/eventApi.js';
import Loader from '../../components/Loader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyMemberships(), getEvents()])
      .then(([m, e]) => {
        setMemberships(m.data || []);
        setEvents((e.data || []).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const approved = memberships.filter(m => m.status === 'approved').length;
  const pending = memberships.filter(m => m.status === 'pending').length;

  const statCards = [
    { label: 'Active Clubs', value: approved, icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10', glow: 'shadow-neon/10' },
    { label: 'Upcoming Events', value: events.length, icon: Calendar, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', glow: 'shadow-neon-cyan/10' },
    { label: 'Pending Requests', value: pending, icon: Clock, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', glow: 'shadow-neon-pink/10' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
            <Zap className="w-5 h-5 text-accent" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Here&apos;s what&apos;s happening in your campus clubs.</p>
      </motion.div>

      {/* Stat cards */}
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

      {/* Quick actions */}
      <motion.div variants={item} className="flex gap-3 flex-wrap">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/student/clubs" className="btn-primary flex items-center gap-2 px-5">
            <BookOpen className="w-4 h-4" /> Browse Clubs
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/student/events" className="btn-secondary flex items-center gap-2 px-5">
            <Calendar className="w-4 h-4" /> View Events
          </Link>
        </motion.div>
      </motion.div>

      {/* Upcoming events */}
      <motion.div variants={item} className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Upcoming Events</h2>
          <Link to="/student/events" className="text-accent text-sm hover:underline flex items-center gap-1 group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-text-secondary text-sm">No upcoming events.</p>
        ) : (
          <div className="space-y-2">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <Link
                  to={`/student/events/${event.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all cursor-pointer group"
                >
                  <div>
                    <p className="text-text-primary font-medium text-sm group-hover:text-accent transition-colors">{event.title}</p>
                    <p className="text-text-secondary text-xs mt-0.5">{event.club_name} · {formatDateTime(event.event_date)}</p>
                  </div>
                  <StatusBadge status={event.status} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
