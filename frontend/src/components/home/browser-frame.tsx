export function BrowserFrame({
  children,
  label,
  tone = 'light',
}: {
  children: React.ReactNode;
  label?: string;
  tone?: 'light' | 'dark';
}) {
  const isDark = tone === 'dark';
  return (
    <div
      className={`overflow-hidden rounded-[20px] border shadow-2xl ${
        isDark ? 'border-white/10 bg-[#111827]' : 'border-slate-200 bg-white'
      }`}
    >
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B4A]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F5B700]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
        {label ? (
          <span className={`ml-3 truncate text-xs font-medium ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
            {label}
          </span>
        ) : null}
      </div>
      <div className={`relative aspect-[16/10] w-full ${isDark ? 'bg-[#0B1220]' : 'bg-slate-50'}`}>
        {children}
      </div>
    </div>
  );
}