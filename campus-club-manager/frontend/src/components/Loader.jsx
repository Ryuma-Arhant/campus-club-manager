import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <motion.div
          className="w-10 h-10 border-[3px] border-secondary rounded-full"
          style={{ borderTopColor: 'var(--color-accent, #FBBF24)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-1 border-[2px] border-transparent rounded-full"
          style={{ borderBottomColor: 'var(--color-accent, #FBBF24)', opacity: 0.3 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {fullScreen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted text-sm"
        >
          Loading...
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
}
