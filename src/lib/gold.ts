import axios from 'axios';

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

// 1. SJC (Aggregator fallback since sjc.com.vn uses Cloudflare)
async function fetchSJC(): Promise<number> {
  try {
    const res = await axios.get('https://chogia.vn/gia-vang/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000,
    });
    const match = res.data.match(/SJC - TP\. Hồ Chí Minh.*?<td.*?>([0-9.]+)<\/td>.*?<td.*?>([0-9.]+)<\/td>/s);
    if (match && match[2]) {
      return parseInt(match[2].replace(/\./g, '')) * 1000;
    }
  } catch (e) {}
  return MOCK_DATA.sjcPrice;
}

// 2. DOJI (Official)
async function fetchDOJI(): Promise<number> {
  try {
    const res = await axios.get('https://giavang.doji.vn/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000,
    });
    const match = res.data.match(/SJC - Bán Lẻ.*?([0-9]{5,})/);
    if (match && match[1]) {
      return parseInt(match[1]) * 1000; // 15850 -> 15,850,000
    }
  } catch (e) {}
  return MOCK_DATA.dojiPrice;
}

// 3. Bảo Tín Minh Châu (Official)
async function fetchBTMC(): Promise<number> {
  try {
    const res = await axios.get('http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=3K8Z1Y2X9W5V6U4T7S', {
      timeout: 5000
    });
    const dataStr = JSON.stringify(res.data);
    const match = dataStr.match(/"@n_\d+":"[^"]*VÀNG MIẾNG SJC[^"]*".*?"@ps_\d+":"(\d+)"/);
    if (match && match[1]) {
      return parseInt(match[1]); // Returns exactly VND per Chỉ, e.g. 16200000
    }
  } catch (e) {}
  return MOCK_DATA.btmcPrice;
}

// 4. Bảo Tín Mạnh Hải (Fallback to BTMC / Aggregator since BTMH uses anti-bot JS)
async function fetchBTMH(): Promise<number> {
  try {
    // Try to get from chogia first
    const res = await axios.get('https://chogia.vn/gia-vang/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000,
    });
    const match = res.data.match(/Bảo Tín Mạnh Hải.*?<td.*?>([0-9.]+)<\/td>.*?<td.*?>([0-9.]+)<\/td>/s);
    if (match && match[2]) {
      return parseInt(match[2].replace(/\./g, '')) * 1000;
    }
  } catch (e) {}
  // Fallback to BTMC since their prices mirror each other very closely
  return await fetchBTMC();
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
  const btmh = calculateDiff(btmhPrice);

  return {
    worldPriceUSD,
    worldPriceVND,
    exchangeRate,
    
    sjcPrice,
    dojiPrice,
    btmcPrice,
    btmhPrice,

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
