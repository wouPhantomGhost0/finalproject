import React, { useState, useEffect } from 'react';
import { Utensils, Plus, ArrowRight } from 'lucide-react';
import './HomeMenu.css';

export default function HomeMenu({ user, onCreateSession, onJoinSession, onLogout }) {
  const [roomCode, setRoomCode] = useState('');
    const [myRooms, setMyRooms] = useState([]);

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams({
      name: user.name || '',
      email: user.email || '',
    });

    fetch(`http://localhost:5000/api/my-rooms?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMyRooms(data);
      })
      .catch(() => setMyRooms([]));
  }, [user]);

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
          <span className="brand-icon">
            <Utensils size={20} />
          </span>
          <h2>CraveMatch</h2>
        </div>
        <div className="nav-actions">
          <span className="user-greeting">Hi, {user?.name || 'Foodie'}</span>
          <button type="button" className="btn-secondary" onClick={onLogout}>
            Log Out
          </button>
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
            <div>
              <h3>Start a Group Session</h3>
              <p>Set your budget, location radius, and dietary filters, then invite your group.</p>
            </div>
            <button type="button" className="btn-primary" onClick={onCreateSession}>
              <Plus size={18} />
              Create New Session
            </button>
          </div>

          {/* Card 2: Join a Session */}
          <div className="action-card">
            <div>
              <h3>Join with a Code</h3>
              <p>Got an invite code from a friend? Enter it below to start swiping.</p>
            </div>
            <form onSubmit={handleJoin} className="join-form">
              <input
                type="text"
                placeholder="e.g. DINE42"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <button type="submit" className="btn-dark">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Active Joined Rooms */}
        {myRooms.length > 0 && (
          <section className="rooms-section">
            <h3>Your Rooms ({myRooms.length})</h3>
            <div className="rooms-list">
              {myRooms.map((room) => (
                <div
                  key={room.code}
                  className="room-item-card"
                  onClick={() => onJoinSession(room.code)}
                >
                  <div>
                    <div className="room-code-label">{room.code}</div>
                    <div className="room-meta">
                      Host: <strong>{room.host}</strong> &bull; {room.members.length}{' '}
                      {room.members.length === 1 ? 'member' : 'members'}
                    </div>
                  </div>
                  <button type="button" className="btn-primary">
                    Rejoin
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}