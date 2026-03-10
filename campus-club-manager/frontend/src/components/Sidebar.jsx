import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Star, Calendar, Zap } from 'lucide-react';

const NAV_LINKS = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/clubs', icon: BookOpen, label: 'Browse Clubs' },
  { to: '/student/memberships', icon: Star, label: 'My Memberships' },
  { to: '/student/events', icon: Calendar, label: 'Events' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-surface border-r border-border/60 z-30 flex flex-col
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
      `}>
        <div className="h-16 flex items-center px-5 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm">CampusClub</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="text-[13px]">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
