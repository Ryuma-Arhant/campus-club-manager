import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';

const item = { hidden: { opacity: 0, y: 15 }, visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }) };

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      // TODO: connect to API
      console.log('Register:', data);
      toast.success('Account created!');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed');
    }
  };

  return (
    <div>
      <motion.div className="mb-8" custom={0} variants={item} initial="hidden" animate="visible">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Create account</h2>
        <p className="text-text-secondary">Join Campus Club Manager today</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div custom={1} variants={item} initial="hidden" animate="visible">
          <label htmlFor="name" className="label">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="name" type="text" {...register('name', { required: 'Name is required' })} className="input pl-10" placeholder="Your name" />
          </div>
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </motion.div>

        <motion.div custom={2} variants={item} initial="hidden" animate="visible">
          <label htmlFor="email" className="label">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="email" type="email" {...register('email', { required: 'Email is required' })} className="input pl-10" placeholder="you@campus.edu" />
          </div>
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
        </motion.div>

        <motion.div custom={3} variants={item} initial="hidden" animate="visible">
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input id="password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} className="input pl-10" placeholder="Min 6 characters" />
          </div>
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
        </motion.div>

        <motion.div custom={4} variants={item} initial="hidden" animate="visible">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {isSubmitting ? 'Creating account...' : 'Create account'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </motion.div>
      </form>

      <motion.p custom={5} variants={item} initial="hidden" animate="visible" className="mt-6 text-center text-text-secondary text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
      </motion.p>
    </div>
  );
}
