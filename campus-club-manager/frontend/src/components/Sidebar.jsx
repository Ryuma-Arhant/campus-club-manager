import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, Settings,
  BookOpen, Star, UserCheck, PlusCircle, BarChart3, ClipboardList, Zap,
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const NAV_LINKS = {
  student: [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/clubs', icon: BookOpen, label: 'Browse Clubs' },
    { to: '/student/memberships', icon: Star, label: 'My Memberships' },
    { to: '/student/events', icon: Calendar, label: 'Events' },
  ],
  club_admin: [
    { to: '/club-admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/club-admin/requests', icon: ClipboardList, label: 'Member Requests' },
    { to: '/club-admin/roster', icon: Users, label: 'Member Roster' },
    { to: '/club-admin/roles', icon: UserCheck, label: 'Manage Roles' },
    { to: '/club-admin/events', icon: Calendar, label: 'Events' },
    { to: '/club-admin/events/create', icon: PlusCircle, label: 'Create Event' },
    { to: '/club-admin/settings', icon: Settings, label: 'Club Settings' },
  ],
  super_admin: [
    { to: '/super-admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/super-admin/approvals', icon: ClipboardList, label: 'Club Approvals' },
    { to: '/super-admin/admins', icon: UserCheck, label: 'Club Admins' },
    { to: '/super-admin/clubs', icon: BookOpen, label: 'All Clubs' },
    { to: '/super-admin/stats', icon: BarChart3, label: 'System Stats' },
  ],
};

const ROLE_LABELS = { student: 'Student', club_admin: 'Club Admin', super_admin: 'Super Admin' };
const ROLE_DOTS = { student: 'bg-[#FBBF24]', club_admin: 'bg-[#3B82F6]', super_admin: 'bg-accent' };

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const links = NAV_LINKS[user?.role] || [];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-surface/95 backdrop-blur-xl border-r border-border/60 z-30 flex flex-col
        transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.4,0.25,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-neon/50">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-text-primary font-mono text-sm tracking-tight block leading-tight">Campus<span className="text-gradient">Club</span></span>
              <span className="text-[10px] text-muted leading-tight">Manager</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-widest px-3 mb-2">Navigation</p>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer min-h-[40px] group relative overflow-hidden ${
                  isActive
                    ? 'bg-accent/[0.12] text-accent font-medium'
                    : 'text-text-secondary hover:bg-secondary/80 hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg, #FBBF24, #F59E0B)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-200 ${isActive ? 'text-accent' : 'text-muted group-hover:text-text-secondary'}`} />
                  <span className="text-[13px]">{label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border/60 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors cursor-default">
            <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-xs font-medium truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${ROLE_DOTS[user?.role] || 'bg-muted'}`} />
                <p className="text-muted text-[10px] capitalize">{ROLE_LABELS[user?.role] || user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
