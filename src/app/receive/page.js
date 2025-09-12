'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

export default function ReceivePage() {
  const clientRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [magnet, setMagnet] = useState('');
  const [torrent, setTorrent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [peers, setPeers] = useState(0);
  const [fileUrls, setFileUrls] = useState({});
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.WebTorrent && !clientRef.current) {
      try {
        clientRef.current = new window.WebTorrent({
          tracker: {
            rtcConfig: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
          },
        });
        setReady(true);
      } catch (e) {
        console.error('Failed to init WebTorrent', e);
      }
    }

    const onBeforeUnload = () => {
      if (clientRef.current) clientRef.current.destroy();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (clientRef.current) clientRef.current.destroy();
      // Revoke blob URLs
      Object.values(fileUrls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  useEffect(() => {
    const m = searchParams.get('magnet');
    if (m) setMagnet(m);
  }, [searchParams]);

  useEffect(() => {
    if (!torrent) return;
    const interval = setInterval(() => {
      setProgress(torrent.progress || 0);
      setDownloadSpeed(torrent.downloadSpeed || 0);
      setPeers(torrent.numPeers || 0);
    }, 500);
    return () => clearInterval(interval);
  }, [torrent]);

  const startDownload = () => {
    if (!clientRef.current || !magnet) return;
    clientRef.current.add(magnet, { announce: TRACKERS }, (t) => {
      setTorrent(t);
      // Prepare blob URLs as files become available
      t.files.forEach((f) => {
        f.getBlobURL((err, url) => {
          if (err) return console.error('Blob URL error', err);
          setFileUrls((prev) => ({ ...prev, [f.path]: url }));
        });
      });
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Receive files</h1>

      {!ready && (
        <div className="rounded border bg-yellow-50 p-4 text-yellow-800">
          Loading WebTorrent… If this persists, check your network/CSP and CDN access.
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Magnet link</label>
          <textarea
            value={magnet}
            onChange={(e) => setMagnet(e.target.value)}
            className="w-full min-h-[100px] rounded border px-3 py-2 text-xs"
            placeholder="Paste magnet:?xt=urn:btih:..."
          />
          <p className="mt-2 text-xs text-gray-500">You can also open /receive?magnet=&lt;encoded_magnet&gt;</p>
        </div>

        <button
          onClick={startDownload}
          disabled={!ready || !magnet}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          START DOWNLOAD
        </button>
      </div>

      {torrent && (
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded bg-gray-50 p-3">
              <div className="text-gray-500">Peers</div>
              <div className="font-semibold">{peers}</div>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <div className="text-gray-500">Download speed</div>
              <div className="font-semibold">{formatBytes(downloadSpeed)}/s</div>
            </div>
            <div className="rounded bg-gray-50 p-3 col-span-2">
              <div className="text-gray-500 mb-1">Progress</div>
              <div className="h-2 w-full rounded bg-gray-200">
                <div className="h-2 rounded bg-green-600" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <div className="mt-1 text-xs text-gray-500">{Math.round(progress * 100)}%</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Files</h3>
            <ul className="space-y-2 text-sm">
              {torrent.files.map((f) => (
                <li key={f.path} className="flex items-center justify-between gap-3 break-all">
                  <span>
                    {f.path} <span className="text-gray-500">({formatBytes(f.length)})</span>
                  </span>
                  <a
                    href={fileUrls[f.path] || '#'}
                    download={f.path.split('/').pop()}
                    className={`rounded px-3 py-1 text-white text-xs ${fileUrls[f.path] ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    onClick={(e) => { if (!fileUrls[f.path]) e.preventDefault(); }}
                  >
                    {fileUrls[f.path] ? 'Download' : 'Preparing…'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Notes</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Both sender and receiver must keep their browser tab open during transfer.</li>
          <li>Some corporate or restrictive networks may block WebRTC trackers.</li>
          <li>If peers don’t connect, try a different tracker list or network.</li>
        </ul>
      </div>
    </div>
  );
}
