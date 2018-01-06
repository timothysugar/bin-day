const Collections = require('./collections.js');
const Notifier = require('./notifier.js');

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.binsHTTP = function binsHTTP(req, res) {
    Collections.query(Notifier.notifyUpcoming);
    res.status(200).send("Collections queried.")
  };