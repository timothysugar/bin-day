const http = require('http');
const querystring = require('querystring');
const cheerio = require('cheerio')

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
    var collection = $('.rc-next-collection .row').text();
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