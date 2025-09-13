import './globals.css';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import Providers from '../components/Providers';
import ThemeToggle from '../components/ThemeToggle';
import PageTransition from '../components/PageTransition';
import StatusBar from '../components/StatusBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'P2P File Share',
  description: 'Browser-based peer-to-peer file sharing',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="hydrated">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        <link rel="apple-touch-icon" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="description" content="Browser-based P2P file sharing with a modern, elegant UI." />
        <meta property="og:title" content="P2P File Share" />
        <meta property="og:description" content="Share files directly via WebRTC with a beautiful UI." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/" />
        <meta property="og:image" content="/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="P2P File Share" />
        <meta name="twitter:description" content="Share files directly via WebRTC with a beautiful UI." />
        <meta name="twitter:image" content="/og.png" />
        <Script
          src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"
          strategy="beforeInteractive"
        />
      </head>
  <body className={`${inter.className} min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-slate-100 text-gray-900 dark:from-slate-900 dark:to-slate-950 dark:text-white`}>
        <Providers>
          <StatusBar />
          <header className="border-b border-brand-100/60 dark:border-brand-900/40 bg-white/70 dark:bg-brand-950/40 backdrop-blur">
            <nav className="container mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center justify-between gap-y-2">
              <a href="/" className="relative font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                <span className="relative z-10">P2P File Share</span>
                <span className="absolute -inset-x-2 -bottom-1 h-2 bg-brand-500/25 blur-lg rounded-full animate-pulse-glow" aria-hidden="true" />
              </a>
              <div className="flex items-center gap-3">
                <a href="/" className="inline-block rounded-lg border border-brand-200/60 dark:border-brand-900/40 bg-white/60 dark:bg-brand-900/40 px-3 py-1.5 hover:bg-white/80 dark:hover:bg-brand-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 dark:text-white">Home</a>
                <a href="/send" className="inline-block rounded-lg border border-brand-200/60 dark:border-brand-900/40 bg-white/60 dark:bg-brand-900/40 px-3 py-1.5 hover:bg-white/80 dark:hover:bg-brand-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 dark:text-white">Send</a>
                <a href="/receive" className="inline-block rounded-lg border border-brand-200/60 dark:border-brand-900/40 bg-white/60 dark:bg-brand-900/40 px-3 py-1.5 hover:bg-white/80 dark:hover:bg-brand-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 dark:text-white">Receive</a>
                <ThemeToggle />
              </div>
            </nav>
          </header>
          <main className="container mx-auto max-w-6xl px-4 py-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="border-t border-brand-100/60 dark:border-brand-900/40 bg-white/70 dark:bg-brand-950/40 backdrop-blur">
            <div className="container mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500 dark:text-brand-200">
              Copyright © W Software Solutions 2025 
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
