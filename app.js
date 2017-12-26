const http = require('http');
const https = require('https');
const querystring = require('querystring');
const cheerio = require('cheerio')
const moment = require('moment')
const HomeAddressUPRN = '100121109103'
const IFTTTKey = ''

const parseCollections = function (data) {
    const $ = cheerio.load(data);
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

const getCollectionsHtml = function (res) {
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
            let entry = {
                value1: `${upcoming[0].service + upcoming[0].date.format('ddd')}`,
            };
            let postData = JSON.stringify(entry);

            var req = https.request({
                host: 'maker.ifttt.com',
                path: `/trigger/upcoming_bin_collection/with/key/${IFTTTKey}`,
                port: 443,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                }
            })
            req.write(postData)
            req.end()

            console.log(`${upcoming.length} upcoming collection(s)`)
            console.log(upcoming)
        }
        else {
            console.log('no upcoming collections')
        }
    })
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

const req = http.request(options, getCollectionsHtml);
req.write(postData);
req.end();