// /client/src/pages/Interns.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Interns.css';

const Interns = () => {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setInterns(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching interns:', error);
                setLoading(false);
            }
        };
        fetchInterns();
    }, []);

    if (loading) {
        return <div className="loading">Loading interns...</div>;
    }

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

    return (
        <div className="page-container interns-page">
            <header className="page-header">
                <h2>All Interns</h2>
                <p>Meet the talented team of interns.</p>
            </header>
            
            <div className="intern-grid">
                {interns.length > 0 ? (
                    interns.map(intern => (
                        <div 
                            key={intern.id} 
                            className="intern-card" 
                            style={{ '--card-color': getColorForRole(intern.role) }}
                        >
                            <img src={intern.profilePicture} alt={intern.username} className="intern-pic" />
                            <div className="intern-details">
                                <h3>{intern.username}</h3>
                                <p className="intern-role">{intern.role}</p>
                                <div className="intern-stats">
                                    <span className="stat-item"><i className="fas fa-dollar-sign"></i> ₹{intern.donationsRaised.toLocaleString()}</span>
                                    <span className="stat-item"><i className="fas fa-share-alt"></i> {intern.referralCount}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No interns found.</p>
                )}
            </div>
        </div>
    );
};

export default Interns;