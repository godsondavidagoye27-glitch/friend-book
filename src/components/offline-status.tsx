'use client';

import { WifiOff, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => setIsOffline(!navigator.onLine);

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed:', error);
      });
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[70] border-b border-amber-200 bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-900 shadow-sm">
      <div className="mx-auto flex max-w-[430px] items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        <span>Offline mode — you can still browse cached pages.</span>
      </div>
    </div>
  );
}
