import { useState, useEffect, useCallback } from 'react';
import {
  Utensils,
  ArrowLeft,
  ArrowRight,
  Search,
  MapPin,
  Bell,
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import HomeMenu from './HomeMenu';
import RoomLobby from './RoomLobby';
import { loginUser, signupUser, fetchUserRooms } from './api';

export const FEATURED_SPOTS = [
  {
    id: 'mcdo-digos',
    name: "McDonald's, Digos City Branch",
    tag: 'FEATURED',
    location: 'Rizal Avenue, Digos City',
    distance: '1.2 km away',
    priceRange: '₱150 – ₱350',
    about: 'Fast-food classics, group chicken bundles, and quick service right in the heart of Digos City.',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'the-nook-digos',
    name: 'The Nook, Digos City',
    tag: 'FEATURED',
    location: 'Quezon Avenue, Digos City',
    distance: '1.8 km away',
    priceRange: '₱220 – ₱450',
    about: 'Cozy wooden-interior cafe and comfort kitchen ideal for small group hangouts and rice bowls.',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'promos-cravematch',
    name: 'PROMO & DISCOUNTS BY CRAVEMATCH',
    tag: 'TRENDING',
    location: 'Digos City & Davao City Partner Spots',
    distance: 'Citywide',
    priceRange: 'Up to 25% OFF',
    about: 'Exclusive group dining vouchers and barkada platter deals unlocked when your lobby matches.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  // Pages: 'welcome' | 'login' | 'register' | 'home' | 'explore' | 'lobbies' | 'history' | 'about' | 'services' | 'settings'
  const [page, setPage] = useState('welcome');
  const [prevPage, setPrevPage] = useState('welcome');

  // Auth form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  // Room & History states
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomError, setRoomError] = useState('');
  const [myRooms, setMyRooms] = useState([]);
  const [exploreQuery, setExploreQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(FEATURED_SPOTS[0]);
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cravematch_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notifyFeedback, setNotifyFeedback] = useState('');

  const navigateTo = (nextPage) => {
    setError('');
    setRoomError('');
    setPrevPage(page);
    setPage(nextPage);
    if (nextPage !== 'room') {
      setActiveRoom(null);
    }
  };

  const loadUserRooms = useCallback(async () => {
    if (!currentUser) return;
    try {
      const rooms = await fetchUserRooms(currentUser);
      setMyRooms(rooms);
    } catch {
      setMyRooms([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserRooms();
    }
  }, [currentUser, page, activeRoom, loadUserRooms]);

  const handleSaveHistory = (entry) => {
    setHistoryItems((prev) => {
      const filtered = prev.filter(
        (item) => !(item.lobbyCode === entry.lobbyCode && item.restaurantName === entry.restaurantName)
      );
      const updated = [entry, ...filtered];
      localStorage.setItem('cravematch_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleNotification = (index) => {
    setHistoryItems((prev) => {
      const updated = prev.map((item, idx) =>
        idx === index ? { ...item, reminderSet: !item.reminderSet } : item
      );
      localStorage.setItem('cravematch_history', JSON.stringify(updated));
      return updated;
    });
    setNotifyFeedback('Dining reminder updated!');
    setTimeout(() => setNotifyFeedback(''), 2500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email address and password.');
      return;
    }

    setAuthLoading(true);
    try {
      const userData = await loginUser(email.trim(), password);
      setCurrentUser({
        name: userData.name || email.split('@')[0],
        email: userData.email || email.trim(),
      });
      setPage('home');
    } catch (err) {
      // Fallback if backend user isn't registered yet during local testing
      if (err.message?.includes('Failed to fetch')) {
        setError('Cannot reach the server. Make sure node server.js is running.');
      } else {
        setError(err.message || 'Invalid email or password.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in your full name, email address, and password.');
      return;
    }

    setAuthLoading(true);
    try {
      const userData = await signupUser(name.trim(), email.trim(), password);
      setCurrentUser({
        name: userData.name || name.trim(),
        email: userData.email || email.trim(),
      });
      setPage('home');
    } catch (err) {
      if (err.message?.includes('Failed to fetch')) {
        setError('Cannot reach the server. Make sure node server.js is running.');
      } else {
        setError(err.message || 'Could not create account.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRoom(null);
    setMyRooms([]);
    setPage('welcome');
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
    } catch {
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
    } catch {
      setRoomError('Cannot reach the server. Make sure node server.js is running.');
    }
  };
// ==================== SHARED TOP & BOTTOM BARS ====================
  const renderTopNav = () => (
    <header className="top-nav">
      <button
        type="button"
        className="brand-logo-btn"
        onClick={() => navigateTo(currentUser ? 'home' : 'welcome')}
      >
        <span className="brand-badge">
          <Utensils size={20} />
        </span>
        <span className="brand-script">
          Crave<span>Match</span>
        </span>
      </button>

      {currentUser ? (
        <nav className="nav-links">
          <button
            type="button"
            className={`nav-link-btn ${page === 'explore' ? 'active' : ''}`}
            onClick={() => navigateTo('explore')}
          >
            EXPLORE
          </button>
          <button
            type="button"
            className={`nav-link-btn ${page === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            HOME
          </button>
          <button
            type="button"
            className={`nav-link-btn ${page === 'lobbies' ? 'active' : ''}`}
            onClick={() => navigateTo('lobbies')}
          >
            LOBBY
          </button>
          <button
            type="button"
            className={`nav-link-btn ${page === 'history' ? 'active' : ''}`}
            onClick={() => navigateTo('history')}
          >
            RESTAURANT HISTORY
          </button>
        </nav>
      ) : (
        <nav className="nav-links">
          <button
            type="button"
            className={`nav-link-btn ${page === 'about' ? 'active' : ''}`}
            onClick={() => navigateTo('about')}
          >
            ABOUT US
          </button>
          <button
            type="button"
            className={`nav-link-btn ${page === 'services' ? 'active' : ''}`}
            onClick={() => navigateTo('services')}
          >
            SERVICES
          </button>
          <button
            type="button"
            className={`nav-link-btn ${page === 'settings' ? 'active' : ''}`}
            onClick={() => navigateTo('settings')}
          >
            SETTINGS
          </button>
        </nav>
      )}
    </header>
  );

  const renderBottomNav = () => (
    <footer className="bottom-nav">
      <div className="bottom-nav-group">
        <button
          type="button"
          className={`nav-link-btn ${page === 'about' ? 'active' : ''}`}
          onClick={() => navigateTo('about')}
        >
          ABOUT US
        </button>
        <button
          type="button"
          className={`nav-link-btn ${page === 'services' ? 'active' : ''}`}
          onClick={() => navigateTo('services')}
        >
          SERVICES
        </button>
        <button
          type="button"
          className={`nav-link-btn ${page === 'settings' ? 'active' : ''}`}
          onClick={() => navigateTo('settings')}
        >
          SETTINGS
        </button>
      </div>

      {currentUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
            Signed in as <strong style={{ color: '#0f172a' }}>{currentUser.name}</strong>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="back-btn"
            style={{ borderColor: '#fecaca', color: '#dc2626', background: '#fef2f2' }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      )}
    </footer>
  );
// ==================== ACTIVE ROOM LOBBY / SWIPER / RESULTS / ANALYTICS ====================
  if (currentUser && activeRoom) {
    return (
      <div className="app-shell">
        {renderTopNav()}
        <RoomLobby
          roomCode={activeRoom}
          currentUser={currentUser}
          onLeaveRoom={() => {
            setActiveRoom(null);
            setPage('home');
          }}
          onNavigate={navigateTo}
          onSaveHistory={handleSaveHistory}
        />
        {renderBottomNav()}
      </div>
    );
  }
// ==================== LOGGED-IN PAGES ====================
  if (currentUser) {
    const hostedLobbies = myRooms.filter(
      (r) =>
        r.host?.toLowerCase() === currentUser.name?.toLowerCase() ||
        r.members?.some(
          (m) => m.isHost && m.email?.toLowerCase() === currentUser.email?.toLowerCase()
        )
    );
    const joinedLobbies = myRooms.filter((r) => !hostedLobbies.some((h) => h.code === r.code));

    return (
      <div className="app-shell">
        {renderTopNav()}

        {roomError && (
          <div style={{ maxWidth: '1120px', width: '100%', margin: '1rem auto 0', padding: '0 1.5rem' }}>
            <div className="error-banner">{roomError}</div>
          </div>
        )}

        {page === 'home' && (
          <HomeMenu
            user={currentUser}
            featuredSpots={FEATURED_SPOTS}
            onCreateSession={handleCreateSession}
            onJoinSession={handleJoinSession}
            onOpenExplore={(spot) => {
              if (spot) setSelectedSpot(spot);
              navigateTo('explore');
            }}
            onOpenLobbies={() => navigateTo('lobbies')}
          />
        )}

        {page === 'explore' && (
          <main className="page-container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                gap: '1.75rem',
                alignItems: 'start',
              }}
            >
              {/* Left Featured Sidebar */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#0f172a',
                  }}
                >
                  FEATURED
                </h3>
                {FEATURED_SPOTS.map((spot) => (
                  <div
                    key={spot.id}
                    className="featured-card"
                    style={{
                      outline: selectedSpot?.id === spot.id ? '3px solid #f97316' : 'none',
                    }}
                    onClick={() => setSelectedSpot(spot)}
                  >
                    <img src={spot.image} alt={spot.name} />
                    <div className="featured-overlay">
                      <h4>{spot.name}</h4>
                      <span>{spot.priceRange}</span>
                    </div>
                  </div>
                ))}
              </aside>

              {/* Right Explore Map & Search */}
              <section className="cm-card" style={{ padding: '1.75rem' }}>
                <h1 className="page-title" style={{ marginBottom: '1.25rem' }}>
                  EXPLORE
                </h1>

                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                      }}
                    />
                    <input
                      type="text"
                      className="cm-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Search restaurants in Digos City or Davao City..."
                      value={exploreQuery}
                      onChange={(e) => setExploreQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="cm-btn-orange"
                    onClick={() => {
                      const match = FEATURED_SPOTS.find((s) =>
                        s.name.toLowerCase().includes(exploreQuery.toLowerCase())
                      );
                      if (match) setSelectedSpot(match);
                    }}
                  >
                    Search
                  </button>
                </div>

                {/* Interactive Map Frame (Digos City / Davao Gulf) */}
                <div
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1.5px solid #fed7aa',
                    background: '#fffaf5',
                  }}
                >
                  <iframe
                    title="Digos and Davao Restaurants Map"
                    width="100%"
                    height="330"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=125.30%2C6.70%2C125.68%2C7.12&layer=mapnik&marker=6.7497%2C125.3572`}
                  />
                </div>

                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#64748b',
                    marginTop: '0.75rem',
                  }}
                >
                  (Google Maps / OpenStreetMap view showing restaurants around Digos City &amp; Davao)
                </p>

                {selectedSpot && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '1.1rem 1.25rem',
                      borderRadius: '14px',
                      background: '#fff7ed',
                      border: '1px solid #fed7aa',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                        {selectedSpot.name}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: '#475569', marginTop: '0.2rem' }}>
                        <MapPin size={14} style={{ verticalAlign: 'middle', color: '#f97316' }} />{' '}
                        {selectedSpot.location} &bull; <strong>{selectedSpot.priceRange}</strong>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.35rem' }}>
                        {selectedSpot.about}
                      </p>
                    </div>
                    <button type="button" className="cm-btn-orange" onClick={handleCreateSession}>
                      Start Lobby for Here
                    </button>
                  </div>
                )}
              </section>
            </div>
          </main>
        )}

        {page === 'lobbies' && (
          <main className="page-container">
            <div style={{ marginBottom: '1rem' }}>
              <button type="button" className="back-btn" onClick={() => navigateTo('home')}>
                <ArrowLeft size={15} /> BACK
              </button>
            </div>

            <h1 className="page-title" style={{ marginBottom: '2rem' }}>
              LOBBY
            </h1>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* YOUR LOBBIES */}
              <div className="cm-card" style={{ padding: '1.75rem' }}>
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    marginBottom: '1.25rem',
                    color: '#0f172a',
                  }}
                >
                  YOUR LOBBIES ({hostedLobbies.length})
                </h2>

                {hostedLobbies.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    You haven&apos;t created a lobby yet. Click &ldquo;Start a Room Lobby&rdquo; on
                    Home!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {hostedLobbies.map((room) => (
                      <div
                        key={room.code}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.9rem 1.1rem',
                          borderRadius: '12px',
                          background: '#fffaf5',
                          border: '1.5px solid #fed7aa',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em' }}>
                            {room.code}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            <Users size={13} style={{ verticalAlign: 'middle' }} />{' '}
                            {room.members?.length || 1} member(s)
                          </div>
                        </div>
                        <button
                          type="button"
                          className="cm-btn-orange"
                          style={{ height: '38px', padding: '0 1.1rem' }}
                          onClick={() => handleJoinSession(room.code)}
                        >
                          REJOIN
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* JOINED LOBBIES */}
              <div className="cm-card" style={{ padding: '1.75rem' }}>
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    marginBottom: '1.25rem',
                    color: '#0f172a',
                  }}
                >
                  JOINED LOBBIES ({joinedLobbies.length})
                </h2>

                {joinedLobbies.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    No joined lobbies yet. Enter an invite code on the Home page to join friends!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {joinedLobbies.map((room) => (
                      <div
                        key={room.code}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.9rem 1.1rem',
                          borderRadius: '12px',
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em' }}>
                            {room.code}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Host: <strong>{room.host}</strong> &bull; {room.members?.length || 1}{' '}
                            member(s)
                          </div>
                        </div>
                        <button
                          type="button"
                          className="cm-btn-dark"
                          style={{ height: '38px', padding: '0 1.1rem' }}
                          onClick={() => handleJoinSession(room.code)}
                        >
                          REJOIN
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
{page === 'history' && (
          <main className="page-container">
            <h1 className="page-title" style={{ marginBottom: '0.4rem' }}>
              RESTAURANT HISTORY
            </h1>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
              Winning group dining matches &amp; scheduled meetups
            </p>

            {notifyFeedback && (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#059669',
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                }}
              >
                {notifyFeedback}
              </div>
            )}

            {historyItems.length === 0 ? (
              <div className="cm-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  No completed group matches yet. Start a lobby and finish rating 10 spots to log
                  your group&apos;s top restaurant!
                </p>
                <button type="button" className="cm-btn-orange" onClick={handleCreateSession}>
                  Start a Room Lobby
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {historyItems.map((item, idx) => (
                  <div
                    key={`${item.lobbyCode}-${idx}`}
                    className="cm-card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt={item.restaurantName}
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '1px solid #fed7aa',
                        }}
/>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                          {item.restaurantName}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#f97316', fontWeight: 700 }}>
                          Lobby: {item.lobbyCode} &bull; {item.matchScore}% Match
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                          <Calendar size={13} style={{ verticalAlign: 'middle' }} /> Schedule:{' '}
                          {item.schedule || 'Flexible / Set in Lobby'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={item.reminderSet ? 'cm-btn-orange' : 'cm-btn-outline'}
                      onClick={() => handleToggleNotification(idx)}
                    >
                      <Bell size={16} />
                      {item.reminderSet ? 'Notification Active' : 'Add Notification +'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {(page === 'about' || page === 'services' || page === 'settings') &&
          renderInfoPages(page, currentUser, () => navigateTo('home'))}

        {renderBottomNav()}
      </div>
    );
  }
// ==================== PUBLIC PAGES (WELCOME, LOGIN, REGISTER, INFO) ====================
  return (
    <div className="app-shell">
      {renderTopNav()}

      {page === 'welcome' && (
        <main className="page-container">
          <div className="welcome-grid">
            <div className="welcome-copy">
              <h1>
                Stop the Group Chat Debate: <span>Find Where Everyone Actually Wants to Eat</span>
              </h1>
              <p>
                CraveMatch takes the back-and-forth out of deciding where to eat with friends,
                family, or coworkers. Instead of endless group chat debates, you create a private
                dining room, and let everyone set their personal budget limit and food allergies or
                restrictions upfront.
              </p>
              <div className="welcome-cta-row">
                <button
                  type="button"
                  className="cm-btn-orange"
                  style={{ minWidth: '150px' }}
                  onClick={() => navigateTo('login')}
                >
                  Login <ArrowRight size={17} />
                </button>
                <button
                  type="button"
                  className="cm-btn-outline"
                  style={{ minWidth: '150px' }}
                  onClick={() => navigateTo('register')}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="welcome-collage">
              <div className="collage-card tall">
                <img
                  className="collage-img"
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80"
                  alt="Friends dining together"
                />
              </div>
              <div className="collage-card">
                <img
                  className="collage-img"
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
                  alt="Group pizza night"
                />
              </div>
              <div className="collage-card">
                <img
                  className="collage-img"
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80"
                  alt="Shared group meal"
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {page === 'login' && (
        <main className="page-container">
          <div className="cm-card auth-page-card">
            <button type="button" className="back-btn" onClick={() => navigateTo('welcome')}>
              <ArrowLeft size={15} /> BACK
            </button>

            <h1 className="page-title" style={{ marginTop: '0.75rem' }}>
              LOGIN
            </h1>

            <form onSubmit={handleLoginSubmit}>
              <div className="auth-two-col">
                <div>
                  <label className="field-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="cm-input"
                    placeholder="youremail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">PASSWORD</label>
                  <input
                    type="password"
                    className="cm-input"
                    placeholder="your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="error-banner">{error}</div>}

              <div style={{ maxWidth: '340px', margin: '0 auto' }}>
                <button
                  type="submit"
                  className="cm-btn-orange"
                  style={{ width: '100%' }}
                  disabled={authLoading}
                >
                  {authLoading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {page === 'register' && (
        <main className="page-container">
          <div className="cm-card auth-page-card">
            <button type="button" className="back-btn" onClick={() => navigateTo('welcome')}>
              <ArrowLeft size={15} /> BACK
            </button>

            <h1 className="page-title" style={{ marginTop: '0.75rem' }}>
              REGISTER
            </h1>

            <form onSubmit={handleRegisterSubmit}>
              <div className="auth-two-col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label className="field-label">FULL NAME:</label>
                    <input
                      type="text"
                      className="cm-input"
                      placeholder="your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      className="cm-input"
                      placeholder="youremail@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">PASSWORD</label>
                  <input
                    type="password"
                    className="cm-input"
                    placeholder="your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="error-banner">{error}</div>}

              <div style={{ maxWidth: '340px', margin: '0 auto' }}>
                <button
                  type="submit"
                  className="cm-btn-orange"
                  style={{ width: '100%' }}
                  disabled={authLoading}
                >
                  {authLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {(page === 'about' || page === 'services' || page === 'settings') &&
        renderInfoPages(page, currentUser, () => navigateTo(prevPage || 'welcome'))}

      {renderBottomNav()}
    </div>
  );
}

function renderInfoPages(page, currentUser, onBack) {
  return (
    <main className="page-container">
      <div className="cm-card" style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem' }}>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeft size={15} /> BACK
        </button>

        {page === 'about' && (
          <div style={{ marginTop: '1.25rem' }}>
            <h1 className="page-title" style={{ marginBottom: '1rem' }}>
              ABOUT US
            </h1>
            <p style={{ lineHeight: 1.7, color: '#334155', marginBottom: '1rem' }}>
              <strong>CraveMatch</strong> is a collaborative group dining preference matcher built
              to eliminate decision fatigue when eating out with friends, classmates, coworkers, or
              family.
            </p>
            <p style={{ lineHeight: 1.7, color: '#334155' }}>
              By combining individual PHP budget caps, allergy filters, location preferences, and
              rapid 10-spot voting, CraveMatch finds restaurants that keep everyone at the table
              happy.
            </p>
          </div>
        )}

        {page === 'services' && (
          <div style={{ marginTop: '1.25rem' }}>
            <h1 className="page-title" style={{ marginBottom: '1.25rem' }}>
              SERVICES
            </h1>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#fff7ed' }}>
                <strong>
                  <Users size={16} style={{ verticalAlign: 'middle', color: '#f97316' }} /> Private
                  Group Dining Lobbies
                </strong>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>
                  Create 6-character invite rooms, set voting deadlines, and collect budgets &amp;
                  allergies in real time.
                </p>
              </div>
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#fff7ed' }}>
                <strong>
                  <Sparkles size={16} style={{ verticalAlign: 'middle', color: '#f97316' }} /> Smart
                  10-Spot Rate &amp; Match Engine
                </strong>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>
                  Swipe Yes or No on curated local spots in Digos City &amp; Davao City and view
                  ranked match percentages.
                </p>
              </div>
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#fff7ed' }}>
                <strong>
                  <CheckCircle2 size={16} style={{ verticalAlign: 'middle', color: '#f97316' }} />{' '}
                  Prematch &amp; Postmatch Group Analytics
                </strong>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>
                  Visualize group compatibility, allergen overlap, and budget ranges before and
                  after voting.
                </p>
              </div>
            </div>
          </div>
        )}

        {page === 'settings' && (
          <div style={{ marginTop: '1.25rem' }}>
            <h1 className="page-title" style={{ marginBottom: '1.25rem' }}>
              SETTINGS
            </h1>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: '480px', margin: '0 auto' }}>
              <div>
                <label className="field-label">DEFAULT CURRENCY</label>
                <input type="text" className="cm-input" value="PHP (₱) - Philippine Peso" readOnly />
              </div>
              <div>
                <label className="field-label">DEFAULT REGION</label>
                <input
                  type="text"
                  className="cm-input"
                  defaultValue="Digos City / Davao Region, Philippines"
                />
              </div>
              {currentUser && (
                <div
                  style={{
                    padding: '0.9rem',
                    borderRadius: '10px',
                    background: '#fffaf5',
                    border: '1px solid #fed7aa',
                    fontSize: '0.88rem',
                    color: '#334155',
                  }}
                >
                  <ShieldCheck size={16} style={{ verticalAlign: 'middle', color: '#f97316' }} />{' '}
                  Logged in as <strong>{currentUser.name}</strong> ({currentUser.email})
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;