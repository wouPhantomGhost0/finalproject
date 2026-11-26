import { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  UserPlus,
  Plus,
  X,
  LogOut,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

const QUICK_RESTRICTIONS = ['Peanuts', 'Shellfish', 'Dairy', 'Eggs', 'Pork', 'Gluten', 'Spicy'];

const sharedInputStyle = {
  width: '100%',
  height: '42px',
  padding: '0 0.85rem',
  borderRadius: '10px',
  border: '1.5px solid #e2e8f0',
  fontSize: '0.9rem',
  color: '#0f172a',
  background: '#ffffff',
  outline: 'none',
};

function RoomLobby({ roomCode, currentUser, onLeaveRoom }) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lobbyError, setLobbyError] = useState('');

  const [copied, setCopied] = useState(false);

  const [inviteInput, setInviteInput] = useState('');
  const [inviting, setInviting] = useState(false);

  const [budget, setBudget] = useState('');
  const [cannotEat, setCannotEat] = useState([]);
  const [foodInput, setFoodInput] = useState('');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const [leaving, setLeaving] = useState(false);

  const initializedPrefs = useRef(false);

  const fetchRoom = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomCode}`);
      const data = await response.json();

      if (response.ok) {
        setRoom(data);
        setLobbyError('');

        if (!initializedPrefs.current && data.members) {
          const me = data.members.find(
            (m) =>
              (currentUser.email && m.email.toLowerCase() === currentUser.email.toLowerCase()) ||
              m.name.toLowerCase() === currentUser.name.toLowerCase()
          );
          if (me) {
            setBudget(me.budget || '');
            setCannotEat(me.cannotEat || []);
            initializedPrefs.current = true;
          }
        }
      } else {
        setLobbyError(data.message || 'Could not load room.');
      }
    } catch (err) {
      setLobbyError('Lost connection to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
    const interval = setInterval(fetchRoom, 3000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePermanentLeave = async () => {
    setLeaving(true);
    setLobbyError('');
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomCode}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        onLeaveRoom();
      } else {
        setLobbyError(data.message || 'Could not leave room.');
      }
    } catch (err) {
      setLobbyError('Server error leaving room.');
    } finally {
      setLeaving(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const trimmed = inviteInput.trim();
    if (!trimmed) return;

    setInviting(true);
    setLobbyError('');
    try {
      const isEmail = trimmed.includes('@');
      const response = await fetch(`http://localhost:5000/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEmail ? { email: trimmed } : { name: trimmed }),
      });
      const data = await response.json();

      if (response.ok) {
        setRoom(data);
        setInviteInput('');
      } else {
        setLobbyError(data.message || 'Could not add member.');
      }
    } catch (err) {
      setLobbyError('Server error adding member.');
    } finally {
      setInviting(false);
    }
  };

  const addRestriction = (item) => {
    const cleaned = item.trim();
    if (!cleaned) return;
    const alreadyAdded = cannotEat.some(
      (existing) => existing.toLowerCase() === cleaned.toLowerCase()
    );
    if (!alreadyAdded) {
      setCannotEat([...cannotEat, cleaned]);
      setPrefsSaved(false);
    }
    setFoodInput('');
  };

  const removeRestriction = (itemToRemove) => {
    setCannotEat(cannotEat.filter((item) => item !== itemToRemove));
    setPrefsSaved(false);
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    setLobbyError('');

    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomCode}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
          budget: budget.trim(),
          cannotEat,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setRoom(data);
        setPrefsSaved(true);
        setTimeout(() => setPrefsSaved(false), 2500);
      } else {
        setLobbyError(data.message || 'Could not save preferences.');
      }
    } catch (err) {
      setLobbyError('Server error saving preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  const isHost =
    room?.members?.some(
      (m) =>
        m.isHost &&
        ((currentUser.email && m.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          m.name.toLowerCase() === currentUser.name.toLowerCase())
    ) || room?.host?.toLowerCase() === currentUser.name.toLowerCase();

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading room lobby...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '2rem 1.5rem 3rem',
      }}
    >
      {/* Top Room Code Banner */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#f97316',
            }}
          >
            Group Session Lobby
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#0f172a',
              }}
            >
              {roomCode}
            </h2>
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                height: '34px',
                padding: '0 0.85rem',
                borderRadius: '10px',
                border: copied ? '1.5px solid #a7f3d0' : '1.5px solid #e2e8f0',
                background: copied ? '#ecfdf5' : '#f8fafc',
                color: copied ? '#059669' : '#334155',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.88rem', color: '#64748b' }}>
            Share this code so friends or family can search and join from their device
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onLeaveRoom}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              height: '40px',
              padding: '0 0.95rem',
              borderRadius: '10px',
              border: '1.5px solid #e2e8f0',
              background: '#f8fafc',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <button
            type="button"
            onClick={handlePermanentLeave}
            disabled={leaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              height: '40px',
              padding: '0 0.95rem',
              borderRadius: '10px',
              border: '1.5px solid #fecaca',
              background: '#fef2f2',
              color: '#dc2626',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            {leaving ? 'Leaving...' : 'Leave Permanently'}
          </button>
        </div>
      </div>

      {lobbyError && (
        <p
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '1.25rem',
          }}
        >
          {lobbyError}
        </p>
      )}

      {/* Main Two-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* LEFT COLUMN: Members and Host Invite */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
          }}
        >
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Group Members ({room?.members?.length || 0})
          </h3>

          {/* Host Add Member Form */}
          {isHost && (
            <form onSubmit={handleAddMember} style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#475569',
                  marginBottom: '0.4rem',
                }}
              >
                Add Friends or Family by Username or Email
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="e.g. John or john@email.com"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  style={{ ...sharedInputStyle, flex: 1, minWidth: 0 }}
                />
                <button
                  type="submit"
                  disabled={inviting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    height: '42px',
                    padding: '0 0.95rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  <UserPlus size={16} />
                  Add
                </button>
              </div>
            </form>
          )}

          {/* Live Member Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {room?.members?.map((member, index) => {
              const isMe =
                (currentUser.email &&
                  member.email.toLowerCase() === currentUser.email.toLowerCase()) ||
                member.name.toLowerCase() === currentUser.name.toLowerCase();

              return (
                <div
                  key={`${member.name}-${index}`}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '12px',
                    border: isMe ? '1.5px solid #fdba74' : '1.5px solid #e2e8f0',
                    background: isMe ? '#fff7ed' : '#f8fafc',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          background: '#f97316',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          {member.name} {isMe && <span style={{ color: '#f97316' }}>(You)</span>}
                        </div>
                        {member.email && (
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{member.email}</div>
                        )}
                      </div>
                    </div>

                    {member.isHost && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.22rem 0.6rem',
                          borderRadius: '8px',
                          background: '#fef3c7',
                          color: '#b45309',
                        }}
                      >
                        Host
                      </span>
                    )}
                  </div>

                  {/* Member's Budget & Cannot-Eat Summary */}
                  <div
                    style={{
                      marginTop: '0.65rem',
                      paddingTop: '0.6rem',
                      borderTop: '1px dashed #cbd5e1',
                      fontSize: '0.82rem',
                      color: '#475569',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div>
                      <strong>Budget:</strong>{' '}
                      {member.budget ? (
                        <span style={{ color: '#059669', fontWeight: 600 }}>{member.budget}</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Not set yet</span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <strong>Cannot eat:</strong>
                      {member.cannotEat && member.cannotEat.length > 0 ? (
                        member.cannotEat.map((food) => (
                          <span
                            key={food}
                            style={{
                              background: '#fee2e2',
                              color: '#b91c1c',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                            }}
                          >
                            {food}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#94a3b8' }}>None listed</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Current user's budget and cannot eat preferences */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <form onSubmit={handleSavePreferences}>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              Your Dining Preferences
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.86rem', lineHeight: 1.45, color: '#64748b' }}>
              Set your own budget and foods to avoid. Your recommendations will be tailored to these
              rules before the group votes!
            </p>

            {/* Budget Limit Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '0.45rem',
                }}
              >
                My Budget Limit
              </label>
              <input
                type="text"
                placeholder="e.g. ₱320 or ₱350"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  setPrefsSaved(false);
                }}
                style={sharedInputStyle}
              />
            </div>

            {/* Cannot Eat List Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '0.45rem',
                }}
              >
                Cannot Eat / Allergies
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <input
                  type="text"
                  placeholder="Type an ingredient (e.g. shrimp)"
                  value={foodInput}
                  onChange={(e) => setFoodInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRestriction(foodInput);
                    }
                  }}
                  style={{ ...sharedInputStyle, flex: 1, minWidth: 0 }}
                />
                <button
                  type="button"
                  onClick={() => addRestriction(foodInput)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    height: '42px',
                    padding: '0 0.9rem',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {/* Quick Tap Common Restrictions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                {QUICK_RESTRICTIONS.map((item) => {
                  const active = cannotEat.some(
                    (existing) => existing.toLowerCase() === item.toLowerCase()
                  );
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => (active ? removeRestriction(item) : addRestriction(item))}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        height: '28px',
                        padding: '0 0.65rem',
                        borderRadius: '8px',
                        border: active ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0',
                        background: active ? '#fef2f2' : '#ffffff',
                        color: active ? '#dc2626' : '#64748b',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {active ? <Check size={12} /> : <Plus size={12} />}
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Selected Cannot-Eat Pills */}
              <div
                style={{
                  minHeight: '44px',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1.5px dashed #cbd5e1',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  alignItems: 'center',
                }}
              >
                {cannotEat.length === 0 ? (
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    No restrictions added yet.
                  </span>
                ) : (
                  cannotEat.map((item) => (
                    <span
                      key={item}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.22rem 0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeRestriction(item)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#b91c1c',
                          padding: 0,
                          display: 'flex',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPrefs}
              className="submit-btn"
              style={{
                width: '100%',
                background: prefsSaved ? '#059669' : undefined,
              }}
            >
              {savingPrefs
                ? 'Saving...'
                : prefsSaved
                ? 'Saved to Lobby!'
                : 'Save My Preferences'}
            </button>
          </form>

          {/* Future Phase Placeholder Banner */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#64748b',
            }}
          >
            <Sparkles size={16} color="#f97316" style={{ flexShrink: 0 }} />
            <span>
              Next step (coming soon): AI + Google Places restaurant recommendations &amp; group
              Yes/No voting.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomLobby;