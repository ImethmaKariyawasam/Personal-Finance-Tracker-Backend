const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the goal
  title: { type: String, required: true },
  description: { type: String },
  targetDate: { type: Date },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Goal', goalSchema);