export const APP_NAME = 'Family Worship'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CREATE_HOUSEHOLD: '/create-household',
  JOIN: '/join',
  CALENDAR: '/calendar',
  STUDY: '/study',
  TOPICS: '/topics',
  FEEDBACK: '/feedback',
  PROFILE: '/profile',
} as const

export const TOPIC_CATEGORIES = [
  { value: 'bible-study', label: 'Bible Study' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'song', label: 'Song' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'devotional', label: 'Devotional' },
  { value: 'activity', label: 'Activity' },
] as const

export const PARADISE_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
] as const
