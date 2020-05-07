const moment = require('moment')
const Notifications = require('../notifier')

describe('Send notification', function () {
  it('should not return an error', function (done) {
    const upcoming = [{ service: 'any-service', date: moment() }]
    Notifications.notifyUpcoming(upcoming, done)
  })
})
