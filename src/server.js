const express = require('express');
const cors = require('cors');
const { generateHashtags, getCategories, getPlatformLimits } = require('./hashtags');
const { generateCaption, getHookTemplates, getEmojis } = require('./captions');
const { getBestTimes, getNextBestTime } = require('./scheduler');
const { calculateEngagement, calculateGrowthRate, scoreContent, estimateMilestones } = require('./analytics');
const { generateContentIdeas } = require('./content-ideas');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

// ── Health & Info ──────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'Social Media Toolkit API',
    version: '1.0.0',
    description: 'Generate hashtags, captions, content ideas, and analyze engagement — all rule-based.',
    endpoints: {
      hashtags: 'GET /api/v1/hashtags/:topic',
      caption: 'GET /api/v1/caption/:category',
      best_times: 'GET /api/v1/best-times/:platform',
      engagement: 'POST /api/v1/engagement',
      content_ideas: 'GET /api/v1/content-ideas/:niche',
      categories: 'GET /api/v1/categories',
      growth_rate: 'POST /api/v1/growth-rate',
      content_score: 'POST /api/v1/content-score',
      milestones: 'POST /api/v1/milestones'
    }
  });
});

// ── Hashtags ───────────────────────────────────────────────────
app.get('/api/v1/hashtags/:topic', (req, res) => {
  const { topic } = req.params;
  const { platform, count, competition } = req.query;
  const result = generateHashtags(topic, {
    platform: platform || 'instagram',
    count: count ? parseInt(count) : undefined,
    competition
  });
  res.json(result);
});

app.get('/api/v1/categories', (_req, res) => {
  res.json({ categories: getCategories(), platform_limits: getPlatformLimits() });
});

// ── Captions ───────────────────────────────────────────────────
app.get('/api/v1/caption/:category', (req, res) => {
  const { category } = req.params;
  const { topic, mood, cta_type, platform, emojis, hashtags } = req.query;
  const result = generateCaption(category, {
    topic,
    mood,
    ctaType: cta_type,
    platform,
    includeEmojis: emojis !== 'false',
    includeHashtags: hashtags === 'true'
  });
  res.json(result);
});

app.get('/api/v1/hooks/:category', (req, res) => {
  res.json(getHookTemplates(req.params.category));
});

app.get('/api/v1/emojis/:mood', (req, res) => {
  res.json(getEmojis(req.params.mood));
});

// ── Scheduler ──────────────────────────────────────────────────
app.get('/api/v1/best-times/:platform', (req, res) => {
  const { platform } = req.params;
  const { timezone, day } = req.query;
  const result = getBestTimes(platform, { timezone, day });
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.get('/api/v1/next-best-time/:platform', (req, res) => {
  const { platform } = req.params;
  const { timezone } = req.query;
  const result = getNextBestTime(platform, { timezone });
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// ── Analytics ──────────────────────────────────────────────────
app.post('/api/v1/engagement', (req, res) => {
  const result = calculateEngagement(req.body);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/v1/growth-rate', (req, res) => {
  const result = calculateGrowthRate(req.body);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/v1/content-score', (req, res) => {
  const result = scoreContent(req.body);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/v1/milestones', (req, res) => {
  const result = estimateMilestones(req.body);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// ── Content Ideas ──────────────────────────────────────────────
app.get('/api/v1/content-ideas/:niche', (req, res) => {
  const { niche } = req.params;
  const { count, format } = req.query;
  const result = generateContentIdeas(niche, {
    count: count ? parseInt(count) : 10,
    format
  });
  res.json(result);
});

// ── 404 ────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found', docs: 'GET / for available endpoints' });
});

// ── Error handler ──────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Social Media Toolkit API running on http://localhost:${PORT}`);
});

module.exports = app;
