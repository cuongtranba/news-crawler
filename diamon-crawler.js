const client = require('./es');
const axios = require('axios');
const cherrio = require('cheerio');
const fs = require('fs');


const getHomePage = async (url) => {
    const page = await axios.get(url);
    return cherrio.load(page.data);
}

const getSize = (el) => {
    return el.find('div div p').text()
}

const getAttr = ($,el) => {
    const attrs = el.find('div div table tbody tr').toArray();
    const parser = attrs.map(c => {
        return {
            color: $(c).find('td:nth-child(1)').text(),
            IF: parseInt($(c).find('td:nth-child(2)').text().replace(/,/g,'')),
            VVS1: parseInt($(c).find('td:nth-child(3)').text().replace(/,/g,'')),
            VVS: parseInt($(c).find('td:nth-child(4)').text().replace(/,/g,'')),
            VS1: parseInt($(c).find('td:nth-child(5)').text().replace(/,/g,'')),
            VS2: parseInt($(c).find('td:nth-child(6)').text().replace(/,/g,'')),
        }
    })
    return parser

}

const getPrices = ($) => {
    const tables = $('#portfolio > div').toArray();
    const price = tables.map(c => {
        return {
            size: parseFloat(getSize($(c)).match(/\d LY \d/g)[0].replace(' LY ', '.')),
            attr: getAttr($,$(c)),
            updatedDate: new Date()
        }
    })
    return price;
}

const insertOrUpdate = async (data) => {
    await client.index({
        index: 'diamond',
        type: 'diamond',
        id: '1',
        body: {
            ...data
        }
    })
}

const crawl = async () => {
    const html = await getHomePage(process.env.URL_PAGE_DIAMOND);
    const price = getPrices(html);
    await insertOrUpdate(price)
}

module.exports = crawl;