import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { loginSchema } from '../../utils/validators.js';

const item = { hidden: { opacity: 0, y: 15 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }) };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success('Welcome back!');
      if (user.role === 'super_admin') navigate('/super-admin/dashboard');
      else if (user.role === 'club_admin') navigate('/club-admin/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <motion.div className="mb-8" custom={0} variants={item} initial="hidden" animate="visible">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Sign in</h2>
        <p className="text-text-secondary">Welcome back to Campus Club Manager</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div custom={1} variants={item} initial="hidden" animate="visible">
          <label htmlFor="email" className="label">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="email" type="email" {...register('email')} className="input pl-10" placeholder="you@campus.edu" />
          </div>
          {errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.email.message}</motion.p>}
        </motion.div>

        <motion.div custom={2} variants={item} initial="hidden" animate="visible">
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="password" type="password" {...register('password')} className="input pl-10" placeholder="••••••••" />
          </div>
          {errors.password && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.password.message}</motion.p>}
        </motion.div>

        <motion.div custom={3} variants={item} initial="hidden" animate="visible" className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
        </motion.div>

        <motion.div custom={4} variants={item} initial="hidden" animate="visible">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </motion.button>
        </motion.div>
      </form>

      <motion.p custom={5} variants={item} initial="hidden" animate="visible" className="mt-6 text-center text-text-secondary text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-accent hover:underline font-medium">Create one</Link>
      </motion.p>
    </div>
  );
}
