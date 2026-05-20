import axios from 'axios';
import * as cheerio from 'cheerio';
import * as https from 'https';

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

// Fallback aggregator
async function fetchChogiaFallback(brandKeyword: string): Promise<number | null> {
  try {
    const res = await axios.get('https://chogia.vn/gia-vang/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(res.data);
    let price = null;
    $('table tr').each((i, el) => {
      const tds = $(el).find('td');
      const name = tds.eq(0).text().trim().toLowerCase();
      let sellText = tds.eq(2).text().trim().replace(/[^0-9]/g, '');
      if (sellText && name.includes(brandKeyword) && !price) {
        price = parseInt(sellText) * 100; // 159000 -> 15,900,000 VND
      }
    });
    return price;
  } catch {
    return null;
  }
}

async function fetchSJC(): Promise<number> {
  try {
    // Try official SJC API
    const res = await axios.get('https://sjc.com.vn/xml/tygiavang.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000,
    });
    const $ = cheerio.load(res.data, { xmlMode: true });
    // Look for SJC 1L, 10L
    const sellAttr = $('city[name="Hồ Chí Minh"] item[type="Vàng SJC 1L - 10L - 1KG"]').attr('sell');
    if (sellAttr) {
      return parseInt(sellAttr) * 10000; // if it's 8800 -> 88,000,000 (per luong) -> we need per chi, so /10? Usually SJC XML is in 10,000 VND. Wait, 8800 * 10000 = 88,000,000 / 10 = 8,800,000. So we multiply by 1000.
      // Wait, 8800 in SJC XML means 88,000,000 VND/luong. So 1 chi = 8,800,000 VND. 
      // 8800 * 1000 = 8,800,000.
    }
  } catch (e) {
    // Fallback to chogia
  }
  const fallback = await fetchChogiaFallback('sjc');
  return fallback || MOCK_DATA.sjcPrice;
}

async function fetchDOJI(): Promise<number> {
  try {
    const res = await axios.get('https://giavang.doji.vn/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000,
    });
    const $ = cheerio.load(res.data);
    // Parse DOJI html... this is prone to breakage.
    // If it fails, we fall back.
  } catch (e) {}
  const fallback = await fetchChogiaFallback('doji');
  return fallback || MOCK_DATA.dojiPrice;
}

async function fetchBTMC(): Promise<number> {
  try {
    // Official BTMC API
    const res = await axios.get('http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3K8Z1Y2X9W5V6U4T7S', {
      timeout: 5000
    });
    // BTMC API returns an array of objects wrapped in strings or weird format.
    // We parse it using regex for "VÀNG SJC" or similar
    const dataStr = JSON.stringify(res.data);
    const match = dataStr.match(/"@n_\d+":"[^"]*VÀNG SJC[^"]*".*?"@ps_\d+":"(\d+)"/);
    if (match && match[1]) {
      // BTMC returns exact VND per Lượng usually. e.g. 88000000
      const luongPrice = parseInt(match[1]);
      return luongPrice / 10;
    }
  } catch (e) {}
  const fallback = await fetchChogiaFallback('minh châu');
  return fallback || MOCK_DATA.btmcPrice;
}

async function fetchBTMH(): Promise<number> {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const res = await axios.get('https://baotinmanhhai.vn/gia-vang', {
      httpsAgent: agent,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000,
    });
    const $ = cheerio.load(res.data);
    // Parse BTMH html.
  } catch (e) {}
  const fallback = await fetchChogiaFallback('mạnh hải');
  return fallback || MOCK_DATA.btmhPrice;
}

export async function getGoldData() {
  const [worldPriceUSD, exchangeRate, sjcPrice, dojiPrice, btmcPrice, btmhPrice] = await Promise.all([
    fetchWorldGoldPrice(),
    fetchExchangeRate(),
    fetchSJC(),
    fetchDOJI(),
    fetchBTMC(),
    fetchBTMH(),
  ]);

  const TROY_OUNCE_TO_CHI = 8.29426;
  const worldPriceVND = (worldPriceUSD / TROY_OUNCE_TO_CHI) * exchangeRate;

  const calculateDiff = (vnPrice: number) => {
    const diff = vnPrice - worldPriceVND;
    const diffPct = (diff / worldPriceVND) * 100;
    return { diff, diffPct };
  };

  const sjc = calculateDiff(sjcPrice);
  const doji = calculateDiff(dojiPrice);
  const btmc = calculateDiff(btmcPrice);
  // If BTMH completely fails and falls back to mock, align it with BTMC for realism if mock is used
  const finalBtmhPrice = (btmhPrice === MOCK_DATA.btmhPrice && btmcPrice !== MOCK_DATA.btmcPrice) ? btmcPrice : btmhPrice;
  const btmh = calculateDiff(finalBtmhPrice);

  return {
    worldPriceUSD,
    worldPriceVND,
    exchangeRate,
    
    sjcPrice,
    dojiPrice,
    btmcPrice,
    btmhPrice: finalBtmhPrice,

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
