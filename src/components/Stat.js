'use client';

export default function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-brand-100/60 dark:border-brand-900/40 bg-white/80 dark:bg-brand-950/50 p-4">
      <div className="text-sm font-medium text-gray-800 dark:text-brand-100/90">{label}</div>
      <div className="mt-1 font-semibold text-2xl text-gray-900 dark:text-white tabular-nums">{value}</div>
    </div>
  );
}
