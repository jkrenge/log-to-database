const _ = require('underscore');

var mongoose = require("mongoose");

var RequestSchema = new mongoose.Schema({
  instance: Number,
  requester: String,
  requested: String,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
}, {
  collection: '_wis_requests'
});

RequestSchema.index({
  instance: 1
});

RequestSchema.index({
  requested: 1
});

////////////
// Export //
////////////

exports.Request = mongoose.model("Request", RequestSchema);
