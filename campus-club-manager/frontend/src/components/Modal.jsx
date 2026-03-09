import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, onConfirm, confirmLabel = 'Confirm', confirmVariant = 'primary', isLoading = false }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative bg-surface border border-border/60 rounded-xl shadow-2xl shadow-black/40 w-full max-w-md z-10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/60">
              <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-muted" />
              </motion.button>
            </div>
            <div className="p-6">{children}</div>
            {onConfirm && (
              <div className="flex gap-3 px-6 pb-6 justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="btn-secondary px-4"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={confirmVariant === 'danger' ? 'btn-danger px-4' : 'btn-primary px-4'}
                >
                  {isLoading ? 'Processing...' : confirmLabel}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
