import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getGoldData } from '@/lib/gold';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const data = await getGoldData();
    
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

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
