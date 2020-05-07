const Collections = require('../collections.js')
const assert = require('assert')
const moment = require('moment')
const validUPRN = 100121074244

describe('Query collections', function () {
  it('should not return an error', function (done) {
    Collections.getTomorrow(validUPRN, done)
  })
})

describe('Get collections', function () {
  it('should return a html string', function () {
    Collections.getCollections(validUPRN, function (_, res) {
      assert(typeof (res) === 'string')
    })
  })

  it('should not return an error', function () {
    Collections.getCollections(validUPRN, function (err, _) {
      assert(err == null)
    })
  })
})

describe('Filtering tomorrows collections', function () {
  it('should return an event occuring midday tomorrow', function () {
    const middayTomorrow = moment().utc()
      .add(1, 'day')
      .hour(12)
      .minute(0)
      .second(0)
      .milliseconds(0)
    const collections = [
      {
        service: 'any-service',
        date: middayTomorrow
      }
    ]

    assert.strictEqual(Collections.filterTomorrow(collections).length, 1)
  })

  it('should return an event occuring at midnight', function () {
    const midnight = moment().utc()
      .add(1, 'day')
      .hour(0)
      .minute(0)
      .second(0)
      .milliseconds(0)
    const collections = [
      {
        service: 'any-service',
        date: midnight
      }
    ]

    assert.strictEqual(Collections.filterTomorrow(collections).length, 1)
  })
})
