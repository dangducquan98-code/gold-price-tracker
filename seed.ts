import { PrismaClient } from '@prisma/client';
import { getGoldData } from './src/lib/gold';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Fetching real-time gold data...');
    const data = await getGoldData();
    
    console.log('Saving to database...');
    const history = await prisma.goldPriceHistory.create({
      data: {
        worldPriceUSD: data.worldPriceUSD,
        worldPriceVND: data.worldPriceVND,
        exchangeRate: data.exchangeRate,
        
        sjcPrice: data.sjcPrice,
        dojiPrice: data.dojiPrice,
        btmcPrice: data.btmcPrice,
        btmhPrice: data.btmhPrice,

        sjcDiff: data.sjcDiff,
        dojiDiff: data.dojiDiff,
        btmcDiff: data.btmcDiff,
        btmhDiff: data.btmhDiff,

        sjcDiffPct: data.sjcDiffPct,
        dojiDiffPct: data.dojiDiffPct,
        btmcDiffPct: data.btmcDiffPct,
        btmhDiffPct: data.btmhDiffPct,
      },
    });

    console.log('✅ Dữ liệu đã được lưu thành công!');
    console.log(history);
  } catch (error) {
    console.error('❌ Lỗi khi lưu dữ liệu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
