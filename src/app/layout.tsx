import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Theo Dõi Chênh Lệch Giá Vàng | Gold Price Tracker',
  description: 'So sánh chênh lệch giá vàng Việt Nam (SJC, DOJI, Bảo Tín Minh Châu...) và Giá Vàng Thế Giới theo thời gian thực. Gợi ý đầu tư vàng tích trữ.',
  keywords: 'giá vàng, chênh lệch giá vàng, vàng sjc, vàng doji, vàng thế giới, đầu tư vàng, tỷ giá usd, vàng tích trữ',
  authors: [{ name: 'Gold Tracker' }],
  openGraph: {
    title: 'Theo Dõi Chênh Lệch Giá Vàng Real-time',
    description: 'So sánh trực quan chênh lệch giá vàng trong nước và thế giới. Cập nhật liên tục 24/7.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Theo Dõi Chênh Lệch Giá Vàng Real-time',
    description: 'Cập nhật biến động chênh lệch giá vàng SJC, DOJI với thế giới.',
  },
  robots: {
    index: true,
    follow: true,
  }
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
