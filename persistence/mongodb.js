const logToConsole = require('../lib/util').logToConsole;

const _ = require('underscore');

const mongoose = require('mongoose');

const Activity = require("../models/mongo/activity").Activity;
const Status = require("../models/mongo/status").Status;
const Request = require("../models/mongo/request").Request;
const Cycle = require("../models/mongo/cycle").Cycle;

/////////////////////////////////
// MongoDB Connection Handling //
/////////////////////////////////

mongoose.connection.on("error", function(err) {
  logToConsole('> Failed to connect to MongoDB on startup ', err);
});

mongoose.connection.on('disconnected', function() {
  logToConsole('> Mongoose default connection to MongoDB disconnected');
});

var gracefulExit = function() {
  mongoose.connection.close(function() {
    logToConsole('> Mongoose default connection with MongoDB is disconnected through app termination');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

////////////
// Object //
////////////

function MongoDBPersistence(connection) {

  if (!_.has(connection, 'options')) {
    connection.options = {
      db: {
        native_parser: true
      },
      server: {
        poolSize: 5,
        socketOptions: {
          keepAlive: true
        }
      }
    };
  }

  try {
    mongoose.connect(connection.path, connection.options);
  } catch (err) {
    logToConsole('> Sever initialization failed ', err.message);
  }

}

///////////////
// Functions //
///////////////

MongoDBPersistence.prototype.activity = function (activity, payload, callback) {

  var a = new Activity({
    activity: activity,
    payload: payload
  });

  a.save(function (err) {
    if (typeof callback == 'function') callback(err);
  });

};

MongoDBPersistence.prototype.status = function (key, value, payload, callback) {

  var s = new Status({
    key: key,
    value: value,
    payload: payload
  });

  s.save(function (err) {
    if (typeof callback == 'function') callback(err);
  });

};

MongoDBPersistence.prototype.request = function (requester, requested, payload, callback) {

  var r = new Request({
    requester: requester,
    requested: requested,
    payload: payload
  });

  r.save(function (err) {
    if (typeof callback == 'function') callback(err);
  });

};

MongoDBPersistence.prototype.cycle = function (type, identifier, step, payload, callback) {

  var c = new Cycle({
    type: type,
    identifier: identifier,
    step: step,
    payload: payload
  });

  c.save(function (err) {
    if (typeof callback == 'function') callback(err);
  });

};

////////////
// Export //
////////////

module.exports = MongoDBPersistence;
