const assert = require('assert')
const moment = require('moment');
const Notifications = require('../notifier')

describe('Send notification', function () {
  it('should not return an error', function () {
    const upcoming = [{"service":"any-service","date": moment()}]
    Notifications.notifyUpcoming(null, upcoming, (err) => {
      assert(err == null)
    })
  })
})

