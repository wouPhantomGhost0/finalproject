// backend/aiService.js
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// Key goes in backend/.env as GEMINI_API_KEY=... (never commit that file)
// Model is configurable: set GEMINI_MODEL in .env if the default is retired.
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let client = null;
function getClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

// Plain-text explanation used when there is no key or the AI call fails
function fallbackExplanation(topPicks, groupInfo) {
  if (!topPicks.length) {
    return 'No restaurants fit everyone\'s budget, distance and dietary needs. Try raising the budget or widening the radius.';
  }
  const best = topPicks[0];
  const parts = [`${best.name} is the top match with a score of ${best.score}.`];
  if (groupInfo.groupBudget) parts.push(`It fits the group's budget of ${groupInfo.groupBudget}.`);
  if (groupInfo.restrictions.length) parts.push(`It avoids: ${groupInfo.restrictions.join(', ')}.`);
  return parts.join(' ');
}

async function explainTopPicks(topPicks, groupInfo = { groupBudget: null, restrictions: [] }) {
  const ai = getClient();
  if (!ai || !topPicks.length) return fallbackExplanation(topPicks, groupInfo);

  const list = topPicks
    .map((r, i) => `${i + 1}. ${r.name} (${r.cuisine || 'n/a'}), price ${r.avgPrice}, rating ${r.rating}, ${r.distanceKm} km, score ${r.score}`)
    .join('\n');

  const prompt =
    `A group is choosing where to eat. Group budget: ${groupInfo.groupBudget ?? 'not set'}. ` +
    `Foods the group cannot eat: ${groupInfo.restrictions.join(', ') || 'none'}.\n` +
    `Top matches:\n${list}\n\n` +
    `In 3 to 4 short, friendly sentences, explain why the first one is the best pick ` +
    `and what the others offer. Use only the facts above; do not invent details.`;

  try {
    const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
    return (response.text || '').trim() || fallbackExplanation(topPicks, groupInfo);
  } catch (err) {
    console.error('Gemini error:', err.message);
    return fallbackExplanation(topPicks, groupInfo);
  }
}

module.exports = { explainTopPicks };