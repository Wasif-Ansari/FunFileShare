'use client';

export default function ProgressBar({ value = 0, color = 'bg-brand-500' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
      <div
        className={`h-full ${color} bg-[length:16px_16px] bg-[linear-gradient(135deg,rgba(255,255,255,.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.35)_50%,rgba(255,255,255,.35)_75%,transparent_75%,transparent)] animate-[progress_1.2s_linear_infinite]`}
        style={{ width: `${pct}%` }}
      />
      <style jsx>{`
        @keyframes progress {
          0% { background-position: 0 0; }
          100% { background-position: 16px 0; }
        }
      `}</style>
    </div>
  );
}
