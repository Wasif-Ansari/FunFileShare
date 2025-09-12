'use client';

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-brand-100/60 dark:border-brand-900/40 bg-white/80 dark:bg-brand-950/50 backdrop-blur p-6 shadow-soft animate-fade-in-up transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-glow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-3 tracking-tight text-gray-900 dark:text-white">{title}</h3>}
      {children}
    </div>
  );
}
