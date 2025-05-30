const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: String,
}, { versionKey: false });

module.exports = mongoose.model('Plan', PlanSchema);
