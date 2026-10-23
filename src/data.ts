export interface Channel {
  id: string
  name: string
  handle: string
  avatar: string
  banner: string
  subscribers: number
  description: string
  joined: string
  category: string
  verified: boolean
}

export interface Chapter {
  time: string
  seconds: number
  title: string
}

export interface Video {
  id: string
  title: string
  channelId: string
  category: string
  duration: number
  views: number
  likes: number
  comments: number
  age: string
  publishedAt: string
  thumb: string
  video: string
  badge?: string
  thumbText?: string
  description: string
  tags: string[]
  chapters?: Chapter[]
  custom?: boolean
}

export interface Short {
  id: string
  title: string
  channelId: string
  thumb: string
  video: string
  views: number
  likes: number
  comments: number
  hashtags: string[]
}

export interface CommentItem {
  id: string
  author: string
  avatar: string
  text: string
  likes: number
  age: string
  replies: number
  hearted?: boolean
  pinned?: boolean
}

export const channels: Channel[] = [
  {
    id: 'techtonic',
    name: 'TechTonic',
    handle: '@TechTonic',
    avatar: '/avatars/a1.jpg',
    banner: '/thumbs/banner1.jpg',
    subscribers: 8420000,
    description:
      'Tech that actually makes life better. Deep dives, honest reviews, and the occasional desk build. New videos every Tuesday and Friday. Business: hello@techtonic.studio',
    joined: 'Mar 14, 2016',
    category: 'Technology',
    verified: true,
  },
  {
    id: 'codepulse',
    name: 'CodePulse',
    handle: '@CodePulse',
    avatar: '/avatars/a2.jpg',
    banner: '/thumbs/banner2.jpg',
    subscribers: 2410000,
    description:
      'Practical software engineering, without the fluff. I build real products in public and break down the decisions behind them. Source code in every description.',
    joined: 'Aug 2, 2018',
    category: 'Technology',
    verified: true,
  },
  {
    id: 'framebyframe',
    name: 'Frame by Frame',
    handle: '@framebyframe',
    avatar: '/avatars/a3.jpg',
    banner: '/thumbs/banner3.jpg',
    subscribers: 1280000,
    description:
      'A channel about the craft of filmmaking — lighting, lenses, color and the tiny decisions that make a frame unforgettable.',
    joined: 'Jan 19, 2017',
    category: 'Film',
    verified: true,
  },
  {
    id: 'driftdine',
    name: 'Drift & Dine',
    handle: '@DriftandDine',
    avatar: '/avatars/a4.jpg',
    banner: '/thumbs/banner1.jpg',
    subscribers: 4730000,
    description:
      'Travel far, eat local. We chase the best food in the world and show you how to find it. New episodes every other Sunday.',
    joined: 'Jun 8, 2015',
    category: 'Food',
    verified: true,
  },
  {
    id: 'aperturelab',
    name: 'Aperture Lab',
    handle: '@ApertureLab',
    avatar: '/avatars/a5.jpg',
    banner: '/thumbs/banner2.jpg',
    subscribers: 986000,
    description:
      'Photography tutorials, gear tests and behind-the-scenes breakdowns. Learn to make images that feel like something.',
    joined: 'Nov 21, 2019',
    category: 'Photography',
    verified: true,
  },
  {
    id: 'studionorth',
    name: 'Studio North',
    handle: '@StudioNorth',
    avatar: '/avatars/a6.jpg',
    banner: '/thumbs/banner3.jpg',
    subscribers: 3150000,
    description:
      'Music, mixes and studio stories from a cabin in the north. Home of the Late Night Sessions.',
    joined: 'Feb 3, 2014',
    category: 'Music',
    verified: true,
  },
  {
    id: 'novamind',
    name: 'Nova Mind',
    handle: '@NovaMind',
    avatar: '/avatars/a7.jpg',
    banner: '/thumbs/banner1.jpg',
    subscribers: 5620000,
    description:
      'Curiosity, explained. Science, psychology and the strange mechanics of everyday life. New essays every week.',
    joined: 'Apr 27, 2018',
    category: 'Science',
    verified: true,
  },
  {
    id: 'gamegrid',
    name: 'GameGrid',
    handle: '@GameGrid',
    avatar: '/avatars/a8.jpg',
    banner: '/thumbs/banner2.jpg',
    subscribers: 6080000,
    description:
      'Retro, modern, and everything in between. Long-form reviews, rankings and the history behind the games we love.',
    joined: 'Sep 12, 2013',
    category: 'Gaming',
    verified: true,
  },
  {
    id: 'designdrip',
    name: 'DesignDrip',
    handle: '@DesignDrip',
    avatar: '/avatars/a9.jpg',
    banner: '/thumbs/banner3.jpg',
    subscribers: 1740000,
    description:
      'Brand design, typography and creative process. Making the internet a little less ugly, one video at a time.',
    joined: 'Jul 30, 2020',
    category: 'Design',
    verified: true,
  },
  {
    id: 'peakpursuit',
    name: 'Peak Pursuit',
    handle: '@PeakPursuit',
    avatar: '/avatars/a10.jpg',
    banner: '/thumbs/banner1.jpg',
    subscribers: 2890000,
    description:
      'Big days outside. Trail running, climbing and the occasional terrible idea. Filmed by people who would rather be outside.',
    joined: 'May 16, 2016',
    category: 'Outdoors',
    verified: true,
  },
  {
    id: 'ironoak',
    name: 'Iron & Oak',
    handle: '@IronandOak',
    avatar: '/avatars/a11.jpg',
    banner: '/thumbs/banner2.jpg',
    subscribers: 3610000,
    description:
      'Building things that last. Timber framing, furniture and off-grid cabins — with real mistakes included.',
    joined: 'Oct 4, 2012',
    category: 'DIY',
    verified: true,
  },
  {
    id: 'dailybyte',
    name: 'The Daily Byte',
    handle: '@TheDailyByte',
    avatar: '/avatars/a12.jpg',
    banner: '/thumbs/banner3.jpg',
    subscribers: 1920000,
    description:
      'The stories behind the products and people shaping technology. Sharp, researched, and under 15 minutes.',
    joined: 'Jan 11, 2021',
    category: 'News',
    verified: true,
  },
  {
    id: 'you',
    name: 'Alex Morgan',
    handle: '@alexmorgan',
    avatar: '/avatars/a8.jpg',
    banner: '/thumbs/banner1.jpg',
    subscribers: 128,
    description:
      'Just here for the good stuff. Occasionally uploads experiments from the desk.',
    joined: 'Mar 12, 2024',
    category: 'Personal',
    verified: false,
  },
]

export const channelById = (id: string) => channels.find((c) => c.id === id)

const desc = (intro: string, body: string, subscribe = false) =>
  `${intro}

${body}

${subscribe ? 'Thanks for watching — subscribe for a new video every week.\n\n' : ''}Chapters
00:00 Intro
01:24 The setup
04:38 The build
09:12 Testing it out
13:50 What I learned

#technology #creator #filmmaking`

export const videos: Video[] = [
  {
    id: 'dream-desk',
    title: 'I Built a $10,000 Dream Desk Setup (Full Tour)',
    channelId: 'techtonic',
    category: 'Technology',
    duration: 1122,
    views: 2431000,
    likes: 98400,
    comments: 2140,
    age: '3 days ago',
    publishedAt: '2026-10-20',
    thumb: '/thumbs/desk.jpg',
    video: '/videos/sample.mp4',
    badge: '4K',
    thumbText: 'DREAM SETUP',
    description: desc(
      'It started with one monitor. It ended with a custom walnut desk, hidden cable runs, and a lighting rig I am slightly embarrassed by.',
      'In this one I break down every piece of the build, what I would do differently, and the three upgrades that actually changed how I work. There is also a full parts list in the pinned comment.',
    ),
    tags: ['desk setup', 'workspace', 'tech', 'productivity', 'setup tour'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'The one-monitor problem' },
      { time: '01:24', seconds: 84, title: 'Desk and cable management' },
      { time: '04:38', seconds: 278, title: 'Monitors and lighting' },
      { time: '09:12', seconds: 552, title: 'The final tour' },
      { time: '13:50', seconds: 830, title: 'What I would change' },
    ],
  },
  {
    id: 'local-ai',
    title: 'Why Everyone Is Switching to Local AI',
    channelId: 'codepulse',
    category: 'Technology',
    duration: 728,
    views: 1842000,
    likes: 113200,
    comments: 3860,
    age: '2 days ago',
    publishedAt: '2026-10-21',
    thumb: '/thumbs/ai.jpg',
    video: '/videos/sintel.mp4',
    badge: 'NEW',
    thumbText: 'LOCAL AI',
    description: desc(
      'Cloud AI is convenient. Local AI is private, cheap, and getting shockingly good. Here is what actually changed in the last six months.',
      'I run the same set of prompts through three local models and compare the results, the hardware cost, and the real-world trade-offs. No benchmarks without context — just the numbers that matter when you are paying the electricity bill.',
    ),
    tags: ['local ai', 'llm', 'coding', 'privacy', 'machine learning', 'ollama'],
    chapters: [
      { time: '00:00', seconds: 0, title: 'The cloud bill problem' },
      { time: '02:12', seconds: 132, title: 'What changed in 2026' },
      { time: '05:40', seconds: 340, title: 'Running the tests' },
      { time: '09:18', seconds: 558, title: 'The verdict' },
    ],
  },
  {
    id: 'cinematic-color',
    title: 'The Art of Cinematic Color Grading',
    channelId: 'framebyframe',
    category: 'Film',
    duration: 866,
    views: 684000,
    likes: 41200,
    comments: 892,
    age: '1 week ago',
    publishedAt: '2026-10-16',
    thumb: '/thumbs/cinema.jpg',
    video: '/videos/pexels.mp4',
    thumbText: 'COLOR',
    description: desc(
      'Color is not a filter. It is a language. In this breakdown I walk through three looks from three films and rebuild each one from a flat log image.',
      'We cover contrast, split toning, skin-tone protection, and why the most expensive part of a grade is usually restraint. Project files are linked below.',
    ),
    tags: ['color grading', 'filmmaking', 'davinci resolve', 'cinematography', 'tutorial'],
  },
  {
    id: 'tokyo-100',
    title: '48 Hours in Tokyo on a $100 Budget',
    channelId: 'driftdine',
    category: 'Travel',
    duration: 1275,
    views: 3145000,
    likes: 187400,
    comments: 4210,
    age: '5 days ago',
    publishedAt: '2026-10-18',
    thumb: '/thumbs/tokyo.jpg',
    video: '/videos/bunny.mp4',
    badge: 'POPULAR',
    thumbText: 'TOKYO / $100',
    description: desc(
      'Tokyo can be absurdly expensive. It can also be one of the best value cities in the world if you know where to look. We gave ourselves 48 hours and exactly $100.',
      'From a 6am fish market breakfast to a tiny nine-seat yakitori counter, this is the route, the prices, and the mistakes. Everything is mapped in the description.',
    ),
    tags: ['tokyo', 'japan', 'travel', 'budget travel', 'street food', 'vlog'],
  },
  {
    id: 'fifty-dollar-camera',
    title: 'This $50 Camera Changed How I Shoot',
    channelId: 'aperturelab',
    category: 'Photography',
    duration: 577,
    views: 512000,
    likes: 32800,
    comments: 740,
    age: '4 days ago',
    publishedAt: '2026-10-19',
    thumb: '/thumbs/camera.jpg',
    video: '/videos/flower.mp4',
    thumbText: 'THE $50 CAM',
    description: desc(
      'I bought a 20-year-old point-and-shoot for $50 and used it as my only camera for a week. It made me a better photographer for reasons I did not expect.',
      'This is not a nostalgia video. It is about constraints, noticing, and why a limited tool can make your work sharper.',
    ),
    tags: ['photography', 'cheap camera', 'point and shoot', 'gear', 'street photography'],
  },
  {
    id: 'lofi-mix',
    title: 'Lo-fi Beats to Build To — 3 Hour Mix',
    channelId: 'studionorth',
    category: 'Music',
    duration: 10931,
    views: 12040000,
    likes: 421000,
    comments: 8930,
    age: '1 year ago',
    publishedAt: '2025-10-23',
    thumb: '/thumbs/studio.jpg',
    video: '/videos/pexels.mp4',
    badge: '3H MIX',
    thumbText: 'LATE NIGHT',
    description: desc(
      'A three-hour mix of warm, dusty beats for deep work. Recorded live in the cabin with the window open — you can hear the rain in a few of these.',
      'Tracklist with timestamps is below. Put it on, get something made, and let me know what you build.',
    ),
    tags: ['lofi', 'study music', 'focus', 'beats', 'mix', 'work music'],
  },
  {
    id: 'best-ramen',
    title: "I Tried the World's Best Ramen (5 Cities)",
    channelId: 'driftdine',
    category: 'Food',
    duration: 964,
    views: 5720000,
    likes: 312000,
    comments: 6740,
    age: '2 weeks ago',
    publishedAt: '2026-10-09',
    thumb: '/thumbs/ramen.jpg',
    video: '/videos/bunny.mp4',
    badge: 'FOOD',
    thumbText: 'RAMEN RANKED',
    description: desc(
      'Five cities. Five bowls. One very full camera operator. We went from Sapporo miso to a tiny Fukuoka yatai to find the bowl that stays with you.',
      'This is a love letter to broth, noodles, and the people who get up at 4am to make them. Ranking at the end — feel free to disagree loudly.',
    ),
    tags: ['ramen', 'food', 'japan', 'tokyo', 'best food', 'travel'],
  },
  {
    id: 'basketball-physics',
    title: 'The Physics of a Perfect Basketball Shot',
    channelId: 'novamind',
    category: 'Science',
    duration: 712,
    views: 1240000,
    likes: 74100,
    comments: 1320,
    age: '6 days ago',
    publishedAt: '2026-10-17',
    thumb: '/thumbs/basketball.jpg',
    video: '/videos/sample.mp4',
    thumbText: 'PERFECT SHOT',
    description: desc(
      'There is a surprising amount of physics in a free throw: launch angle, backspin, release height, and the tiny margin between a swish and a brick.',
      'We built a slow-motion rig, collected 500 shots, and found the one variable that separated the good shooters from the great ones.',
    ),
    tags: ['physics', 'basketball', 'sports science', 'math', 'slow motion'],
  },
  {
    id: 'pokemon-ranking',
    title: 'Ranking Every Pokémon Game (Worst to Best)',
    channelId: 'gamegrid',
    category: 'Gaming',
    duration: 1939,
    views: 4360000,
    likes: 241000,
    comments: 9870,
    age: '3 weeks ago',
    publishedAt: '2026-10-02',
    thumb: '/thumbs/arcade.jpg',
    video: '/videos/bunny.mp4',
    badge: '32 MIN',
    thumbText: 'EVERY GAME',
    description: desc(
      'Every mainline Pokémon game, ranked. This took two months, a lot of spreadsheets, and one very heated argument about Black and White.',
      'We factored in story, region design, mechanics, and how each game holds up today. The full spreadsheet is linked below if you want to yell at the numbers.',
    ),
    tags: ['pokemon', 'ranking', 'gaming', 'nintendo', 'retro'],
  },
  {
    id: 'brand-60',
    title: 'Designing a Brand in 60 Minutes',
    channelId: 'designdrip',
    category: 'Design',
    duration: 501,
    views: 890000,
    likes: 58600,
    comments: 1100,
    age: '1 day ago',
    publishedAt: '2026-10-22',
    thumb: '/thumbs/design.jpg',
    video: '/videos/flower.mp4',
    badge: 'NEW',
    thumbText: '60 MIN BRAND',
    description: desc(
      'A real client brief, a real timer, and no moodboard safety net. Watch me take a coffee roastery from a name to a full visual identity in one hour.',
      'The point is not perfection — it is the decisions. I explain every choice, including the two dead ends I walked into.',
    ),
    tags: ['graphic design', 'branding', 'design process', 'logo', 'typography'],
  },
  {
    id: 'desert-100',
    title: 'I Ran 100 Miles in the Desert',
    channelId: 'peakpursuit',
    category: 'Outdoors',
    duration: 1488,
    views: 2910000,
    likes: 164000,
    comments: 3520,
    age: '1 week ago',
    publishedAt: '2026-10-16',
    thumb: '/thumbs/desert.jpg',
    video: '/videos/pexels.mp4',
    badge: 'FILM',
    thumbText: '100 MILES',
    description: desc(
      'One hundred miles across the Mojave in under 30 hours. This is what it actually felt like — the good miles, the bad miles, and the hallucinations at 3am.',
      'Huge thanks to the crew who crewed, the strangers who fed us, and the desert for being exactly as unforgiving as advertised.',
    ),
    tags: ['running', 'ultramarathon', 'desert', 'endurance', 'documentary'],
  },
  {
    id: 'cabin-build',
    title: 'Building a Cabin in the Woods (Timelapse)',
    channelId: 'ironoak',
    category: 'DIY',
    duration: 1173,
    views: 7410000,
    likes: 402000,
    comments: 5120,
    age: '2 months ago',
    publishedAt: '2026-08-23',
    thumb: '/thumbs/cabin.jpg',
    video: '/videos/bunny.mp4',
    badge: 'BUILD',
    thumbText: '6 MONTHS',
    description: desc(
      'Six months, two builders, and 1,200 board feet of cedar. Here is the whole cabin timelapse from the first stake to the first fire.',
      'We made plenty of mistakes and left most of them in. Detailed plans, lumber list, and lessons learned are available on the build log.',
    ),
    tags: ['cabin', 'timelapse', 'woodworking', 'off grid', 'diy', 'build'],
  },
  {
    id: 'ev-truth',
    title: 'The Truth About EV Batteries',
    channelId: 'techtonic',
    category: 'Technology',
    duration: 910,
    views: 1530000,
    likes: 87200,
    comments: 2890,
    age: '4 days ago',
    publishedAt: '2026-10-19',
    thumb: '/thumbs/ev.jpg',
    video: '/videos/sintel.mp4',
    thumbText: 'EV BATTERIES',
    description: desc(
      'Do EV batteries really die after eight years? We talk to battery engineers, look at real fleet data, and separate the myths from the chemistry.',
      'The short answer is more interesting than the headline. The long answer involves degradation curves, thermal management, and why where you live matters more than how you drive.',
    ),
    tags: ['ev', 'battery', 'electric car', 'technology', 'sustainability'],
  },
  {
    id: 'ten-million-app',
    title: 'How This 19-Year-Old Built a $10M App',
    channelId: 'dailybyte',
    category: 'News',
    duration: 824,
    views: 2210000,
    likes: 109400,
    comments: 1930,
    age: '2 days ago',
    publishedAt: '2026-10-21',
    thumb: '/thumbs/startup.jpg',
    video: '/videos/sample.mp4',
    badge: 'STORY',
    thumbText: 'BUILT AT 19',
    description: desc(
      'No funding, no team, no computer science degree. The story of how a student turned a study app into a business doing eight figures — and what happened next.',
      'We spoke to the founder, early users, and one very skeptical investor. This is the version without the LinkedIn gloss.',
    ),
    tags: ['startup', 'founder', 'business', 'technology', 'interview'],
  },
  {
    id: 'michelin-mornings',
    title: 'Morning Routine of a Michelin Chef',
    channelId: 'driftdine',
    category: 'Food',
    duration: 629,
    views: 943000,
    likes: 51200,
    comments: 811,
    age: '5 days ago',
    publishedAt: '2026-10-18',
    thumb: '/thumbs/chef.jpg',
    video: '/videos/flower.mp4',
    thumbText: '4AM KITCHEN',
    description: desc(
      'Before the first guest arrives, there are six hours of work. We follow Chef Ana Ruiz through a morning at her two-star kitchen in Lisbon.',
      'It is quiet, precise, and far less glamorous than the dining room. That is exactly why I wanted to film it.',
    ),
    tags: ['chef', 'michelin', 'food', 'kitchen', 'documentary', 'lisbon'],
  },
  {
    id: 'focus-habits',
    title: '7 Habits That Ruined Your Focus',
    channelId: 'novamind',
    category: 'Science',
    duration: 478,
    views: 6840000,
    likes: 391000,
    comments: 7240,
    age: '1 month ago',
    publishedAt: '2026-09-23',
    thumb: '/thumbs/focus.jpg',
    video: '/videos/pexels.mp4',
    badge: 'MOST VIEWED',
    thumbText: 'FOCUS',
    description: desc(
      'Most focus advice asks you to add something. This video is about subtraction — seven very common habits that quietly make sustained attention impossible.',
      'We look at the research, the counterarguments, and the two changes that made the biggest difference for me. No apps required.',
    ),
    tags: ['focus', 'productivity', 'psychology', 'habits', 'attention', 'science'],
  },
  {
    id: 'milky-way',
    title: 'I Photographed the Milky Way (Start to Finish)',
    channelId: 'aperturelab',
    category: 'Photography',
    duration: 1026,
    views: 1130000,
    likes: 68900,
    comments: 954,
    age: '2 weeks ago',
    publishedAt: '2026-10-09',
    thumb: '/thumbs/milkyway.jpg',
    video: '/videos/sintel.mp4',
    thumbText: 'MILKY WAY',
    description: desc(
      'Two nights, one stubborn cloud bank, and a 20-second exposure. This is the full process behind a Milky Way image — planning, shooting, stacking and editing.',
      'I also show the frames that did not work, because the failures are where most of the learning happens.',
    ),
    tags: ['astrophotography', 'milky way', 'photography', 'night sky', 'editing'],
  },
  {
    id: 'guitar-pedals',
    title: 'Every Guitar Pedal I Regret Buying',
    channelId: 'studionorth',
    category: 'Music',
    duration: 1351,
    views: 431000,
    likes: 24700,
    comments: 1630,
    age: '6 days ago',
    publishedAt: '2026-10-17',
    thumb: '/thumbs/guitar.jpg',
    video: '/videos/bunny.mp4',
    thumbText: 'PEDAL REGRETS',
    description: desc(
      'Twenty years of gear, and a drawer full of pedals that promised more than they delivered. This is the honest list — including a few that cost way too much.',
      'A pedal is not bad just because it did not work for me. I explain what each one is actually good at, and who should buy it instead.',
    ),
    tags: ['guitar', 'pedals', 'gear', 'music production', 'review'],
  },
  {
    id: 'arcade-rise',
    title: 'The Rise and Fall of Arcades',
    channelId: 'gamegrid',
    category: 'Gaming',
    duration: 1684,
    views: 3610000,
    likes: 198000,
    comments: 4820,
    age: '1 month ago',
    publishedAt: '2026-09-23',
    thumb: '/thumbs/arcades.jpg',
    video: '/videos/pexels.mp4',
    badge: 'DOCUMENTARY',
    thumbText: 'GAME OVER?',
    description: desc(
      'From smoky back rooms to shopping-mall palaces to the strange, wonderful revival happening right now — the arcade never really died.',
      'Featuring interviews with operators, collectors, and the people still driving two hours to play a machine they cannot find anywhere else.',
    ),
    tags: ['arcade', 'gaming history', 'documentary', 'retro', 'culture'],
  },
  {
    id: 'engineer-week',
    title: 'A Week in My Life as a Software Engineer',
    channelId: 'codepulse',
    category: 'Technology',
    duration: 671,
    views: 720000,
    likes: 44200,
    comments: 863,
    age: '1 day ago',
    publishedAt: '2026-10-22',
    thumb: '/thumbs/engineer.jpg',
    video: '/videos/sample.mp4',
    badge: 'NEW',
    thumbText: 'WEEK IN MY LIFE',
    description: desc(
      'Not a highlight reel. This is a normal week: standups, a production bug, code review, and the unglamorous work of making a small feature actually good.',
      'I talk about how I structure my days, how the team ships, and the parts of the job that no one puts on a landing page.',
    ),
    tags: ['software engineer', 'day in the life', 'coding', 'tech', 'career'],
  },
]

export const shorts: Short[] = [
  {
    id: 'desk-2am',
    title: 'POV: your desk at 2am',
    channelId: 'techtonic',
    thumb: '/thumbs/desknight.jpg',
    video: '/videos/flower.mp4',
    views: 12400000,
    likes: 890000,
    comments: 2140,
    hashtags: ['#desksetup', '#nightowl', '#tech'],
  },
  {
    id: 'tiny-ramen',
    title: "Tokyo's tiniest ramen shop",
    channelId: 'driftdine',
    thumb: '/thumbs/ramenshop.jpg',
    video: '/videos/sample.mp4',
    views: 8400000,
    likes: 612000,
    comments: 1870,
    hashtags: ['#tokyo', '#ramen', '#streetfood'],
  },
  {
    id: 'transition',
    title: 'This transition took 3 hours',
    channelId: 'framebyframe',
    thumb: '/thumbs/transition.jpg',
    video: '/videos/pexels.mp4',
    views: 2100000,
    likes: 143000,
    comments: 420,
    hashtags: ['#filmmaking', '#transition', '#behindthescenes'],
  },
  {
    id: 'keyboard-sounds',
    title: 'Satisfying keyboard sounds',
    channelId: 'codepulse',
    thumb: '/thumbs/keyboard.jpg',
    video: '/videos/sintel.mp4',
    views: 4700000,
    likes: 301000,
    comments: 980,
    hashtags: ['#keyboard', '#asmr', '#coding'],
  },
  {
    id: 'sunrise-clouds',
    title: 'Sunrise above the clouds',
    channelId: 'peakpursuit',
    thumb: '/thumbs/sunrise.jpg',
    video: '/videos/bunny.mp4',
    views: 1900000,
    likes: 118000,
    comments: 310,
    hashtags: ['#sunrise', '#hiking', '#nature'],
  },
  {
    id: 'one-chord',
    title: 'One chord, endless vibes',
    channelId: 'studionorth',
    thumb: '/thumbs/guitar2.jpg',
    video: '/videos/sample.mp4',
    views: 3200000,
    likes: 204000,
    comments: 670,
    hashtags: ['#guitar', '#music', '#chords'],
  },
  {
    id: 'coffee-pour',
    title: 'The perfect 6am pour',
    channelId: 'driftdine',
    thumb: '/thumbs/coffee.jpg',
    video: '/videos/flower.mp4',
    views: 980000,
    likes: 64000,
    comments: 190,
    hashtags: ['#coffee', '#morning', '#asmr'],
  },
]

const baseComments: CommentItem[] = [
  {
    id: 'c1',
    author: 'Maya Chen',
    avatar: '/avatars/a2.jpg',
    text: 'The pacing of this video is insane. No filler, no five-minute intro — just the good stuff. Instantly subscribed.',
    likes: 1842,
    age: '2 days ago',
    replies: 24,
    hearted: true,
    pinned: true,
  },
  {
    id: 'c2',
    author: 'Daniel Ortiz',
    avatar: '/avatars/a1.jpg',
    text: 'That overhead shot at 6:42 is doing something to my brain. Anyone know what lens they used?',
    likes: 621,
    age: '1 day ago',
    replies: 41,
  },
  {
    id: 'c3',
    author: 'Priya Raman',
    avatar: '/avatars/a4.jpg',
    text: 'I have been in this hobby for ten years and still learned three new things. The part about keeping the old setup for a week is genuinely great advice.',
    likes: 398,
    age: '3 days ago',
    replies: 12,
  },
  {
    id: 'c4',
    author: 'Theo Lindqvist',
    avatar: '/avatars/a3.jpg',
    text: 'Watched this at 1.5x and still had to rewind twice. So much detail packed in here.',
    likes: 287,
    age: '20 hours ago',
    replies: 8,
  },
  {
    id: 'c5',
    author: 'Jules Bennett',
    avatar: '/avatars/a6.jpg',
    text: 'The editing on the chapter transitions deserves its own video. Clean, subtle, never distracting.',
    likes: 214,
    age: '5 days ago',
    replies: 3,
  },
  {
    id: 'c6',
    author: 'Sofia Almeida',
    avatar: '/avatars/a5.jpg',
    text: 'Came for the tutorial, stayed for the storytelling. This channel keeps getting better.',
    likes: 176,
    age: '1 week ago',
    replies: 6,
  },
  {
    id: 'c7',
    author: 'Marcus Lee',
    avatar: '/avatars/a7.jpg',
    text: 'Underrated detail: the sound design. You can hear the room change when they move outside. That is care.',
    likes: 143,
    age: '4 days ago',
    replies: 2,
  },
  {
    id: 'c8',
    author: 'Nina Park',
    avatar: '/avatars/a10.jpg',
    text: 'I tried the first tip this morning and it actually worked. Rare that a video delivers on its title.',
    likes: 98,
    age: '18 hours ago',
    replies: 4,
  },
]

export const commentsFor = (videoId: string): CommentItem[] => {
  const offset = videoId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 4
  const rotated = [...baseComments.slice(offset), ...baseComments.slice(0, offset)]
  return rotated.slice(0, 7).map((c, i) => ({ ...c, id: `${videoId}-c${i}` }))
}

export const notifications = [
  {
    id: 'n1',
    avatar: '/avatars/a1.jpg',
    thumb: '/thumbs/desk.jpg',
    title: 'TechTonic uploaded: I Built a $10,000 Dream Desk Setup',
    time: '2 hours ago',
    read: false,
    href: '#/watch/dream-desk',
  },
  {
    id: 'n2',
    avatar: '/avatars/a4.jpg',
    thumb: '/thumbs/ramen.jpg',
    title: 'Drift & Dine uploaded: I Tried the World’s Best Ramen',
    time: '1 day ago',
    read: false,
    href: '#/watch/best-ramen',
  },
  {
    id: 'n3',
    avatar: '/avatars/a2.jpg',
    thumb: '',
    title: 'CodePulse replied to your comment',
    time: '2 days ago',
    read: false,
    href: '#/watch/local-ai',
  },
  {
    id: 'n4',
    avatar: '/avatars/a8.jpg',
    thumb: '/thumbs/arcade.jpg',
    title: 'GameGrid uploaded: Ranking Every Pokémon Game',
    time: '3 weeks ago',
    read: true,
    href: '#/watch/pokemon-ranking',
  },
]

export const searchSuggestions = [
  'desk setup tour 2026',
  'local ai models',
  'tokyo street food',
  'color grading tutorial',
  'best budget camera',
  'lofi beats',
  'milky way photography',
  'guitar pedal review',
  'focus and productivity',
  'arcade documentary',
]

export const homeChips = [
  'All',
  'Music',
  'Gaming',
  'Technology',
  'Film',
  'Travel',
  'Food',
  'Photography',
  'Science',
  'Design',
  'Outdoors',
  'DIY',
  'News',
  'Live',
  'Podcasts',
]

export const formatViews = (n: number): string => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export const formatFull = (n: number): string => new Intl.NumberFormat('en-US').format(n)

export const plural = (n: number, singular: string, pluralWord?: string): string =>
  `${n} ${n === 1 ? singular : pluralWord ?? `${singular}s`}`

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export const formatPublished = (date: string): string => {
  const d = new Date(date + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const videoById = (id: string, extra: Video[] = []) =>
  [...extra, ...videos].find((v) => v.id === id)

export const videosForChannel = (channelId: string, extra: Video[] = []) =>
  [...extra, ...videos].filter((v) => v.channelId === channelId)

export const relatedVideos = (video: Video, extra: Video[] = []) => {
  const all = [...extra, ...videos].filter((v) => v.id !== video.id)
  const sameChannel = all.filter((v) => v.channelId === video.channelId)
  const sameCategory = all.filter((v) => v.channelId !== video.channelId && v.category === video.category)
  const rest = all.filter((v) => v.channelId !== video.channelId && v.category !== video.category)
  return [...sameCategory, ...sameChannel, ...rest].slice(0, 12)
}

export const searchVideos = (query: string, extra: Video[] = []) => {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  return [...extra, ...videos]
    .map((v) => {
      const channel = channelById(v.channelId)
      const haystack = `${v.title} ${v.category} ${v.tags.join(' ')} ${channel?.name ?? ''} ${v.description}`.toLowerCase()
      let score = 0
      for (const t of terms) {
        if (v.title.toLowerCase().includes(t)) score += 8
        if (v.tags.some((tag) => tag.toLowerCase().includes(t))) score += 4
        if (channel?.name.toLowerCase().includes(t)) score += 3
        if (haystack.includes(t)) score += 1
      }
      return { v, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.v)
}
