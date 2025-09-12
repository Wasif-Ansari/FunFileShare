'use client';

import { useEffect, useRef, useState } from 'react';

const TRACKERS = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.fastcast.nz'
];

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export default function SendPage() {
  const clientRef = useRef(null);
  const unloadHandlerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [torrent, setTorrent] = useState(null);
  const [magnet, setMagnet] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [peers, setPeers] = useState(0);

  // Create or recreate the WebTorrent client if needed
  const getOrCreateClient = () => {
    if (typeof window === 'undefined' || !window.WebTorrent) return null;
    if (!clientRef.current || clientRef.current.destroyed) {
      try {
        clientRef.current = new window.WebTorrent({
          tracker: {
            rtcConfig: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
          },
        });
      } catch (e) {
        console.error('Failed to init WebTorrent', e);
        clientRef.current = null;
      }
    }
    return clientRef.current;
  };

  useEffect(() => {
    const client = getOrCreateClient();
    if (client) setReady(true);

    // Register unload handler once
    if (!unloadHandlerRef.current) {
      unloadHandlerRef.current = () => {
        if (clientRef.current && !clientRef.current.destroyed) {
          clientRef.current.destroy();
          clientRef.current = null;
        }
      };
      window.addEventListener('beforeunload', unloadHandlerRef.current);
    }

    return () => {
      if (unloadHandlerRef.current) {
        window.removeEventListener('beforeunload', unloadHandlerRef.current);
        unloadHandlerRef.current = null;
      }
      if (clientRef.current && !clientRef.current.destroyed) {
        clientRef.current.destroy();
        clientRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!torrent) return;
    const interval = setInterval(() => {
      setProgress(torrent.progress || 0);
      setUploadSpeed(torrent.uploadSpeed || 0);
      setPeers(torrent.numPeers || 0);
    }, 500);
    return () => clearInterval(interval);
  }, [torrent]);

  const handleFileChange = (e) => {
    const sel = Array.from(e.target.files || []);
    setFiles(sel);
  };

  const seedNow = () => {
    const client = getOrCreateClient();
    if (!client || files.length === 0 || torrent) return;
    client.seed(files, { announce: TRACKERS }, (t) => {
      setTorrent(t);
      setMagnet(t.magnetURI);
      try {
        const url = new URL(window.location.origin);
        url.pathname = '/receive';
        url.searchParams.set('magnet', t.magnetURI);
        setShareLink(url.toString());
      } catch {}
    });
  };

  const copyMagnet = async () => {
    if (!magnet) return;
    try {
      await navigator.clipboard.writeText(magnet);
    } catch {}
  };

  const copyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Send files</h1>

      {!ready && (
        <div className="rounded border bg-yellow-50 p-4 text-yellow-800">
          Loading WebTorrent… If this persists, check your network/CSP and CDN access.
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
          />
          {files.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">{files.length} file(s) selected</p>
          )}
        </div>

        <button
          onClick={seedNow}
          disabled={!ready || files.length === 0 || !!torrent}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          INITIATE TRANSMISSION
        </button>
      </div>

      {torrent && (
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Magnet link</label>
            <div className="flex items-stretch gap-2">
              <input
                readOnly
                value={magnet}
                className="flex-1 rounded border px-3 py-2 text-xs"
              />
              <button onClick={copyMagnet} className="rounded bg-gray-800 px-3 py-2 text-white text-sm">Copy</button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Share this magnet link with the receiver. Keep this tab open while they download.
            </p>
          </div>

          {shareLink && (
            <div>
              <label className="block text-sm font-medium mb-2">Direct receive link</label>
              <div className="flex items-stretch gap-2">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 rounded border px-3 py-2 text-xs"
                />
                <button onClick={copyShareLink} className="rounded bg-gray-800 px-3 py-2 text-white text-sm">Copy</button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Send this URL — it opens the Receive page with the magnet prefilled.</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded bg-gray-50 p-3">
              <div className="text-gray-500">Peers</div>
              <div className="font-semibold">{peers}</div>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <div className="text-gray-500">Upload speed</div>
              <div className="font-semibold">{formatBytes(uploadSpeed)}/s</div>
            </div>
            <div className="rounded bg-gray-50 p-3 col-span-2">
              <div className="text-gray-500 mb-1">Progress</div>
              <div className="h-2 w-full rounded bg-gray-200">
                <div className="h-2 rounded bg-blue-600" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <div className="mt-1 text-xs text-gray-500">{Math.round(progress * 100)}%</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Files</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {torrent.files.map((f) => (
                <li key={f.path} className="break-all">
                  {f.path} <span className="text-gray-500">({formatBytes(f.length)})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
