const goldTypes = [
    '10K', '14K', '18K', '24K', 'SJC10c', 'SJC1c', 'SJC99.99', 'SJC99.99N'
]

const getHomePage = async (url) => {
    const page = await axios.get(url);
    return cherrio.load(page.data);
}

const getPrice = ($) => {
    const priceTable = $('#div_ban_tin_gia_vang_1 > table > tbody > tr').toArray();
    const prices = priceTable
        .filter(c => {
            const type = $(c).find('td:nth-child(1) > span').text();
            if (type && goldTypes.includes(type)) {
                return true;
            }
            return false;
        })
        .map(c => {
            return {
                goldType: $(c).find('td:nth-child(1) > span').text(),
                el: c
            }
        })
        .map(c => {
            const buy = $(c.el).find('td:nth-child(2) > span').text().replace('.', '');
            const sell = $(c.el).find('td:nth-child(3) > span').text().replace('.', '');
            return {
                goldType: c.goldType,
                buy: parseInt(buy) * 1000,
                sell: parseInt(sell) * 1000,
                updatedDate: new Date()
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
    const html = await getHomePage(process.env.URL_PAGE);
    const prices = getPrice(html);
    await insertOrUpdate(prices);
    console.log(prices)
}

module.exports = crawl