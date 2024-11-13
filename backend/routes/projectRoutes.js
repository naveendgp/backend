const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the path is correct
const User = require('../models/User');
const Project = require('../models/Project');

const jwt = require('jsonwebtoken');



  // Create a new project
  // Create a new project
  router.post('/projects', authMiddleware, async (req, res) => {
    console.log("POST /projects request received"); 
  const { title, description, priority, deadline, teamMembersEmails } = req.body; // Fields coming from frontend

  // Validate required fields
  if (!title || !description || !priority || !deadline || !teamMembersEmails) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find team members by their emails
    const teamMembers = await User.find({
      email: { $in: teamMembersEmails }
    }).select('_id');

    if (teamMembers.length !== teamMembersEmails.length) {
      return res.status(404).json({ message: 'One or more email addresses not found' });
    }

    // Create new project, status defaults to "Not Started"
    const newProject = new Project({
      title,
      description,
      priority,
      deadline,
      teamMembers,
      createdBy: req.user.id,
      status:'Not Started', // Ensure that the project is created with "Not Started" status
    });

    await newProject.save();

    // Populate createdBy and teamMembers fields immediately after saving
    const populatedProject = await Project.findById(newProject._id)
      .populate('createdBy', 'email')
      .populate('teamMembers', 'email')
      .exec();

    res.json(populatedProject); // Return the newly created and populated project
  } catch (error) {
    res.status(500).json({ message: 'Error adding project', error: error.message });
  }
  });
// Get all projects for the logged-in user (creator or team member)

router.get('/projects', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user.id;
  
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: userId }, // Projects where the user is the creator
        { teamMembers: userId } // Projects where the user is a team member
      ]
    })
    .populate('createdBy', 'email')
    .populate('teamMembers', 'email')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    const totalProjects = await Project.countDocuments({
      $or: [
        { createdBy: userId },
        { teamMembers: userId }
      ]
    });

    res.json({ projects, totalPages: Math.ceil(totalProjects / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Update project
router.put('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, deadline, teamMembers } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { title, description, deadline, teamMembers },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found or you do not have permission' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/projects/:id/reopen', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.isCompleted = false;
    

    await project.save();

    // After saving, populate the creator and team members
    const updatedProject = await Project.findById(req.params.id)
      .populate('createdBy', 'email')
      .populate('teamMembers', 'email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reopen project' });
  }
});


router.put('/projects/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, teamMembers: req.user.id }, // Ensure only team members can update the status
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission' });
    }

    res.json({ message: 'Status updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

router.put('/projects/:id/mark-as-finished', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You are not the creator of this project' });
    }

    // Update the project to mark it as finished
    project.isCompleted = true;  // Make sure this is set
     // Update the status to "Finished"
    await project.save();

    // Return the updated project with populated fields
    const updatedProject = await Project.findById(req.params.id)
      .populate('createdBy', 'email')
      .populate('teamMembers', 'email');

    res.json({ message: 'Project marked as finished', project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: 'Error marking project as finished' });
  }
});


// Delete project
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    // Only allow the project creator to delete the project
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });

    if (!project) return res.status(404).json({ message: 'Project not found or you do not have permission' });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;
