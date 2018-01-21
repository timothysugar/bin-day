'use strict'
const Collections = require('./collections.js');
const Notifier = require('./notifier.js');

exports.handler = function (event, context, callback) {
    console.log(JSON.stringify(`Event: event`))
    Collections.query(Notifier.notifyUpcoming);

    const response = {
        statusCode: 200,
        body:JSON.stringify({ "message": "Collections queried"})
    }

    callback(null, response);
}