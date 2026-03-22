import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Users, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import useClubs from '../../hooks/useClubs.js';
import { requestJoin } from '../../api/memberApi.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { CLUB_CATEGORIES } from '../../utils/constants.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } } };

const CATEGORY_COLORS = {
  Technology: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  Arts: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  Sports: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Music: { color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20' },
  Science: { color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', border: 'border-[#FBBF24]/20' },
  default: { color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
};

function getCategoryStyle(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;
}

export default function BrowseClubs() {
  const { clubs, loading } = useClubs();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [joining, setJoining] = useState(null);

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || c.category === category)
  );

  const handleJoin = async (clubId) => {
    setJoining(clubId);
    try {
      await requestJoin(clubId);
      toast.success('Membership request sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setJoining(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Browse Clubs</h1>
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}>
            <Sparkles className="w-5 h-5 text-accent" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Find and join clubs that match your interests.</p>
      </motion.div>

      <motion.div variants={item} className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search clubs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input sm:w-48">
          <option value="">All Categories</option>
          {CLUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState title="No clubs found" description="Try adjusting your search or filter." />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((club) => {
              const catStyle = getCategoryStyle(club.category);
              return (
                <motion.div
                  key={club.id}
                  variants={item}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="card flex flex-col gap-3 group relative overflow-hidden hover:border-accent/20 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/[0.04] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">{club.name}</h3>
                        <span className={`text-xs ${catStyle.color} ${catStyle.bg} px-2.5 py-0.5 rounded-full mt-1.5 inline-block border ${catStyle.border}`}>{club.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary text-xs bg-secondary/50 px-2 py-1 rounded-full">
                        <Users className="w-3.5 h-3.5" /> {club.member_count || 0}
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm line-clamp-2 flex-1 mt-3">{club.description}</p>
                    <div className="flex gap-2 pt-3">
                      <motion.button
                        onClick={() => handleJoin(club.id)}
                        disabled={joining === club.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-primary flex-1 text-sm"
                      >
                        {joining === club.id ? 'Sending...' : 'Request to Join'}
                      </motion.button>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to={`/student/clubs/${club.id}`} className="btn-secondary px-3 h-full flex items-center justify-center" aria-label="View club">
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
