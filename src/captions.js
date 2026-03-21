/**
 * Caption template generation module — rule-based.
 */

const HOOK_TEMPLATES = {
  question: [
    'Ever wondered why {topic} matters so much?',
    'What if I told you {topic} could change everything?',
    'Are you making this {topic} mistake?',
    'Want to know the secret behind {topic}?',
    'Why do most people get {topic} wrong?',
    'Ready to transform your {topic} game?',
    'Still struggling with {topic}?',
    'Did you know this about {topic}?'
  ],
  stat: [
    '80% of people fail at {topic}. Here\'s why.',
    'Studies show {topic} can boost results by 3x.',
    'Only 5% of people master {topic}. Be one of them.',
    '{topic} has grown 200% in the last year alone.',
    'The top 1% in {topic} all do this one thing.',
    '9 out of 10 experts agree: {topic} is the future.',
    'People who focus on {topic} see 50% better results.',
    'In just 30 days, {topic} changed my entire perspective.'
  ],
  story: [
    'I used to struggle with {topic} until I discovered this...',
    'A year ago, I knew nothing about {topic}. Now...',
    'Here\'s my honest journey with {topic}.',
    'Nobody talks about the hard part of {topic}.',
    'The moment {topic} clicked for me was unexpected.',
    'I failed at {topic} 100 times before getting it right.',
    'My {topic} story starts with a complete disaster.',
    'Three months of {topic} taught me more than three years of school.'
  ],
  challenge: [
    'Try this {topic} challenge for 7 days.',
    'I dare you to master {topic} this week.',
    'Take the {topic} challenge and see the difference.',
    'Can you do this {topic} routine for 30 days?',
    'Challenge: Improve your {topic} in just 5 minutes a day.',
    'Stop scrolling and try this {topic} hack right now.',
    'The {topic} challenge that went viral — here\'s why.',
    'I challenged myself to {topic} every day. Here are the results.'
  ],
  controversial: [
    'Unpopular opinion: {topic} is overrated.',
    'Hot take: Everything you know about {topic} is wrong.',
    'Controversial but true: {topic} isn\'t what you think.',
    'I\'m going to say what nobody else will about {topic}.',
    'This {topic} truth will make some people uncomfortable.'
  ],
  educational: [
    'Here\'s what nobody teaches you about {topic}.',
    '{topic} 101: Everything you need to know.',
    'The beginner\'s guide to {topic} (save this).',
    '5 {topic} mistakes you\'re probably making right now.',
    'The complete breakdown of {topic} in 60 seconds.'
  ]
};

const CTA_TEMPLATES = {
  engagement: [
    'Drop a {emoji} if you agree!',
    'Tag someone who needs to see this.',
    'Save this for later!',
    'Share this with a friend who needs it.',
    'Double tap if you relate!',
    'Comment your thoughts below!',
    'Which one resonated with you? Let me know!',
    'Agree or disagree? Tell me in the comments.'
  ],
  follow: [
    'Follow for more {topic} tips!',
    'Hit follow for daily {topic} content.',
    'Follow along on this journey!',
    'Want more like this? Follow me!',
    'New here? Follow for {topic} insights.',
    'Follow and turn on notifications!'
  ],
  link: [
    'Link in bio for the full guide.',
    'Check the link in bio for more details.',
    'Full breakdown available — link in bio.',
    'Get the free resource — link in bio.',
    'Click the link in bio to learn more.'
  ],
  sale: [
    'Limited spots available — grab yours now!',
    'Use code SOCIAL20 for 20% off.',
    'Early bird pricing ends soon!',
    'DM me "START" to get access.',
    'The doors close at midnight — don\'t miss out.'
  ]
};

const EMOJI_BY_MOOD = {
  excited: ['🔥', '🚀', '💥', '⚡', '🎉', '✨', '💪', '🙌'],
  calm: ['🌿', '☁️', '🧘', '🌊', '🕊️', '💫', '🌸', '☀️'],
  professional: ['📊', '💼', '📈', '🎯', '✅', '💡', '🏆', '📌'],
  funny: ['😂', '🤣', '💀', '😅', '🙃', '🤪', '😜', '👀'],
  inspiring: ['💪', '🌟', '🔥', '👑', '🏆', '✨', '🎯', '💎'],
  love: ['❤️', '💕', '🥰', '😍', '💗', '💖', '🫶', '💘'],
  warning: ['⚠️', '🚨', '❌', '🛑', '👆', '‼️', '📢', '🔴'],
  educational: ['📚', '🧠', '💡', '📝', '🎓', '📖', '🔬', '📐']
};

const BODY_TEMPLATES = [
  'Here are {count} things you need to know:\n\n{points}',
  'The truth is simple:\n\n{points}\n\nThat\'s it. No magic.',
  'Let me break it down:\n\n{points}\n\nSimple but powerful.',
  'Most people overlook this:\n\n{points}\n\nDon\'t be most people.',
  '{points}\n\nThe difference between success and failure? Taking action.',
  'I learned this the hard way:\n\n{points}\n\nNow you don\'t have to.'
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a caption by category.
 */
function generateCaption(category, options = {}) {
  const {
    topic = 'this',
    mood = 'professional',
    ctaType = 'engagement',
    platform = 'instagram',
    includeEmojis = true,
    includeHashtags = false
  } = options;

  const hookCategory = HOOK_TEMPLATES[category] || HOOK_TEMPLATES.question;
  const hook = pickRandom(hookCategory).replace(/\{topic\}/g, topic);
  const body = pickRandom(BODY_TEMPLATES)
    .replace(/\{count\}/g, '3')
    .replace(/\{points\}/g, `1. Start with the basics\n2. Be consistent every day\n3. Track your progress`);
  const cta = pickRandom(CTA_TEMPLATES[ctaType] || CTA_TEMPLATES.engagement)
    .replace(/\{topic\}/g, topic)
    .replace(/\{emoji\}/g, pickRandom(EMOJI_BY_MOOD[mood] || EMOJI_BY_MOOD.professional));

  const emojis = EMOJI_BY_MOOD[mood] || EMOJI_BY_MOOD.professional;

  const fullCaption = includeEmojis
    ? `${pickRandom(emojis)} ${hook}\n\n${body}\n\n${cta}`
    : `${hook}\n\n${body}\n\n${cta}`;

  return {
    category,
    platform,
    mood,
    hook,
    body,
    cta,
    full_caption: fullCaption,
    emoji_suggestions: emojis.slice(0, 5),
    character_count: fullCaption.length,
    available_categories: Object.keys(HOOK_TEMPLATES),
    available_moods: Object.keys(EMOJI_BY_MOOD),
    available_cta_types: Object.keys(CTA_TEMPLATES)
  };
}

/**
 * Get all available hook templates for a category.
 */
function getHookTemplates(category) {
  if (category && HOOK_TEMPLATES[category]) {
    return { category, templates: HOOK_TEMPLATES[category] };
  }
  return { categories: Object.keys(HOOK_TEMPLATES) };
}

/**
 * Get emoji suggestions by mood.
 */
function getEmojis(mood) {
  if (mood && EMOJI_BY_MOOD[mood]) {
    return { mood, emojis: EMOJI_BY_MOOD[mood] };
  }
  return { moods: Object.keys(EMOJI_BY_MOOD) };
}

module.exports = { generateCaption, getHookTemplates, getEmojis, HOOK_TEMPLATES, CTA_TEMPLATES, EMOJI_BY_MOOD };
