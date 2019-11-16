const http = require('http');
const querystring = require('querystring');
const cheerio = require('cheerio')
const moment = require('moment')

const getCollections = function (UPRN, cb) {

    const options = {
        host: 'www.wiltshire.gov.uk',
        path: '/rubbish-collection/address-area',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
    }

    const postData = querystring.stringify({
        'uprn': UPRN,
    });
    const req = http.request(options, function (res) {
        let str = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            cb(null, str)
        })
    });
    req.write(postData);
    req.end();
}

const parseCollections = function (html) {
    const $ = cheerio.load(html);
    const collections = $('.rc-next-collection .row')
        .map(function (i, e) {
            const dateTime = moment($(e).children().eq(1).text().trim(), 'dddd DD MMMM YYYY')
            return {
                'service': $(e).children().eq(0).text().trim(),
                'date': dateTime,
            }
        }).get();

    console.log(JSON.stringify({collections}))
    return collections
}

const startOfTomorrow = moment().add(1, 'days').startOf('day')
const endOfTomorrow = moment().add(1, 'days').endOf('day')
const filterUpcoming = function (collections, from = startOfTomorrow, to = endOfTomorrow) {
    const upcoming = collections.filter(
        collection => {
            return collection.date.isBetween(from, to)
        }
    );
    console.log(JSON.stringify({upcoming}))

    return upcoming
}

const getUpcoming = function (UPRN, cb) {
    getCollections(UPRN, (err, html) => {
        const collections = parseCollections(html)
        cb(null, filterUpcoming(collections))
    })
}


module.exports = {
    query: getUpcoming,
    getCollections,
    filterUpcoming,
}