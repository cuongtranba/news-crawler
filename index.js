require('dotenv').config({
    path: __dirname + '/env'
});
const schedule = require('node-schedule');
const program = require('commander');
const goldCrawler = require('./gold-crawler');
const diamondCrawler = require('./diamon-crawler');

program
    .version('0.1.0')
    .option('-m --type [type]', 'crawl gold|watch|diamond')
    .parse(process.argv);


switch (program.type) {
    case 'gold':
        console.log('gold crawler - cron: ', process.env.GOLD);
        schedule.scheduleJob(process.env.GOLD, async () => {
            await goldCrawler()
        });
        break;
    case 'diamond':
        console.log('diamond crawler - cron: ', process.env.DIAMOND);
        schedule.scheduleJob(process.env.DIAMOND, async () => {
            await diamondCrawler()
        });
        break;
    default:
        break;
}