import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../logo.webp';
import './Dashboard.css';
import authService from '../../services/authService';
import userService from '../../services/userService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [userCounts, setUserCounts] = useState({
    numberOfFriends: 0,
    numberOfGroups: 0,
    numberOfFriendRequests: 0
  });
  const [loading, setLoading] = useState({
    userCounts: false,
    userData: false
  });
  const [error, setError] = useState({
    userCounts: null,
    userData: null
  });
  
  // Check authentication and get user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(prev => ({ ...prev, userData: true }));
        
        if (!authService.isLoggedIn()) {
          navigate('/login');
          return;
        }
        
        const user = authService.getCurrentUser();
        setUserData(user);
        
        // Fetch user counts data separately
        await fetchUserCounts();
      } catch (err) {
        setError(prev => ({
          ...prev,
          userData: err.message || 'Failed to load user data'
        }));
      } finally {
        setLoading(prev => ({ ...prev, userData: false }));
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // Fetch user counts data
  const fetchUserCounts = async () => {
    try {
      setLoading(prev => ({ ...prev, userCounts: true }));
      const counts = await userService.getUserCounts();
      setUserCounts(counts);
    } catch (err) {
      setError(prev => ({
        ...prev,
        userCounts: err.message || 'Failed to load user counts'
      }));
      console.error('Error loading user counts:', err);
    } finally {
      setLoading(prev => ({ ...prev, userCounts: false }));
    }
  };
  
  const handleLogout = () => {
    authService.logout();
  };
  
  // Display user initials in the avatar
  const getUserInitials = () => {
    if (userData && userData.firstName && userData.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    } else if (userData && userData.firstName) {
      return userData.firstName[0].toUpperCase();
    } else if (userData && userData.email) {
      return userData.email[0].toUpperCase();
    }
    return 'AD'; // Default
  };
  
  const tabContent = {
    dashboard: (
      <>
        <h2>Dashboard Overview</h2>
        <p className="section-description">Monitor your chat application performance and metrics</p>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Active Friends</h3>
            {loading.userCounts ? (
              <p className="stat-value loading">Loading...</p>
            ) : error.userCounts ? (
              <p className="stat-error">Error loading data</p>
            ) : (
              <>
                <p className="stat-value">{userCounts.numberOfFriends || 0}</p>
                <p className="stat-label">Connected friends</p>
              </>
            )}
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-comment-dots"></i>
            </div>
            <h3>Active Groups</h3>
            {loading.userCounts ? (
              <p className="stat-value loading">Loading...</p>
            ) : error.userCounts ? (
              <p className="stat-error">Error loading data</p>
            ) : (
              <>
                <p className="stat-value">{userCounts.numberOfGroups || 0}</p>
                <p className="stat-label">Active chat groups</p>
              </>
            )}
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3>Friend Requests</h3>
            {loading.userCounts ? (
              <p className="stat-value loading">Loading...</p>
            ) : error.userCounts ? (
              <p className="stat-error">Error loading data</p>
            ) : (
              <>
                <p className="stat-value">{userCounts.numberOfFriendRequests || 0}</p>
                <p className="stat-label">Pending requests</p>
              </>
            )}
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Reports</h3>
            <p className="stat-value">12</p>
            <p className="stat-change negative">+2 from last week</p>
          </div>
        </div>
        
        <div className="dashboard-row">
          <div className="dashboard-card activity-feed">
            <div className="card-header">
              <h3>Recent Activity</h3>
              <button className="btn-transparent">View All</button>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon user-registered">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">New user registered: <strong>john_doe</strong></p>
                  <p className="activity-time">5 minutes ago</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon message-reported">
                  <i className="fas fa-flag"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">Message reported in <strong>General Chat</strong></p>
                  <p className="activity-time">20 minutes ago</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon user-banned">
                  <i className="fas fa-ban"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">User <strong>troll123</strong> was temporarily banned</p>
                  <p className="activity-time">45 minutes ago</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon channel-created">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <div className="activity-content">
                  <p className="activity-text">New channel created: <strong>Product Updates</strong></p>
                  <p className="activity-time">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Active Channels</h3>
              <button className="btn-transparent">View All</button>
            </div>
            <ul className="channels-list">
              <li className="channel-item">
                <span className="channel-name">General Chat</span>
                <span className="channel-count">245 users</span>
              </li>
              <li className="channel-item">
                <span className="channel-name">Support</span>
                <span className="channel-count">124 users</span>
              </li>
              <li className="channel-item">
                <span className="channel-name">Marketing</span>
                <span className="channel-count">86 users</span>
              </li>
              <li className="channel-item">
                <span className="channel-name">Development</span>
                <span className="channel-count">78 users</span>
              </li>
              <li className="channel-item">
                <span className="channel-name">Random</span>
                <span className="channel-count">52 users</span>
              </li>
            </ul>
          </div>
        </div>
      </>
    ),
    users: (
      <>
        <h2>User Management</h2>
        <p className="section-description">View and manage all user accounts</p>
        <div className="user-management-placeholder">
          <i className="fas fa-users placeholder-icon"></i>
          <p>User management content will be displayed here</p>
        </div>
      </>
    ),
    messages: (
      <>
        <h2>Message Moderation</h2>
        <p className="section-description">Monitor and moderate messages across channels</p>
        <div className="message-moderation-placeholder">
          <i className="fas fa-comments placeholder-icon"></i>
          <p>Message moderation content will be displayed here</p>
        </div>
      </>
    ),
    settings: (
      <>
        <h2>System Settings</h2>
        <p className="section-description">Configure application settings</p>
        <div className="settings-placeholder">
          <i className="fas fa-cog placeholder-icon"></i>
          <p>Settings content will be displayed here</p>
        </div>
      </>
    )
  };
  
  if (!userData) return null;
  
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="ReactoSphere Logo" className="sidebar-logo" />
          <h2>ReactoSphere</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </li>
            <li 
              className={activeTab === 'users' ? 'active' : ''} 
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i>
              <span>Users</span>
            </li>
            <li 
              className={activeTab === 'messages' ? 'active' : ''} 
              onClick={() => setActiveTab('messages')}
            >
              <i className="fas fa-comments"></i>
              <span>Messages</span>
            </li>
            <li 
              className={activeTab === 'channels' ? 'active' : ''} 
              onClick={() => setActiveTab('channels')}
            >
              <i className="fas fa-hashtag"></i>
              <span>Channels</span>
            </li>
            <li 
              className={activeTab === 'reports' ? 'active' : ''} 
              onClick={() => setActiveTab('reports')}
            >
              <i className="fas fa-flag"></i>
              <span>Reports</span>
            </li>
            <li 
              className={activeTab === 'settings' ? 'active' : ''} 
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="main">
        <header className="main-header">
          <div className="header-search">
            <i className="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              <i className="fas fa-bell"></i>
              <span className="badge">3</span>
            </button>
            <div className="admin-profile">
              <div className="admin-avatar">{getUserInitials()}</div>
              <span className="admin-name">{userData.firstName || 'Admin'}</span>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 