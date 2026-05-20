import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getGoldData } from '@/lib/gold';

export async function GET(request: Request) {
  // Check authorization for cron job (Vercel provides a CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const data = await getGoldData();
    
    // Save to database
    const history = await prisma.goldPriceHistory.create({
      data: {
        worldPriceUSD: data.worldPriceUSD,
        worldPriceVND: data.worldPriceVND,
        vnPriceVND: data.vnPriceVND,
        differenceVND: data.differenceVND,
        exchangeRate: data.exchangeRate,
      },
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
