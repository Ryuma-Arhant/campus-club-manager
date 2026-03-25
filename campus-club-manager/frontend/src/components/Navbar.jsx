import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, ChevronDown, Menu, X } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const ROLE_LABELS = { student: 'Student', club_admin: 'Club Admin', super_admin: 'Super Admin' };
const ROLE_COLORS = { student: 'text-[#FBBF24]', club_admin: 'text-[#3B82F6]', super_admin: 'text-accent' };

export default function Navbar({ onMenuToggle, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-surface/95 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 flex-shrink-0">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        <AnimatePresence mode="wait">
          {isSidebarOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex-1 lg:flex-none" />

      <div className="relative">
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          onClick={() => setDropdownOpen(o => !o)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
            {user?.avatar_url
              ? <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              : <span className="text-white text-sm font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
            }
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-text-primary text-sm font-medium leading-tight">{user?.name}</span>
            <span className={`text-xs leading-tight ${ROLE_COLORS[user?.role] || 'text-muted'}`}>
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </div>
          <motion.div
            animate={{ rotate: dropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute right-0 mt-2 w-52 bg-surface border border-border/60 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden backdrop-blur-xl"
              >
                <div className="px-4 py-3 border-b border-border/60">
                  <p className="text-text-primary text-sm font-medium">{user?.name}</p>
                  <p className="text-muted text-xs truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 text-text-secondary hover:bg-secondary/80 hover:text-text-primary transition-colors cursor-pointer text-sm group"
                >
                  <User className="w-4 h-4 group-hover:scale-110 transition-transform" /> Profile
                </Link>
                <div className="border-t border-border/60">
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-sm group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sign out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
