const _ = require('underscore');

var mongoose = require("mongoose");

var StatusSchema = new mongoose.Schema({
  key: String,
  value: String,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
});

StatusSchema.index({
  key: 1
});

////////////
// Export //
////////////

exports.Status = mongoose.model("Status", StatusSchema);
