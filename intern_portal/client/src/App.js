// /client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Interns from './pages/Interns';

import './App.css';

const AppRoutes = () => {
  const { currentUser, fetchCurrentUser, logout } = useUser();

  const handleLogin = (userId) => {
    fetchCurrentUser(userId);
  };

  return (
    <div className="app-container">
      {currentUser && <Sidebar onLogout={logout} />}
      <main className={`content-container ${currentUser ? '' : 'shifted'}`}>
        {currentUser && (
          <div className="top-navbar">
            <button onClick={logout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}
        <Routes>
          <Route path="/" element={currentUser ? <Dashboard /> : <Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Login onLogin={handleLogin} />} />
          <Route path="/leaderboard" element={currentUser ? <Leaderboard /> : <Login onLogin={handleLogin} />} />
          <Route path="/tasks" element={currentUser ? <Tasks /> : <Login onLogin={handleLogin} />} />
          <Route path="/projects" element={currentUser ? <Projects /> : <Login onLogin={handleLogin} />} />
          <Route path="/profile" element={currentUser ? <Profile /> : <Login onLogin={handleLogin} />} />
          <Route path="/resources" element={currentUser ? <Resources /> : <Login onLogin={handleLogin} />} />
          <Route path="/admin" element={currentUser ? <Admin /> : <Login onLogin={handleLogin} />} />
          <Route path="/interns" element={currentUser ? <Interns /> : <Login onLogin={handleLogin} />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  </Router>
);

export default App;