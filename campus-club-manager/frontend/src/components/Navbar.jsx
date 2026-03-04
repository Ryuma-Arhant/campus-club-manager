import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar({ onMenuToggle, isSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-surface border-b border-border/60 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="flex-1 lg:flex-none" />

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-black text-sm font-bold">U</span>
          </div>
          <span className="hidden sm:block text-sm">User</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
            <a href="/profile" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary text-sm">
              <User className="w-4 h-4" /> Profile
            </a>
            <a href="/logout" className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm">
              <LogOut className="w-4 h-4" /> Sign out
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
