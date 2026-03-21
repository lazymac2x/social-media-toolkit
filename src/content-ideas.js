/**
 * Content ideas generator — rule-based templates by niche.
 */

const CONTENT_FORMATS = ['carousel', 'reel', 'story', 'single_image', 'video', 'live', 'text_post', 'poll', 'thread'];

const NICHE_IDEAS = {
  tech: [
    { title: 'Tool comparison post', format: 'carousel', description: 'Compare 3-5 tools in your stack side by side with pros/cons.' },
    { title: 'Day in the life of a developer', format: 'reel', description: 'Show your setup, workflow, and daily routine.' },
    { title: 'Bug fix story', format: 'story', description: 'Share a tricky bug you solved and how you debugged it.' },
    { title: 'Tech hot takes', format: 'text_post', description: 'Share a controversial opinion about a trending tech topic.' },
    { title: 'Before/After code refactor', format: 'carousel', description: 'Show messy code vs clean code transformation.' },
    { title: 'Setup tour', format: 'reel', description: 'Show your desk setup, hardware, and favorite tools.' },
    { title: 'Tutorial thread', format: 'thread', description: 'Step-by-step tutorial for a common coding task.' },
    { title: '"Things I wish I knew" list', format: 'carousel', description: 'Share lessons from your experience in tech.' },
    { title: 'Live coding session', format: 'live', description: 'Build something from scratch live with audience interaction.' },
    { title: 'Tech news reaction', format: 'reel', description: 'React to and explain a recent tech announcement.' }
  ],
  fitness: [
    { title: 'Workout routine breakdown', format: 'carousel', description: 'Share a full workout with sets, reps, and form tips.' },
    { title: 'Transformation timeline', format: 'reel', description: 'Show your fitness journey progress over time.' },
    { title: 'Meal prep guide', format: 'carousel', description: 'Step-by-step meal prep for the week.' },
    { title: 'Exercise myth busters', format: 'text_post', description: 'Debunk common fitness myths with science.' },
    { title: 'Quick home workout', format: 'reel', description: '5-minute no-equipment workout anyone can do.' },
    { title: 'Supplement review', format: 'carousel', description: 'Honest review of popular supplements.' },
    { title: 'Form check tips', format: 'reel', description: 'Common form mistakes and how to fix them.' },
    { title: 'Fitness Q&A', format: 'live', description: 'Answer audience fitness questions live.' },
    { title: 'Healthy recipe share', format: 'reel', description: 'Quick healthy recipe that fits your macros.' },
    { title: 'Rest day routine', format: 'story', description: 'Show what you do on rest days for recovery.' }
  ],
  food: [
    { title: 'Recipe in 60 seconds', format: 'reel', description: 'Fast-paced cooking video of a complete dish.' },
    { title: 'Restaurant review', format: 'carousel', description: 'Rate food, ambiance, and value at a local spot.' },
    { title: 'Kitchen hack compilation', format: 'reel', description: 'Share 5 kitchen hacks that save time.' },
    { title: 'Ingredient spotlight', format: 'carousel', description: 'Deep dive into one ingredient and 3 ways to use it.' },
    { title: 'Budget meal challenge', format: 'reel', description: 'Create a full meal for under $5.' },
    { title: 'Taste test ranking', format: 'carousel', description: 'Rank different brands of the same product.' },
    { title: 'Cultural food exploration', format: 'reel', description: 'Try and explain a dish from a different culture.' },
    { title: 'Food poll', format: 'poll', description: 'Ask followers to vote between two dishes or ingredients.' },
    { title: 'Grocery haul', format: 'story', description: 'Share your weekly grocery haul and explain choices.' },
    { title: 'Cooking fail to success', format: 'reel', description: 'Show a cooking disaster and how you fixed it.' }
  ],
  travel: [
    { title: 'Hidden gems guide', format: 'carousel', description: 'Share lesser-known spots in a popular destination.' },
    { title: 'Packing essentials', format: 'carousel', description: 'Show must-have items for a specific type of trip.' },
    { title: 'Budget travel breakdown', format: 'text_post', description: 'Full cost breakdown of a recent trip.' },
    { title: 'Travel vlog snippet', format: 'reel', description: 'Best moments from a recent trip in 30 seconds.' },
    { title: 'Local food tour', format: 'reel', description: 'Try local street food and share honest reactions.' },
    { title: 'Before/After expectations', format: 'carousel', description: 'Expectation vs reality of popular tourist spots.' },
    { title: 'Travel tips thread', format: 'thread', description: 'Share your top travel tips for a destination.' },
    { title: 'Accommodation review', format: 'carousel', description: 'Honest review of where you stayed.' },
    { title: 'Day itinerary', format: 'carousel', description: 'Hour-by-hour itinerary for one perfect day.' },
    { title: 'Travel poll', format: 'poll', description: 'Ask followers: beach or mountains?' }
  ],
  business: [
    { title: 'Revenue breakdown', format: 'carousel', description: 'Share (anonymized) revenue streams and lessons learned.' },
    { title: 'Morning routine', format: 'reel', description: 'Show your productive morning routine as an entrepreneur.' },
    { title: 'Tool stack reveal', format: 'carousel', description: 'Share the tools you use to run your business.' },
    { title: 'Client win story', format: 'text_post', description: 'Share a success story (with permission) from a client.' },
    { title: 'Mistakes I made', format: 'carousel', description: 'Share business mistakes and what you learned.' },
    { title: 'Industry prediction', format: 'text_post', description: 'Share your predictions for the next year in your industry.' },
    { title: 'Productivity hack', format: 'reel', description: 'Share one productivity technique that changed your work.' },
    { title: 'Book recommendation', format: 'carousel', description: 'Top 5 business books and key takeaway from each.' },
    { title: 'Behind the scenes', format: 'story', description: 'Show the real behind-the-scenes of running your business.' },
    { title: 'Ask Me Anything', format: 'live', description: 'Host a live AMA about your industry or journey.' }
  ],
  fashion: [
    { title: 'Outfit of the day', format: 'reel', description: 'Style a complete outfit with brand tags and pricing.' },
    { title: 'Capsule wardrobe guide', format: 'carousel', description: 'Show how to build a versatile wardrobe with fewer pieces.' },
    { title: 'Thrift haul', format: 'reel', description: 'Show amazing finds from a thrift store trip.' },
    { title: 'Style challenge', format: 'reel', description: 'Style one piece 5 different ways.' },
    { title: 'Trend forecast', format: 'carousel', description: 'Predict and explain upcoming fashion trends.' },
    { title: 'Get ready with me', format: 'reel', description: 'Full GRWM from outfit selection to accessories.' },
    { title: 'Wardrobe declutter', format: 'story', description: 'Document your wardrobe cleanup and donate pile.' },
    { title: 'Budget vs luxury comparison', format: 'carousel', description: 'Compare affordable alternatives to luxury items.' },
    { title: 'Style poll', format: 'poll', description: 'Ask followers to choose between two outfit options.' },
    { title: 'Seasonal must-haves', format: 'carousel', description: 'Essential pieces for the current season.' }
  ],
  education: [
    { title: 'Study tips carousel', format: 'carousel', description: 'Share science-backed study techniques.' },
    { title: 'Concept explainer', format: 'reel', description: 'Explain a complex concept in 60 seconds.' },
    { title: 'Resource roundup', format: 'carousel', description: 'Share free learning resources for a topic.' },
    { title: 'Myth vs fact', format: 'carousel', description: 'Debunk common misconceptions in your field.' },
    { title: 'Book summary', format: 'carousel', description: 'Key takeaways from an educational book.' },
    { title: 'Learn with me', format: 'reel', description: 'Document your learning process for a new skill.' },
    { title: 'Quick quiz', format: 'poll', description: 'Test your audience with a fun quiz question.' },
    { title: 'Career path breakdown', format: 'carousel', description: 'Explain how to get started in a specific career.' },
    { title: 'Productivity setup', format: 'reel', description: 'Show your study or work setup and tools.' },
    { title: 'Live study session', format: 'live', description: 'Study or work alongside your audience.' }
  ],
  gaming: [
    { title: 'Game review', format: 'carousel', description: 'Rate graphics, gameplay, story, and value.' },
    { title: 'Tips and tricks', format: 'reel', description: 'Share pro tips for a popular game.' },
    { title: 'Setup tour', format: 'reel', description: 'Show your gaming setup with gear list.' },
    { title: 'Gameplay highlights', format: 'reel', description: 'Best moments from a recent gaming session.' },
    { title: 'Game comparison', format: 'carousel', description: 'Compare two similar games head to head.' },
    { title: 'Controller vs keyboard debate', format: 'poll', description: 'Get audience opinions on input methods.' },
    { title: 'Speedrun attempt', format: 'reel', description: 'Try to speedrun a level and share the result.' },
    { title: 'Game tier list', format: 'carousel', description: 'Rank games in a genre from S to F tier.' },
    { title: 'Live gameplay', format: 'live', description: 'Stream gameplay and interact with viewers.' },
    { title: 'Nostalgia post', format: 'carousel', description: 'Revisit classic games and share memories.' }
  ]
};

// Generic templates for niches not in the database
const GENERIC_IDEAS = [
  { title: 'Top 5 tips for beginners', format: 'carousel', description: 'Share essential tips for someone starting in {niche}.' },
  { title: 'Day in the life', format: 'reel', description: 'Show a typical day in your {niche} journey.' },
  { title: 'Common mistakes to avoid', format: 'carousel', description: '5 mistakes beginners make in {niche} and how to fix them.' },
  { title: 'Q&A session', format: 'live', description: 'Answer audience questions about {niche}.' },
  { title: 'Before and after', format: 'carousel', description: 'Show your progress or transformation in {niche}.' },
  { title: 'Resource list', format: 'carousel', description: 'Share your favorite resources for learning {niche}.' },
  { title: 'Myth busting', format: 'text_post', description: 'Debunk common myths about {niche}.' },
  { title: 'Challenge accepted', format: 'reel', description: 'Take on a fun challenge related to {niche}.' },
  { title: 'Behind the scenes', format: 'story', description: 'Show the real work behind your {niche} content.' },
  { title: 'Hot take', format: 'text_post', description: 'Share a controversial opinion about {niche}.' },
  { title: 'Tutorial', format: 'reel', description: 'Teach one actionable skill related to {niche}.' },
  { title: 'Community poll', format: 'poll', description: 'Ask your audience a fun question about {niche}.' }
];

/**
 * Generate content ideas for a niche.
 */
function generateContentIdeas(niche, options = {}) {
  const { count = 10, format } = options;
  const nicheKey = niche.toLowerCase().trim();

  let ideas;
  if (NICHE_IDEAS[nicheKey]) {
    ideas = [...NICHE_IDEAS[nicheKey]];
  } else {
    ideas = GENERIC_IDEAS.map(idea => ({
      ...idea,
      title: idea.title.replace(/\{niche\}/g, niche),
      description: idea.description.replace(/\{niche\}/g, niche)
    }));
  }

  // Filter by format if specified
  if (format) {
    ideas = ideas.filter(i => i.format === format.toLowerCase());
  }

  // Shuffle
  for (let i = ideas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ideas[i], ideas[j]] = [ideas[j], ideas[i]];
  }

  ideas = ideas.slice(0, count);

  return {
    niche: nicheKey,
    count: ideas.length,
    ideas,
    available_niches: Object.keys(NICHE_IDEAS),
    available_formats: CONTENT_FORMATS
  };
}

module.exports = { generateContentIdeas, NICHE_IDEAS, CONTENT_FORMATS };
