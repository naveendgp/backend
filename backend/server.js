const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const scheduleRoutes= require('./routes/scheduleRoutes');
const subtaskRoutes=require('./routes/subtaskRouter');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes); // Correctly use taskRoutes
app.use('/api', projectRoutes);
app.use('/api/schedules',scheduleRoutes);
app.use('/api',subtaskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
