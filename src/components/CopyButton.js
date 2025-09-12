'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { copyText } from '../lib/clipboard';

export default function CopyButton({ text, size = 'sm', className = '' }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!text) return;
    const ok = await copyText(text);
    setCopied(ok);
    if (ok) toast.success('Copied to clipboard'); else toast.error('Copy failed');
    setTimeout(() => setCopied(false), 1200);
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-live="polite"
      className={`inline-flex items-center rounded bg-gray-900 text-white hover:bg-black transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 ${sizes[size]} ${className}`}
    >
      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}