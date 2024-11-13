const express = require('express');
const Subtask = require('../models/Subtask');  // Your subtask model
const router = express.Router();

// Route to add a subtask
router.post('/subtask/:taskId', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const subtask = new Subtask({
      taskId: req.params.taskId,
      title,
      description,
      dueDate,
    });
    await subtask.save();
    res.status(201).json(subtask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating subtask', error });
  }
});

// Route to get subtasks by taskId
router.get('/subtask/:taskId', async (req, res) => {
  try {
    const subtasks = await Subtask.find({ taskId: req.params.taskId });
    res.json(subtasks);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching subtasks', error });
  }
});

// Route to update subtask status
router.put('/subtask/:subtaskId', async (req, res) => {
  try {
    const { completed } = req.body;
    const subtask = await Subtask.findByIdAndUpdate(req.params.subtaskId, { completed }, { new: true });
    res.json(subtask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating subtask', error });
  }
});

// Route to delete a subtask
router.delete('/subtask/:subtaskId', async (req, res) => {
  try {
    await Subtask.findByIdAndDelete(req.params.subtaskId);
    res.status(200).json({ message: 'Subtask deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting subtask', error });
  }
});

module.exports = router;
