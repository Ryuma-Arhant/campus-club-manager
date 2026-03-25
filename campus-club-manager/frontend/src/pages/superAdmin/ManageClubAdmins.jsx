import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserCheck, BookOpen } from 'lucide-react';
import { getAllAdminClubs, assignAdmin } from '../../api/adminApi.js';
import { getAllUsers } from '../../api/adminApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ManageClubAdmins() {
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [c, u] = await Promise.all([getAllAdminClubs(), getAllUsers()]);
    setClubs((c.data || []).filter(cl => cl.status === 'approved'));
    setUsers((u.data || []).filter(u => u.role === 'club_admin' || u.role === 'student'));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async () => {
    if (!selectedAdmin) return toast.error('Select an admin');
    setSaving(true);
    try {
      await assignAdmin(modal.id, selectedAdmin);
      toast.success('Admin assigned');
      setModal(null);
      setSelectedAdmin('');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Manage Club Admins</h1>
          <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
            <UserCheck className="w-5 h-5 text-accent" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Assign administrators to approved clubs.</p>
      </motion.div>

      {clubs.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState icon={BookOpen} title="No approved clubs" />
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Club</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Current Admin</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club, i) => (
                  <motion.tr
                    key={club.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-text-primary font-medium group-hover:text-accent transition-colors">{club.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">{club.category}</td>
                    <td className="py-3.5 px-4 text-text-secondary">{club.admin_name || <span className="text-muted italic">Unassigned</span>}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={club.status} /></td>
                    <td className="py-3.5 px-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setModal(club); setSelectedAdmin(''); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-xs transition-colors cursor-pointer font-medium"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Assign Admin
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={`Assign Admin — ${modal?.name}`}
        onConfirm={handleAssign} confirmLabel="Assign" isLoading={saving}>
        <div>
          <label className="label">Select User</label>
          <select value={selectedAdmin} onChange={e => setSelectedAdmin(e.target.value)} className="input">
            <option value="">Choose a user...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
      </Modal>
    </motion.div>
  );
}
