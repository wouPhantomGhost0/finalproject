// backend/analytics.js
function parseBudget(value) {
  const n = parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

// The group can only spend what its tightest member can
function getGroupBudget(members) {
  const budgets = members.map((m) => parseBudget(m.budget)).filter((b) => b !== null);
  return budgets.length ? Math.min(...budgets) : null;
}

// Everything anyone in the group cannot eat
function getGroupRestrictions(members) {
  const all = new Set();
  members.forEach((m) =>
    (m.cannotEat || []).forEach((item) => {
      const clean = String(item).trim().toLowerCase();
      if (clean) all.add(clean);
    })
  );
  return [...all];
}

function rankRestaurants(restaurants, members, options = {}) {
  const { radiusKm = null, votes = {}, limit = 3 } = options;
  const groupBudget = getGroupBudget(members);
  const restrictions = getGroupRestrictions(members);

  const ranked = [];
  for (const r of restaurants) {
    const contains = (r.contains || []).map((t) => String(t).toLowerCase());
    if (restrictions.some((x) => contains.includes(x))) continue;   // dietary clash
    if (groupBudget !== null && r.avgPrice > groupBudget) continue;  // too expensive
    if (radiusKm !== null && r.distanceKm > radiusKm) continue;      // too far

    const rating = (r.rating || 0) * 10;                             // 0-50
    const likes = (votes[r.id] || 0) * 10;                           // swipe-right count
    const near = radiusKm ? (1 - r.distanceKm / radiusKm) * 10 : 0;  // 0-10
    ranked.push({ ...r, score: Math.round(rating + likes + near) });
  }

  ranked.sort((a, b) => b.score - a.score);
  return { groupBudget, restrictions, top: ranked.slice(0, limit) };
}

module.exports = { parseBudget, getGroupBudget, getGroupRestrictions, rankRestaurants };