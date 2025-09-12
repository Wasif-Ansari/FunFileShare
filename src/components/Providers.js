'use client';

import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { TransferProvider } from './TransferContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <TransferProvider>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      </TransferProvider>
    </ThemeProvider>
  );
}
