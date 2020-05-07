const http = require('http');
const querystring = require('querystring');
const cheerio = require('cheerio')
const moment = require('moment')

const getCollections = function (UPRN, cb) {
    const options = {
        host: 'wiltshire.gov.uk',
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
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            rawData += chunk;
        });

        res.on('end', function () {
            return cb(null, rawData)
        })
    });
    req.write(postData);
    req.end();
}

const parseCollections = function (html) {
    const $ = cheerio.load(html);
    const collections = $('.rc-next-collection .row')
        .map(function (_, e) {
            const dateTime = moment.utc($(e).children().eq(1).text().trim(), 'dddd DD MMMM YYYY')
            return {
                'service': $(e).children().eq(0).text().trim(),
                'date': dateTime,
            }
        }).get();

    console.log(JSON.stringify({collections}))
    return collections
}

const filterTomorrow = function (collections) {
const startOfTomorrow = moment().utc().add(1, 'days').startOf('day')
const endOfTomorrow = moment().utc().add(1, 'days').endOf('day')
    const upcoming = collections.filter(
        collection => {
            return collection.date.isSame(startOfTomorrow) ||
                collection.date.isBetween(startOfTomorrow, endOfTomorrow)
        }
    );
    console.log(`collections tomorrow ${JSON.stringify(upcoming)}`)

    return upcoming
}

const getTomorrow = function (UPRN, cb) {
    getCollections(UPRN, (err, html) => {
        if (err) {
            console.log('unable to get collections')
            return cb(err)
        }
        const collections = parseCollections(html)
        cb(null, filterTomorrow(collections))
    })
}


module.exports = {
    getCollections,
    getTomorrow,
    filterTomorrow,
}