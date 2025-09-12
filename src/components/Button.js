'use client';

export default function Button({
  children,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2';
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-500 focus:ring-brand-400 disabled:opacity-50 shadow-glow',
    secondary:
      'border border-brand-200/60 bg-white/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 hover:bg-white/90 dark:hover:bg-brand-900/50 focus:ring-brand-300',
    accent:
      'bg-accent-600 text-white hover:bg-accent-500 focus:ring-accent-400 disabled:opacity-50 shadow-glowAccent',
  };
  return (
    <button disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
