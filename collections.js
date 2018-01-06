const http = require('http');
const querystring = require('querystring');
const cheerio = require('cheerio')
const moment = require('moment')
const HomeAddressUPRN = ''

const parseCollections = function (html) {
    const $ = cheerio.load(html);
    var collections = $('.rc-next-collection .row')
        .map(function (i, e) {
            var dateTime = moment($(e).children().eq(1).text().trim(), 'dddd DD MMMM YYYY')
            dateTime.hours(7)
            return {
                'service': $(e).children().eq(0).text().trim(),
                'date': dateTime,
            }
        }).get();

    return collections
}

const getCollections = function (callback) {
    const req = http.request(options, function (res) {
        var str = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            var collections = parseCollections(str)
            var upcoming = collections.filter(
                collection => {
                    var endOfTomorrow = moment().add(1, 'days').endOf('day')
                    return collection.date.isBefore(endOfTomorrow)
                }
            );

            if (upcoming.length > 0) {
                console.log(`${upcoming.length} upcoming collection(s)`)
                console.log(upcoming)
            }
            else {
                console.log('no upcoming collections')
            }

            callback(null, upcoming)
        })
    });
    req.write(postData);
    req.end();
}

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
    'uprn': HomeAddressUPRN,
});

module.exports.query = function(callback) {
    getCollections(callback);;
}
