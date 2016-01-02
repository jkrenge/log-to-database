const logToConsole = require('../lib/util').logToConsole;

const _ = require('underscore');

// prepare database and keep connection open

const MySQL = require('mysql');
var connection;

/**
 * object constructor
 */
function MySQLPersistence(connection) {

  this.host = connection.host;
  this.port = connection.port;
  this.user = connection.user;
  this.password = connection.password;
  this.db = connection.db;

  this.handleDisconnect();

}

/**
 * contructs table string for the MySQL query
 * @param  {String} type type of log
 * @return {String}      MySQL query path of type
 */
const tables = ['request'];
MySQLPersistence.prototype.Table = function(type) {
  if (tables.indexOf(type) > -1) return '`' + db + '`.`_wis_' + tables[type] + '`';
  else return null;
};

///////////////////////////////////
// Connection handling and setup //
///////////////////////////////////

/**
 * handles unwanted disconnects from MySQL to keep connection open
 */
MySQLPersistence.prototype.handleDisconnect = function() {
  logToConsole('Opening connection to MySQL...');
  const d = this;

  connection = MySQL.createConnection({
    host: this.host,
    port: this.port,
    user: this.user,
    password: this.password
  });

  connection.connect(function(err) {
    if (err) {
      logToConsole('Error on database connection', err);
      setTimeout(this.handleDisconnect, 2000);
    } else {

      logToConsole('Connected.');
      d.checkForDatastructure(function(datastructureExists) {
        if (!datastructureExists) d.createDatastructure();
      });

    }
  });

  connection.on('error', function(err) {
    logToConsole('Error on database connection: ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      logToConsole('Attempting to reconnect...');
      this.handleDisconnect();
    } else {
      throw err;
    }
  });

};

/**
 * checks if the required datastructure already exists and gives the result in the callback
 * @param  {Function} callback
 */
MySQLPersistence.prototype.checkForDatastructure = function(callback) {
  logToConsole('Checking if datastructure exists...');

  Async.map(tables, function(table, cb_mapa) {

    const qry = 'SELECT id ' +
      'FROM ' + this.Table(table) +
      'LIMIT 1';

    connection.query(qry, function(err) {

      if (err) cb_mapa(err);
      else cb_mapa(null);

    });

  }, function(err, results) {
    if (err) {
      logToConsole('Datastructure does not exist yet', err);
      callback(false);

    } else {
      logToConsole('Datastructure ready');
      callback(true);

    }
  });

};

/**
 * creates the required datastructure in the MySQL database
 */
MySQLPersistence.prototype.createDatastructure = function() {
  logToConsole('Creating datastructure...');

  const table_request = 'CREATE TABLE ' + this.Table('request') + ' (' +
    '`id` int(11) unsigned NOT NULL AUTO_INCREMENT,' +
    '`instance` int(11) NOT NULL DEFAULT 0,' +
    '`created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
    '`requester` varchar(256) NOT NULL DEFAULT \'anonymous\',' +
    '`requested` varchar(256) NOT NULL DEFAULT \'\',' +
    '`payload` varchar(2048) DEFAULT NULL,' +
    'PRIMARY KEY (`id`),' +
    'KEY `requested` (`requested`(255))' +
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8;';

  const tablesToCreate = [table_request];

  Async.map(tablesToCreate, function(table, cb_mapa) {

    connection.query(qry, function(err) {
      cb_mapa();
    });

  }, function(err) {

    logToConsole('Datastructure created.');

  });

};

///////////////////
// Logging stuff //
///////////////////

MySQLPersistence.prototype.request = function(instance, requester, requested, payload, callback) {

  const qry = 'INSERT INTO ' + this.Table('request') + ' (instance, requester, requested, payload) ' +
    'values(' + instance + ', \'' + requester + '\', \'' + requested + '\', \'' + JSON.stringify(payload) + '\')';

  connection.query(qry, function(err, result) {

    if (err) callback(err, null, hash);
    else callback(null, result.insertId, hash);

  });

};

////////////
// Export //
////////////

module.exports = MySQLPersistence;
