import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Trash2, Users } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { getClubMembers, removeMember } from '../../api/memberApi.js';
import { getClubs } from '../../api/clubApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Modal from '../../components/Modal.jsx';
import { formatDate } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function MemberRoster() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [removing, setRemoving] = useState(false);

  const load = async () => {
    const clubs = await getClubs();
    const club = (clubs.data || []).find(c => c.admin_id === user?.id);
    if (club) {
      const res = await getClubMembers(club.id);
      setMembers((res.data || []).filter(m => m.status === 'approved'));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeMember(modal.id);
      toast.success('Member removed');
      setModal(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setRemoving(false); }
  };

  const filtered = members.filter(m =>
    m.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Member Roster</h1>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-0.5 rounded-full border border-accent/20"
          >
            {members.length}
          </motion.span>
        </div>
        <p className="text-text-secondary">{members.length} approved members.</p>
      </motion.div>

      <motion.div variants={item} className="relative max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
        <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" />
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState icon={Users} title="No members found" />
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <span className="text-accent text-xs font-bold">{m.user_name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <span className="text-text-primary font-medium group-hover:text-accent transition-colors">{m.user_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">{m.user_email}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={m.role} /></td>
                    <td className="py-3.5 px-4 text-text-secondary font-mono text-xs">{formatDate(m.joined_at)}</td>
                    <td className="py-3.5 px-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setModal(m)}
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

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title="Remove Member"
        onConfirm={handleRemove}
        confirmLabel="Remove"
        confirmVariant="danger"
        isLoading={removing}
      >
        <p className="text-text-secondary">Remove <strong className="text-text-primary">{modal?.user_name}</strong> from the club? This cannot be undone.</p>
      </Modal>
    </motion.div>
  );
}
