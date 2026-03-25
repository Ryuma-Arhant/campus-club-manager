import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Save, Mail, Link as LinkIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { profileSchema } from '../../utils/validators.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, avatar_url: user.avatar_url || '' });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUser(data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary mt-1">Manage your account information.</p>
      </motion.div>

      <motion.div variants={item} className="card flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-emerald-600/20 flex items-center justify-center flex-shrink-0 border border-accent/20"
        >
          {user?.avatar_url
            ? <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-2xl object-cover" />
            : <User className="w-8 h-8 text-accent" />
          }
        </motion.div>
        <div className="relative">
          <p className="text-text-primary font-semibold text-lg">{user?.name}</p>
          <p className="text-muted text-sm">{user?.email}</p>
          <span className="text-xs bg-accent/10 text-accent px-2.5 py-0.5 rounded-full mt-1.5 inline-block capitalize border border-accent/20">
            {user?.role?.replace('_', ' ')}
          </span>
        </div>
      </motion.div>

      <motion.form variants={item} onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
        <div>
          <label htmlFor="name" className="label">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="name" {...register('name')} className="input pl-10" />
          </div>
          {errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.name.message}</motion.p>}
        </div>
        <div>
          <label htmlFor="email" className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="email" type="email" {...register('email')} className="input pl-10" />
          </div>
          {errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.email.message}</motion.p>}
        </div>
        <div>
          <label htmlFor="avatar_url" className="label">Avatar URL (optional)</label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="avatar_url" type="url" {...register('avatar_url')} className="input pl-10" placeholder="https://..." />
          </div>
          {errors.avatar_url && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.avatar_url.message}</motion.p>}
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
