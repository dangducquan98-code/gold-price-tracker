const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

async function test() {
  try {
    const res = await axios.get('https://baotinmanhhai.vn/gia-vang', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const $ = cheerio.load(res.data);
    const results = [];
    $('table tr').each((i, el) => {
       results.push($(el).text().replace(/\s+/g, ' ').trim());
    });
    console.log(results.slice(0, 10));
  } catch (e) {
    console.error(e.message);
  }
}
test();
