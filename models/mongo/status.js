const _ = require('underscore');

var mongoose = require("mongoose");

var StatusSchema = new mongoose.Schema({
  instance: Number,
  key: String,
  value: String,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
}, {
  collection: '_wis_status'
});

StatusSchema.index({
  instance: 1
});

StatusSchema.index({
  key: 1
});

////////////
// Export //
////////////

exports.Status = mongoose.model("Status", StatusSchema);
