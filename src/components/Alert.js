'use client';

const variants = {
  info: 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-100',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100',
  error: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100',
};

export default function Alert({ children, variant = 'info', className = '' }) {
  const base = 'rounded-xl border p-4 text-sm leading-relaxed';
  const cls = `${base} ${variants[variant] || variants.info} ${className}`;
  return <div className={cls}>{children}</div>;
}
