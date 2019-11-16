'use strict'
const Collections = require('./collections.js');
const Notifier = require('./notifier.js');
const AddressUPRN = process.env.ADDRESSUPRN

exports.handler = function (event, context, callback) {
    console.log(JSON.stringify({event}))
    Collections.query(AddressUPRN, Notifier.notifyUpcoming);

    const response = {
        statusCode: 200,
    }

    callback(null, response);
}