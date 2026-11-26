// backend/mapsService.js
// SAMPLE DATA for now. Swap getNearbyRestaurants for a real places API later;
// keep the same return shape so analytics.js keeps working.
const SAMPLE_RESTAURANTS = [
  { id: 1, name: 'Lechon House',   cuisine: 'Filipino', avgPrice: 200, rating: 4.5, distanceKm: 1.0, contains: ['pork'] },
  { id: 2, name: 'Pasta Place',    cuisine: 'Italian',  avgPrice: 220, rating: 4.2, distanceKm: 2.0, contains: ['dairy', 'gluten'] },
  { id: 3, name: 'Steak Palace',   cuisine: 'Steakhouse', avgPrice: 600, rating: 4.9, distanceKm: 1.5, contains: [] },
  { id: 4, name: 'Sushi Corner',   cuisine: 'Japanese', avgPrice: 350, rating: 4.4, distanceKm: 3.0, contains: ['shellfish', 'eggs'] },
  { id: 5, name: 'Green Bowl',     cuisine: 'Healthy',  avgPrice: 180, rating: 4.1, distanceKm: 0.8, contains: [] },
  { id: 6, name: 'Spice Route',    cuisine: 'Indian',   avgPrice: 240, rating: 4.3, distanceKm: 4.5, contains: ['dairy', 'spicy'] },
  { id: 7, name: 'Burger Barn',    cuisine: 'American', avgPrice: 210, rating: 3.9, distanceKm: 2.2, contains: ['gluten', 'dairy'] },
  { id: 8, name: 'Noodle Nest',    cuisine: 'Asian',    avgPrice: 160, rating: 4.0, distanceKm: 1.2, contains: ['gluten', 'eggs', 'peanuts'] },
];

async function getNearbyRestaurants({ radiusKm = 5 } = {}) {
  return SAMPLE_RESTAURANTS.filter((r) => r.distanceKm <= radiusKm);
}

module.exports = { getNearbyRestaurants };