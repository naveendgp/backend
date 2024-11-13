import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ScheduleProject.css';


const ScheduleProject = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [schedules, setTasks] = useState([]);
  const [newSchedule, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
  });

  const [subtasks, setSubtasks] = useState({});
  const [newSubtask, setNewSubtask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found. Please log in again.');
          return;
        }

        const response = await axios.get(`/api/schedules/${projectId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);

        // Fetch subtasks for each schedule and update the state
        const subtasksPromises = response.data.map(async (task) => {
          const subtaskResponse = await axios.get(`/api/subtask/${task._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          return { taskId: task._id, subtasks: subtaskResponse.data };
        });

        const subtasksData = await Promise.all(subtasksPromises);

        const subtasksObj = {};
        subtasksData.forEach(({ taskId, subtasks }) => {
          subtasksObj[taskId] = subtasks;
        });

        setSubtasks(subtasksObj);
      } catch (error) {
        console.error('Error fetching tasks and subtasks:', error);
      }
    };

    fetchTasks();
  }, [projectId, user]);

  const handleTaskChange = (e) => {
    setNewTask({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const handleSubtaskChange = (e) => {
    setNewSubtask({ ...newSubtask, [e.target.name]: e.target.value });
  };

  const addSchedule = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(`/api/schedules/${projectId}`, newSchedule, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...schedules, response.data]);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const addSubtask = async (taskId, e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(`/api/subtask/${taskId}`, newSubtask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubtasks((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), response.data],
      }));
      setNewSubtask({ title: '', description: '', dueDate: '' });
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const markSubtaskAsCompleted = async (subtaskId, taskId, completed) => {
    if (!taskId) {
      console.error('Task ID is missing or invalid');
      return;
    }

    try {
      const response = await axios.put(`/api/subtask/${subtaskId}`, { completed }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // Update the specific subtask within the taskId
      setSubtasks((prev) => {
        const updatedSubtasks = { ...prev };
        updatedSubtasks[taskId] = updatedSubtasks[taskId].map((subtask) =>
          subtask._id === subtaskId ? { ...subtask, completed: response.data.completed } : subtask
        );
        return updatedSubtasks;
      });
    } catch (error) {
      console.error('Error updating subtask status:', error);
    }
  };

  const deleteSubtask = async (subtaskId) => {
    try {
      await axios.delete(`/api/subtask/${subtaskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSubtasks((prev) => {
        const updatedSubtasks = { ...prev };
        for (let taskId in updatedSubtasks) {
          updatedSubtasks[taskId] = updatedSubtasks[taskId].filter((subtask) => subtask._id !== subtaskId);
        }
        return updatedSubtasks;
      });
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };
  const deleteSchedule = async (scheduleId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found. Please log in again.');
        return;
      }
  
      await axios.delete(`/api/schedules/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };
  
  const markAsRead = async (taskId, completed) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found. Please log in again.');
        return;
      }
  
      const response = await axios.put(`/api/schedules/${taskId}`, { completed }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: response.data.completed } : task
        )
      );
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };
  
  

  return (
    <div className="schedule-container">
      <h2>Task Schedule for Project {projectId.title}</h2> {/* Displaying Project Name */}
      <form className="schedule-form" onSubmit={addSchedule}>
        <input
          className="schedule-input"
          type="text"
          name="title"
          placeholder="Task Title"
          value={newSchedule.title}
          onChange={handleTaskChange}
          required
        />
        <textarea
          className="schedule-input"
          name="description"
          placeholder="Task Description"
          value={newSchedule.description}
          onChange={handleTaskChange}
        />
        <input
          className="schedule-input"
          type="date"
          name="dueDate"
          value={newSchedule.dueDate}
          onChange={handleTaskChange}
          required
        />
        <input
          className="schedule-input"
          type="text"
          name="assignedTo"
          placeholder="Assignee Email"
          value={newSchedule.assignedTo}
          onChange={handleTaskChange}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <ul className="schedule-list">
  {schedules.map((schedule) => (
    <li key={schedule._id} className="schedule-item">
      <h3>{schedule.title}</h3>
      <p>{schedule.description}</p>
      <p>Due: {new Date(schedule.dueDate).toLocaleDateString()}</p>
      <p>Assigned to: {schedule.assignedTo.name}</p> {/* Displaying Assigned User's Name */}
      <button onClick={() => markAsRead(schedule._id, !schedule.completed)}>
  {schedule.completed ? 'Undo Complete' : 'Mark as Completed'}
</button>

      <button onClick={() => deleteSchedule(schedule._id)}>Delete Task</button>


      {/* Display Subtasks */}
      <h4>Subtasks:</h4>
      <ul>
        {(subtasks[schedule._id] || []).map((subtask) => (  // Default to an empty array if undefined
          <li key={subtask._id}>
            <h5>{subtask.title}</h5>
            <p>{subtask.description}</p>
            <p>Due: {new Date(subtask.dueDate).toLocaleDateString()}</p>
            <button onClick={() => markSubtaskAsCompleted(subtask._id, schedule._id, !subtask.completed)}>
              {subtask.completed ? 'Undo Complete' : 'Mark as Completed'}
            </button>
            <button onClick={() => deleteSubtask(subtask._id)}>Delete Subtask</button>
          </li>
        ))}
      </ul>
    

    
            <form onSubmit={(e) => addSubtask(schedule._id, e)}>
              <input
                type="text"
                name="title"
                value={newSubtask.title}
                onChange={handleSubtaskChange}
                placeholder="Subtask Title"
                required
              />
              <textarea
                name="description"
                value={newSubtask.description}
                onChange={handleSubtaskChange}
                placeholder="Subtask Description"
              />
              <input
                type="date"
                name="dueDate"
                value={newSubtask.dueDate}
                onChange={handleSubtaskChange}
                required
              />
              <button type="submit">Add Subtask</button>
            </form>
          </li>
        ))}
      </ul>
     
    </div>
  );
};

export default ScheduleProject;
