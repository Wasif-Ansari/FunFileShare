'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 animate-fade-in-up">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">Peer-to-Peer File Sharing</h1>
        <p className="text-gray-700 dark:text-brand-100/90 max-w-2xl mx-auto">
          Share files directly from your browser using WebTorrent over WebRTC.
          No servers. No sign up. Keep the page open while transferring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-brand-100/60 dark:border-brand-900/40 bg-white/80 dark:bg-brand-950/50 backdrop-blur p-6 shadow-soft animate-fade-in-up">
          <h2 className="text-xl font-semibold mb-2">Send files</h2>
          <p className="text-gray-700 dark:text-brand-100/90 mb-4">Seed files from your browser and share a magnet link.</p>
          <Link href="/send" className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 shadow-glow">
            Go to Send
          </Link>
        </div>
        <div className="rounded-2xl border border-brand-100/60 dark:border-brand-900/40 bg-white/80 dark:bg-brand-950/50 backdrop-blur p-6 shadow-soft animate-fade-in-up">
          <h2 className="text-xl font-semibold mb-2">Receive files</h2>
          <p className="text-gray-700 dark:text-brand-100/90 mb-4">Paste a magnet link to download files via P2P.</p>
          <Link href="/receive" className="inline-block rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 shadow">
            Go to Receive
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100/60 dark:border-brand-900/40 bg-white/80 dark:bg-brand-950/50 backdrop-blur p-6 shadow-soft animate-fade-in-up">
        <h3 className="font-semibold mb-2">How it works</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-brand-100/90 space-y-1">
          <li>Sender selects files and clicks INITIATE TRANSMISSION to start seeding.</li>
          <li>A magnet link is generated; share it with the receiver.</li>
          <li>Receiver pastes the magnet link and downloads directly from the sender.</li>
          <li>Both peers must keep the tab open during the transfer.</li>
        </ul>
      </div>
    </div>
  );
}
