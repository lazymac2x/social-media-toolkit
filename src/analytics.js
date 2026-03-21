/**
 * Engagement and analytics module — pure calculations, no external APIs.
 */

/**
 * Calculate engagement rate.
 */
function calculateEngagement(data) {
  const {
    followers = 0,
    likes = 0,
    comments = 0,
    shares = 0,
    saves = 0,
    impressions = 0,
    clicks = 0,
    views = 0
  } = data;

  if (followers === 0) {
    return { error: 'Followers count must be greater than 0' };
  }

  const totalEngagement = likes + comments + shares + saves;
  const engagementRate = (totalEngagement / followers) * 100;

  // Engagement rate benchmarks
  let rating;
  if (engagementRate >= 6) rating = 'excellent';
  else if (engagementRate >= 3) rating = 'good';
  else if (engagementRate >= 1) rating = 'average';
  else rating = 'below_average';

  const result = {
    followers,
    total_engagement: totalEngagement,
    engagement_rate: Math.round(engagementRate * 100) / 100,
    engagement_rate_formatted: `${(Math.round(engagementRate * 100) / 100).toFixed(2)}%`,
    rating,
    breakdown: {
      likes: { count: likes, percentage: totalEngagement > 0 ? Math.round((likes / totalEngagement) * 100) : 0 },
      comments: { count: comments, percentage: totalEngagement > 0 ? Math.round((comments / totalEngagement) * 100) : 0 },
      shares: { count: shares, percentage: totalEngagement > 0 ? Math.round((shares / totalEngagement) * 100) : 0 },
      saves: { count: saves, percentage: totalEngagement > 0 ? Math.round((saves / totalEngagement) * 100) : 0 }
    },
    benchmarks: {
      excellent: '6%+',
      good: '3-6%',
      average: '1-3%',
      below_average: 'below 1%'
    }
  };

  // Optional metrics
  if (impressions > 0) {
    result.reach_rate = Math.round((impressions / followers) * 100 * 100) / 100;
    result.engagement_by_reach = Math.round((totalEngagement / impressions) * 100 * 100) / 100;
  }

  if (clicks > 0) {
    result.click_through_rate = impressions > 0
      ? Math.round((clicks / impressions) * 100 * 100) / 100
      : null;
  }

  if (views > 0) {
    result.view_engagement_rate = Math.round((totalEngagement / views) * 100 * 100) / 100;
  }

  return result;
}

/**
 * Calculate growth rate.
 */
function calculateGrowthRate(data) {
  const {
    current_followers = 0,
    previous_followers = 0,
    days = 30
  } = data;

  if (previous_followers === 0) {
    return { error: 'Previous followers count must be greater than 0' };
  }

  const gained = current_followers - previous_followers;
  const growthRate = (gained / previous_followers) * 100;
  const dailyRate = growthRate / days;
  const monthlyProjection = dailyRate * 30;
  const yearlyProjection = dailyRate * 365;

  let rating;
  if (monthlyProjection >= 10) rating = 'viral_growth';
  else if (monthlyProjection >= 5) rating = 'rapid_growth';
  else if (monthlyProjection >= 2) rating = 'healthy_growth';
  else if (monthlyProjection >= 0) rating = 'slow_growth';
  else rating = 'declining';

  return {
    current_followers,
    previous_followers,
    period_days: days,
    followers_gained: gained,
    growth_rate: Math.round(growthRate * 100) / 100,
    growth_rate_formatted: `${(Math.round(growthRate * 100) / 100).toFixed(2)}%`,
    daily_growth_rate: Math.round(dailyRate * 1000) / 1000,
    monthly_projection: `${Math.round(monthlyProjection * 100) / 100}%`,
    yearly_projection: `${Math.round(yearlyProjection * 100) / 100}%`,
    rating,
    estimated_followers: {
      in_30_days: Math.round(current_followers * (1 + monthlyProjection / 100)),
      in_90_days: Math.round(current_followers * Math.pow(1 + monthlyProjection / 100, 3)),
      in_365_days: Math.round(current_followers * Math.pow(1 + monthlyProjection / 100, 12))
    }
  };
}

/**
 * Score content performance.
 */
function scoreContent(data) {
  const {
    likes = 0,
    comments = 0,
    shares = 0,
    saves = 0,
    followers = 1,
    avg_likes = null,
    avg_comments = null
  } = data;

  // Weight: shares > saves > comments > likes
  const weightedScore = (likes * 1) + (comments * 3) + (shares * 5) + (saves * 4);
  const maxPossible = followers * 5; // theoretical max if everyone shared
  const normalizedScore = Math.min(100, Math.round((weightedScore / maxPossible) * 100 * 10));

  let performanceLabel;
  if (normalizedScore >= 80) performanceLabel = 'viral';
  else if (normalizedScore >= 60) performanceLabel = 'high_performing';
  else if (normalizedScore >= 40) performanceLabel = 'above_average';
  else if (normalizedScore >= 20) performanceLabel = 'average';
  else performanceLabel = 'below_average';

  const result = {
    performance_score: normalizedScore,
    performance_label: performanceLabel,
    weighted_engagement: weightedScore,
    engagement_breakdown: {
      likes: { raw: likes, weighted: likes * 1, weight: '1x' },
      comments: { raw: comments, weighted: comments * 3, weight: '3x' },
      shares: { raw: shares, weighted: shares * 5, weight: '5x' },
      saves: { raw: saves, weighted: saves * 4, weight: '4x' }
    },
    recommendations: []
  };

  // Generate recommendations
  if (comments < likes * 0.02) {
    result.recommendations.push('Low comment rate — try asking a question in your caption to boost comments.');
  }
  if (shares < likes * 0.01) {
    result.recommendations.push('Low share rate — create more shareable/relatable content.');
  }
  if (saves < likes * 0.05) {
    result.recommendations.push('Low save rate — add educational value or actionable tips.');
  }
  if (normalizedScore < 20) {
    result.recommendations.push('Consider experimenting with different content formats (carousels, reels, stories).');
  }

  // Compare to average if provided
  if (avg_likes !== null) {
    result.vs_average = {
      likes: likes > avg_likes ? 'above' : likes < avg_likes ? 'below' : 'equal',
      likes_diff: Math.round(((likes - avg_likes) / (avg_likes || 1)) * 100)
    };
  }
  if (avg_comments !== null) {
    result.vs_average = result.vs_average || {};
    result.vs_average.comments = comments > avg_comments ? 'above' : comments < avg_comments ? 'below' : 'equal';
    result.vs_average.comments_diff = Math.round(((comments - avg_comments) / (avg_comments || 1)) * 100);
  }

  return result;
}

/**
 * Estimate time to reach follower milestones.
 */
function estimateMilestones(data) {
  const {
    current_followers = 0,
    daily_growth = 0,
    monthly_growth_rate = 0
  } = data;

  if (current_followers === 0) {
    return { error: 'Current followers must be greater than 0' };
  }

  const dailyRate = daily_growth > 0
    ? daily_growth
    : current_followers * (monthly_growth_rate / 100) / 30;

  if (dailyRate <= 0) {
    return { error: 'Growth rate must be positive. Provide daily_growth or positive monthly_growth_rate.' };
  }

  const milestones = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000];

  const upcoming = milestones
    .filter(m => m > current_followers)
    .map(milestone => {
      const needed = milestone - current_followers;
      const daysNeeded = Math.ceil(needed / dailyRate);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysNeeded);

      return {
        milestone: milestone.toLocaleString(),
        followers_needed: needed,
        estimated_days: daysNeeded,
        estimated_date: targetDate.toISOString().split('T')[0]
      };
    });

  return {
    current_followers,
    estimated_daily_growth: Math.round(dailyRate * 10) / 10,
    milestones: upcoming,
    monetization_tiers: {
      nano_influencer: { range: '1K-10K', status: current_followers >= 1000 ? 'reached' : 'upcoming' },
      micro_influencer: { range: '10K-100K', status: current_followers >= 10000 ? 'reached' : 'upcoming' },
      macro_influencer: { range: '100K-1M', status: current_followers >= 100000 ? 'reached' : 'upcoming' },
      mega_influencer: { range: '1M+', status: current_followers >= 1000000 ? 'reached' : 'upcoming' }
    }
  };
}

module.exports = { calculateEngagement, calculateGrowthRate, scoreContent, estimateMilestones };
