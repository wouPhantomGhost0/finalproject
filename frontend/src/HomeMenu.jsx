import React, { useState } from 'react';
import './HomeMenu.css';

export default function HomeMenu({ user, onCreateSession, onJoinSession, onLogout }) {
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      onJoinSession(roomCode.trim().toUpperCase());
    }
  };

  return (
    <div className="home-container">
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">🍴</span>
          <h2>CraveMatch</h2>
        </div>
        <div className="nav-actions">
          <span className="user-greeting">Hi, {user?.name || 'Foodie'}</span>
          <button className="btn-secondary" onClick={onLogout}>Log Out</button>
        </div>
      </nav>

      {/* Main Dashboard / Action Cards */}
      <main className="home-main">
        <header className="hero-section">
          <h1>Where are we eating tonight?</h1>
          <p>Start a group session or enter a code to match preferences in seconds.</p>
        </header>

        <div className="action-grid">
          {/* Card 1: Host a Session */}
          <div className="action-card primary-card">
            <h3>Start a Group Session</h3>
            <p>Set your budget, location radius, and dietary filters, then invite your group.</p>
            <button className="btn-primary" onClick={onCreateSession}>
              + Create New Session
            </button>
          </div>

          {/* Card 2: Join a Session */}
          <div className="action-card">
            <h3>Join with a Code</h3>
            <p>Got an invite code from a friend? Enter it below to start swiping.</p>
            <form onSubmit={handleJoin} className="join-form">
              <input
                type="text"
                placeholder="e.g. DINE42"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <button type="submit" className="btn-dark">Join</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}