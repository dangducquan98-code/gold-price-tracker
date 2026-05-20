import { getGoldData } from '@/lib/gold';
import { prisma } from '@/lib/prisma';
import { TrendingUp, TrendingDown, Clock, Globe, MapPin, DollarSign, Activity, ExternalLink, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const revalidate = 60;

export default async function Home() {
  const [currentData, dbHistoryData] = await Promise.all([
    getGoldData(),
    prisma.goldPriceHistory.findMany({
      orderBy: { recordedAt: 'desc' },
      take: 20,
    }).catch(() => []) 
  ]);

  const historyData = dbHistoryData;

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
        
        {/* Attribution note */}
        <div className="text-center text-sm text-zinc-500 mt-4 mb-8">
          Dữ liệu thị trường Việt Nam được tổng hợp tự động từ <a href="https://giavang.org" target="_blank" rel="noreferrer" className="text-gold-500 hover:text-gold-400 font-medium transition-colors">giavang.org</a>
        </div>

        {/* Historical Data Section */}
        <div className="glass-panel rounded-3xl p-6 lg:p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Clock className="w-6 h-6 mr-3 text-gold-400" />
              Lịch Sử Biến Động (So sánh Thế Giới)
            </h2>
            <div className="text-sm text-zinc-400 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50 flex items-center">
              Lưu tự động lúc 10h sáng và 10h tối
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-700/50 text-zinc-400 text-sm">
                  <th className="pb-4 font-medium pl-4">Thời Gian</th>
                  <th className="pb-4 font-medium">Thế Giới (VNĐ)</th>
                  <th className="pb-4 font-medium">SJC</th>
                  <th className="pb-4 font-medium">DOJI</th>
                  <th className="pb-4 font-medium">BTMC</th>
                  <th className="pb-4 font-medium">BTMH</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {historyData.map((record) => (
                  <tr key={record.id} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors group">
                    <td className="py-5 pl-4 whitespace-nowrap text-sm text-zinc-400">
                      {format(new Date(record.recordedAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                    </td>
                    <td className="py-5 font-semibold text-zinc-200">
                      {formatVND(record.worldPriceVND)}
                    </td>
                    <td className="py-5">
                      <div className="font-bold text-white">{formatVND(record.sjcPrice)}</div>
                      <div className={`text-xs mt-1 font-medium ${record.sjcDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {record.sjcDiff > 0 ? '+' : '-'}{formatVND(Math.abs(record.sjcDiff))} ({Math.abs(record.sjcDiffPct).toFixed(1)}%)
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="font-bold text-white">{formatVND(record.dojiPrice)}</div>
                      <div className={`text-xs mt-1 font-medium ${record.dojiDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {record.dojiDiff > 0 ? '+' : '-'}{formatVND(Math.abs(record.dojiDiff))} ({Math.abs(record.dojiDiffPct).toFixed(1)}%)
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="font-bold text-white">{formatVND(record.btmcPrice)}</div>
                      <div className={`text-xs mt-1 font-medium ${record.btmcDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {record.btmcDiff > 0 ? '+' : '-'}{formatVND(Math.abs(record.btmcDiff))} ({Math.abs(record.btmcDiffPct).toFixed(1)}%)
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="font-bold text-white">{formatVND(record.btmhPrice)}</div>
                      <div className={`text-xs mt-1 font-medium ${record.btmhDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {record.btmhDiff > 0 ? '+' : '-'}{formatVND(Math.abs(record.btmhDiff))} ({Math.abs(record.btmhDiffPct).toFixed(1)}%)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
