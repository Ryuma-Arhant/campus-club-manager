import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/50 backdrop-blur-sm py-4 px-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-accent/50" />
          <span className="text-muted text-xs">Campus Club Manager</span>
        </div>
        <p className="text-muted text-xs">&copy; 2026 All rights reserved.</p>
      </div>
    </footer>
  );
}
