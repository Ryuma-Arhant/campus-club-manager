import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

const schema = z.object({ email: z.string().email('Invalid email address') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 border border-accent/20"
          >
            <CheckCircle className="w-8 h-8 text-accent" />
          </motion.div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Check your email</h2>
          <p className="text-text-secondary mb-6">If that email is registered, you&apos;ll receive a reset link shortly.</p>
          <Link to="/login" className="text-accent hover:underline font-medium">Back to sign in</Link>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Forgot password?</h2>
            <p className="text-text-secondary">Enter your email and we&apos;ll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input id="email" type="email" {...register('email')} className="input pl-10" placeholder="you@campus.edu" />
              </div>
              {errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.email.message}</motion.p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <Mail className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send reset link'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-text-secondary text-sm">
            <Link to="/login" className="text-accent hover:underline font-medium">Back to sign in</Link>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
