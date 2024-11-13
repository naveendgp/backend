  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useAuth } from '../context/AuthContext';
  import { useNavigate } from 'react-router-dom';

  const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [task, setTask] = useState({
      title: '',
      description: '',
      priority: 'Low',
      date: '',
      status: 'Pending',
    });
    const [tasks, setTasks] = useState([]);
    const [finishedTasks, setFinishedTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [sortCriterion, setSortCriterion] = useState('priority');
    const [animationClass, setAnimationClass] = useState('fade-in');
    
    useEffect(() => {
      
        
      
      const fetchTasks = async () => {
        try {
          if (!user || !user.token) return;

          const token = user.token;

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await axios.get('/api/tasks', config);
          const allTasks = response.data;
          setTasks(allTasks.filter(t => !t.completed));
          setFinishedTasks(allTasks.filter(t => t.completed));
        } catch (error) {
          if (error.response?.status === 401) {
            console.error('Unauthorized! Logging out...');
            logout();
            navigate('/login');
          } else {
            console.error('Error fetching tasks:', error.response?.data || error.message);
          }
        }
      };

      fetchTasks();

      // Trigger the fade-in animation when the component mounts
      setAnimationClass('fade-in');
    }, [user, logout, navigate]);

    const handleLogout = () => {
      logout();
      navigate('/');
    };
    
    const handleChange = (e) => {
      setTask({ ...task, [e.target.name]: e.target.value });
    };

    const addTask = async () => {
      try {
        const token = user?.token;
        if (!token) throw new Error('No token available');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post('/api/tasks', task, config);
        setTasks([...tasks, response.data]);
      } catch (error) {
        console.error('Error adding task:', error.response?.data || error.message);
        alert(`Failed to add task. Error: ${error.response?.data?.message || error.message}`);
      }
    };

    const onSubmit = (e) => {
      e.preventDefault();
      if (isEditing) {
        updateTask();
      } else {
        addTask();
      }

      setTask({
        title: '',
        description: '',
        priority: 'Low',
        date: '',
        status: 'Pending',
      });
      setIsEditing(false);
      setEditingTask(null);
    };

    const editTask = (task) => {
      setTask(task);
      setEditingTask(task);
      setIsEditing(true);
    };

    const updateTask = async () => {
      try {
        const token = user?.token;
        if (!token) throw new Error('No token available');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.put(`/api/tasks/${editingTask._id}`, task, config);
        setTasks(tasks.map(t => (t._id === editingTask._id ? response.data : t)));
        if (response.data.status === 'Finished') {
          setFinishedTasks([...finishedTasks, response.data]);
        } else {
          setFinishedTasks(finishedTasks.filter(t => t._id !== editingTask._id));
        }
      } catch (error) {
        console.error('Error updating task:', error.response?.data || error.message);
        alert(`Failed to update task. Error: ${error.response?.data?.message || error.message}`);
      }
    };
    
    const markAsFinished = async (id) => {
      try {
        const token = user?.token;
        if (!token) throw new Error('No token available');
    
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        const updatedTask = tasks.find(t => t._id === id);
        if (!updatedTask) return;
    
        updatedTask.completed = true;
        const response = await axios.put(`/api/tasks/${id}`, updatedTask, config);
        setTasks(tasks.filter(t => t._id !== id));
        setFinishedTasks([...finishedTasks, response.data]);
      } catch (error) {
        console.error('Error marking task as finished:', error.response?.data || error.message);
        alert(`Failed to mark task as finished. Error: ${error.response?.data?.message || error.message}`);
      }
    };

    const reopenTask = async (id) => {
      try {
        const token = user?.token;
        if (!token) throw new Error('No token available');
    
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        const updatedTask = finishedTasks.find(t => t._id === id);
        if (!updatedTask) return;
    
        updatedTask.completed = false;
        const response = await axios.put(`/api/tasks/${id}`, updatedTask, config);
        setFinishedTasks(finishedTasks.filter(t => t._id !== id));
        setTasks([...tasks, response.data]);
      } catch (error) {
        console.error('Error reopening task:', error.response?.data || error.message);
        alert(`Failed to reopen task. Error: ${error.response?.data?.message || error.message}`);
      }
    };

    const deleteTask = async (id) => {
      try {
        const token = user?.token;
        if (!token) throw new Error('No token available');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(`/api/tasks/${id}`, config);
        setTasks(tasks.filter((task) => task._id !== id));
        setFinishedTasks(finishedTasks.filter((task) => task._id !== id));
      } catch (error) {
        console.error('Error deleting task:', error.response?.data || error.message);
        alert(`Failed to delete task. Error: ${error.response?.data?.message || error.message}`);
      }
    };
    const handleProjectClick = () => {
      navigate('/project-dashboard');
    };
    const sortedTasks = [...tasks].sort((a, b) => {
      if (sortCriterion === 'priority') {
        return a.priority.localeCompare(b.priority);
      } else if (sortCriterion === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

    const formatDateForInput = (date) => {
      if (!date) return '';
      const formattedDate = new Date(date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
      return formattedDate;
    };

    return (
      <div style={styles.container} className={animationClass}><style>
      {`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
    
        .slide-up {
          animation: slideUp 0.7s ease-in-out;
        }
      `}
    </style>
    
        <div style={styles.addTaskSection}>
          <header style={styles.header}>
            <h1 style={styles.heading}>Add Your Tasks</h1>
          </header>
          <form onSubmit={onSubmit} style={styles.form}>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={task.title}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={task.description}
              onChange={handleChange}
              required
              style={styles.textarea}
            />
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="date"
              name="date"
              value={formatDateForInput(task.date)} 
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>{isEditing ? 'Update Task' : 'Add Task'}</button>
          </form>
        </div>

        <div style={styles.taskContainer}>
          <div style={styles.taskListSection}>
            <h2 style={styles.subHeading}>Task List</h2>
            <div style={styles.sortButtonsContainer}>
              <button onClick={() => setSortCriterion('date')} style={styles.sortButton}>Sort by Date</button>
              <button onClick={() => setSortCriterion('priority')} style={styles.sortButton}>Sort by Priority</button>
            </div>
            {tasks.length === 0 ? (
              <p style={styles.noTasksMessage}>No tasks yet</p>
            ) : (
              <ul style={styles.taskList}>
                {sortedTasks.map((task) => (
                  <li key={task._id} style={styles.taskItem}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <p style={styles.taskDescription}>{task.description}</p>
                    <p style={styles.taskPriority}><strong>Priority:</strong> {task.priority}</p>
                    <p style={styles.taskDate}><strong>Date:</strong> {formatDateForInput(task.date)}</p>
                    <div style={styles.buttonGroup}>
                      <button onClick={() => editTask(task)} style={styles.editButton}>Edit</button>
                      <button onClick={() => markAsFinished(task._id)} style={styles.finishButton}>Mark as Finished</button>
                      <button onClick={() => deleteTask(task._id)} style={styles.deleteButton}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div style={styles.finishedTasksSection}>
            <header style={styles.finishedTasksHeader}>
              <h2 style={styles.subHeading}>Finished Tasks</h2>
              <button onClick={handleProjectClick} style={styles.projectButton}>
            Project
          </button>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </header>
            {finishedTasks.length === 0 ? (
              <p style={styles.noTasksMessage}>No finished tasks yet</p>
            ) : (
              <ul style={styles.taskList}>
                {finishedTasks.map((task) => (
                  <li key={task._id} style={styles.taskItem}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <p style={styles.taskDescription}>{task.description}</p>
                    <p style={styles.taskPriority}><strong>Priority:</strong> {task.priority}</p>
                    <p style={styles.taskDate}><strong>Date:</strong> {formatDateForInput(task.date)}</p>
                    <div style={styles.buttonGroup}>
                      <button onClick={() => reopenTask(task._id)} style={styles.reopenButton}>Reopen</button>
                      <button onClick={() => deleteTask(task._id)} style={styles.deleteButton}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden', // Ensure the container handles overflow
    },
    projectButton: {
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1em',
      marginRight: '10px',
    },
    addTaskSection: {
      width: '40%',
      padding: '20px',
      backgroundColor: '#f3f4f6',
      borderRight: '2px solid #4a6fa5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflowY: 'auto', // Allow vertical scrolling
    },
    header: {
      marginBottom: '20px',
    },
    heading: {
      fontSize: '2em',
      color: '#4a6fa5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1em',
    },
    textarea: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1em',
      minHeight: '100px',
    },
    select: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '1em',
    },
    button: {
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1em',
    },
    taskContainer: {
      width: '60%',
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      overflow: 'auto', // Allow overflow handling
    },
    taskListSection: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#4a6fa5',
      borderRadius: '3px',
      overflowY: 'auto', // Allow vertical scrolling
    },
    finishedTasksSection: {
      flex: 1,
      padding: '20px',
      backgroundColor: '#4a6fa5',
      borderRadius: '3px',
      position: 'relative',
      overflowY: 'auto', // Allow vertical scrolling
    },
    subHeading: {
      fontSize: '1.5em',
      marginBottom: '10px',
      color: '#f3f4f6',
    },
    sortButtonsContainer: {
      marginBottom: '10px',
    },
    sortButton: {
      backgroundColor: '#fff',
      color: '#4a6fa5',
      border: 'none',
      padding: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    noTasksMessage: {
      fontStyle: 'italic',
      color: '#fff',
    },
    taskList: {
      listStyleType: 'none',
      padding: '0',
      margin: '0', // Remove default margin
    },
    taskItem: {
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '15px',
      marginBottom: '10px',
    },
    taskTitle: {
      fontSize: '1.25em',
      color: '#4a6fa5',
    },
    taskDescription: {
      fontSize: '1em',
      color: '#555',
    },
    taskPriority: {
      fontSize: '1em',
      color: '#777',
    },
    taskDate: {
      fontSize: '1em',
      color: '#777',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
    },
    editButton: {
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    finishButton: {
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    reopenButton: {
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButton: {
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    finishedTasksHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    logoutButton: {
      backgroundColor: '#d9534f',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1em',
    },
  };

  export default Dashboard;
