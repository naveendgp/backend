import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProjectDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: '',  
    description: '',
    priority: 'Medium',
    deadline: '',
    status: 'Not Started',
    teamMembersEmails: '',
  });
  const [projects, setProjects] = useState([]);
  const [finishedProjects, setFinishedProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
 
  const animationClass = 'slide-up';
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user || !user.token) return;
  
        const token = user.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        // Fetch projects for both creator and assignees
        const response = await axios.get('/api/projects', config);
        const allProjects = response.data.projects; // Access 'projects' from response
  
        // Separate into ongoing (not completed) and finished (completed) projects
        setProjects(allProjects.filter(project => !project.isCompleted));  // Ongoing projects
        setFinishedProjects(allProjects.filter(project => project.isCompleted));  // Finished projects
        
      } catch (error) {
        if (error.response?.status === 401) {
          console.error('Unauthorized! Logging out...');
          
          navigate('/login');
        } else {
          console.error('Error fetching projects:', error.response?.data || error.message);
        }
      }
    };
  
    fetchProjects();
  }, [user, navigate]);
  
  
  const handleProjectChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };
  const addProject = async () => {
    try {
      const token = user?.token;
      if (!token) throw new Error('No token available');
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      // Convert teamMembersEmails to an array
      const teamMembersEmails = project.teamMembersEmails.split(',').map(email => email.trim());

  
      const response = await axios.post('/api/projects', {
        ...project,
        teamMembersEmails, // Send team members' emails
        createdBy: user.id, // Send the user id as the creator
      }, config);
  
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error adding project:', error.response?.data || error.message);
      alert(`Failed to add project. Error: ${error.response?.data?.message || error.message}`);
    }
  };
  

  const onSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateProject();
    } else {
      addProject();
    }

    setProject({
      title: '',
      description: '',
      priority: 'Medium',
      deadline: '',
      teamMembersEmails: '',
      createdBy: user.id,
    });
    setIsEditing(false);
    setEditingProject(null);
  };
  const editProject = (project) => {
    setProject({
      title: project.title,
      description: project.description,
      priority: project.priority,
      deadline: formatDateForInput(project.deadline),
      teamMembersEmails: project.teamMembers.map(member => member.email).join(', '), // Map team members to their emails
    });
    setEditingProject(project);
    setIsEditing(true);
  };
  

  const updateProject = async () => {
    try {
      const token = user?.token;
      if (!token) throw new Error('No token available');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.put(`/api/projects/${editingProject._id}`, project, config);
      setProjects(projects.map(p => (p._id === editingProject._id ? response.data : p)));
    } catch (error) {
      console.error('Error updating project:', error.response?.data || error.message);
      alert(`Failed to update project. Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (projectId, isFinished) => {
    try {
      const token = user?.token;
      if (!token) throw new Error('No token available');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`api/projects/${projectId}`, config);
      
      
      // Delete from the appropriate list (ongoing or finished)
      if (isFinished) {
        setFinishedProjects(finishedProjects.filter(p => p._id !== projectId));
      } else {
        setProjects(projects.filter(p => p._id !== projectId));
      }
    } catch (error) {
      alert('Error deleting project');
    }
  };
  const handleReopen = async (projectId) => {
    try {
      const token = user?.token;  // Ensure that you have a token
      if (!token) throw new Error('No token available');  // Handle missing token
      
      const config = { headers: { Authorization: `Bearer ${token}` } };  // Set token in request headers
  
      const response = await axios.put(`/api/projects/${projectId}/reopen`, {}, config);
      // Handle success
      
      setFinishedProjects(finishedProjects.filter(project => project._id !== projectId));
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error reopening project:', error);  // Log error for debugging
      alert('Error reopening project');
    }
  };
  const handleProjectClick = (projectId) => {
    navigate(`/schedule/${projectId}`);  // Navigate to the schedule page for the selected project
  };
  
  

  const formatDateForInput = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
    return formattedDate;
  };
  const markAsFinished = async (projectId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error('No token available');
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.put(`/api/projects/${projectId}/mark-as-finished`, {}, config);
      
      const updatedProject = response.data.project;
      
      setProjects((prevProjects) => prevProjects.filter((p) => p._id !== projectId));
      setFinishedProjects((prevFinished) => [...prevFinished, updatedProject]);
      
    } catch (error) {
      console.error('Error marking project as finished:', error);
      alert('Failed to mark project as finished');
    }
  };
  
  

    return (
      <div style={styles.container} className={animationClass}>
        <style>
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
    
        {/* Add Project Section */}
        <div style={styles.addProjectSection}>
          <header style={styles.header}>
            <h1 style={styles.heading}>{isEditing ? 'Edit Project' : 'Add New Project'}</h1>
          </header>
          <form onSubmit={onSubmit} style={styles.form}>
  <input
    type="text"
    name="title"
    placeholder="Project Title"
    value={project.title || ''}  // Ensure it never changes to undefined
    onChange={handleProjectChange}
    required
    style={styles.input}
  />
  <textarea
    name="description"
    placeholder="Project Description"
    value={project.description || ''}
    onChange={handleProjectChange}
    required
    style={styles.textarea}
  />
  <select
    name="priority"
    value={project.priority || 'Low'}  // Default to 'Low' if undefined
    onChange={handleProjectChange}
    required
    style={styles.select}
  >
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
  <input
    type="date"
    name="deadline"
    value={formatDateForInput(project.deadline) || ''}  // Ensure it's never undefined
    onChange={handleProjectChange}
    required
    style={styles.input}
  />
  <input
    type="text"
    name="teamMembersEmails"
    placeholder="Enter team members' emails, separated by commas"
    value={project.teamMembersEmails || ''}  // Default to empty string if undefined
    onChange={handleProjectChange}
    required
    style={styles.input}
  />
  <button type="submit" style={styles.button}>
    {isEditing ? 'Update Project' : 'Add Project'}
  </button>
</form>

        </div>
    
        {/* Project List */}
        <div style={styles.projectContainer}>
          <div style={styles.projectListSection}>
            <h2 style={styles.subHeading}>Ongoing Projects</h2>
            <ul style={styles.projectList}>
              {projects.map((project) => (

                  <li key={project._id} onClick={() => handleProjectClick(project._id)} style={styles.projectItem}>
                    {console.log('Created By:', project?.createdBy)}
                    <p>
  <b>Team Head:</b> {project?.createdBy?.email || 'No Email Available'}
  </p>

  <p>
    <b>Team Members:</b> {project?.teamMembers && project.teamMembers.length > 0
      ? project.teamMembers.map(member => member.email).join(', ') // Map to emails and join them
      : 'Not Assigned'}
  </p>
                    <h3 style={styles.projectTitle}>{project.title}</h3>
                    <p style={styles.projectDescription}>{project.description}</p>
                    <p style={styles.projectPriority}>Priority: {project.priority}</p>
                    <p style={styles.projectDeadline}>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                    
    
                  <button onClick={(e) =>{e.stopPropagation(); editProject(project)}} style={styles.editButton}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); markAsFinished(project._id)}} style={styles.finishButton}>Finished</button>
                  <button onClick={(e) =>{e.stopPropagation(); handleDelete(project._id, false)}} style={styles.deleteButton}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
    
          {/* Finished Projects Section */}
          <div style={styles.finishedProjectsSection}>
            <h2 style={styles.subHeading}>Finished Projects</h2>
            <ul style={styles.projectList}>
              {finishedProjects.map((project) => (
                <li key={project._id} style={styles.projectItem}>
                
                  <h3 style={styles.projectTitle}>{project.title}</h3>
                  <p style={styles.projectDescription}>{project.description}</p>
                  <p style={styles.projectPriority}>Priority: {project.priority}</p>
                  <p style={styles.projectDeadline}>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                  <p>Status: {project.status}</p>
    
                  <button onClick={() => handleDelete(project._id, true)} style={styles.deleteButton}>Delete</button>
                  <button onClick={() => handleReopen(project._id)} style={styles.reopenButton}>Reopen</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )};

  // Updated styles
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
    },
    addProjectSection: {
      width: '40%',
      padding: '20px',
      backgroundColor: '#f3f4f6',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      marginRight: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
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
    projectContainer: {
      width: '60%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '20px',
    },
    creator: {
      fontStyle: 'italic',
      color: '#007bff',  // Blue for the creator
    },
  
    assignee: {
      fontStyle: 'normal',
      color: '#28a745',  // Green for the assignee
    },  
  
    projectListSection: {
      backgroundColor: '#4a6fa5',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      flex: 1, 
      overflowY: 'auto',
    },
    finishedProjectsSection: {
      backgroundColor: '#4a6fa5',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      flex: 1, 
      overflowY: 'auto',
    },
    subHeading: {
      fontSize: '1.5em',
      marginBottom: '10px',
      color: '#ffffff',
    },
    projectList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    projectItem: {
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '15px',
      marginBottom: '10px',
    },
    projectTitle: {
      fontSize: '1.25em',
      color: '#333',
    },
    projectDescription: {
      fontSize: '1em',
      color: '#555',
    },
    projectPriority: {
      fontSize: '1em',
      color: '#777',
    },
    projectDeadline: {
      fontSize: '1em',
      color: '#777',
    },
    statusInput: {
      padding: '8px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      width: '70%',
    },
    updateStatusButton: {
      padding: '8px 12px',
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    editButton: {
      padding: '8px 12px',
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    finishButton: {
      padding: '8px 12px',
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    deleteButton: {
      padding: '8px 12px',
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    reopenButton: {
      padding: '8px 12px',
      backgroundColor: '#4a6fa5',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }
  };
  
export default ProjectDashboard;
