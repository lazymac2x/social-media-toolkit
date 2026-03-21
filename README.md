# Social Media Toolkit

Social media content generation and analysis API + MCP server. Generate hashtags, captions, content ideas, and analyze engagement metrics — all rule-based, no external AI APIs required.

## Features

- **Hashtag Generation** — Topic-based hashtags with competition grouping and platform-specific limits (Instagram 30, Twitter 5, TikTok 8, etc.)
- **Caption Templates** — Hook/body/CTA structures with multiple categories (question, stat, story, challenge, controversial, educational)
- **Best Posting Times** — Optimal posting schedules by platform and timezone for every day of the week
- **Engagement Analytics** — Engagement rate calculator, growth rate projections, content scoring, follower milestone estimator
- **Content Ideas** — Niche-specific content ideas with format suggestions (carousel, reel, story, live, etc.)
- **MCP Server** — All tools available via Model Context Protocol for AI assistant integration

## Quick Start

```bash
npm install
npm start
# API running on http://localhost:3500
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/hashtags/:topic` | Generate hashtags for a topic |
| GET | `/api/v1/caption/:category` | Generate caption template |
| GET | `/api/v1/best-times/:platform` | Best posting times |
| POST | `/api/v1/engagement` | Calculate engagement metrics |
| GET | `/api/v1/content-ideas/:niche` | Generate content ideas |
| POST | `/api/v1/growth-rate` | Calculate follower growth rate |
| POST | `/api/v1/content-score` | Score content performance |
| POST | `/api/v1/milestones` | Estimate follower milestones |
| GET | `/api/v1/categories` | List hashtag categories |

## Usage Examples

### Generate Hashtags

```bash
curl "http://localhost:3500/api/v1/hashtags/tech?platform=instagram&competition=mixed"
```

### Generate Caption

```bash
curl "http://localhost:3500/api/v1/caption/question?topic=coding&mood=professional"
```

### Best Posting Times

```bash
curl "http://localhost:3500/api/v1/best-times/instagram?timezone=US/Pacific&day=monday"
```

### Calculate Engagement

```bash
curl -X POST http://localhost:3500/api/v1/engagement \
  -H "Content-Type: application/json" \
  -d '{"followers":10000,"likes":500,"comments":50,"shares":20,"saves":30}'
```

### Content Ideas

```bash
curl "http://localhost:3500/api/v1/content-ideas/tech?count=5&format=reel"
```

## MCP Server

Add to your Claude Desktop or MCP client config:

```json
{
  "mcpServers": {
    "social-media-toolkit": {
      "command": "node",
      "args": ["src/mcp-server.js"],
      "cwd": "/path/to/social-media-toolkit"
    }
  }
}
```

Available MCP tools: `generate_hashtags`, `generate_caption`, `get_best_posting_times`, `calculate_engagement`, `calculate_growth_rate`, `score_content`, `estimate_milestones`, `generate_content_ideas`, `get_categories`.

## Docker

```bash
docker build -t social-media-toolkit .
docker run -p 3500:3500 social-media-toolkit
```

## License

MIT
