// routes/scheduleRouter.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Schedule = require('../models/scheduleModel'); // Assuming scheduleModel replaces taskModel
const Project = require('../models/Project');
const cron = require('node-cron');
 // Assuming taskModel is your task schema
const sendReminderEmail = require('../utils/emailService');

const User = require('../models/User'); // Make sure to import the User model

// Create a new schedule within a project
router.post('/:projectId', authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { title, description, dueDate, assignedTo: assignedEmail } = req.body;

  try {
    // Find the assigned user by email
    const assignedUser = await User.findOne({ email: assignedEmail });
    if (!assignedUser) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    const newSchedule = new Schedule({
      title,
      description,
      dueDate,
      projectId,
      assignedTo: assignedUser._id, // Use the ObjectId here
      createdBy: req.user.id,
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
});

// Example route for fetching schedules with project details
router.get('/:projectId',authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name')  // Populate the assigned user name
      .populate('projectId', 'name')  // Populate the project name
      .exec();
    
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedules', error: err });
  }
});

// Update schedule status (mark as completed/incomplete)
router.put('/:scheduleId', authMiddleware, async (req, res) => {
  const { scheduleId } = req.params;
  const { completed } = req.body;

  try {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    schedule.completed = completed;
    await schedule.save();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
});

// Delete a schedule
router.delete('/:scheduleId', authMiddleware, async (req, res) => {
  const { scheduleId } = req.params;

  try {
    await Schedule.findByIdAndDelete(scheduleId);
    res.status(204).json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule', error: error.message });
  }
});
router.get('/test-email', async (req, res) => {
  try {
    await sendReminderEmail('test-recipient@example.com', 'Test Task', new Date());
    res.status(200).send('Test email sent!');
  } catch (error) {
    res.status(500).send('Error sending test email');
  }
});

// Schedule a cron job to run every day at midnight
cron.schedule('* * * * *', async () => {
  try {
    console.log('Running daily task reminder check...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Get the next day's date

    // Find tasks due tomorrow
    const tasksDueTomorrow = await Schedule.find({
      dueDate: {
        $gte: new Date(tomorrow.setHours(0, 0, 0, 0)), // Start of tomorrow
        $lt: new Date(tomorrow.setHours(23, 59, 59, 999)), // End of tomorrow
      },
    }).populate('assignedMembers', 'email'); // Populate assignedMembers with their email addresses

    // Send email notifications to each assigned member
    for (const task of tasksDueTomorrow) {
      for (const member of task.assignedMembers) {
        await sendReminderEmail(member.email, task.title, task.dueDate);
      }
    }

    console.log('Reminder emails sent for tasks due tomorrow.');
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

module.exports = router;
