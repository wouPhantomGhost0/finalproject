import { useState } from 'react';
import { Utensils, Mail, Lock, User, ArrowRight } from 'lucide-react';
import HomeMenu from './HomeMenu';
import RoomLobby from './RoomLobby';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomError, setRoomError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    setCurrentUser({
      name: isLogin ? email.split('@')[0] : name.trim(),
      email: email.trim(),
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRoom(null);
    setRoomError('');
  };

  const handleCreateSession = async () => {
    setRoomError('');
    try {
      const response = await fetch('http://localhost:5000/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: currentUser.name || 'Host',
          email: currentUser.email || '',
        }),
      });

      const data = await response.json();

      if (response.ok && data.code) {
        setActiveRoom(data.code);
      } else {
        setRoomError(data.message || 'Server replied without a room code.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setRoomError('Cannot reach the server. Make sure node server.js is running.');
    }
  };

  const handleJoinSession = async (code) => {
    setRoomError('');
    const cleanedCode = code.trim().toUpperCase();
    if (!cleanedCode) return;

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${cleanedCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
        }),
      });
      const data = await response.json();

      if (response.ok && data.code) {
        setActiveRoom(data.code);
      } else {
        setRoomError(data.message || 'Room not found.');
      }
    } catch (err) {

      setRoomError('Cannot reach the server. Make sure node server.js is running.');
    }
  };

  if (currentUser) {
    if (activeRoom) {
      return (
        <RoomLobby
          roomCode={activeRoom}
          currentUser={currentUser}
          onLeaveRoom={() => setActiveRoom(null)}
        />
      );
    }

    return (
      <>
        {roomError && (
          <p
            style={{
              background: '#fef2f2',
              color: '#dc2626',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #fee2e2',
            }}
          >
            {roomError}
          </p>
        )}

        <HomeMenu
          user={currentUser}
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
          onLogout={handleLogout}
        />
      </>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="brand-header">
          <div className="logo-badge">
            <Utensils size={26} />
          </div>
          <h1>CraveMatch</h1>
          <p>Group Dining Preference Matcher</p>
        </div>

        <div className="tab-switch">
          <button
            type="button"
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-box">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-box">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-box">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Log In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;