import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Utensils, Plus, ArrowRight } from 'lucide-react';
=======
>>>>>>> 79618afe5ea0f3eca98bbc69c4185d7b5659eb41
import './HomeMenu.css';

export default function HomeMenu({ user, onCreateSession, onJoinSession, onLogout }) {
  const [roomCode, setRoomCode] = useState('');
  const [myRooms, setMyRooms] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    if (!user) return;
=======
    if(!user) return;
>>>>>>> 79618afe5ea0f3eca98bbc69c4185d7b5659eb41
    const params = new URLSearchParams({
      name: user.name || '',
      email: user.email || '',
    });

    fetch(`http://localhost:5000/api/my-rooms?${params.toString()}`)
<<<<<<< HEAD
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMyRooms(data);
      })
      .catch(() => setMyRooms([]));
=======
    .then((res) => res.json()).then((data) => {
      if(Array.isArray(data)) setMyRooms(data);
    })
    .catch(() => setMyRooms([]));
>>>>>>> 79618afe5ea0f3eca98bbc69c4185d7b5659eb41
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
          <button className="btn-secondary" onClick={onLogout}>
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
            <button className="btn-primary" onClick={onCreateSession}>
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


          {/* Active Joined Rooms*/}
          {myRooms.length > 0 && (
            <section style={{ marginTop: '2rem', textAlign: 'left'}}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem', color: '#0f172a'}}>
                Your Rooms ({myRooms.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {myRooms.map((room) => (
                  <div
                    key={room.code}
                    onClick={() => onJoinSession(room.code)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                    }}
                    >
                      <div>
                        <div style={{fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.1rem', color: '#0f172a'}}>
                          {room.code}
                        </div>
                        <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem'}}>
                          Host: <strong>{room.host}</strong> • {room.members.length}{' '}
                          {room.members.length === 1 ? 'member' : 'members'}
                        </div>
                      </div>
                      <button type="button" className='btn-primary'>
                        Rejoin →
                      </button>
                    </div>
                ))}
              </div>
            </section>
          )}
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