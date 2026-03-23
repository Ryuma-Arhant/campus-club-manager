import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { getEvent } from '../../api/eventApi.js';
import { rsvpEvent, cancelRsvp } from '../../api/eventApi.js';
import Loader from '../../components/Loader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvped, setRsvped] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(res => setEvent(res.data))
      .catch(() => toast.error('Failed to load event'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRsvp = async () => {
    setProcessing(true);
    try {
      if (rsvped) {
        await cancelRsvp(id);
        setRsvped(false);
        toast.success('RSVP cancelled');
      } else {
        await rsvpEvent(id);
        setRsvped(true);
        toast.success('RSVP confirmed!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;
  if (!event) return <div className="text-text-secondary">Event not found.</div>;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <motion.div variants={item}>
        <Link to="/student/events" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors cursor-pointer text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to events
        </Link>
      </motion.div>

      <motion.div variants={item} className="card space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{event.title}</h1>
              <p className="text-accent text-sm mt-1 font-medium">{event.club_name}</p>
            </div>
            <StatusBadge status={event.status} />
          </div>

          {event.description && (
            <p className="text-text-secondary leading-relaxed mt-4">{event.description}</p>
          )}

          <div className="space-y-2.5 pt-4 mt-4 border-t border-border/60">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-text-secondary">{formatDateTime(event.event_date)}</span>
            </motion.div>
            {event.end_date && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-muted" />
                </div>
                <span className="text-text-secondary">Ends: {formatDateTime(event.end_date)}</span>
              </motion.div>
            )}
            {event.location && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-text-secondary">{event.location}</span>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-text-secondary">{event.rsvp_count || 0} / {event.capacity} attending</span>
                {event.capacity && (
                  <div className="flex-1 max-w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent/60 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((event.rsvp_count || 0) / event.capacity) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRsvp}
            disabled={processing || event.status === 'cancelled' || event.status === 'completed'}
            className={`w-full flex items-center justify-center gap-2 mt-4 ${rsvped ? 'btn-secondary' : 'btn-primary'}`}
          >
            <CheckCircle className="w-4 h-4" />
            {processing ? 'Processing...' : rsvped ? 'Cancel RSVP' : 'RSVP to this event'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
