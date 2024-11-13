const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  deadline: {
    type: Date,
    required: true,
  },
  teamMembers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  }],  // Array of user references (team members)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },  // User who created the project
  status: { type: String, default: 'Not Started' },
  isCompleted: { type: Boolean, default: false },

});

module.exports = mongoose.model('Project', projectSchema);
