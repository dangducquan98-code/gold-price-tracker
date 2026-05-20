import axios from 'axios';
import * as cheerio from 'cheerio';

const MOCK_DATA = {
  worldPriceUSD: 2350.50,
  exchangeRate: 25450,
  sjcPrice: 8800000,
  dojiPrice: 8780000,
  btmcPrice: 8790000,
  btmhPrice: 8790000,
};

async function fetchWorldGoldPrice(): Promise<number> {
  try {
    const res = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/GC=F', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    return res.data?.chart?.result?.[0]?.meta?.regularMarketPrice || MOCK_DATA.worldPriceUSD;
  } catch (error) {
    return MOCK_DATA.worldPriceUSD;
  }
}

async function fetchExchangeRate(): Promise<number> {
  try {
    const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    return res.data?.rates?.VND || MOCK_DATA.exchangeRate;
  } catch (error) {
    return MOCK_DATA.exchangeRate;
  }
}

async function fetchVnGoldPrices() {
  const prices = {
    sjcPrice: 0,
    dojiPrice: 0,
    btmcPrice: 0,
    btmhPrice: 0,
  };

  try {
    const res = await axios.get('https://chogia.vn/gia-vang/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(res.data);
    
    $('table tr').each((i, el) => {
      const tds = $(el).find('td');
      const name = tds.eq(0).text().trim().toLowerCase();
      // The price is usually in format "159.000" which means 15,900,000 VND / chỉ
      // We parse it and multiply by 100 to get VND
      let sellText = tds.eq(2).text().trim().replace(/[^0-9]/g, '');
      if (sellText) {
        let priceVnd = parseInt(sellText) * 100; // 159000 -> 15,900,000
        
        if (name.includes('sjc') && prices.sjcPrice === 0) prices.sjcPrice = priceVnd;
        if (name.includes('doji') && prices.dojiPrice === 0) prices.dojiPrice = priceVnd;
        if (name.includes('bảo tín minh châu') && prices.btmcPrice === 0) prices.btmcPrice = priceVnd;
        if (name.includes('bảo tín mạnh hải') && prices.btmhPrice === 0) prices.btmhPrice = priceVnd;
      }
    });
  } catch (error) {
    console.error('Error fetching chogia:', error);
  }

  // Fallbacks if not found on chogia.vn
  if (!prices.sjcPrice) prices.sjcPrice = MOCK_DATA.sjcPrice;
  if (!prices.dojiPrice) prices.dojiPrice = prices.sjcPrice - 200000;
  if (!prices.btmcPrice) prices.btmcPrice = prices.sjcPrice - 100000;
  if (!prices.btmhPrice) prices.btmhPrice = prices.btmcPrice; // Fallback to BTMC

  return prices;
}

export async function getGoldData() {
  const [worldPriceUSD, exchangeRate, vnPrices] = await Promise.all([
    fetchWorldGoldPrice(),
    fetchExchangeRate(),
    fetchVnGoldPrices(),
  ]);

  const TROY_OUNCE_TO_CHI = 8.29426;
  const worldPriceVND = (worldPriceUSD / TROY_OUNCE_TO_CHI) * exchangeRate;

  const calculateDiff = (vnPrice: number) => {
    const diff = vnPrice - worldPriceVND;
    const diffPct = (diff / worldPriceVND) * 100;
    return { diff, diffPct };
  };

  const sjc = calculateDiff(vnPrices.sjcPrice);
  const doji = calculateDiff(vnPrices.dojiPrice);
  const btmc = calculateDiff(vnPrices.btmcPrice);
  const btmh = calculateDiff(vnPrices.btmhPrice);

  return {
    worldPriceUSD,
    worldPriceVND,
    exchangeRate,
    
    sjcPrice: vnPrices.sjcPrice,
    dojiPrice: vnPrices.dojiPrice,
    btmcPrice: vnPrices.btmcPrice,
    btmhPrice: vnPrices.btmhPrice,

    sjcDiff: sjc.diff,
    dojiDiff: doji.diff,
    btmcDiff: btmc.diff,
    btmhDiff: btmh.diff,

    sjcDiffPct: sjc.diffPct,
    dojiDiffPct: doji.diffPct,
    btmcDiffPct: btmc.diffPct,
    btmhDiffPct: btmh.diffPct,

    recordedAt: new Date().toISOString(),
  };
}
