// /client/src/pages/Profile.js
import React from 'react';
import { useUser } from '../context/UserContext';
import './Profile.css';

const Profile = () => {
    const { currentUser: user } = useUser();

    if (!user) {
        return <div className="loading">Loading...</div>;
    }
    
    return (
        <div className="page-container profile-page">
            <header className="page-header">
                <h2>My Profile</h2>
                <p>Manage your personal information and settings.</p>
            </header>
            
            <div className="profile-content">
                <div className="profile-card">
                    <img src={user.profilePicture} alt="Profile" className="profile-pic" />
                    <div className="profile-details">
                        <h3>{user.username}</h3>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Joined:</strong> {user.joinDate}</p>
                    </div>
                </div>
                
                <div className="profile-stats-card">
                    <h3>Performance Stats</h3>
                    <div className="stats-list">
                        <div className="stat-item">
                            <i className="fas fa-dollar-sign"></i>
                            <div>
                                <h4>Donations Raised</h4>
                                <p>₹{user.donationsRaised.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-share-alt"></i>
                            <div>
                                <h4>Referral Count</h4>
                                <p>{user.referralCount}</p>
                            </div>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-tasks"></i>
                            <div>
                                <h4>Completed Tasks</h4>
                                <p>{user.tasks.filter(t => t.completed).length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="tasks-projects-section full-width">
                <div className="assigned-tasks-card">
                    <h3>My Assigned Tasks</h3>
                    <ul className="task-list-profile">
                        {user.tasks.length > 0 ? (
                            user.tasks.map(task => (
                                <li key={task.id} className={task.completed ? 'completed' : ''}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>{task.title}</span>
                                </li>
                            ))
                        ) : (
                            <p>No tasks assigned yet.</p>
                        )}
                    </ul>
                </div>
                <div className="assigned-projects-card">
                    <h3>My Projects</h3>
                    <ul className="project-list-profile">
                        {user.projects.length > 0 ? (
                            user.projects.map(project => (
                                <li key={project.id}>
                                    <i className="fas fa-project-diagram"></i>
                                    <span>{project.name}</span>
                                </li>
                            ))
                        ) : (
                            <p>No projects assigned yet.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;