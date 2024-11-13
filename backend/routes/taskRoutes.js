const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the path is correct
const Task = require('../models/Task');


// Create a task
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, priority,date } = req.body;

  try {
    const newTask = new Task({
      user: req.user.id, 
      title,
      description,
      priority,
      date,
    });

    const task = await newTask.save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all tasks for the logged-in user

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, date, completed } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, priority, date, completed },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to schedule a task
router.put('/:id/schedule', async (req, res) => {
  try {
    const { scheduleDate, scheduleTime } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');

    task.scheduleDate = scheduleDate;
    task.scheduleTime = scheduleTime;
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Delete a task by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
