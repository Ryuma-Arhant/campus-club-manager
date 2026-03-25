import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/[0.02] via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/[0.04] rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6 }}
        className="text-center relative"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20"
        >
          <ShieldOff className="w-12 h-12 text-red-400" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="text-5xl font-black text-red-400 font-mono mb-4"
        >
          403
        </motion.h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Access denied</h2>
        <p className="text-text-secondary mb-8 max-w-xs mx-auto">
          You don&apos;t have permission to view this page.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="btn-secondary px-8 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
