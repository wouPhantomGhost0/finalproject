import { useState } from 'react';
import { Plus, ArrowRight, Flame, Sparkles, FolderOpen } from 'lucide-react';
import './HomeMenu.css';

export default function HomeMenu({
  user,
  featuredSpots = [],
  onCreateSession,
  onJoinSession,
  onOpenExplore,
  onOpenLobbies,
}) {
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      onJoinSession(roomCode.trim().toUpperCase());
    }
  };

  const featuredList = featuredSpots.filter((s) => s.tag === 'FEATURED');
  const trendingSpot = featuredSpots.find((s) => s.tag === 'TRENDING');

  return (
    <main className="home-page">
      <div className="home-header-row">
        <h1 className="page-title">HOME</h1>
        <p>
          Welcome back, <strong>{user?.name || 'Foodie'}</strong> — create a new dining lobby or
          enter an invite code to match.
        </p>
      </div>

      {/* Primary Action Grid */}
      <section className="home-actions-grid">
        {/* Left: Start a Room Lobby */}
        <div className="home-action-box highlight">
          <div>
            <h2 className="home-action-title">START A ROOM LOBBY</h2>
            <p className="home-action-sub">
              Create a new session, invite friends, set your PHP budget &amp; allergies, and start
              matching spots.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="cm-btn-orange"
              style={{ flex: 1, minWidth: '185px', height: '46px' }}
              onClick={onCreateSession}
            >
              <Plus size={18} />
              create a new session
            </button>

            <button
              type="button"
              className="cm-btn-outline"
              style={{ height: '46px' }}
              onClick={onOpenLobbies}
            >
              <FolderOpen size={17} />
              My Lobbies
            </button>
          </div>
        </div>

        {/* Right: Join With a Code */}
        <div className="home-action-box">
          <div>
            <h2 className="home-action-title">JOIN WITH A CODE</h2>
            <p className="home-action-sub">
              Got a 6-character lobby code from your group host? Enter it below to jump in.
            </p>
          </div>

          <form onSubmit={handleJoin} className="home-join-row">
            <input
              type="text"
              className="home-code-input"
              placeholder="ex. 123ABC"
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button type="submit" className="cm-btn-dark" style={{ height: '46px' }}>
              JOIN <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Featured & Trending Showcase */}
      <section className="showcase-grid">
        {/* Left: FEATURED */}
        <div>
          <div className="showcase-section-label">
            <Sparkles size={16} color="#f97316" />
            FEATURED
          </div>
          <div className="featured-pair">
            {featuredList.map((spot) => (
              <div
                key={spot.id}
                className="spot-tile"
                onClick={() => onOpenExplore && onOpenExplore(spot)}
              >
                <img src={spot.image} alt={spot.name} />
                <div className="spot-tile-overlay">
                  <span className="spot-tile-badge">FEATURED</span>
                  <h3>{spot.name}</h3>
                  <p>{spot.priceRange}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: TRENDING */}
        <div>
          <div className="showcase-section-label">
            <Flame size={16} color="#f97316" />
            TRENDING
          </div>
          {trendingSpot && (
            <div
              className="spot-tile"
              style={{ height: 'calc(100% - 28px)' }}
              onClick={() => onOpenExplore && onOpenExplore(trendingSpot)}
            >
              <img src={trendingSpot.image} alt={trendingSpot.name} />
              <div className="spot-tile-overlay">
                <span className="spot-tile-badge">TRENDING</span>
                <h3>{trendingSpot.name}</h3>
                <p>{trendingSpot.priceRange}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}