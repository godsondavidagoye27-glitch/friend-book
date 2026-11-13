import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FriendBook',
  description: 'Mobile-first marketplace for booking nearby social time.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
