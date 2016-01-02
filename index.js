const logToConsole = require('./lib/util').logToConsole;

const _ = require('underscore');

var database;
const persistenceTypes = {
  mysql: './persistence/mysql',
  mongodb: './persistence/mongodb'
};

/**
 * constructs a bag object to be used
 * @param {String} persistence  whether MongoDB or MySQL
 * @param {Object} connection   database connection data
 */
function WrittenInStone(type, connection) {

  if (_.keys(persistenceTypes).indexOf(type.toLowerCase() > -1)) {

    const persistence = require(persistenceTypes[type]);
    database = new persistence(connection);

  } else return new Error('Unknown persistence type');

}

WrittenInStone.prototype.engraveActivity = function (activity, payload, callback) {
  callback = typeof callback == 'function' ? callback : null;

  database.activity(activity, payload, callback);
};

WrittenInStone.prototype.engraveStatus = function (key, value, payload, callback) {
  callback = typeof callback == 'function' ? callback : null;

  database.status(key, value, payload, callback);
};

WrittenInStone.prototype.engraveRequest = function (requester, requsted, payload, callback) {
  callback = typeof callback == 'function' ? callback : null;

  database.request(requester, requsted, payload, callback);
};

WrittenInStone.prototype.engraveCycle = function (type, identifier, step, payload, callback) {
  callback = typeof callback == 'function' ? callback : null;

  database.cycle(type, identifier, step, payload, callback);
};

////////////
// Export //
////////////

module.exports = WrittenInStone;
