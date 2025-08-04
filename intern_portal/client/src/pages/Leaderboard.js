// /client/src/pages/Leaderboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './Leaderboard.css';

const Leaderboard = () => {
    const { currentUser } = useUser();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('donationsRaised');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentUserRank, setCurrentUserRank] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                const sortedUsers = response.data.sort((a, b) => b.donationsRaised - a.donationsRaised);
                setUsers(sortedUsers);
                
                const rank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;
                setCurrentUserRank({
                    ...sortedUsers.find(u => u.id === currentUser.id),
                    rank
                });
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [currentUser]);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const sortedAndFilteredUsers = [...users]
        .filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.role.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="page-container leaderboard-page">
            <header className="page-header">
                <h2>Leaderboard</h2>
                <p>See how you rank against other interns.</p>
            </header>
            
            {currentUserRank && (
                <div className="user-rank-card">
                    <h3>Your Rank: #{currentUserRank.rank}</h3>
                    <p>You have raised **₹{currentUserRank.donationsRaised.toLocaleString()}** in donations.</p>
                </div>
            )}
            
            <div className="leaderboard-controls">
                <input
                    type="text"
                    placeholder="Search by name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="sort-buttons">
                    <button onClick={() => handleSort('donationsRaised')}>
                        Donations <i className={`fas fa-sort-${sortKey === 'donationsRaised' ? (sortDirection === 'asc' ? 'up' : 'down') : 'down'}`}></i>
                    </button>
                    <button onClick={() => handleSort('referralCount')}>
                        Referrals <i className={`fas fa-sort-${sortKey === 'referralCount' ? (sortDirection === 'asc' ? 'up' : 'down') : 'down'}`}></i>
                    </button>
                </div>
            </div>
            
            <div className="leaderboard-list">
                {sortedAndFilteredUsers.length > 0 ? (
                    sortedAndFilteredUsers.map((u, index) => (
                        <div key={u.id} className={`leaderboard-item ${u.id === currentUser.id ? 'current-user' : ''}`}>
                            <span className="rank-badge">{index + 1}</span>
                            <img src={u.profilePicture} alt="Profile" className="leaderboard-profile-pic" />
                            <div className="user-info">
                                <span className="username">{u.username}</span>
                                <span className="user-role">{u.role}</span>
                            </div>
                            <span className="donations">₹{u.donationsRaised.toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;