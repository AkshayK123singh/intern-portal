// /client/src/pages/Resources.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Resources.css';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/resources');
                setResources(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching resources:', error);
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    if (loading) {
        return <div className="loading">Loading resources...</div>;
    }

    return (
        <div className="page-container resources-page">
            <header className="page-header">
                <h2>Resources</h2>
                <p>Access important documents and links for your internship.</p>
            </header>
            
            <div className="resource-list">
                {resources.length > 0 ? (
                    resources.map(resource => (
                        <a key={resource.id} href={resource.link} className="resource-item" target="_blank" rel="noopener noreferrer">
                            <i className={`${resource.icon}`}></i>
                            <div className="resource-info">
                                <h3>{resource.title}</h3>
                                <p>{resource.description}</p>
                            </div>
                            <span className="resource-type-badge">{resource.type}</span>
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                    ))
                ) : (
                    <p>No resources available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default Resources;