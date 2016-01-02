const _ = require('underscore');

var mongoose = require("mongoose");

var CycleSchema = new mongoose.Schema({
  instance: Number,
  type: String,
  identifier: String,
  step: Number,
  payload: Object,
  created: {
    type: Date,
    default: Date.now
  }
}, {
  collection: '_wis_cycles'
});

CycleSchema.index({
  instance: 1
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
