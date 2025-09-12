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
  const { setState: setTransfer } = useTransfer();
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
        // Clear global transfer state
        setTransfer((prev) => ({ ...prev, active: false, mode: null, peers: 0, speed: 0, progress: 0 }));
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
      setTransfer((prev) => ({ ...prev, active: false, mode: null, peers: 0, speed: 0, progress: 0 }));
    };
  }, []);

  useEffect(() => {
    if (!torrent) return;
    const interval = setInterval(() => {
      setProgress(torrent.progress || 0);
      setUploadSpeed(torrent.uploadSpeed || 0);
      setPeers(torrent.numPeers || 0);
      setTransfer((prev) => ({
        ...prev,
        active: true,
        mode: 'send',
        peers: torrent.numPeers || 0,
        speed: torrent.uploadSpeed || 0,
        progress: torrent.progress || 0,
      }));
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
    toast.loading('Seeding…', { id: 'seed' });
    client.seed(files, { announce: TRACKERS }, (t) => {
      setTorrent(t);
      setMagnet(t.magnetURI);
      try {
        const url = new URL(window.location.origin);
        url.pathname = '/receive';
        url.searchParams.set('magnet', t.magnetURI);
        setShareLink(url.toString());
      } catch {}
      toast.success('Seeding started', { id: 'seed' });
      setTransfer({ active: true, mode: 'send', peers: 0, speed: 0, progress: 0 });
    });
    client.on('error', (e) => {
      console.error('Client error', e);
      toast.error('WebTorrent error');
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
  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Send files</h1>

      {!ready && (
        <Alert variant="warning">
          Loading WebTorrent… If this persists, check your network/CSP and CDN access.
        </Alert>
      )}

      <Card className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Select files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-white hover:file:bg-brand-700 text-gray-900 dark:text-white"
          />
          {files.length > 0 && (
            <p className="mt-2 text-sm text-gray-700 dark:text-brand-100/90">{files.length} file(s) selected</p>
          )}
        </div>

        <Button onClick={seedNow} disabled={!ready || files.length === 0 || !!torrent} className="animate-fade-in-up">
          INITIATE TRANSMISSION
        </Button>
      </Card>

      {torrent && (
        <Card className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Magnet link</label>
            <div className="flex items-stretch gap-2">
              <input
                readOnly
                value={magnet}
                className="flex-1 rounded-lg border border-brand-200/60 dark:border-brand-800/60 bg-white dark:bg-brand-900/60 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-brand-300"
              />
              <CopyButton text={magnet} />
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-brand-100/80">
              Share this magnet link with the receiver. Keep this tab open while they download.
            </p>
          </div>

          {shareLink && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Direct receive link</label>
              <div className="flex items-stretch gap-2">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 rounded-lg border border-brand-200/60 dark:border-brand-800/60 bg-white dark:bg-brand-900/60 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-brand-300"
                />
                <CopyButton text={shareLink} />
              </div>
              <p className="mt-2 text-xs text-gray-600 dark:text-brand-100/80">Send this URL — it opens the Receive page with the magnet prefilled.</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Stat label="Peers" value={peers} />
            <Stat label="Upload speed" value={`${formatBytes(uploadSpeed)}/s`} />
            <div className="col-span-2">
              <div className="text-gray-500 mb-2">Progress</div>
              <ProgressBar value={progress * 100} />
              <div className="mt-1 text-xs text-gray-500">{Math.round(progress * 100)}%</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Files</h3>
            <ul className="list-disc list-inside text-sm text-gray-800 dark:text-brand-100/90">
              {torrent.files.map((f) => (
                <li key={f.path} className="break-all">
                  {f.path} <span className="text-gray-600 dark:text-brand-200/80">({formatBytes(f.length)})</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {!torrent && files.length > 0 && (
        <Alert variant="info">Ready to seed {files.length} file(s). Click “Initiate Transmission”.</Alert>
      )}
    </div>
  );
}
