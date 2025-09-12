import { Suspense } from 'react';
import ReceiveClient from './Client';

export const dynamic = 'force-dynamic';

export default function ReceivePage() {
  return (
    <Suspense fallback={<div className="text-gray-600">Loading…</div>}>
      <ReceiveClient />
    </Suspense>
  );
}
