const axios = require('axios');
const cheerio = require('cheerio');
async function run() {
  try {
    const res = await axios.get('https://webgia.com/gia-vang/');
    const $ = cheerio.load(res.data);
    const results = [];
    $('table tbody tr').each((i, el) => {
        results.push($(el).text().replace(/\s+/g, ' ').trim());
    });
    console.log(results.slice(0, 10));
  } catch(e) { console.error(e.message); }
}
run();
