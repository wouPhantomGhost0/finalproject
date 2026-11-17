import { useState } from 'react';
import { Utensils, Mail, Lock, User, ArrowRight } from 'lucide-react';
import HomeMenu from './HomeMenu';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    // Logs straight into HomeMenu without requiring MongoDB
    setCurrentUser({
      name: isLogin ? email.split('@')[0] : name,
      email,
    });
  };

  if (currentUser) {
    return (
      <HomeMenu
        user={currentUser}
        onCreateSession={() => console.log('Creating session...')}
        onJoinSession={(code) => console.log('Joining session:', code)}
        onLogout={() => setCurrentUser(null)}
      />
    );
  }

  return (
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
  );
}

export default App;