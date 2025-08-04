// /client/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './Dashboard.css';

const Dashboard = () => {
    const { currentUser: userData, updateUserState } = useUser();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [statusMessage, setStatusMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const leaderboardResponse = await axios.get('http://localhost:5000/api/users');
                const sortedLeaderboard = leaderboardResponse.data
                    .sort((a, b) => b.donationsRaised - a.donationsRaised)
                    .slice(0, 3);
                setLeaderboardData(sortedLeaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };
        fetchLeaderboard();
    }, [userData]);

    const handleRaiseDonation = async () => {
        const donationAmount = Math.floor(Math.random() * 1000) + 100;
        const newDonations = (userData.donationsRaised || 0) + donationAmount;
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userData.id}`, { donationsRaised: newDonations });
            updateUserState(response.data);
            setStatusMessage(`+₹${donationAmount} donations raised!`);
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (error) {
            console.error('Error raising donation:', error);
            setStatusMessage('Error raising donation.');
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    const handleViewTasks = () => {
        navigate('/tasks');
    };

    if (!userData || leaderboardData.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    const goalProgress = (userData.donationsRaised / 50000) * 100;
    const pendingTasksCount = userData.tasks ? userData.tasks.filter(t => !t.completed).length : 0;

    return (
        <div className="page-container dashboard-page">
            <div className="dashboard-header-section">
                <img src={userData.profilePicture} alt="Profile" className="profile-pic" />
                <div className="header-text">
                    <h2>Welcome back, {userData.username}!</h2>
                    <p>You're making a great impact. Keep it up!</p>
                </div>
                <div className="dashboard-actions">
                    <button onClick={handleRaiseDonation}>
                        <i className="fas fa-hand-holding-usd"></i> Raise Donations
                    </button>
                    {statusMessage && <span className="status-message">{statusMessage}</span>}
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stat-card large">
                    <h3>Total Donations Raised</h3>
                    <p className="stat-value">₹{userData.donationsRaised.toLocaleString()}</p>
                </div>
                
                <div className="stat-card referral-card">
                    <h3>Referral Code</h3>
                    <p className="stat-value code-value">{userData.referralCode}</p>
                    <p className="sub-stat">Used by {userData.referralCount} people</p>
                </div>
                
                <div className="progress-card full-width">
                    <h3>Donation Goal Progress</h3>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${goalProgress}%` }}></div>
                        <span className="progress-percentage">{`${goalProgress.toFixed(0)}%`}</span>
                    </div>
                    <p className="progress-text">{`₹${userData.donationsRaised.toLocaleString()} of ₹50,000 goal`}</p>
                </div>

                <div className="rewards-card full-width">
                    <h3>Rewards & Badges</h3>
                    <div className="rewards-list">
                        {userData.rewardsUnlocked.length > 0 ? (
                            userData.rewardsUnlocked.map((reward, index) => (
                                <span key={index} className="reward-badge"><i className="fas fa-award"></i> {reward}</span>
                            ))
                        ) : (
                            <p>No rewards unlocked yet.</p>
                        )}
                    </div>
                </div>

                <div className="mini-leaderboard-card full-width">
                    <h3>Top Donors</h3>
                    <div className="mini-leaderboard-list">
                        {leaderboardData.map((leader, index) => (
                            <div key={leader.id} className="mini-leaderboard-item">
                                <span className="rank-badge">{index + 1}</span>
                                <img src={leader.profilePicture} alt="Profile" className="leader-pic" />
                                <div className="leader-info">
                                    <span className="leader-name">{leader.username}</span>
                                    <span className="leader-donations">₹{leader.donationsRaised.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="tasks-summary-card full-width">
                    <h3>Task Summary</h3>
                    <p>You have **{pendingTasksCount}** pending tasks.</p>
                    <button onClick={handleViewTasks} className="view-all-tasks-btn">View All Tasks</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;