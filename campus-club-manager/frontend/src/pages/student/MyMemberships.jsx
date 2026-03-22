import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMyMemberships } from '../../api/memberApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { BookOpen, Star } from 'lucide-react';
import { formatDate } from '../../utils/formatDate.js';
import { MEMBER_ROLES } from '../../utils/constants.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } } };

export default function MyMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyMemberships()
      .then(res => setMemberships(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">My Memberships</h1>
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}>
            <Star className="w-5 h-5 text-[#FBBF24]" />
          </motion.div>
        </div>
        <p className="text-text-secondary">All your club memberships and their status.</p>
      </motion.div>

      {memberships.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState icon={BookOpen} title="No memberships yet" description="Browse clubs and request to join one." />
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Club</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((m, i) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-text-primary font-medium group-hover:text-accent transition-colors">{m.club_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">{m.category}</td>
                    <td className="py-3.5 px-4 text-text-secondary capitalize">
                      {MEMBER_ROLES[m.role?.toUpperCase()]?.label || m.role}
                    </td>
                    <td className="py-3.5 px-4"><StatusBadge status={m.status} /></td>
                    <td className="py-3.5 px-4 text-text-secondary font-mono text-xs">{formatDate(m.joined_at)}</td>
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
