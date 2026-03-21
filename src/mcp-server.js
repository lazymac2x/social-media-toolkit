#!/usr/bin/env node
/**
 * MCP (Model Context Protocol) server for Social Media Toolkit.
 * Exposes all toolkit functions as MCP tools over stdio.
 */

const readline = require('readline');
const { generateHashtags, getCategories, getPlatformLimits } = require('./hashtags');
const { generateCaption, getHookTemplates, getEmojis } = require('./captions');
const { getBestTimes, getNextBestTime } = require('./scheduler');
const { calculateEngagement, calculateGrowthRate, scoreContent, estimateMilestones } = require('./analytics');
const { generateContentIdeas } = require('./content-ideas');

const SERVER_INFO = {
  name: 'social-media-toolkit',
  version: '1.0.0'
};

const TOOLS = [
  {
    name: 'generate_hashtags',
    description: 'Generate relevant hashtags for a topic. Supports platform-specific limits and competition filtering.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Topic or keyword to generate hashtags for' },
        platform: { type: 'string', enum: ['instagram', 'twitter', 'tiktok', 'linkedin', 'facebook', 'youtube', 'pinterest', 'threads'], description: 'Target platform (default: instagram)' },
        count: { type: 'number', description: 'Number of hashtags to return' },
        competition: { type: 'string', enum: ['high', 'medium', 'low', 'mixed'], description: 'Competition level filter (default: mixed)' }
      },
      required: ['topic']
    }
  },
  {
    name: 'generate_caption',
    description: 'Generate a social media caption with hook, body, and CTA.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['question', 'stat', 'story', 'challenge', 'controversial', 'educational'], description: 'Hook style category' },
        topic: { type: 'string', description: 'Topic for the caption' },
        mood: { type: 'string', enum: ['excited', 'calm', 'professional', 'funny', 'inspiring', 'love', 'warning', 'educational'], description: 'Mood for emoji selection' },
        cta_type: { type: 'string', enum: ['engagement', 'follow', 'link', 'sale'], description: 'Call to action type' },
        platform: { type: 'string', description: 'Target platform' }
      },
      required: ['category']
    }
  },
  {
    name: 'get_best_posting_times',
    description: 'Get optimal posting times for a social media platform, with timezone conversion.',
    inputSchema: {
      type: 'object',
      properties: {
        platform: { type: 'string', enum: ['instagram', 'twitter', 'tiktok', 'linkedin', 'facebook', 'youtube', 'pinterest'], description: 'Social media platform' },
        timezone: { type: 'string', description: 'Timezone (e.g., US/Eastern, Asia/Seoul, Europe/London)' },
        day: { type: 'string', description: 'Specific day of week (e.g., monday)' }
      },
      required: ['platform']
    }
  },
  {
    name: 'calculate_engagement',
    description: 'Calculate engagement rate from likes, comments, shares, saves, and follower count.',
    inputSchema: {
      type: 'object',
      properties: {
        followers: { type: 'number', description: 'Total followers' },
        likes: { type: 'number', description: 'Number of likes' },
        comments: { type: 'number', description: 'Number of comments' },
        shares: { type: 'number', description: 'Number of shares' },
        saves: { type: 'number', description: 'Number of saves' },
        impressions: { type: 'number', description: 'Total impressions' },
        views: { type: 'number', description: 'Total views' }
      },
      required: ['followers']
    }
  },
  {
    name: 'calculate_growth_rate',
    description: 'Calculate follower growth rate and project future growth.',
    inputSchema: {
      type: 'object',
      properties: {
        current_followers: { type: 'number', description: 'Current follower count' },
        previous_followers: { type: 'number', description: 'Previous follower count' },
        days: { type: 'number', description: 'Number of days between measurements (default: 30)' }
      },
      required: ['current_followers', 'previous_followers']
    }
  },
  {
    name: 'score_content',
    description: 'Score content performance based on weighted engagement metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        likes: { type: 'number' },
        comments: { type: 'number' },
        shares: { type: 'number' },
        saves: { type: 'number' },
        followers: { type: 'number' },
        avg_likes: { type: 'number', description: 'Your average likes per post for comparison' },
        avg_comments: { type: 'number', description: 'Your average comments per post for comparison' }
      },
      required: ['followers']
    }
  },
  {
    name: 'estimate_milestones',
    description: 'Estimate time to reach follower milestones based on current growth.',
    inputSchema: {
      type: 'object',
      properties: {
        current_followers: { type: 'number', description: 'Current follower count' },
        daily_growth: { type: 'number', description: 'Average new followers per day' },
        monthly_growth_rate: { type: 'number', description: 'Monthly growth rate percentage' }
      },
      required: ['current_followers']
    }
  },
  {
    name: 'generate_content_ideas',
    description: 'Generate content ideas for a specific niche with format suggestions.',
    inputSchema: {
      type: 'object',
      properties: {
        niche: { type: 'string', description: 'Content niche (e.g., tech, fitness, food, travel, business)' },
        count: { type: 'number', description: 'Number of ideas to generate (default: 10)' },
        format: { type: 'string', enum: ['carousel', 'reel', 'story', 'single_image', 'video', 'live', 'text_post', 'poll', 'thread'], description: 'Filter by content format' }
      },
      required: ['niche']
    }
  },
  {
    name: 'get_categories',
    description: 'List all available hashtag categories and platform limits.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

function handleToolCall(name, args) {
  switch (name) {
    case 'generate_hashtags':
      return generateHashtags(args.topic, {
        platform: args.platform,
        count: args.count,
        competition: args.competition
      });
    case 'generate_caption':
      return generateCaption(args.category, {
        topic: args.topic,
        mood: args.mood,
        ctaType: args.cta_type,
        platform: args.platform
      });
    case 'get_best_posting_times':
      return getBestTimes(args.platform, {
        timezone: args.timezone,
        day: args.day
      });
    case 'calculate_engagement':
      return calculateEngagement(args);
    case 'calculate_growth_rate':
      return calculateGrowthRate(args);
    case 'score_content':
      return scoreContent(args);
    case 'estimate_milestones':
      return estimateMilestones(args);
    case 'generate_content_ideas':
      return generateContentIdeas(args.niche, {
        count: args.count,
        format: args.format
      });
    case 'get_categories':
      return { categories: getCategories(), platform_limits: getPlatformLimits() };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── JSON-RPC over stdio ────────────────────────────────────────

function sendResponse(id, result) {
  const msg = JSON.stringify({ jsonrpc: '2.0', id, result });
  process.stdout.write(msg + '\n');
}

function sendError(id, code, message) {
  const msg = JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } });
  process.stdout.write(msg + '\n');
}

function sendNotification(method, params) {
  const msg = JSON.stringify({ jsonrpc: '2.0', method, params });
  process.stdout.write(msg + '\n');
}

function handleMessage(message) {
  let parsed;
  try {
    parsed = JSON.parse(message);
  } catch {
    return sendError(null, -32700, 'Parse error');
  }

  const { id, method, params } = parsed;

  switch (method) {
    case 'initialize':
      return sendResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO
      });

    case 'notifications/initialized':
      // Client acknowledgment — no response needed
      return;

    case 'tools/list':
      return sendResponse(id, { tools: TOOLS });

    case 'tools/call': {
      const { name, arguments: args } = params;
      try {
        const result = handleToolCall(name, args || {});
        return sendResponse(id, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        });
      } catch (err) {
        return sendResponse(id, {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true
        });
      }
    }

    case 'ping':
      return sendResponse(id, {});

    default:
      if (id !== undefined) {
        return sendError(id, -32601, `Method not found: ${method}`);
      }
  }
}

// ── Start stdio listener ──────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  if (line.trim()) handleMessage(line.trim());
});

process.stderr.write('Social Media Toolkit MCP server started (stdio)\n');
