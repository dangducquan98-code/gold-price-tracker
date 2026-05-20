import { getGoldData } from '@/lib/gold';
import { prisma } from '@/lib/prisma';
import { TrendingUp, TrendingDown, Clock, Globe, MapPin, DollarSign, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const [currentData, historyData] = await Promise.all([
    getGoldData(),
    prisma.goldPriceHistory.findMany({
      orderBy: { recordedAt: 'desc' },
      take: 20,
    }).catch(() => []) // Catch if DB isn't initialized yet
  ]);

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

  const diffIsPositive = currentData.differenceVND > 0;

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-24 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-700/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-gold-500/10 rounded-2xl mb-4 border border-gold-500/20">
            <Activity className="w-6 h-6 text-gold-400 mr-2" />
            <span className="text-gold-200 font-medium tracking-wide">GOLD DIFFERENCE TRACKER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient">
            Chênh Lệch Giá Vàng
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            So sánh giá vàng SJC trong nước và thế giới theo thời gian thực (tính trên 1 chỉ vàng).
          </p>
        </header>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* World Price Card */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Giá Thế Giới / Chỉ</span>
              </div>
              <div className="text-3xl font-bold text-zinc-100 mb-1">
                {formatVND(currentData.worldPriceVND)}
              </div>
              <div className="text-sm text-zinc-500 flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                {formatUSD(currentData.worldPriceUSD)} / Troy Ounce
              </div>
            </div>
          </div>

          {/* Vietnam Price Card */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <MapPin className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                <MapPin className="w-5 h-5 text-red-400" />
                <span className="font-medium">Giá SJC / Chỉ</span>
              </div>
              <div className="text-3xl font-bold text-zinc-100 mb-1">
                {formatVND(currentData.vnPriceVND)}
              </div>
              <div className="text-sm text-zinc-500">
                1 Lượng = 10 Chỉ
              </div>
            </div>
          </div>

          {/* Difference Card */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden border-gold-500/20 bg-gold-500/5 group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-gold-500">
              <Activity className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-gold-200 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Chênh Lệch / Chỉ</span>
              </div>
              <div className="text-4xl font-black text-gold-400 mb-2">
                {formatVND(Math.abs(currentData.differenceVND))}
              </div>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${diffIsPositive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                {diffIsPositive ? 'SJC Cao Hơn' : 'Thế Giới Cao Hơn'}
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data Section */}
        <div className="glass-panel rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <Clock className="w-6 h-6 mr-3 text-gold-400" />
              Lịch Sử Biến Động
            </h2>
            <div className="text-sm text-zinc-500 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50">
              Tự động lưu lúc 10h sáng và 10h tối
            </div>
          </div>

          {historyData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-4 font-medium pl-4">Thời Gian</th>
                    <th className="pb-4 font-medium">Giá Thế Giới</th>
                    <th className="pb-4 font-medium">Giá SJC</th>
                    <th className="pb-4 font-medium">Chênh Lệch</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {historyData.map((record) => (
                    <tr key={record.id} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-4 pl-4 whitespace-nowrap">
                        {format(new Date(record.recordedAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                      </td>
                      <td className="py-4">{formatVND(record.worldPriceVND)}</td>
                      <td className="py-4">{formatVND(record.vnPriceVND)}</td>
                      <td className="py-4 text-gold-400 font-medium">
                        {formatVND(Math.abs(record.differenceVND))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">Chưa có dữ liệu lịch sử.</p>
              <p className="text-zinc-500 text-sm mt-2">Dữ liệu sẽ được hệ thống cron tự động lưu vào 10h sáng và tối.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
