import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { getAllAdminClubs } from '../../api/adminApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDate } from '../../utils/formatDate.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AllClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getAllAdminClubs().then(res => setClubs(res.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === '' || c.status === statusFilter)
  );

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary">All Clubs</h1>
        <p className="text-text-secondary mt-1">{clubs.length} clubs in the system.</p>
      </motion.div>

      <motion.div variants={item} className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
          <input type="text" placeholder="Search clubs..." value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input sm:w-40">
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div variants={item}>
          <EmptyState icon={BookOpen} title="No clubs found" />
        </motion.div>
      ) : (
        <motion.div variants={item} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Club</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Admin</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Members</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium text-xs uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((club, i) => (
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
                    <td className="py-3.5 px-4 text-text-secondary">{club.admin_name || <span className="text-muted italic">None</span>}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-text-secondary font-mono text-xs">{club.member_count || 0}/{club.max_members}</span>
                    </td>
                    <td className="py-3.5 px-4"><StatusBadge status={club.status} /></td>
                    <td className="py-3.5 px-4 text-text-secondary font-mono text-xs">{formatDate(club.created_at)}</td>
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
