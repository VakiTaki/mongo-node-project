const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, { 
  versionKey: false,
  timestamps: true 
});

module.exports = mongoose.model('Plan', PlanSchema);
