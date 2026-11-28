import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users,
  Copy,
  Check,
  UserPlus,
  Wallet,
  Ban,
  Plus,
  X,
  LogOut,
  Crown,
  ArrowLeft,
  Heart,
  MapPin,
  BarChart3,
  Clock,
  Edit3,
  Trash2,
  Play,
  Sparkles,
} from 'lucide-react';

const QUICK_RESTRICTIONS = ['Pork', 'Shellfish', 'Gluten', 'Peanuts', 'Dairy', 'Eggs', 'Spicy'];

const DINING_SPOTS = [
  {
    id: 'mixed-temptation',
    name: 'Mixed Temptation Chinese Restaurant, Davao City',
    shortName: 'Mixed Temptation Chinese Restaurant',
    location: 'Roxas Ave / Downtown, Davao City',
    distance: '3.4 km away',
    priceRange: '₱280 – ₱550',
    minPrice: 280,
    maxPrice: 550,
    cuisine: 'Chinese & Dimsum',
    allergens: ['Shellfish', 'Gluten', 'Peanuts'],
    about: 'Authentic Cantonese dishes, dimsum baskets, and family-style platters great for group sharing.',
    image:
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'american-backyard',
    name: 'The American Backyard, Digos City',
    shortName: 'The American Backyard',
    location: 'Rizal Avenue, Digos City',
    distance: '1.1 km away',
    priceRange: '₱250 – ₱480',
    minPrice: 250,
    maxPrice: 480,
    cuisine: 'American Grill & Burgers',
    allergens: ['Dairy', 'Gluten', 'Pork'],
    about: 'Wood-accented grill house known for smoky ribs, handcrafted burgers, and loaded fries.',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'baybayin',
    name: 'Baybayin',
    shortName: 'Baybayin',
    location: 'Coastal Road / Digos City',
    distance: '2.3 km away',
    priceRange: '₱220 – ₱420',
    minPrice: 220,
    maxPrice: 420,
    cuisine: 'Modern Filipino',
    allergens: ['Shellfish'],
    about: 'Homegrown Filipino comfort dishes and local rice meals in a relaxed, breezy setting.',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'the-nook-digos',
    name: 'The Nook, Digos City',
    shortName: 'The Nook, Digos City',
    location: 'Quezon Avenue, Digos City',
    distance: '1.8 km away',
    priceRange: '₱200 – ₱390',
    minPrice: 200,
    maxPrice: 390,
    cuisine: 'Cafe & Comfort Food',
    allergens: ['Dairy', 'Gluten', 'Eggs'],
    about: 'Cozy neighborhood cafe serving pasta, rice bowls, iced coffee, and shareable snacks.',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'mcdo-digos',
    name: "McDonald's, Digos City Branch",
    shortName: "McDonald's, Digos City",
    location: 'Rizal Avenue, Digos City',
    distance: '1.2 km away',
    priceRange: '₱150 – ₱320',
    minPrice: 150,
    maxPrice: 320,
    cuisine: 'Fast Food',
    allergens: ['Gluten', 'Dairy'],
    about: 'Quick, budget-friendly chicken meals, burgers, and group bundles right in town.',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'davao-seafood-grill',
    name: 'Davao Bayfront Seafood & Grill',
    shortName: 'Davao Bayfront Grill',
    location: 'Times Beach, Davao City',
    distance: '4.6 km away',
    priceRange: '₱300 – ₱600',
    minPrice: 300,
    maxPrice: 600,
    cuisine: 'Seafood & BBQ',
    allergens: ['Shellfish'],
    about: 'Fresh grilled tuna panga, kinilaw, and seaside tables for big group dinners.',
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kanto-ramen',
    name: 'Kanto Ramen & Gyoza House',
    shortName: 'Kanto Ramen House',
    location: 'Luna Street, Digos City',
    distance: '1.5 km away',
    priceRange: '₱240 – ₱430',
    minPrice: 240,
    maxPrice: 430,
    cuisine: 'Japanese',
    allergens: ['Pork', 'Gluten', 'Eggs'],
    about: 'Rich tonkotsu and miso bowls with crispy pan-fried gyoza.',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'bricklane-pizza',
    name: 'Bricklane Woodfired Pizza & Pasta',
    shortName: 'Bricklane Woodfired Pizza',
    location: 'Obrero, Davao City',
    distance: '3.9 km away',
    priceRange: '₱260 – ₱500',
    minPrice: 260,
    maxPrice: 500,
    cuisine: 'Italian',
    allergens: ['Dairy', 'Gluten'],
    about: '14-inch hand-tossed pizzas and creamy baked pastas made for splitting with friends.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'greenleaf-bistro',
    name: 'Greenleaf Garden Bistro',
    shortName: 'Greenleaf Garden Bistro',
    location: 'Tres de Mayo, Digos City',
    distance: '2.0 km away',
    priceRange: '₱210 – ₱400',
    minPrice: 210,
    maxPrice: 400,
    cuisine: 'Healthy & Salads',
    allergens: ['Peanuts'],
    about: 'Fresh grain bowls, grilled chicken wraps, and allergen-conscious plates.',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'seoul-kitchen',
    name: 'Seoul Kitchen Samgyup & Bibimbap',
    shortName: 'Seoul Kitchen',
    location: 'Torres Street, Davao City',
    distance: '4.1 km away',
    priceRange: '₱299 – ₱549',
    minPrice: 299,
    maxPrice: 549,
    cuisine: 'Korean',
    allergens: ['Pork', 'Gluten', 'Spicy'],
    about: 'Unlimited Korean BBQ sets, sizzling bibimbap, and customizable side dishes.',
    image:
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=80',
  },
];

const matchesUser = (member, currentUser) => {
  if (!member || !currentUser) return false;
  const emailMatch =
    currentUser.email &&
    member.email &&
    member.email.toLowerCase() === currentUser.email.toLowerCase();
  const nameMatch =
    currentUser.name &&
    member.name &&
    member.name.toLowerCase() === currentUser.name.toLowerCase();
  return Boolean(emailMatch || nameMatch);
};

const parseBudgetNumber = (rawBudget) => {
  if (!rawBudget) return 350;
  const digits = String(rawBudget).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(digits);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 350;
};

function RoomLobby({ roomCode, currentUser, onLeaveRoom, onSaveHistory }) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lobbyError, setLobbyError] = useState('');

  // Views inside an active room: 'lobby' | 'rate' | 'results' | 'analytics'
  const [subView, setSubView] = useState('lobby');
  const [analyticsTab, setAnalyticsTab] = useState('prematch');

  const [copied, setCopied] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [inviting, setInviting] = useState(false);
  const [editMembersMode, setEditMembersMode] = useState(false);

  // Local room metadata (stored per room code so it works seamlessly with current backend)
  const [deadline, setDeadline] = useState(() => {
    return localStorage.getItem(`cm_deadline_${roomCode}`) || 'Today, 5:00 P.M. GMT+8';
  });
  const [locationPref, setLocationPref] = useState(() => {
    return localStorage.getItem(`cm_location_${roomCode}`) || 'Digos City';
  });

  // Member preferences
  const [budget, setBudget] = useState('');
  const [cannotEat, setCannotEat] = useState([]);
  const [foodInput, setFoodInput] = useState('');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Rate Spots (1/10 to 10/10) state
  const [spotIndex, setSpotIndex] = useState(0);
  const [votes, setVotes] = useState({}); // { [spotId]: 'yes' | 'no' }
  const [rankedResults, setRankedResults] = useState([]);

  const initializedPrefs = useRef(false);

  const fetchRoom = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomCode}`);
      const data = await response.json();

      if (response.ok) {
        setRoom(data);
        setLobbyError('');

        if (!initializedPrefs.current && Array.isArray(data.members)) {
          const me = data.members.find((m) => matchesUser(m, currentUser));
          if (me) {
            setBudget(me.budget || '');
            setCannotEat(me.cannotEat || []);
            initializedPrefs.current = true;
          }
        }
      } else {
        setLobbyError(data.message || 'Could not load room.');
      }
    } catch {
      setLobbyError('Lost connection to server.');
    } finally {
      setLoading(false);
    }
  }, [roomCode, currentUser]);

  useEffect(() => {
    initializedPrefs.current = false;
    setLoading(true);
    fetchRoom();
    const interval = setInterval(fetchRoom, 3500);
    return () => clearInterval(interval);
  }, [fetchRoom]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setLobbyError('Could not copy room code.');
    }
  };

  const handleDeadlineChange = (val) => {
    setDeadline(val);
    localStorage.setItem(`cm_deadline_${roomCode}`, val);
  };

  const handleLocationChange = (val) => {
    setLocationPref(val);
    localStorage.setItem(`cm_location_${roomCode}`, val);
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

      if (response.ok) {
        onLeaveRoom();
      } else {
        const data = await response.json();
        setLobbyError(data.message || 'Could not leave room.');
      }
    } catch {
      setLobbyError('Server error leaving room.');
    } finally {
      setLeaving(false);
    }
  };

const handleRemoveMember = async (member) => {
    try {
      const response = await fetch(`http://localhost:5000/api/rooms/${roomCode}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: member.name,
          email: member.email,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.deleted) setRoom(data);
      }
    } catch {
      setLobbyError('Could not remove member.');
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
    } catch {
      setLobbyError('Server error adding member.');
    } finally {
      setInviting(false);
    }
  };

  const addRestriction = (item) => {
    const cleaned = item.trim();
    if (!cleaned) return;
    const exists = cannotEat.some((x) => x.toLowerCase() === cleaned.toLowerCase());
    if (!exists) {
      setCannotEat([...cannotEat, cleaned]);
      setPrefsSaved(false);
    }
    setFoodInput('');
  };

  const removeRestriction = (itemToRemove) => {
    setCannotEat(cannotEat.filter((item) => item !== itemToRemove));
    setPrefsSaved(false);
  };

  const savePreferencesToBackend = async () => {
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
        return true;
      } else {
        setLobbyError(data.message || 'Could not save preferences.');
        return false;
      }
    } catch {
      setLobbyError('Server error saving preferences.');
      return false;
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSaveAndStartMatching = async (e) => {
    e.preventDefault();
    const ok = await savePreferencesToBackend();
    if (ok) {
      setSpotIndex(0);
      setVotes({});
      setSubView('rate');
    }
  };

const computeMatchResults = (finalVotes) => {
    const members = room?.members || [];
    const budgets = members.map((m) => parseBudgetNumber(m.budget));
    const avgBudget =
      budgets.length > 0 ? budgets.reduce((a, b) => a + b, 0) / budgets.length : 350;

    const allRestrictions = members.flatMap((m) => m.cannotEat || []).map((r) => r.toLowerCase());

    const scored = DINING_SPOTS.map((spot) => {
      let score = 62;

      // Vote bonus
      if (finalVotes[spot.id] === 'yes') score += 26;
      else score -= 12;

      // Budget alignment
      if (spot.minPrice <= avgBudget) score += 8;
      else score -= 6;

      // Location preference match
      if (
        locationPref &&
        spot.location.toLowerCase().includes(locationPref.trim().toLowerCase())
      ) {
        score += 5;
      }

      // Allergen penalty
      const conflictCount = spot.allergens.filter((a) =>
        allRestrictions.includes(a.toLowerCase())
      ).length;
      score -= conflictCount * 4;

      const clamped = Math.max(48, Math.min(98, Math.round(score)));
      return { ...spot, matchScore: clamped };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    setRankedResults(scored);

    if (scored[0] && onSaveHistory) {
      onSaveHistory({
        lobbyCode: roomCode,
        restaurantName: scored[0].shortName,
        matchScore: scored[0].matchScore,
        schedule: deadline,
        image: scored[0].image,
        reminderSet: false,
      });
    }
  };

const handleVoteSpot = (choice) => {
    const currentSpot = DINING_SPOTS[spotIndex];
    const updatedVotes = { ...votes, [currentSpot.id]: choice };
    setVotes(updatedVotes);

    if (spotIndex + 1 < DINING_SPOTS.length) {
      setSpotIndex(spotIndex + 1);
    } else {
      computeMatchResults(updatedVotes);
      setSubView('results');
    }
  };

  const isHost =
    room?.members?.some((m) => m.isHost && matchesUser(m, currentUser)) ||
    (room?.host &&
      currentUser?.name &&
      room.host.toLowerCase() === currentUser.name.toLowerCase());

  if (loading) {
    return (
      <main className="page-container" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="cm-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading {roomCode} lobby...</p>
        </div>
      </main>
    );
  }

  // ==================== SUBVIEW 2: RATE SPOTS (1/10 to 10/10) ====================
  if (subView === 'rate') {
    const spot = DINING_SPOTS[spotIndex];
    return (
      <main className="page-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <button type="button" className="back-btn" onClick={() => setSubView('lobby')}>
            <ArrowLeft size={15} /> BACK TO LOBBY
          </button>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#f97316',
              background: '#ffffff',
              padding: '0.4rem 0.9rem',
              borderRadius: '10px',
              border: '1.5px solid #fed7aa',
            }}
          >
            {spotIndex + 1} / {DINING_SPOTS.length}
          </span>
        </div>

        <h1 className="page-title" style={{ marginBottom: '1.75rem' }}>
          RATE SPOTS
        </h1>

        <div
          className="cm-card"
          style={{
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.75rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Restaurant Name */}
          <div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: '#f97316',
                marginBottom: '0.5rem',
              }}
            >
              {spot.cuisine}
            </span>
            <h2 style={{ fontSize: '1.65rem', lineHeight: 1.25, fontWeight: 800, color: '#0f172a' }}>
              {spot.name}
            </h2>
          </div>

          {/* Center: Restaurant Photo & YES / NO Controls */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid #fed7aa',
                height: '240px',
                marginBottom: '1.35rem',
              }}
            >
              <img
                src={spot.image}
                alt={spot.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
              <button
                type="button"
                onClick={() => handleVoteSpot('yes')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '50%',
                    background: '#f97316',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 18px rgba(249, 115, 22, 0.32)',
                  }}
                >
                  <Heart size={28} fill="#ffffff" />
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>YES</span>
              </button>

              <button
                type="button"
                onClick={() => handleVoteSpot('no')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    color: '#dc2626',
                    border: '2px solid #fecaca',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 14px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <X size={28} />
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>NO</span>
              </button>
            </div>
          </div>

          {/* Right: Information Panel */}
          <div
            style={{
              background: '#fffaf5',
              border: '1.5px solid #fed7aa',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#f97316',
              }}
            >
              Information
            </h3>
            <div style={{ fontSize: '0.9rem', color: '#334155' }}>
              <strong>Location:</strong> {spot.location}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#334155' }}>
              <strong>Distance:</strong> {spot.distance}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#334155' }}>
              <strong>Price Range:</strong>{' '}
              <span style={{ color: '#059669', fontWeight: 700 }}>{spot.priceRange}</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
              <strong>About:</strong> {spot.about}
            </div>
          </div>
        </div>
      </main>
    );
  }

// ==================== SUBVIEW 3: RESULTS PAGE (10/10) ====================
  if (subView === 'results') {
    const topMatches = rankedResults.slice(0, 5);
    return (
      <main className="page-container">
        <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#f97316',
              background: '#ffffff',
              padding: '0.35rem 0.85rem',
              borderRadius: '10px',
              border: '1.5px solid #fed7aa',
            }}
          >
            10 / 10
          </span>
        </div>

        <h1 className="page-title" style={{ marginBottom: '1.75rem' }}>
          RESULTS
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '860px',
            margin: '0 auto 2rem',
          }}
        >
          {topMatches.map((spot, idx) => (
            <div
              key={spot.id}
              className="cm-card"
              style={{
                display: 'grid',
                gridTemplateColumns: '64px 72px 1fr 125px',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.9rem 1.25rem',
                border: idx === 0 ? '2px solid #f97316' : '1.5px solid #fed7aa',
                background: idx === 0 ? '#fffaf5' : '#ffffff',
              }}
            >
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: idx === 0 ? '#f97316' : '#334155',
                  textAlign: 'center',
                }}
              >
                #{idx + 1}
              </div>

              <img
                src={spot.image}
                alt={spot.shortName}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '1px solid #fed7aa',
                }}
              />

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {spot.shortName}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {spot.location} &bull; {spot.priceRange}
                </div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  padding: '0.55rem',
                  borderRadius: '12px',
                  background: idx === 0 ? '#f97316' : '#fff7ed',
                  color: idx === 0 ? '#ffffff' : '#f97316',
                  fontWeight: 800,
                }}
              >
                <div style={{ fontSize: '1.2rem', lineHeight: 1.1 }}>{spot.matchScore}%</div>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>MATCH</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="cm-btn-orange"
            onClick={() => {
              setAnalyticsTab('postmatch');
              setSubView('analytics');
            }}
          >
            <BarChart3 size={18} /> GROUP ANALYTICS
          </button>

          <button type="button" className="cm-btn-outline" onClick={() => setSubView('lobby')}>
            <ArrowLeft size={17} /> RETURN TO LOBBY
          </button>
        </div>
      </main>
    );
  }

// ==================== SUBVIEW 4: GROUP ANALYTICS (PREMATCH & POSTMATCH) ====================
  if (subView === 'analytics') {
    const members = room?.members || [];
    const totalMembers = Math.max(1, members.length);

    // Aggregate restrictions
    const allergenKeys = ['Pork', 'Shellfish', 'Gluten', 'Peanuts'];
    const allergenCounts = allergenKeys.map((key) => {
      const count = members.filter((m) =>
        (m.cannotEat || []).some((r) => r.toLowerCase() === key.toLowerCase())
      ).length;
      return { label: key, count };
    });

    // Compatibility percentage based on budget spread & restriction overlap
    const budgets = members.map((m) => parseBudgetNumber(m.budget));
    const minB = budgets.length ? Math.min(...budgets) : 300;
    const maxB = budgets.length ? Math.max(...budgets) : 450;
    const spreadPenalty = Math.min(22, Math.round((maxB - minB) / 25));
    const compatibilityPct = Math.max(68, 95 - spreadPenalty);

    return (
      <main className="page-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <button type="button" className="back-btn" onClick={() => setSubView('lobby')}>
            <ArrowLeft size={15} /> RETURN TO LOBBY
          </button>

          <div
            style={{
              display: 'inline-flex',
              background: '#ffffff',
              padding: '4px',
              borderRadius: '12px',
              border: '1.5px solid #fed7aa',
            }}
          >
            <button
              type="button"
              onClick={() => setAnalyticsTab('prematch')}
              style={{
                padding: '0.5rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                background: analyticsTab === 'prematch' ? '#f97316' : 'transparent',
                color: analyticsTab === 'prematch' ? '#ffffff' : '#475569',
              }}
            >
              PREMATCH
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTab('postmatch')}
              style={{
                padding: '0.5rem 1.15rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                background: analyticsTab === 'postmatch' ? '#f97316' : 'transparent',
                color: analyticsTab === 'postmatch' ? '#ffffff' : '#475569',
              }}
            >
              POSTMATCH
            </button>
          </div>
        </div>

        <h1 className="page-title" style={{ marginBottom: '1.75rem' }}>
          GROUP ANALYTICS - {roomCode} LOBBY
        </h1>

        {analyticsTab === 'prematch' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Card 1: Group Compatibility Donut */}
            <div className="cm-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <h3
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  marginBottom: '1.25rem',
                }}
              >
                GROUP COMPATIBILITY
              </h3>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  background: `conic-gradient(#f97316 0% ${compatibilityPct}%, #10b981 ${compatibilityPct}% 100%)`,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '112px',
                    height: '112px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '1.85rem',
                    fontWeight: 900,
                    color: '#0f172a',
                  }}
                >
                  {compatibilityPct}%
                </div>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '1rem' }}>
                Based on {totalMembers} member(s) in {locationPref}
              </p>
            </div>

            {/* Card 2: Dietary Preferences & Allergens */}
            <div className="cm-card" style={{ padding: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  marginBottom: '1.25rem',
                }}
              >
                DIETARY PREFERENCES &amp; ALLERGENS
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.75rem',
                  alignItems: 'end',
                  height: '165px',
                  paddingTop: '1rem',
                }}
              >
                {allergenCounts.map((item) => {
                  const pct = Math.max(18, Math.round((item.count / totalMembers) * 100));
                  return (
                    <div
                      key={item.label}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: `${pct}%`,
                          background: item.count > 0 ? '#f97316' : '#fed7aa',
                          borderRadius: '8px 8px 0 0',
                          transition: 'height 0.3s',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#334155',
                          marginTop: '0.45rem',
                          textAlign: 'center',
                        }}
                      >
                        {item.count}/{totalMembers} avoid {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Budget Range Horizontal Bars */}
            <div className="cm-card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
              <h3
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  marginBottom: '1rem',
                }}
              >
                BUDGET RANGE (PHP)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {members.map((m, idx) => {
                  const val = parseBudgetNumber(m.budget);
                  const barWidth = Math.min(100, Math.max(20, Math.round((val / 650) * 100)));
                  return (
                    <div
                      key={`${m.name}-${idx}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr 85px',
                        alignItems: 'center',
                        gap: '0.85rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                        {m.name}
                      </span>
                      <div
                        style={{
                          height: '16px',
                          borderRadius: '999px',
                          background: '#fff7ed',
                          border: '1px solid #fed7aa',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${barWidth}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #f97316 0%, #10b981 100%)',
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#059669' }}>
                        ₱{val.toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* POSTMATCH ANALYTICS */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="cm-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '1rem' }}>
                INDIVIDUAL RATINGS BY MEMBERS CHART
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {members.map((m, idx) => {
                  const yesCount = Object.values(votes).filter((v) => v === 'yes').length || 6;
                  const pct = Math.min(100, Math.round((yesCount / DINING_SPOTS.length) * 100));
                  return (
                    <div key={`${m.name}-${idx}`}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          marginBottom: '0.25rem',
                        }}
                      >
                        <span>@{m.name}</span>
                        <span style={{ color: '#f97316' }}>
                          {yesCount}/{DINING_SPOTS.length} Approved
                        </span>
                      </div>
                      <div
                        style={{
                          height: '12px',
                          borderRadius: '999px',
                          background: '#f1f5f9',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: '#f97316',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cm-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '1rem' }}>
                CUISINE &amp; CRAVING BREAKDOWN CHART
              </h3>
              {[
                { label: 'Chinese & Asian', pct: 94 },
                { label: 'American Grill & Burgers', pct: 89 },
                { label: 'Modern Filipino', pct: 76 },
                { label: 'Cafe & Comfort Food', pct: 68 },
              ].map((c) => (
                <div key={c.label} style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span>{c.label}</span>
                    <span style={{ color: '#059669' }}>{c.pct}%</span>
                  </div>
                  <div
                    style={{
                      height: '12px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${c.pct}%`,
                        height: '100%',
                        background: '#10b981',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="cm-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                TOP MATCH SUMMARY
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
                Your lobby <strong>{roomCode}</strong> achieved a top restaurant consensus of{' '}
                <strong style={{ color: '#f97316' }}>
                  {rankedResults[0]?.matchScore || 94}%
                </strong>{' '}
                for <strong>{rankedResults[0]?.shortName || 'Mixed Temptation Chinese Restaurant'}</strong>
                .
              </p>
              {rankedResults.length === 0 && (
                <button
                  type="button"
                  className="cm-btn-orange"
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => setSubView('rate')}
                >
                  Start Rating 10 Spots Now
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    );
  }
// ==================== SUBVIEW 1: LOBBY ROOM (HOST & MEMBER) ====================
  return (
    <main className="page-container">
      {/* Top Bar: Back + Lobby Title + Copy/Leave */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <button type="button" className="back-btn" onClick={onLeaveRoom}>
          <ArrowLeft size={15} /> BACK
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            {roomCode} LOBBY
          </h1>
          <button
            type="button"
            onClick={handleCopyCode}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              height: '36px',
              padding: '0 0.85rem',
              borderRadius: '10px',
              border: copied ? '1.5px solid #a7f3d0' : '1.5px solid #fed7aa',
              background: copied ? '#ecfdf5' : '#ffffff',
              color: copied ? '#059669' : '#f97316',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'COPIED' : 'COPY CODE'}
          </button>
        </div>

        <button
          type="button"
          onClick={handlePermanentLeave}
          disabled={leaving}
          className="back-btn"
          style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#dc2626' }}
        >
          <LogOut size={14} /> {leaving ? 'LEAVING...' : 'LEAVE'}
        </button>
      </div>

      {lobbyError && <div className="error-banner">{lobbyError}</div>}

      {/* Top Host / Member Controls Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Host: Add People | Member: Group Invite Info */}
        {isHost ? (
          <form onSubmit={handleAddMember} className="cm-card" style={{ padding: '1.25rem' }}>
            <label className="field-label">ADD PEOPLE</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="cm-input"
                placeholder="eg. @gmail.com or username"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
              />
              <button type="submit" className="cm-btn-dark" disabled={inviting}>
                <UserPlus size={16} /> ADD
              </button>
            </div>
          </form>
        ) : (
          <div className="cm-card" style={{ padding: '1.25rem' }}>
            <label className="field-label">LOBBY STATUS</label>
            <p style={{ fontSize: '0.9rem', color: '#475569' }}>
              You joined <strong>{room?.host}&apos;s</strong> dining room. Set your budget,
              allergies, and location below.
            </p>
          </div>
        )}

        {/* Host: Set Deadline | Member: Deadline Display */}
        <div className="cm-card" style={{ padding: '1.25rem' }}>
          <label className="field-label">
            <Clock size={14} style={{ verticalAlign: 'middle', color: '#f97316' }} />{' '}
            {isHost ? 'SET DEADLINE' : 'DEADLINE (ADDED BY HOST)'}
          </label>
          {isHost ? (
            <input
              type="text"
              className="cm-input"
              placeholder="mm/dd/yyyy, 5:00 P.M. GMT"
              value={deadline}
              onChange={(e) => handleDeadlineChange(e.target.value)}
            />
          ) : (
            <div
              style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.95rem',
                borderRadius: '10px',
                background: '#fffaf5',
                border: '1.5px solid #fed7aa',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              {deadline}
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Column Lobby Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* LEFT: MEMBERS LIST & EDIT MEMBERS (HOST) */}
        <div
          className="cm-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                <Users size={18} style={{ verticalAlign: 'middle', color: '#f97316' }} /> MEMBERS (
                {room?.members?.length || 0})
              </h3>

              {isHost && (
                <button
                  type="button"
                  onClick={() => setEditMembersMode(!editMembersMode)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #fed7aa',
                    background: editMembersMode ? '#f97316' : '#fffaf5',
                    color: editMembersMode ? '#ffffff' : '#f97316',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <Edit3 size={13} /> {editMembersMode ? 'DONE' : 'EDIT MEMBERS'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {room?.members?.map((member, index) => {
                const isMe = matchesUser(member, currentUser);
                return (
                  <div
                    key={`${member.name}-${index}`}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: isMe ? '1.5px solid #fdba74' : '1.5px solid #e2e8f0',
                      background: isMe ? '#fff7ed' : '#f8fafc',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                        @{member.name}{' '}
                        {member.isHost && (
                          <span style={{ color: '#f97316', fontWeight: 700 }}>(host)</span>
                        )}
                        {isMe && !member.isHost && (
                          <span style={{ color: '#f97316', fontWeight: 700 }}>(you)</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {member.isHost && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '7px',
                              background: '#fef3c7',
                              color: '#b45309',
                            }}
                          >
                            <Crown size={12} /> Host
                          </span>
                        )}

                        {isHost && editMembersMode && !member.isHost && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member)}
                            style={{
                              border: 'none',
                              background: '#fee2e2',
                              color: '#dc2626',
                              borderRadius: '7px',
                              padding: '0.25rem 0.45rem',
                              cursor: 'pointer',
                            }}
                            title="Remove member"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '0.5rem',
                        paddingTop: '0.5rem',
                        borderTop: '1px dashed #cbd5e1',
                        fontSize: '0.82rem',
                        color: '#475569',
                      }}
                    >
                      <div>
                        <strong>Budget:</strong>{' '}
                        {member.budget ? (
                          <span style={{ color: '#059669', fontWeight: 700 }}>
                            {member.budget} PHP
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>0.00 PHP</span>
                        )}
                      </div>
                      <div style={{ marginTop: '0.25rem' }}>
                        <strong>Allergies:</strong>{' '}
                        {member.cannotEat?.length ? (
                          member.cannotEat.join(', ')
                        ) : (
                          <span style={{ color: '#94a3b8' }}>None</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

<button
            type="button"
            className="cm-btn-outline"
            style={{ width: '100%', marginTop: '1.25rem' }}
            onClick={() => {
              setAnalyticsTab('prematch');
              setSubView('analytics');
            }}
          >
            <BarChart3 size={17} /> GROUP ANALYTICS
          </button>
        </div>

        {/* RIGHT: YOUR PREFERRED BUDGET, ALLERGIES, LOCATION & SAVE & START MATCHING */}
        <form onSubmit={handleSaveAndStartMatching} className="cm-card" style={{ padding: '1.5rem' }}>
          {/* Preferred Budget */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="field-label">
              <Wallet size={15} style={{ verticalAlign: 'middle', color: '#f97316' }} /> YOUR
              PREFERRED BUDGET
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="cm-input"
                style={{ paddingRight: '3.5rem' }}
                placeholder="0.00"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  setPrefsSaved(false);
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#64748b',
                }}
              >
                PHP
              </span>
            </div>
          </div>

          {/* Allergies */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="field-label">
              <Ban size={15} style={{ verticalAlign: 'middle', color: '#dc2626' }} /> ALLERGIES
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <input
                type="text"
                className="cm-input"
                placeholder="shellfish, pork, gluten, etc."
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRestriction(foodInput);
                  }
                }}
              />
              <button
                type="button"
                className="cm-btn-dark"
                onClick={() => addRestriction(foodInput)}
              >
                <Plus size={16} /> ADD
              </button>
            </div>

            {/* Quick Tap Restriction Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem' }}>
              {QUICK_RESTRICTIONS.map((item) => {
                const active = cannotEat.some((x) => x.toLowerCase() === item.toLowerCase());
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => (active ? removeRestriction(item) : addRestriction(item))}
                    style={{
                      height: '28px',
                      padding: '0 0.65rem',
                      borderRadius: '8px',
                      border: active ? '1.5px solid #fca5a5' : '1.5px solid #e2e8f0',
                      background: active ? '#fef2f2' : '#ffffff',
                      color: active ? '#dc2626' : '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {active ? `✓ ${item}` : `+ ${item}`}
                  </button>
                );
              })}
            </div>

            {cannotEat.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {cannotEat.map((item) => (
                  <span
                    key={item}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
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
                        cursor: 'pointer',
                        display: 'flex',
                      }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="field-label">
              <MapPin size={15} style={{ verticalAlign: 'middle', color: '#f97316' }} /> LOCATION
            </label>
            <input
              type="text"
              className="cm-input"
              placeholder="eg. Digos City, Davao City, etc."
              value={locationPref}
              onChange={(e) => handleLocationChange(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              type="submit"
              disabled={savingPrefs}
              className="cm-btn-orange"
              style={{ width: '100%' }}
            >
              <Play size={17} />
              {savingPrefs ? 'SAVING...' : 'SAVE & START MATCHING'}
            </button>

            <button
              type="button"
              onClick={savePreferencesToBackend}
              className="cm-btn-outline"
              style={{
                width: '100%',
                borderColor: prefsSaved ? '#059669' : undefined,
                color: prefsSaved ? '#059669' : undefined,
              }}
            >
              <Sparkles size={16} />
              {prefsSaved ? 'PREFERENCES SAVED!' : 'SAVE PREFERENCES ONLY'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default RoomLobby;      
