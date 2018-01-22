const https = require('https');
const IFTTTKey = process.env.IFTTTKey

module.exports.notifyUpcoming = function (err, upcoming) {
    if (upcoming.length > 0) {
        let entry = {
            value1: `${upcoming[0].service + upcoming[0].date.format('ddd')}`,
        };
        let postData = JSON.stringify(entry);

        console.log(`calling IFTTT with key ${IFTTTKEY}`)
        
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

        console.log('notification triggered')
    }
    else {
        console.log('no notification triggered')
    }
}

