const Collections = require("../collections.js");
var assert = require('assert');

describe('Collections', function() {
  describe('#query()', function() {
    it('should not throw', function() {
      assert.doesNotThrow(() => Collections.query());
    });
  });
});