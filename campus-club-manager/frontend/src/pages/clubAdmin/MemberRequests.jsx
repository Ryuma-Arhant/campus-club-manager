import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Users, ClipboardList } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { getPendingMembers, approveMember, rejectMember } from '../../api/memberApi.js';
import { getClubs } from '../../api/clubApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function MemberRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [clubId, setClubId] = useState(null);

  const load = async () => {
    try {
      const clubs = await getClubs();
      const club = (clubs.data || []).find(c => c.admin_id === user?.id);
      if (club) {
        setClubId(club.id);
        const res = await getPendingMembers(club.id);
        setRequests(res.data || []);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user?.id]);

  const handle = async (id, action) => {
    setProcessing(id);
    try {
      if (action === 'approve') { await approveMember(id); toast.success('Member approved'); }
      else { await rejectMember(id); toast.success('Request rejected'); }
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setProcessing(null); }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Member Requests</h1>
          {requests.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#FBBF24]/20"
            >
              {requests.length}
            </motion.span>
          )}
        </div>
        <p className="text-text-secondary">Review and approve membership applications.</p>
      </motion.div>

      {requests.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState icon={Users} title="No pending requests" description="All membership requests have been handled." />
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Requested</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FBBF24]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <span className="text-[#FBBF24] text-xs font-bold">{r.user_name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <span className="text-text-primary font-medium">{r.user_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">{r.user_email}</td>
                    <td className="py-3.5 px-4 text-text-secondary font-mono text-xs">{formatDate(r.joined_at)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handle(r.id, 'approve')}
                          disabled={processing === r.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-xs transition-colors cursor-pointer font-medium"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handle(r.id, 'reject')}
                          disabled={processing === r.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs transition-colors cursor-pointer font-medium"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </motion.button>
                      </div>
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
