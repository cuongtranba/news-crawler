const client = require('./es');
const axios = require('axios');
const cherrio = require('cheerio');


const getHomePage = async (url) => {
    const page = await axios.get(url, {
        headers: {
            'Cookie': 'CartUrlBack=%2Fkim-cuong-vien-igi; ssupp.vid=4uI5Jat_Nz; lang=vi; ssupp.visits=2; ssupp.chatid=DYaEKoBcLFpjRG3GFzMH6uWDjYqxGmqV; product_total_row=200'
        }
    });
    return cherrio.load(page.data);
}

const getPrice = ($) => {
    const priceTable = $('#loadpage > div.body-list2-product > table > tbody > tr').toArray();
    const prices = priceTable
        .map(c => {
            const hinhDang = $(c.el).find('td:nth-child(2) > i').text();
            const trongLuong = $(c.el).find('td:nth-child(3) > i').text();
            return {
                hinhDang,
                trongLuong
            }
        })
    return prices;
}

const insertOrUpdate = async (data) => {
    await client.index({
        index: 'gold',
        type: 'gold',
        id: '1',
        body: {
            ...data
        }
    })
}

const crawl = async () => {
    const html = await getHomePage(process.env.URL_PAGE_DIAMOND);
    const prices = getPrice(html);
    // await insertOrUpdate(prices);
    console.log(prices)
}

module.exports = crawl;