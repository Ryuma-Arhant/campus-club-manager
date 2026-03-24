import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Trash2, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getClubEvents, deleteEvent, updateEvent } from '../../api/eventApi.js';
import { getClubs } from '../../api/clubApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import { formatDateTime } from '../../utils/formatDate.js';
import { EVENT_STATUS } from '../../utils/constants.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ManageEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const clubs = await getClubs();
    const club = (clubs.data || []).find(c => c.admin_id === user?.id);
    if (club) {
      const res = await getClubEvents(club.id);
      setEvents(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(modal.id);
      toast.success('Event deleted');
      setModal(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setDeleting(false); }
  };

  const handleStatusChange = async (eventId, status, event) => {
    try {
      await updateEvent(eventId, { ...event, status });
      await load();
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Manage Events</h1>
          <p className="text-text-secondary mt-1">{events.length} events total.</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/club-admin/events/create" className="btn-primary flex items-center gap-2 px-4 text-sm">
            <PlusCircle className="w-4 h-4" /> New Event
          </Link>
        </motion.div>
      </motion.div>

      {events.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState icon={Calendar} title="No events yet" description="Create your first event." action={{ label: 'Create Event', onClick: () => {} }} />
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">RSVPs</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Calendar className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-text-primary font-medium group-hover:text-accent transition-colors">{e.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary font-mono text-xs">{formatDateTime(e.event_date)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-text-secondary font-mono text-xs">{e.rsvp_count || 0}/{e.capacity}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={e.status}
                        onChange={ev => handleStatusChange(e.id, ev.target.value, e)}
                        className="input py-1 min-h-0 h-8 text-xs"
                      >
                        {Object.values(EVENT_STATUS).map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setModal(e)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title="Delete Event"
        onConfirm={handleDelete} confirmLabel="Delete" confirmVariant="danger" isLoading={deleting}>
        <p className="text-text-secondary">Delete <strong className="text-text-primary">{modal?.title}</strong>? This cannot be undone.</p>
      </Modal>
    </motion.div>
  );
}
