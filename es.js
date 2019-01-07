const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    host: process.env.ES_URL,
    log: 'trace'
});

module.exports = client;