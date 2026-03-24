import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, Settings, BookOpen, Users, FileText } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { getClub, updateClub } from '../../api/clubApi.js';
import { getClubs } from '../../api/clubApi.js';
import { clubSchema } from '../../utils/validators.js';
import Loader from '../../components/Loader.jsx';
import { CLUB_CATEGORIES } from '../../utils/constants.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ClubSettings() {
  const { user } = useAuth();
  const [clubId, setClubId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(clubSchema),
  });

  useEffect(() => {
    getClubs().then(res => {
      const club = (res.data || []).find(c => c.admin_id === user?.id);
      if (club) {
        setClubId(club.id);
        return getClub(club.id);
      }
    }).then(res => {
      if (res?.data) reset({ name: res.data.name, description: res.data.description, category: res.data.category, max_members: res.data.max_members });
    }).finally(() => setLoading(false));
  }, [user?.id, reset]);

  const onSubmit = async (data) => {
    try {
      await updateClub(clubId, data);
      toast.success('Club settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Club Settings</h1>
          <motion.div animate={{ rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
            <Settings className="w-5 h-5 text-muted" />
          </motion.div>
        </div>
        <p className="text-text-secondary">Update your club information.</p>
      </motion.div>

      <motion.form variants={item} onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
        <div>
          <label htmlFor="name" className="label">Club Name *</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="name" {...register('name')} className="input pl-10" />
          </div>
          {errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.name.message}</motion.p>}
        </div>
        <div>
          <label htmlFor="description" className="label">Description *</label>
          <textarea id="description" {...register('description')} rows={4} className="input resize-none" />
          {errors.description && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.description.message}</motion.p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="label">Category *</label>
            <select id="category" {...register('category')} className="input">
              {CLUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.category.message}</motion.p>}
          </div>
          <div>
            <label htmlFor="max_members" className="label">Max Members</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input id="max_members" type="number" {...register('max_members', { valueAsNumber: true })} className="input pl-10" />
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 px-6"
        >
          <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
