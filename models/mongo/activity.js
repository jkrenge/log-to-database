const _ = require('underscore');

var mongoose = require("mongoose");

var ActivitySchema = new mongoose.Schema({
  activity: String,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
});

ActivitySchema.index({
  activity: 1
});

////////////
// Export //
////////////

exports.Activity = mongoose.model("Activity", ActivitySchema);
