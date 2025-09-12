# P2P File Share (WebTorrent + Next.js)

Browser-based peer-to-peer file sharing using WebTorrent (BitTorrent over WebRTC), built with Next.js (App Router) and TailwindCSS. No server storage. Share magnet links directly.

## Features
- Seed and download files entirely in the browser
- Share magnet links with peers
- Progress, speed, peers indicators
- Minimal, clean Tailwind UI

## Pages
- `/` – Overview and navigation
- `/send` – Select files and seed (INITIATE TRANSMISSION)
- `/receive` – Paste magnet link and download
  - Also supports `/receive?magnet=<encoded_magnet>`

## Requirements & Caveats
- Both peers must keep the tab open during transfer
- WebRTC must be permitted on the network; some networks block trackers
- Tracker availability can vary; update the `TRACKERS` array if needed

## Development

### Setup
```powershell
cd "c:\Users\DELL\Desktop\funfileshareapp"
npm install
npm run dev
```
Open http://localhost:3000

### Build
```powershell
npm run build
npm start
```

## Trackers
The app uses a default set of public WebRTC trackers. You can change them in:
- `src/app/send/page.js`
- `src/app/receive/page.js`

```js
const TRACKERS = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.fastcast.nz'
];
```

## Security
This is true P2P with no server-side storage. Magnet links are sensitive; share only with intended recipients.

## License
MIT
