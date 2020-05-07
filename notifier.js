const https = require('https');
const IFTTTKey = process.env.IFTTTKEY

module.exports.notifyUpcoming = function (upcoming, cb) {
    if (upcoming.length > 0) {
        console.log('sending notification')
        let entry = {
            value1: `${upcoming[0].service} ${upcoming[0].date.format('ddd')}`,
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
        }, (res) => {
            let rawData = '';
            res.setEncoding('utf8');

            res.on('error', (e) => {
                console.log('error making request to IFTTT')
                return cb(e)
            })

            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.log(`expected OK response but received ${res.statusCode}`,
                        {
                            responseMessage: res.statusMessage,
                            responseData: rawData
                        })
                        cb(Error(`IFTTT returned ${res.statusMessage}`))
                }
                return cb()
            })
        })

        req.write(postData)
        req.end()

    }
    else {
        console.log('no notification triggered')
        cb()
    }
}
