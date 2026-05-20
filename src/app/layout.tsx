import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gold Price Tracker | Real-time Chênh Lệch Giá',
  description: 'Theo dõi sự chênh lệch giá vàng Việt Nam (SJC) và Giá Vàng Thế Giới theo thời gian thực.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-50 antialiased selection:bg-gold-500/30">
        {children}
      </body>
    </html>
  );
}
