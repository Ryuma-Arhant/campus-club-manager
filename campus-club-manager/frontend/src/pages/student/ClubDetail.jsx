import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, Calendar, ArrowLeft, MapPin, BookOpen } from 'lucide-react';
import { getClub } from '../../api/clubApi.js';
import { getClubEvents } from '../../api/eventApi.js';
import { requestJoin } from '../../api/memberApi.js';
import Loader from '../../components/Loader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    Promise.all([getClub(id), getClubEvents(id)])
      .then(([c, e]) => { setClub(c.data); setEvents(e.data || []); })
      .catch(() => toast.error('Failed to load club'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await requestJoin(id);
      toast.success('Membership request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <Loader />;
  if (!club) return <div className="text-text-secondary">Club not found.</div>;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6 max-w-4xl">
      <motion.div variants={item}>
        <Link to="/student/clubs" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors cursor-pointer text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to clubs
        </Link>
      </motion.div>

      <motion.div variants={item} className="card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20"
              >
                <BookOpen className="w-7 h-7 text-accent" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{club.name}</h1>
                <span className="text-sm text-accent bg-accent/10 px-2.5 py-0.5 rounded-full mt-2 inline-block border border-accent/20">{club.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-text-secondary text-sm bg-secondary/50 px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4" /> {club.member_count || 0} members
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleJoin}
                disabled={joining}
                className="btn-primary px-5"
              >
                {joining ? 'Sending...' : 'Request to Join'}
              </motion.button>
            </div>
          </div>
          <p className="text-text-secondary mt-4 leading-relaxed">{club.description}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="card">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" /> Upcoming Events
        </h2>
        {events.length === 0 ? (
          <p className="text-text-secondary text-sm">No events yet.</p>
        ) : (
          <div className="space-y-2">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Link
                  to={`/student/events/${event.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all cursor-pointer group border border-transparent hover:border-border"
                >
                  <div>
                    <p className="text-text-primary font-medium text-sm group-hover:text-accent transition-colors">{event.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-text-secondary text-xs">{formatDateTime(event.event_date)}</span>
                      {event.location && (
                        <span className="text-text-secondary text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </span>
                      )}
                    </div>
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
