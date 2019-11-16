const Collections = require("../collections.js");
const assert = require('assert');
const moment = require('moment')
const validUPRN = 100121074244

describe('Query collections', function () {
  it('should not return an error', function () {
    Collections.query(validUPRN, (err) => {
      assert(err == null)
    });
  });
});

describe('Get collections', function () {
  it('should return a html string', function () {
    Collections.getCollections(validUPRN, (err, res) => {
      assert(typeof (res) === 'string')
    });
  });

  it('should not return an error', function () {
    Collections.getCollections(validUPRN, (err, res) => {
      assert(err == null)
    });
  });
});

describe('Filtering tomorrows collections', function () {
  it('should return an event occuring midday tomorrow', function () {
    middayTomorrow = moment().add(1, 'day').hour(12)
    const collections = [
      {
        service: "any-service",
        date: middayTomorrow,
      }
    ]

    assert.equal(Collections.filterUpcoming(collections).length, 1)
  })
})