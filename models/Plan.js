const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

module.exports = mongoose.model('Plan', PlanSchema);
