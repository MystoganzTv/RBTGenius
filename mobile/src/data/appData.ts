export type RouteKey =
  | 'Dashboard'
  | 'Practice'
  | 'MockExams'
  | 'AITutor'
  | 'Analytics'
  | 'Flashcards'
  | 'Pricing'
  | 'Profile'
  | 'More';

export const primaryTabs: RouteKey[] = [
  'Dashboard',
  'Practice',
  'MockExams',
  'AITutor',
  'More',
];

export const routeMeta: Record<
  RouteKey,
  { subtitle: string; title: string }
> = {
  Dashboard: {
    title: 'Dashboard',
    subtitle: 'Your exam readiness and study momentum',
  },
  Practice: {
    title: 'Practice',
    subtitle: 'Mobile-friendly questions by domain',
  },
  MockExams: {
    title: 'Mock Exams',
    subtitle: 'Timed simulations that feel closer to test day',
  },
  AITutor: {
    title: 'AI Tutor',
    subtitle: 'Fast explanations, mnemonics and coaching',
  },
  Analytics: {
    title: 'Analytics',
    subtitle: 'Performance insights across the week',
  },
  Flashcards: {
    title: 'Flashcards',
    subtitle: 'Rapid recall built for short mobile sessions',
  },
  Pricing: {
    title: 'Pricing',
    subtitle: 'Free and premium plans for different study styles',
  },
  Profile: {
    title: 'Profile',
    subtitle: 'Your account, goals and app preferences',
  },
  More: {
    title: 'More',
    subtitle: 'Extra tools and account sections',
  },
};

export const appUser = {
  completedQuestions: 248,
  firstName: 'Student',
  goal: 'Preparing for the RBT exam in 4 weeks',
  initials: 'ST',
  name: 'Student Learner',
  planLabel: 'Free Plan',
  readiness: 84,
  streak: 3,
};

export const quickLinks: Array<{
  accent: 'primary' | 'gold' | 'success';
  description: string;
  route: RouteKey;
  title: string;
}> = [
  {
    accent: 'primary',
    route: 'Practice',
    title: 'Practice Questions',
    description: 'Test your knowledge with focused question sets.',
  },
  {
    accent: 'gold',
    route: 'MockExams',
    title: 'Mock Exam',
    description: 'Simulate the real test with time pressure and pacing.',
  },
  {
    accent: 'success',
    route: 'AITutor',
    title: 'AI Tutor',
    description: 'Ask for hints, explanations and memory hooks.',
  },
  {
    accent: 'primary',
    route: 'Flashcards',
    title: 'Flashcards',
    description: 'Drill quick concepts during short study blocks.',
  },
];

export const domainStats: Array<{
  accent: 'primary' | 'gold' | 'success';
  label: string;
  mastery: number;
  recommendation: string;
  status: string;
}> = [
  {
    accent: 'success',
    label: 'Measurement',
    mastery: 92,
    recommendation: 'Keep this sharp with mixed-review sets twice a week.',
    status: 'Exam Ready',
  },
  {
    accent: 'gold',
    label: 'Assessment',
    mastery: 81,
    recommendation: 'Review preference assessments and indirect measures.',
    status: 'Almost There',
  },
  {
    accent: 'primary',
    label: 'Skill Acquisition',
    mastery: 76,
    recommendation: 'Spend time on prompting, shaping and fading decisions.',
    status: 'Keep Studying',
  },
  {
    accent: 'gold',
    label: 'Behavior Reduction',
    mastery: 79,
    recommendation: 'Practice matching strategies to the function of behavior.',
    status: 'Almost There',
  },
  {
    accent: 'success',
    label: 'Documentation',
    mastery: 88,
    recommendation: 'Maintain with short warm-up questions before each session.',
    status: 'Domain Mastery',
  },
  {
    accent: 'primary',
    label: 'Professional Conduct',
    mastery: 74,
    recommendation: 'Review boundaries, scope of competence and reporting.',
    status: 'Keep Studying',
  },
];

export const practiceQuestions = [
  {
    correctIndex: 1,
    difficulty: 'Medium',
    domain: 'Measurement',
    explanation:
      'Partial-interval recording checks whether the behavior happened at any time during the interval, which can overestimate duration but efficiently captures occurrence.',
    options: [
      'Count every response and divide by total session time',
      'Mark whether the behavior occurred at any point in each interval',
      'Measure the exact elapsed time from onset to offset',
      'Record only the first instance of behavior in each interval',
    ],
    prompt:
      'Which data-collection method is most appropriate when you need to know whether a behavior occurred at any time during each 30-second interval?',
    timeEstimate: 2,
  },
  {
    correctIndex: 2,
    difficulty: 'Medium',
    domain: 'Assessment',
    explanation:
      'A multiple-stimulus without replacement preference assessment helps rank likely reinforcers efficiently by presenting several options and removing chosen items after each trial.',
    options: [
      'Scatterplot analysis',
      'Continuous ABC data',
      'Multiple-stimulus without replacement assessment',
      'Latency recording',
    ],
    prompt:
      'Which assessment format is often used to quickly identify a hierarchy of preferred items before instruction?',
    timeEstimate: 2,
  },
  {
    correctIndex: 0,
    difficulty: 'Hard',
    domain: 'Skill Acquisition',
    explanation:
      'Most-to-least prompting begins with the level of assistance most likely to ensure a correct response, then systematically fades support to build independence.',
    options: [
      'Begin with the prompt level that guarantees success, then fade support',
      'Wait for three errors before using a prompt',
      'Rotate randomly across all prompt levels every trial',
      'Use verbal prompts only for initial teaching',
    ],
    prompt:
      'Which statement best describes the rationale behind most-to-least prompting?',
    timeEstimate: 3,
  },
  {
    correctIndex: 3,
    difficulty: 'Hard',
    domain: 'Behavior Reduction',
    explanation:
      'Differential reinforcement of alternative behavior strengthens a replacement response that serves the same function as the interfering behavior.',
    options: [
      'Withhold reinforcement for all behavior during instruction',
      'Increase task difficulty until problem behavior stops',
      'Deliver reinforcement on a fixed-time schedule regardless of responding',
      'Reinforce a more appropriate behavior that can access the same outcome',
    ],
    prompt:
      'What is the main goal of differential reinforcement of alternative behavior (DRA)?',
    timeEstimate: 3,
  },
  {
    correctIndex: 1,
    difficulty: 'Easy',
    domain: 'Documentation',
    explanation:
      'Objective notes focus on observable actions and measurable facts without interpretation or subjective labels.',
    options: [
      'Use emotional descriptors so the team understands urgency',
      'Write only what was observed and measured during the session',
      'Skip minor events to keep notes short',
      'Copy the previous session note and adjust the date',
    ],
    prompt:
      'Which habit best supports accurate session documentation?',
    timeEstimate: 1,
  },
  {
    correctIndex: 0,
    difficulty: 'Medium',
    domain: 'Professional Conduct',
    explanation:
      'RBTs work within their defined role and communicate concerns through supervisors instead of independently changing goals or procedures.',
    options: [
      'Consult the supervising BCBA before changing intervention procedures',
      'Adjust the behavior plan when the family requests a small change',
      'Share case details with classmates for study support',
      'Continue treatment goals after authorization expires',
    ],
    prompt:
      'What is the most appropriate action when a caregiver asks you to modify a teaching procedure that is not in the current plan?',
    timeEstimate: 2,
  },
];

export const examModes = [
  {
    duration: '25 minutes',
    highlights: [
      'Focused warm-up before a study block',
      'Best for commuting or quick evening review',
      'Covers a balanced spread of domains',
    ],
    id: 'quick',
    questions: 20,
    summary:
      'A compact confidence builder with just enough time pressure to sharpen recall.',
    title: 'Quick Sprint',
  },
  {
    duration: '60 minutes',
    highlights: [
      'Mid-length exam for deeper pacing practice',
      'Useful for spotting domain fatigue',
      'Detailed review screen after completion',
    ],
    id: 'core',
    questions: 50,
    summary:
      'A strong benchmark mode when you want realistic pacing without a full exam.',
    title: 'Core Simulation',
  },
  {
    duration: '110 minutes',
    highlights: [
      'Full-length endurance practice',
      'Mirrors test-day concentration demands',
      'Ideal for weekend readiness checks',
    ],
    id: 'full',
    questions: 85,
    summary:
      'The closest mobile rehearsal to exam day, designed for stamina and confidence.',
    title: 'Exam Day Replica',
  },
];

export const tutorPrompts = [
  {
    title: 'Explain a concept simply',
    body: 'Break down motivating operations in plain language with one example.',
  },
  {
    title: 'Create a mnemonic',
    body: 'Give me a memorable way to recall prompt fading strategies.',
  },
  {
    title: 'Coach my mistake',
    body: 'I missed a DRA question. Show me how to think through it next time.',
  },
];

export const tutorMessages = [
  {
    author: 'user' as const,
    body: 'I keep mixing up DRA, DRO and DRI. Can you help me remember the difference?',
    id: 'u1',
  },
  {
    author: 'assistant' as const,
    body: 'Think of the second letter as your clue: Alternative = replacement behavior, Other = anything except the target, Incompatible = behavior that physically cannot happen at the same time.',
    id: 'a1',
  },
  {
    author: 'assistant' as const,
    body: 'Quick check: if a learner gets reinforcement for asking for a break instead of throwing materials, that is DRA because we reinforced an alternative response.',
    id: 'a2',
  },
];

export const weeklyPerformance = [
  { day: 'Mon', highlight: false, score: 68 },
  { day: 'Tue', highlight: false, score: 74 },
  { day: 'Wed', highlight: false, score: 76 },
  { day: 'Thu', highlight: false, score: 83 },
  { day: 'Fri', highlight: false, score: 79 },
  { day: 'Sat', highlight: true, score: 88 },
  { day: 'Sun', highlight: false, score: 84 },
];

export const flashcards = [
  {
    answer:
      'An antecedent intervention changes what happens before behavior so the learner is more likely to respond successfully.',
    domain: 'Behavior Reduction',
    question: 'What is the purpose of an antecedent intervention?',
  },
  {
    answer:
      'Maintenance means the skill continues over time after formal teaching has faded.',
    domain: 'Skill Acquisition',
    question: 'Define maintenance in one sentence.',
  },
  {
    answer:
      'Permanent-product recording measures the outcome of behavior after it has occurred, like completed worksheets or cleaned areas.',
    domain: 'Measurement',
    question: 'When is permanent-product recording especially useful?',
  },
];

export const pricingPlans = [
  {
    description: 'A clean starting point for daily practice and foundational review.',
    features: [
      'Practice questions by domain',
      'Progress dashboard',
      'Flashcards and daily streak tracking',
    ],
    featured: false,
    id: 'free',
    price: '$0',
    title: 'Free Plan',
  },
  {
    description: 'The best fit for learners who want structure, analytics and coaching.',
    features: [
      'Unlimited mock exams',
      'AI Tutor workflows',
      'Advanced analytics and study recommendations',
      'Premium flashcard decks',
    ],
    featured: true,
    id: 'monthly',
    price: '$14.99 / month',
    title: 'Premium Monthly',
  },
  {
    description: 'Lower monthly cost for students preparing over a longer runway.',
    features: [
      'Everything in monthly premium',
      'Priority access to new study packs',
      'Best annual value',
    ],
    featured: false,
    id: 'yearly',
    price: '$119 / year',
    title: 'Premium Yearly',
  },
];

export const profileActions = [
  {
    body: 'Fine-tune reminders for short study sessions and full mock exams.',
    title: 'Notifications',
  },
  {
    body: 'Review saved tutor chats, favorite flashcards and bookmarked questions.',
    title: 'Study Library',
  },
  {
    body: 'Access support, app info and account management later when backend is connected.',
    title: 'Support & Account',
  },
];
