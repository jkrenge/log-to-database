const _ = require('underscore');

var mongoose = require("mongoose");

var CycleSchema = new mongoose.Schema({
  type: String,
  identifier: String,
  step: Number,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
});

CycleSchema.index({
  type: 1
});

CycleSchema.index({
  identifier: 1,
  step: -1
}, {
  unique: true
});

////////////
// Export //
////////////

exports.Cycle = mongoose.model("Cycle", CycleSchema);
