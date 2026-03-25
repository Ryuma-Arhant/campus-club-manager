import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-[#FBBF24]/[0.02]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/[0.06] rounded-full blur-[100px]" />

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
          className="w-24 h-24 rounded-2xl bg-secondary/80 flex items-center justify-center mx-auto mb-6 border border-border/60"
        >
          <SearchX className="w-12 h-12 text-muted" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="text-7xl font-black text-gradient font-mono mb-4"
        >
          404
        </motion.h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Page not found</h2>
        <p className="text-text-secondary mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="btn-primary px-8 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
