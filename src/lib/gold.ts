import axios from 'axios';
import * as cheerio from 'cheerio';

const MOCK_DATA = {
  worldPriceUSD: 2350.50,
  exchangeRate: 25450,
  sjcPrice: 16200000,
  dojiPrice: 16150000,
  btmcPrice: 16200000,
  btmhPrice: 16200000,
};

async function fetchWorldGoldPrice(): Promise<number> {
  try {
    const res = await axios.get('https://giavang.org/the-gioi/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 8000
    });
    const $ = cheerio.load(res.data);
    const priceText = $('.crypto-price').attr('data-price') || $('.crypto-price').first().text();
    const price = parseFloat(priceText.replace(/,/g, ''));
    return price > 0 ? price : MOCK_DATA.worldPriceUSD;
  } catch (error) {
    console.error('Error fetching world gold price:', error);
    return MOCK_DATA.worldPriceUSD;
  }
}

async function fetchExchangeRate(): Promise<number> {
  try {
    const res = await axios.get('https://open.er-api.com/v6/latest/USD', { timeout: 8000 });
    return res.data?.rates?.VND || MOCK_DATA.exchangeRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
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

  const fetchPrice = async (url: string, keywords: string[]) => {
    try {
      const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 });
      const $ = cheerio.load(res.data);
      let priceVnd = 0;
      $('table tr').each((i, el) => {
        const firstCol = $(el).children().eq(0).text().trim().toLowerCase();
        const sellText = $(el).children().eq(2).text().trim().replace(/[^0-9]/g, '');
        
        if (keywords.some(k => firstCol.includes(k.toLowerCase())) && sellText && priceVnd === 0) {
          priceVnd = parseInt(sellText) * 100;
        }
      });
      return priceVnd;
    } catch (e) {
      console.error('Error fetching', url, e);
      return 0;
    }
  };

  try {
    const [sjc, doji, btmc, btmh] = await Promise.all([
      fetchPrice('https://giavang.org/trong-nuoc/sjc/', ['vàng nhẫn sjc 99,99%', 'nhẫn sjc']),
      fetchPrice('https://giavang.org/trong-nuoc/doji/', ['nhẫn tròn 999 hưng thịnh vượng', 'nhẫn tròn']),
      fetchPrice('https://giavang.org/trong-nuoc/bao-tin-minh-chau/', ['nhẫn tròn trơn']),
      fetchPrice('https://giavang.org/trong-nuoc/bao-tin-manh-hai/', ['vàng kim gia bảo', 'đồng vàng kim gia bảo', 'nhẫn tròn'])
    ]);

    prices.sjcPrice = sjc;
    prices.dojiPrice = doji;
    prices.btmcPrice = btmc;
    prices.btmhPrice = btmh;
  } catch (error) {
    console.error('Error fetching giavang.org:', error);
  }

  // Fallbacks
  if (!prices.sjcPrice) prices.sjcPrice = MOCK_DATA.sjcPrice;
  if (!prices.dojiPrice) prices.dojiPrice = prices.sjcPrice - 50000; 
  if (!prices.btmcPrice) prices.btmcPrice = prices.sjcPrice;
  if (!prices.btmhPrice) prices.btmhPrice = prices.btmcPrice; 

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
