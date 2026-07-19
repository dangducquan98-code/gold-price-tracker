import { getGoldData } from '@/lib/gold';
import { ExternalLink, Star, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function Home() {
  const currentData = await getGoldData();
  const formatVND = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');

  const vnBrands = [
    {
      name: 'SJC',
      price: currentData.sjcPrice,
      diff: currentData.sjcDiff,
      pct: currentData.sjcDiffPct,
      url: 'https://giavang.org/'
    },
    {
      name: 'DOJI',
      price: currentData.dojiPrice,
      diff: currentData.dojiDiff,
      pct: currentData.dojiDiffPct,
      url: 'https://giavang.org/'
    },
    {
      name: 'Bảo Tín Minh Châu',
      price: currentData.btmcPrice,
      diff: currentData.btmcDiff,
      pct: currentData.btmcDiffPct,
      url: 'https://giavang.org/'
    },
    {
      name: 'Bảo Tín Mạnh Hải',
      price: currentData.btmhPrice,
      diff: currentData.btmhDiff,
      pct: currentData.btmhDiffPct,
      url: 'https://giavang.org/'
    },
  ];

  // Sản phẩm Affiliate Shopee
  const affiliateProducts = [
    {
      id: 1,
      name: 'Vàng tích trữ 24k 0,1 chỉ Bảo Tín Mạnh Hải',
      price: currentData.btmhPrice / 10,
      image: '/images/1.webp',
      link: 'https://s.shopee.vn/7fWpp8xKRZ',
      rating: 5.0,
      sold: '1.2k'
    },
    {
      id: 2,
      name: 'Nhẫn Tiết Kiệm Vàng 24k 0.1 Chỉ Huy Thanh Jewelry (KÈM TÚI GẤM)',
      price: currentData.dojiPrice / 10,
      image: '/images/2.webp',
      link: 'https://s.shopee.vn/8pinDNCnVq',
      rating: 4.9,
      sold: '20.5k'
    },
    {
      id: 3,
      name: 'Thần Tài Phát 0.1 Chỉ Huy Thanh',
      price: currentData.dojiPrice / 10,
      image: '/images/3.webp',
      link: 'https://s.shopee.vn/6feIdRteO6',
      rating: 5.0,
      sold: '10.1k'
    },
    {
      id: 4,
      name: 'Sổ tay tiết kiệm đựng vàng nhẫn',
      price: 73000,
      image: '/images/4.webp',
      link: 'https://s.shopee.vn/1gFcgIbemA',
      rating: 4.8,
      sold: '9.3k'
    }
  ];

  return (
    <>
      {/* N1b-style Minimal Nav */}
      <nav className="nav sticky top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-paper/80">
        <div className="font-display font-bold text-lg tracking-tight text-ink flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          GOLD TRACKER
        </div>
        <div className="text-sm font-mono text-muted uppercase tracking-widest hidden sm:block">
          VN ⇄ World
        </div>
      </nav>

      <main className="px-4 py-16 md:py-24 max-w-5xl mx-auto flex flex-col gap-24">
        
        {/* H4 · Stat-Led Hero */}
        <section className="stat-hero flex flex-col items-start reveal is-in">
          <div className="text-display font-mono font-bold leading-none tracking-tighter text-ink mb-6 tnum">
            {formatVND(currentData.sjcPrice)}
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-medium text-ink-2 max-w-2xl leading-snug">
            Giá vàng nhẫn 9999 SJC trong nước. <br/>
            <span className="text-muted">Đang chênh lệch {(currentData.sjcDiffPct > 0 ? '+' : '')}{currentData.sjcDiffPct.toFixed(2)}% so với thị trường thế giới.</span>
          </h1>
          <div className="mt-10 flex gap-4">
            <a href="#affiliate" className="btn--primary inline-flex items-center gap-2">
              Xem gợi ý đầu tư <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#world-price" className="btn--outline inline-flex items-center">
              Giá thế giới
            </a>
          </div>
        </section>

        {/* F3 / Grid variant for Supporting Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal is-in" style={{ transitionDelay: '100ms' }}>
          {vnBrands.map(brand => (
            <div key={brand.name} className="data-card p-6 flex flex-col">
               <div className="text-xs font-mono uppercase text-muted mb-4 tracking-wider flex justify-between items-center">
                 {brand.name}
                 <a href={brand.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                   <ExternalLink className="w-3 h-3" />
                 </a>
               </div>
               <div className="text-2xl font-display font-bold text-ink tnum mb-1">{formatVND(brand.price)}</div>
               <div className={`text-sm font-mono ${brand.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                 {brand.diff > 0 ? '+' : ''}{formatVND(brand.diff)} ({brand.pct > 0 ? '+' : ''}{brand.pct.toFixed(2)}%)
               </div>
            </div>
          ))}
        </section>

        {/* World Price Focus */}
        <section id="world-price" className="data-card p-8 md:p-12 border-l-4 border-l-accent reveal is-in" style={{ transitionDelay: '200ms' }}>
           <h2 className="text-xs font-mono uppercase text-muted mb-4 tracking-wider">Giá thế giới quy đổi (1 chỉ)</h2>
           <div className="text-4xl md:text-5xl font-display font-bold text-ink tnum mb-3">{formatVND(currentData.worldPriceVND)}</div>
           <div className="text-muted font-mono text-sm">~ {currentData.worldPriceUSD.toFixed(2)} USD / Troy Ounce</div>
           <p className="mt-6 text-sm text-ink-2 max-w-xl font-body leading-relaxed">
             Tỷ giá quy đổi tham chiếu: <span className="font-mono">{formatVND(currentData.exchangeRate)}</span>. 
             Dữ liệu được cập nhật realtime từ thị trường toàn cầu giúp bạn có cái nhìn tổng quan trước khi quyết định đầu tư.
           </p>
        </section>

        {/* F6 Product Card Grid - Affiliate Section */}
        <section id="affiliate" className="pt-16 border-t border-rule reveal is-in" style={{ transitionDelay: '300ms' }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold text-ink mb-3">Đầu tư vàng thông minh</h2>
              <p className="text-ink-2 font-body">Sản phẩm vàng nhẫn, vàng miếng chính hãng phân phối trên Shopee Mall.</p>
            </div>
            <div className="text-xs font-mono text-accent uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded-sm self-start md:self-auto border border-accent/20">
              Giao hàng tận nơi
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {affiliateProducts.map(p => (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="data-card p-4 group flex flex-col h-full hover:border-accent transition-colors">
                <div className="bg-white rounded-sm overflow-hidden mb-5 relative aspect-square p-2 border border-rule-2">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                   <span className="absolute top-2 right-2 bg-accent text-accent-ink font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-sm shadow-sm">Mall</span>
                </div>
                <h3 className="font-medium text-sm text-ink-2 mb-6 group-hover:text-ink transition-colors line-clamp-2 leading-relaxed">
                  {p.name}
                </h3>
                <div className="mt-auto pt-4 border-t border-rule-2 border-dashed">
                  <div className="font-display font-bold text-lg text-ink tnum">{formatVND(p.price)}</div>
                  <div className="flex justify-between items-center text-xs font-mono text-muted mt-3">
                     <div className="flex items-center"><Star className="w-3 h-3 fill-accent text-accent mr-1.5"/> {p.rating}</div>
                     <div>Bán {p.sold}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Ft5 Statement Footer */}
        <footer className="mt-16 pt-16 border-t border-rule flex flex-col gap-12 reveal is-in" style={{ transitionDelay: '400ms' }}>
           <div className="text-2xl md:text-3xl font-display font-medium text-ink max-w-3xl leading-tight">
             Dữ liệu được cập nhật tự động từ giavang.org và thị trường thế giới. Mọi quyết định đầu tư đều do bạn lựa chọn.
           </div>
           <div className="flex flex-col md:flex-row justify-between text-xs font-mono text-muted pt-8 border-t border-rule-2 gap-4">
              <div>GOLD TRACKER &copy; 2026</div>
              <div className="flex gap-6">
                 <a href="#" className="hover:text-ink transition-colors">Trang chủ</a>
                 <a href="https://giavang.org" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Nguồn dữ liệu ↗</a>
              </div>
           </div>
        </footer>
      </main>
    </>
  );
}
