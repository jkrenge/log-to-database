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

WrittenInStone.prototype.request = function (requester, requsted, payload, callback) {
  callback = typeof callback == 'function' ? callback : null;

  database.request(requester, requsted, payload, callback);
};

////////////
// Export //
////////////

module.exports = WrittenInStone;
