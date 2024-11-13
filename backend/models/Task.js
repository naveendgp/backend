const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    date: {
        type: Date, // Make sure to use Date type here
        required: true,
      },
    completed: { type: Boolean, default: false },

});

module.exports = mongoose.model('Task', taskSchema);
