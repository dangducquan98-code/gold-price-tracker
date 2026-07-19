import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin', 'vietnamese'], variable: '--font-space-grotesk' });
const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin', 'vietnamese'], variable: '--font-jetbrains-mono' });

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
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen antialiased selection:bg-[oklch(75%_0.16_85/0.3)]`}>
        {children}
      </body>
    </html>
  );
}
