const http = require('http');
const querystring = require('querystring');
const cheerio = require('cheerio')
const moment = require('moment')

const options = {
    host: 'www.wiltshire.gov.uk',
    path: '/rubbish-collection/address-area',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
    },
}

const parseDates = function (data) {
    const $ = cheerio.load(data);
    var collection = $('.rc-next-collection .row')
        .map(function (i, e) {
            var dateTime = moment($(e).children().eq(1).text().trim(), 'dddd DD MMMM YYYY').format('LLL')
            return {
                'collection': $(e).children().eq(0).text().trim(),
                'date': dateTime,
            }
        }).get();

    console.log(collection);
}

const getDatesHtml = function (res) {
    var str = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        str += chunk;
    });

    res.on('end', function () {
        parseDates(str)
    })
}

const postData = querystring.stringify({
    'uprn': '100121109103',
});

const req = http.request(options, getDatesHtml);
req.write(postData);
req.end();