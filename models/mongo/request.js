const _ = require('underscore');

/////////////
// Request //
/////////////

var mongoose = require("mongoose");

var RequestSchema = new mongoose.Schema({
  requester: String,
  requested: String,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
});

RequestSchema.index({
  requested: 1
});

////////////
// Export //
////////////

exports.Request = mongoose.model("Request", RequestSchema);
