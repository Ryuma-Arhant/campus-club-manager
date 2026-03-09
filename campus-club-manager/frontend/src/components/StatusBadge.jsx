const STATUS_STYLES = {
  pending:   'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/25',
  approved:  'bg-green-500/15 text-green-400 border border-green-500/25',
  rejected:  'bg-red-500/15 text-red-400 border border-red-500/25',
  upcoming:  'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  ongoing:   'bg-green-500/15 text-green-400 border border-green-500/25',
  completed: 'bg-slate-500/15 text-slate-400 border border-slate-500/25',
  cancelled: 'bg-red-500/15 text-red-400 border border-red-500/25',
  going:     'bg-green-500/15 text-green-400 border border-green-500/25',
  maybe:     'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/25',
  not_going: 'bg-red-500/15 text-red-400 border border-red-500/25',
  member:    'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  president: 'bg-accent/15 text-accent border border-accent/25',
  secretary: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
  treasurer: 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/25',
};

const STATUS_DOTS = {
  pending: 'bg-[#FBBF24]',
  approved: 'bg-green-400',
  rejected: 'bg-red-400',
  upcoming: 'bg-blue-400',
  ongoing: 'bg-green-400',
  going: 'bg-green-400',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-500/15 text-slate-400 border border-slate-500/25';
  const dot = STATUS_DOTS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {status?.replace('_', ' ')}
    </span>
  );
}
