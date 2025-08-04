// /client/src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.documentElement.className = theme === 'dark' ? '' : 'light-theme';
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="sidebar">
            <div className="portal-logo">
                <h3>Intern Portal</h3>
            </div>
            <nav>
                <ul>
                    <li><NavLink to="/dashboard"><i className="fas fa-tachometer-alt"></i>Dashboard</NavLink></li>
                    <li><NavLink to="/leaderboard"><i className="fas fa-trophy"></i>Leaderboard</NavLink></li>
                    <li><NavLink to="/interns"><i className="fas fa-users"></i>Interns</NavLink></li>
                    <li><NavLink to="/tasks"><i className="fas fa-tasks"></i>Tasks</NavLink></li>
                    <li><NavLink to="/projects"><i className="fas fa-project-diagram"></i>Projects</NavLink></li>
                    <li><NavLink to="/profile"><i className="fas fa-user"></i>My Profile</NavLink></li>
                    <li><NavLink to="/resources"><i className="fas fa-book"></i>Resources</NavLink></li>
                    <li><NavLink to="/admin"><i className="fas fa-user-shield"></i>Admin Panel</NavLink></li>
                </ul>
            </nav>
            <div className="sidebar-footer">
              <div className="theme-toggle">
                  <button onClick={toggleTheme}>
                      <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
              </div>
            </div>
        </div>
    );
};

export default Sidebar;