// /client/src/pages/Projects.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './Projects.css';

const Projects = () => {
    const { currentUser } = useUser();
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setAllUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching all users:', error);
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, [currentUser]);

    const getProjectMembers = (projectId) => {
        if (!allUsers || allUsers.length === 0) {
            return 'Team members not found';
        }

        return allUsers
            .filter(u => u && u.projects && u.username && u.projects.some(p => p && p.id === projectId))
            .map(u => u.username)
            .join(', ');
    };

    if (loading || !currentUser) {
        return <div className="loading">Loading projects...</div>;
    }

    const userProjects = currentUser.projects;
    
    return (
        <div className="page-container projects-page">
            <header className="page-header">
                <h2>My Projects</h2>
                <p>View details of the projects you are contributing to.</p>
            </header>
            
            <div className="project-grid">
                {userProjects.length > 0 ? (
                    userProjects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-header">
                                <h3>{project.name}</h3>
                                <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>{project.status}</span>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-members">
                                <i className="fas fa-users"></i>
                                <span>Team: {getProjectMembers(project.id)}</span>
                            </div>
                            <div className="project-deadline">
                                <i className="fas fa-calendar-alt"></i>
                                <span>Deadline: {project.deadline}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No projects assigned yet.</p>
                )}
            </div>
        </div>
    );
};

export default Projects;