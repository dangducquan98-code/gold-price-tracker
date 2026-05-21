import { getGoldData } from '@/lib/gold';
import { TrendingUp, TrendingDown, Globe, MapPin, DollarSign, Activity, ExternalLink, RefreshCcw, ShoppingBag, Star } from 'lucide-react';

export const revalidate = 60;

export default async function Home() {
  const currentData = await getGoldData();

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

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
      price: 1050000,
      image: 'https://cdn.pnj.io/images/detailed/133/sp-g0xmxmy000057-mat-day-chuyen-vang-10k-dinh-da-ecz-pnj-1.png',
      link: 'https://s.shopee.vn/7fWpp8xKRZ',
      rating: 5.0,
      sold: '1.2k'
    },
    {
      id: 2,
      name: 'Nhẫn Tiết Kiệm Vàng 24k 0.1 Chỉ Huy Thanh Jewelry (KÈM TÚI GẤM)',
      price: 1050000,
      image: 'https://cdn.pnj.io/images/detailed/148/gnxmxmy000216-nhan-kim-tien-vang-10k-pnj-1.png',
      link: 'https://s.shopee.vn/8pinDNCnVq',
      rating: 4.9,
      sold: '4.5k'
    },
    {
      id: 3,
      name: 'Thần Tài Phát 0.1 Chỉ Huy Thanh',
      price: 1050000,
      image: 'https://cdn.pnj.io/images/detailed/99/sp-g0xmxmw000020-mat-day-chuyen-vang-10k-dinh-da-syz-pnj-1.png',
      link: 'https://s.shopee.vn/6feIdRteO6',
      rating: 5.0,
      sold: '2.1k'
    },
    {
      id: 4,
      name: 'Sổ tay tiết kiệm đựng vàng nhẫn',
      price: 150000,
      image: 'https://cdn.pnj.io/images/detailed/118/gcxmxmy000108-day-chuyen-vang-10k-dinh-da-ecz-pnj-1.png',
      link: 'https://s.shopee.vn/1gFcgIbemA',
      rating: 4.8,
      sold: '8.3k'
    }
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-24 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-700/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-gold-500/10 rounded-2xl mb-4 border border-gold-500/20">
            <Activity className="w-6 h-6 text-gold-400 mr-2" />
            <span className="text-gold-200 font-medium tracking-wide">REAL-TIME GOLD TRACKER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient">
            Chênh Lệch Giá Vàng
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            So sánh giá các thương hiệu vàng Việt Nam với thế giới theo thời gian thực (tính trên 1 chỉ vàng).
          </p>
          <div className="inline-flex items-center space-x-2 text-zinc-300 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 shadow-inner">
            <RefreshCcw className="w-4 h-4 text-blue-400" />
            <span>Tỷ giá USD/VND hiện tại: <strong className="text-white ml-1">{formatVND(currentData.exchangeRate).replace('₫', '')} VNĐ</strong></span>
          </div>
        </header>

        {/* World Price */}
        <div className="flex justify-center">
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-300 w-full max-w-md text-center border border-white/5">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-32 h-32 text-blue-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-2 text-zinc-400 mb-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-lg">Giá Thế Giới / Chỉ</span>
              </div>
              <div className="text-4xl font-bold text-zinc-100 mb-2">
                {formatVND(currentData.worldPriceVND)}
              </div>
              <div className="text-zinc-500 flex items-center justify-center mb-6">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatUSD(currentData.worldPriceUSD)} / Troy Ounce
              </div>
              
              <div className="flex justify-center space-x-4">
                <a href="https://finance.yahoo.com/quote/GC=F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-gold-400 hover:text-gold-300 transition-colors bg-gold-500/10 px-3 py-1.5 rounded-full border border-gold-500/20">
                  Nguồn: Yahoo Finance
                  <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* VN Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vnBrands.map((brand, idx) => {
            const isPositive = brand.diff > 0;
            return (
              <div key={idx} className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-gold-500/30">
                <div className="mb-6">
                  <div className="flex items-center justify-between text-zinc-300 mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span className="font-semibold text-lg">{brand.name}</span>
                    </div>
                    <a href={brand.url} target="_blank" rel="noopener noreferrer" title="Kiểm tra nguồn giavang.org" className="text-zinc-500 hover:text-gold-400 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {formatVND(brand.price)}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="text-sm text-zinc-400 mb-2">Độ chênh lệch:</div>
                  <div className="flex items-end justify-between">
                    <div className={`font-medium flex items-center ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
                      {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {formatVND(Math.abs(brand.diff))}
                    </div>
                    <div className={`inline-flex items-center text-2xl font-black tracking-tight ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
                      {isPositive ? '+' : '-'}{Math.abs(brand.pct).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center text-sm text-zinc-500 mt-4 mb-8">
          Dữ liệu thị trường Việt Nam được tổng hợp tự động từ <a href="https://giavang.org" target="_blank" rel="noreferrer" className="text-gold-500 hover:text-gold-400 font-medium transition-colors">giavang.org</a>
        </div>

        {/* Affiliate Section */}
        <div className="glass-panel rounded-3xl p-6 lg:p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShoppingBag className="w-64 h-64 text-gold-400" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-2xl font-bold flex items-center">
                <ShoppingBag className="w-6 h-6 mr-3 text-gold-400" />
                Gợi Ý Đầu Tư Vàng (Shopee Mall)
              </h2>
              <div className="text-sm text-zinc-400 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50 flex items-center">
                Mua vàng an toàn - Giao hàng tận nơi
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {affiliateProducts.map((product) => (
                <a 
                  key={product.id} 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-gold-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)] transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Mall
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-zinc-200 line-clamp-2 mb-2 group-hover:text-gold-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <div className="text-gold-500 font-bold text-lg mb-2">
                        {formatVND(product.price).replace('₫', 'đ')}
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          {product.rating}
                        </div>
                        <div>Đã bán {product.sold}</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
