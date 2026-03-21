/**
 * Hashtag generation module — rule-based, no external APIs.
 */

const CATEGORY_HASHTAGS = {
  tech: {
    high: ['#technology', '#tech', '#AI', '#programming', '#coding', '#software', '#developer', '#innovation', '#startup', '#digitalmarketing'],
    medium: ['#techlife', '#devlife', '#codelife', '#webdevelopment', '#appdevelopment', '#machinelearning', '#datascience', '#cybersecurity', '#cloudcomputing', '#techcommunity'],
    low: ['#techstartups', '#codingtips', '#devtips', '#techtalk', '#programminglife', '#softwaredeveloper', '#techinnovation', '#digitaltransformation', '#techeducation', '#opensourcecommunity']
  },
  fitness: {
    high: ['#fitness', '#gym', '#workout', '#fitnessmotivation', '#fit', '#training', '#health', '#bodybuilding', '#exercise', '#fitfam'],
    medium: ['#fitnessjourney', '#gymlife', '#workoutmotivation', '#strengthtraining', '#cardio', '#weightlifting', '#personaltrainer', '#fitnessgoals', '#healthylifestyle', '#muscle'],
    low: ['#homeworkout', '#fitnesstips', '#gymmotivation', '#functionaltraining', '#fitnesscommunity', '#trainingday', '#exerciseroutine', '#fitnesscoach', '#workoutroutine', '#fitlife']
  },
  food: {
    high: ['#food', '#foodie', '#foodporn', '#cooking', '#recipe', '#yummy', '#delicious', '#homemade', '#instafood', '#foodlover'],
    medium: ['#foodphotography', '#healthyfood', '#foodblogger', '#dinner', '#lunch', '#baking', '#vegan', '#foodstagram', '#chef', '#mealprep'],
    low: ['#foodgasm', '#cookingtips', '#recipeideas', '#foodlovers', '#homecooked', '#kitchenlife', '#plantbased', '#mealprepping', '#foodblog', '#cookingathome']
  },
  travel: {
    high: ['#travel', '#wanderlust', '#travelgram', '#vacation', '#adventure', '#explore', '#travelphotography', '#trip', '#holiday', '#tourism'],
    medium: ['#travelblogger', '#traveltheworld', '#instatravel', '#traveling', '#traveler', '#roadtrip', '#backpacking', '#paradise', '#beautifuldestinations', '#traveladdict'],
    low: ['#traveltips', '#solotravel', '#travelhacks', '#travelcouple', '#budgettravel', '#travelinspo', '#digitalnomad', '#travelguide', '#exploremore', '#hiddenplaces']
  },
  business: {
    high: ['#business', '#entrepreneur', '#marketing', '#success', '#money', '#motivation', '#hustle', '#branding', '#smallbusiness', '#leadership'],
    medium: ['#businessowner', '#entrepreneurlife', '#digitalmarketing', '#onlinebusiness', '#mindset', '#investing', '#wealth', '#growthmindset', '#socialmediamarketing', '#ecommerce'],
    low: ['#businesstips', '#entrepreneurship', '#sidehustle', '#passiveincome', '#businessgrowth', '#startupcommunity', '#ceo', '#networkmarketing', '#salesfunnel', '#personalbranding']
  },
  fashion: {
    high: ['#fashion', '#style', '#ootd', '#fashionblogger', '#beauty', '#outfit', '#model', '#fashionstyle', '#streetstyle', '#shopping'],
    medium: ['#fashionista', '#styleinspiration', '#lookoftheday', '#fashiondesigner', '#trendy', '#outfitoftheday', '#whatiwore', '#styleinspo', '#fashionable', '#accessories'],
    low: ['#fashiontips', '#sustainablefashion', '#vintagestyle', '#fashiondaily', '#wardrobeideas', '#outfitinspo', '#fashioncommunity', '#styleguide', '#fashionweek', '#minimalistfashion']
  },
  lifestyle: {
    high: ['#lifestyle', '#life', '#love', '#happy', '#instagood', '#photooftheday', '#beautiful', '#picoftheday', '#nature', '#instagram'],
    medium: ['#lifestyleblogger', '#dailylife', '#goodvibes', '#positivevibes', '#mindfulness', '#selfcare', '#wellness', '#liveyourbestlife', '#happiness', '#grateful'],
    low: ['#lifestyletips', '#morningroutine', '#productivitytips', '#minimalism', '#intentionalliving', '#simpleliving', '#dailyroutine', '#lifehacks', '#wellnessjourney', '#selfimprovement']
  },
  music: {
    high: ['#music', '#musician', '#singer', '#hiphop', '#rap', '#dj', '#beats', '#song', '#artist', '#newmusic'],
    medium: ['#musicproducer', '#songwriter', '#livemusic', '#guitar', '#producer', '#musiclife', '#studio', '#indie', '#musicvideo', '#unsignedartist'],
    low: ['#musictips', '#musiccommunity', '#indiemusic', '#musicproduction', '#singersongwriter', '#musicianlife', '#beatmaker', '#coverband', '#originalmusic', '#musicislife']
  },
  education: {
    high: ['#education', '#learning', '#study', '#school', '#knowledge', '#teacher', '#student', '#books', '#reading', '#science'],
    medium: ['#onlinelearning', '#elearning', '#studytips', '#edtech', '#studygram', '#teaching', '#university', '#research', '#selftaught', '#learnmore'],
    low: ['#educationtips', '#studymotivation', '#lifetimelearner', '#teacherlife', '#knowledgeispower', '#learneveryday', '#educationmatters', '#studyhard', '#onlinecourse', '#scholarlife']
  },
  gaming: {
    high: ['#gaming', '#gamer', '#videogames', '#ps5', '#xbox', '#pc', '#twitch', '#esports', '#streamer', '#games'],
    medium: ['#gamingcommunity', '#gaminglife', '#gameplay', '#gamedev', '#pcgaming', '#retrogaming', '#consolegaming', '#gamingsetup', '#indiegame', '#gamers'],
    low: ['#gamingtips', '#gamingpc', '#gamingchannel', '#gamereview', '#gamingmemes', '#mobilegaming', '#gamingworld', '#gamingclips', '#gamenight', '#gamerlife']
  }
};

const PLATFORM_LIMITS = {
  instagram: 30,
  twitter: 5,
  tiktok: 8,
  linkedin: 5,
  facebook: 10,
  youtube: 15,
  pinterest: 20,
  threads: 5
};

/**
 * Generate hashtags for a topic.
 */
function generateHashtags(topic, options = {}) {
  const {
    platform = 'instagram',
    count,
    competition = 'mixed'
  } = options;

  const limit = count || PLATFORM_LIMITS[platform] || 10;
  const normalizedTopic = topic.toLowerCase().trim();

  // Find matching category
  let matchedCategory = null;
  let matchScore = 0;

  for (const [category, tags] of Object.entries(CATEGORY_HASHTAGS)) {
    if (normalizedTopic.includes(category) || category.includes(normalizedTopic)) {
      matchedCategory = category;
      matchScore = 1;
      break;
    }
    // Check if topic appears in any hashtag of this category
    const allTags = [...tags.high, ...tags.medium, ...tags.low];
    const hits = allTags.filter(t => t.toLowerCase().includes(normalizedTopic)).length;
    if (hits > matchScore) {
      matchScore = hits;
      matchedCategory = category;
    }
  }

  let hashtags = [];

  if (matchedCategory && CATEGORY_HASHTAGS[matchedCategory]) {
    const catTags = CATEGORY_HASHTAGS[matchedCategory];

    if (competition === 'high') {
      hashtags = [...catTags.high];
    } else if (competition === 'low') {
      hashtags = [...catTags.low];
    } else if (competition === 'medium') {
      hashtags = [...catTags.medium];
    } else {
      // mixed: blend all
      hashtags = [...catTags.high.slice(0, 4), ...catTags.medium.slice(0, 3), ...catTags.low.slice(0, 3)];
    }
  }

  // Generate dynamic hashtags from the topic itself
  const dynamicTags = generateDynamicHashtags(normalizedTopic);
  hashtags = [...hashtags, ...dynamicTags];

  // Deduplicate
  hashtags = [...new Set(hashtags)];

  // Trim to platform limit
  hashtags = hashtags.slice(0, limit);

  return {
    topic,
    platform,
    limit: PLATFORM_LIMITS[platform] || limit,
    count: hashtags.length,
    category: matchedCategory || 'general',
    hashtags,
    groups: {
      high_competition: hashtags.filter((_, i) => i < Math.ceil(hashtags.length * 0.3)),
      medium_competition: hashtags.filter((_, i) => i >= Math.ceil(hashtags.length * 0.3) && i < Math.ceil(hashtags.length * 0.7)),
      low_competition: hashtags.filter((_, i) => i >= Math.ceil(hashtags.length * 0.7))
    }
  };
}

function generateDynamicHashtags(topic) {
  const words = topic.split(/[\s,_-]+/).filter(w => w.length > 1);
  const tags = [];

  // Single word tag
  tags.push(`#${words.join('')}`);

  // Individual word tags
  words.forEach(w => {
    if (w.length > 2) tags.push(`#${w}`);
  });

  // Common suffixes
  const suffixes = ['tips', 'life', 'community', 'daily', 'lover', 'goals', 'vibes', 'inspo'];
  const base = words[0] || topic.replace(/\s+/g, '');
  suffixes.forEach(s => tags.push(`#${base}${s}`));

  return tags;
}

/**
 * List all available trending categories.
 */
function getCategories() {
  return Object.keys(CATEGORY_HASHTAGS).map(cat => ({
    name: cat,
    hashtag_count: Object.values(CATEGORY_HASHTAGS[cat]).flat().length,
    competition_levels: ['high', 'medium', 'low']
  }));
}

/**
 * Get platform hashtag limits.
 */
function getPlatformLimits() {
  return PLATFORM_LIMITS;
}

module.exports = { generateHashtags, getCategories, getPlatformLimits, CATEGORY_HASHTAGS, PLATFORM_LIMITS };
