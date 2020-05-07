'use strict'
const Collections = require('./collections.js')
const Notifier = require('./notifier.js')
const AddressUPRN = process.env.ADDRESSUPRN

exports.handler = function (event, context, callback) {
  console.log('received event', { event })

  const lambdaResponse = function (err) {
    if (err) {
      console.error('failure')
      console.log(err)
      callback(err)
    }
    console.log('success')
    const response = {
      statusCode: 200
    }
    callback(null, response)
  }

  Collections.getTomorrow(AddressUPRN, function (err, upcoming) {
    if (err) {
      console.err('unable to query collections')
      return lambdaResponse(err)
    }
    Notifier.notifyUpcoming(upcoming, function (err) {
      if (err) {
        console.err('unable to send notification')
        return lambdaResponse(err)
      }
      lambdaResponse()
    })
  })
}
