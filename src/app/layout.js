import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'P2P File Share',
  description: 'Browser-based peer-to-peer file sharing using WebTorrent over WebRTC',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="container py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-lg">P2P File Share</a>
            <div className="space-x-4">
              <a href="/send" className="text-blue-600 hover:underline">Send</a>
              <a href="/receive" className="text-blue-600 hover:underline">Receive</a>
            </div>
          </nav>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t bg-white">
          <div className="container py-6 text-sm text-gray-500">
            Built with Next.js, TailwindCSS, and WebTorrent (browser).
          </div>
        </footer>
      </body>
    </html>
  );
}
