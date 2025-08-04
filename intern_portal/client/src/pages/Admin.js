// /client/src/pages/Admin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomDropdown from '../components/CustomDropdown';
import { useUser } from '../context/UserContext';
import './Admin.css';

const Admin = () => {
    const { currentUser, updateUserState } = useUser();
    const [users, setUsers] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', role: 'Web Development Intern' });
    const [taskAssignment, setTaskAssignment] = useState({ userId: '', taskId: '' });
    const [projectAssignment, setProjectAssignment] = useState({ userId: '', projectId: '' });
    const [newProject, setNewProject] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchData();
    }, [currentUser]);

    const fetchData = async () => {
        try {
            const usersResponse = await axios.get('http://localhost:5000/api/users');
            setUsers(usersResponse.data);

            const tasksResponse = await axios.get('http://localhost:5000/api/tasks');
            setAllTasks(tasksResponse.data);

            const projectsResponse = await axios.get('http://localhost:5000/api/projects');
            setAllProjects(projectsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users', newUser);
            setNewUser({ username: '', role: 'Web Development Intern' });
            fetchData();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdateDonations = async (id, currentDonations) => {
        const newDonations = prompt("Enter new donation amount:", currentDonations);
        if (newDonations !== null && !isNaN(newDonations)) {
            try {
                const response = await axios.put(`http://localhost:5000/api/users/${id}`, { donationsRaised: parseInt(newDonations) });
                fetchData();
                if (currentUser && currentUser.id === id) {
                    updateUserState(response.data);
                }
            } catch (error) {
                console.error('Error updating donations:', error);
            }
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        const { userId, taskId } = taskAssignment;
        if (!userId || !taskId) return;
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}`, { taskToAssign: taskId });
            setTaskAssignment({ userId: '', taskId: '' });
            fetchData();
            if (currentUser && currentUser.id === userId) {
                updateUserState(response.data);
            }
        } catch (error) {
            console.error('Error assigning task:', error);
        }
    };

    const handleManageProject = async (e, action) => {
        e.preventDefault();
        const { userId, projectId } = projectAssignment;
        if (!userId || !projectId) return;

        try {
            const requestBody = action === 'assign' ? { projectToAssign: projectId } : { projectToRemove: projectId };
            const response = await axios.put(`http://localhost:5000/api/users/${userId}`, requestBody);
            setProjectAssignment({ userId: '', projectId: '' });
            fetchData();
            if (currentUser && currentUser.id === userId) {
                updateUserState(response.data);
            }
        } catch (error) {
            console.error(`Error ${action} project:`, error);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProject.name || !newProject.description) return;
        try {
            await axios.post('http://localhost:5000/api/projects', newProject);
            setNewProject({ name: '', description: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const getColorForRole = (role) => {
        switch (role) {
            case 'Web Development Intern': return '#03dac6';
            case 'ML Intern': return '#bb86fc';
            case 'UX/UI Intern': return '#ff8a80';
            case 'Backend Intern': return '#f39c12';
            case 'Data Science Intern': return '#3498db';
            case 'Marketing Intern': return '#9b59b6';
            default: return '#7f8c8d';
        }
    };
    
    const internOptions = users.map(user => ({ value: user.id, label: user.username }));
    const taskOptions = allTasks.map(task => ({ value: task.id, label: task.title }));
    const projectOptions = allProjects.map(project => ({ value: project.id, label: project.name }));

    return (
        <div className="page-container admin-page">
            <header className="page-header">
                <h2>Admin Panel</h2>
                <p>Manage intern data and tasks.</p>
            </header>

            <div className="admin-grid">
                <div className="add-user-form">
                    <h3><i className="fas fa-user-plus"></i> Add New Intern</h3>
                    <form onSubmit={handleAddUser}>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={newUser.username} 
                            onChange={(e) => setNewUser({...newUser, username: e.target.value})} 
                            required 
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                            <option value="Web Development Intern">Web Development Intern</option>
                            <option value="ML Intern">ML Intern</option>
                            <option value="UX/UI Intern">UX/UI Intern</option>
                            <option value="Backend Intern">Backend Intern</option>
                            <option value="Data Science Intern">Data Science Intern</option>
                            <option value="Marketing Intern">Marketing Intern</option>
                        </select>
                        <button type="submit">Add Intern</button>
                    </form>
                </div>
                
                <div className="create-project-form">
                    <h3><i className="fas fa-plus-circle"></i> Create New Project</h3>
                    <form onSubmit={handleCreateProject}>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Project Description"
                            rows="4"
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            required
                        ></textarea>
                        <button type="submit">Create Project</button>
                    </form>
                </div>

                <div className="assign-task-form">
                    <h3><i className="fas fa-tasks"></i> Assign New Task</h3>
                    <form onSubmit={handleAssignTask}>
                        <CustomDropdown
                            options={internOptions}
                            selected={internOptions.find(o => o.value == taskAssignment.userId)}
                            onSelect={(option) => setTaskAssignment({...taskAssignment, userId: option.value})}
                            placeholder="Select an Intern"
                        />
                        <CustomDropdown
                            options={taskOptions}
                            selected={taskOptions.find(o => o.value == taskAssignment.taskId)}
                            onSelect={(option) => setTaskAssignment({...taskAssignment, taskId: option.value})}
                            placeholder="Select a Task"
                        />
                        <button type="submit">Assign Task</button>
                    </form>
                </div>
                
                <div className="manage-project-form">
                    <h3><i className="fas fa-project-diagram"></i> Manage Projects</h3>
                    <form>
                        <CustomDropdown
                            options={internOptions}
                            selected={internOptions.find(o => o.value == projectAssignment.userId)}
                            onSelect={(option) => setProjectAssignment({...projectAssignment, userId: option.value})}
                            placeholder="Select an Intern"
                        />
                        <CustomDropdown
                            options={projectOptions}
                            selected={projectOptions.find(o => o.value == projectAssignment.projectId)}
                            onSelect={(option) => setProjectAssignment({...projectAssignment, projectId: option.value})}
                            placeholder="Select a Project"
                        />
                        <div className="project-actions">
                            <button onClick={(e) => handleManageProject(e, 'assign')} className="assign-btn">Assign</button>
                            <button onClick={(e) => handleManageProject(e, 'remove')} className="remove-btn">Remove</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="user-list-cards">
                <h3>All Interns</h3>
                <div className="intern-cards-grid">
                    {users.map(user => (
                        <div key={user.id} className="intern-admin-card" style={{ '--card-color': getColorForRole(user.role) }}>
                            <div className="card-header-admin">
                                <img src={user.profilePicture} alt={user.username} className="intern-pic" />
                                <div className="card-header-details">
                                    <h4>{user.username}</h4>
                                    <span className="intern-role-badge">{user.role}</span>
                                </div>
                            </div>
                            <div className="card-body-admin">
                                <p><strong>Donations:</strong> ₹{user.donationsRaised.toLocaleString()}</p>
                                <div className="tasks-projects-info">
                                    <p><strong>Tasks:</strong></p>
                                    <ul>
                                        {user.tasks.length > 0 ? (
                                            user.tasks.map(task => <li key={task.id}>{task.title}</li>)
                                        ) : <li>No tasks</li>}
                                    </ul>
                                </div>
                                <div className="tasks-projects-info">
                                    <p><strong>Projects:</strong></p>
                                    <ul>
                                        {user.projects.length > 0 ? (
                                            user.projects.map(project => <li key={project.id}>{project.name}</li>)
                                        ) : <li>No projects</li>}
                                    </ul>
                                </div>
                            </div>
                            <div className="card-footer-admin">
                                <button onClick={() => handleUpdateDonations(user.id, user.donationsRaised)}>Edit Donations</button>
                                <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;