'use client';

import { useTransfer } from './TransferContext';

export default function StatusBar() {
  const { state } = useTransfer();
  if (!state.active) return null;
  const { mode, peers, speed, progress } = state;
  return (
    <div className="sticky top-0 z-40 w-full bg-gradient-to-r from-brand-700/95 via-brand-600/95 to-accent-600/90 text-white backdrop-blur border-b border-white/10">
      <div className="container mx-auto max-w-6xl px-4 py-2 text-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-block rounded px-2 py-0.5 bg-white/20 text-white/95 capitalize">{mode}</span>
          <span className="opacity-90">Peers: {peers}</span>
          <span className="opacity-90">Speed: {formatBytes(speed)}/s</span>
        </div>
        <div className="flex-1 h-2 sm:mx-4 rounded bg-white/20 overflow-hidden max-w-full sm:max-w-md">
          <div className="h-2 bg-white/90" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <span className="opacity-90">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}
