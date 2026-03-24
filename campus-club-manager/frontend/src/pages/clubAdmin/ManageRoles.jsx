import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, UserCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { getClubMembers, changeMemberRole } from '../../api/memberApi.js';
import { getClubs } from '../../api/clubApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { MEMBER_ROLES } from '../../utils/constants.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ManageRoles() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    getClubs().then(res => {
      const club = (res.data || []).find(c => c.admin_id === user?.id);
      if (club) return getClubMembers(club.id);
      return { data: [] };
    }).then(res => {
      const approved = (res.data || []).filter(m => m.status === 'approved');
      setMembers(approved);
      const initRoles = {};
      approved.forEach(m => { initRoles[m.id] = m.role; });
      setRoles(initRoles);
    }).finally(() => setLoading(false));
  }, [user?.id]);

  const handleSave = async (memberId) => {
    setSaving(memberId);
    try {
      await changeMemberRole(memberId, roles[memberId]);
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(null); }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Manage Roles</h1>
          <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
            <UserCheck className="w-5 h-5 text-accent" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Assign roles to club members.</p>
      </motion.div>

      {members.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState icon={UserCheck} title="No members" description="Approve membership requests first." />
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Member</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
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
                    <td className="py-3.5 px-4">
                      <select
                        value={roles[m.id] || 'member'}
                        onChange={e => setRoles(r => ({ ...r, [m.id]: e.target.value }))}
                        className="input py-1 min-h-0 h-9"
                      >
                        {Object.values(MEMBER_ROLES).map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSave(m.id)}
                        disabled={saving === m.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-xs transition-colors cursor-pointer font-medium"
                      >
                        <Save className="w-3.5 h-3.5" /> {saving === m.id ? 'Saving...' : 'Save'}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
