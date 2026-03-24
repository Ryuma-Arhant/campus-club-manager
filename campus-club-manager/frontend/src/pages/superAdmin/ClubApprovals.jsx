import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, BookOpen, Clock } from 'lucide-react';
import { getPendingClubs, approveClub, rejectClub } from '../../api/adminApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import { formatDate } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ClubApprovals() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [processing, setProcessing] = useState(false);

  const load = () => getPendingClubs().then(res => setClubs(res.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handle = async () => {
    setProcessing(true);
    try {
      if (modal.action === 'approve') { await approveClub(modal.club.id); toast.success('Club approved'); }
      else { await rejectClub(modal.club.id); toast.success('Club rejected'); }
      setModal(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setProcessing(false); }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Club Approvals</h1>
          {clubs.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#FBBF24]/20"
            >
              {clubs.length}
            </motion.span>
          )}
        </div>
        <p className="text-text-secondary">{clubs.length} pending club(s) awaiting review.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {clubs.length === 0 ? (
          <motion.div key="empty" variants={item}>
            <EmptyState icon={BookOpen} title="No pending clubs" description="All club applications have been reviewed." />
          </motion.div>
        ) : (
          <motion.div key="list" className="space-y-3">
            {clubs.map((club, i) => (
              <motion.div
                key={club.id}
                variants={item}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="card hover:border-accent/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FBBF24]/60 rounded-r" />
                <div className="flex items-start justify-between flex-wrap gap-3 pl-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5 text-[#FBBF24]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">{club.name}</h3>
                        <span className="text-xs text-accent bg-accent/10 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-accent/20">{club.category}</span>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm mt-3 line-clamp-2">{club.description}</p>
                    <p className="text-muted text-xs mt-2 font-mono">Submitted {formatDate(club.created_at)} · Max {club.max_members} members</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setModal({ club, action: 'approve' })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-sm transition-colors cursor-pointer font-medium"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setModal({ club, action: 'reject' })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-colors cursor-pointer font-medium"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.action === 'approve' ? 'Approve Club' : 'Reject Club'}
        onConfirm={handle}
        confirmLabel={modal?.action === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={modal?.action === 'approve' ? 'primary' : 'danger'}
        isLoading={processing}
      >
        <p className="text-text-secondary">
          {modal?.action === 'approve' ? 'Approve' : 'Reject'} <strong className="text-text-primary">{modal?.club?.name}</strong>?
        </p>
      </Modal>
    </motion.div>
  );
}
