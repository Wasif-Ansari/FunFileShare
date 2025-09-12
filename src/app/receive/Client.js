'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTransfer } from '../../components/TransferContext';
import CopyButton from '../../components/CopyButton';
import Card from '../../components/Card';
import Stat from '../../components/Stat';
import ProgressBar from '../../components/ProgressBar';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
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

export default function ReceiveClient() {
  const clientRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [magnet, setMagnet] = useState('');
  const [torrent, setTorrent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [peers, setPeers] = useState(0);
  const [fileUrls, setFileUrls] = useState({});
  const searchParams = useSearchParams();
  const { setState: setTransfer } = useTransfer();

  // Helper to get or recreate client
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

    const onBeforeUnload = () => {
      if (clientRef.current && !clientRef.current.destroyed) {
        clientRef.current.destroy();
        clientRef.current = null;
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (clientRef.current && !clientRef.current.destroyed) {
        clientRef.current.destroy();
        clientRef.current = null;
      }
      Object.values(fileUrls).forEach((u) => URL.revokeObjectURL(u));
      setTransfer((prev) => ({ ...prev, active: false, mode: null, peers: 0, speed: 0, progress: 0 }));
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
      setTransfer((prev) => ({
        ...prev,
        active: true,
        mode: 'receive',
        peers: torrent.numPeers || 0,
        speed: torrent.downloadSpeed || 0,
        progress: torrent.progress || 0,
      }));
    }, 500);
    return () => clearInterval(interval);
  }, [torrent]);

  const startDownload = () => {
    const client = getOrCreateClient();
    if (!client || !magnet || torrent) return;
    toast.loading('Connecting…', { id: 'dl' });
    client.add(magnet, { announce: TRACKERS }, (t) => {
      setTorrent(t);
      setTransfer({ active: true, mode: 'receive', peers: 0, speed: 0, progress: 0 });
      toast.success('Downloading started', { id: 'dl' });
      t.files.forEach((f) => {
        f.getBlobURL((err, url) => {
          if (err) return console.error('Blob URL error', err);
          setFileUrls((prev) => ({ ...prev, [f.path]: url }));
        });
      });
    });
    client.on('error', (e) => {
      console.error('Client error', e);
      toast.error('WebTorrent error');
    });
  };

  return (
    <div className="space-y-6">
  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Receive files</h1>

      {!ready && (
        <Alert variant="warning">
          Loading WebTorrent… If this persists, check your network/CSP and CDN access.
        </Alert>
      )}

      <Card className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Magnet link</label>
          <textarea
            value={magnet}
            onChange={(e) => setMagnet(e.target.value)}
            className="w-full min-h-[100px] rounded-lg border border-brand-200/60 dark:border-brand-800/60 bg-white dark:bg-brand-900/60 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-brand-300 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-300"
            placeholder="Paste magnet:?xt=urn:btih:..."
          />
          <div className="mt-3 flex items-center gap-2">
            <CopyButton text={magnet} />
            <p className="text-xs text-gray-600 dark:text-brand-100/80">Tip: You can also open /receive?magnet=&lt;encoded_magnet&gt;</p>
          </div>
        </div>

        <Button variant="accent" onClick={startDownload} disabled={!ready || !magnet}
        >
          START DOWNLOAD
        </Button>
      </Card>

      {torrent && (
        <Card className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Stat label="Peers" value={peers} />
            <Stat label="Download speed" value={`${formatBytes(downloadSpeed)}/s`} />
            <div className="col-span-2">
              <div className="text-gray-600 dark:text-brand-100/80 mb-2">Progress</div>
              <ProgressBar value={progress * 100} color="bg-green-600" />
              <div className="mt-1 text-xs text-gray-600 dark:text-brand-100/80">{Math.round(progress * 100)}%</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Files</h3>
            <ul className="space-y-2 text-sm text-gray-800 dark:text-brand-100/90">
              {torrent.files.map((f) => (
                <li key={f.path} className="flex items-center justify-between gap-3 break-all">
                  <span>
                    {f.path} <span className="text-gray-600 dark:text-brand-200/80">({formatBytes(f.length)})</span>
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
  </Card>
      )}

      <Card className="text-sm">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-brand-100/90">
          <li>Both sender and receiver must keep their browser tab open during transfer.</li>
          <li>Some corporate or restrictive networks may block WebRTC trackers.</li>
          <li>If peers don’t connect, try a different tracker list or network.</li>
        </ul>
      </Card>
    </div>
  );
}