export const weeklyPerformance = [
  { day: 'Mon', score: 72, highlight: false },
  { day: 'Tue', score: 85, highlight: false },
  { day: 'Wed', score: 78, highlight: false },
  { day: 'Thu', score: 91, highlight: true },
  { day: 'Fri', score: 88, highlight: false },
  { day: 'Sat', score: 76, highlight: false },
  { day: 'Sun', score: 84, highlight: false },
];

export const pricingPlans = [
  {
    id: 'free', title: 'Free', price: '$0 / month', featured: false,
    description: 'Start studying with no commitment.',
    features: ['15 practice questions/day', '15 flashcards/day', 'Basic analytics'],
  },
  {
    id: 'monthly', title: 'Pro Monthly', price: '$19.99 / month', featured: true,
    description: 'Full access billed monthly.',
    features: ['Unlimited practice questions', 'All mock exams', 'Full flashcards access', 'Full analytics'],
  },
  {
    id: 'yearly', title: 'Pro Annual', price: '$99.99 / year', featured: false,
    description: 'Long-term value — save 58%.',
    features: ['Everything in Pro Monthly', 'Save 58% vs monthly', 'Priority support'],
  },
];

export const profileActions = [
  { title: 'Notifications', body: 'Daily study reminders' },
  { title: 'Language', body: 'English / Español' },
  { title: 'Privacy Policy', body: 'How we handle your data' },
  { title: 'Terms of Service', body: 'Usage and legal info' },
];
