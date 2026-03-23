import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, Search, Zap } from 'lucide-react';
import useEvents from '../../hooks/useEvents.js';
import { rsvpEvent } from '../../api/eventApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } } };

export default function EventsList() {
  const { events, loading } = useEvents();
  const [search, setSearch] = useState('');
  const [rsvping, setRsvping] = useState(null);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.club_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRsvp = async (eventId) => {
    setRsvping(eventId);
    try {
      await rsvpEvent(eventId);
      toast.success('RSVP confirmed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to RSVP');
    } finally {
      setRsvping(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Upcoming Events</h1>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap className="w-5 h-5 text-[#FBBF24]" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Browse and RSVP to campus events.</p>
      </motion.div>

      <motion.div variants={item} className="relative max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-10"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState icon={Calendar} title="No events found" description="Check back later for upcoming events." />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((event) => (
              <motion.div
                key={event.id}
                variants={item}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card flex flex-col gap-3 group relative overflow-hidden hover:border-accent/20 transition-colors"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/[0.04] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">{event.title}</h3>
                    <StatusBadge status={event.status} />
                  </div>
                  <p className="text-accent text-sm mt-1 font-medium">{event.club_name}</p>
                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Calendar className="w-4 h-4 text-purple-400" /> {formatDateTime(event.event_date)}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <MapPin className="w-4 h-4 text-blue-400" /> {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Users className="w-4 h-4 text-accent" />
                      <span>{event.rsvp_count || 0} / {event.capacity} going</span>
                      {event.capacity && (
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden ml-1">
                          <motion.div
                            className="h-full bg-accent/60 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((event.rsvp_count || 0) / event.capacity) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3">
                    <motion.button
                      onClick={() => handleRsvp(event.id)}
                      disabled={rsvping === event.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-primary flex-1 text-sm"
                    >
                      {rsvping === event.id ? 'RSVPing...' : 'RSVP'}
                    </motion.button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to={`/student/events/${event.id}`} className="btn-secondary px-4 text-sm h-full flex items-center">Details</Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
