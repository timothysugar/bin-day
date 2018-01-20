'use strict'
const Collections = require('./collections.js');
const Notifier = require('./notifier.js');

exports.handler = function (event, context, callback) {
    console.log(JSON.stringify(`Event: event`))

    Collections.query(Notifier.notifyUpcoming);
    callback(null, "Collections queried.")
}