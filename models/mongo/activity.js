const _ = require('underscore');

var mongoose = require("mongoose");

var ActivitySchema = new mongoose.Schema({
  instance: Number,
  activity: String,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
}, {
  collection: '_wis_activities'
});

ActivitySchema.index({
  instance: 1
});

ActivitySchema.index({
  activity: 1
});

////////////
// Export //
////////////

exports.Activity = mongoose.model("Activity", ActivitySchema);
