const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },  // Reference to the main task
  title: String,
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
});

const Subtask = mongoose.model('Subtask', subtaskSchema);
module.exports = Subtask;
