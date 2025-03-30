const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  category: { type: String, required: true },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
  isRecurring: { type: Boolean, default: false },
  recurrencePattern: { type: String, enum: ['daily', 'weekly', 'monthly'] },
  endDate: { type: Date }
});

module.exports = mongoose.model('Transaction', transactionSchema);