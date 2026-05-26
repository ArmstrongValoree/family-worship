export type UserRole = 'head_of_household' | 'family_member'

export interface Profile {
  id: string
  user_id: string
  full_name: string
  avatar_url?: string
  role: UserRole
  household_id?: string
  created_at: string
}

export interface Household {
  id: string
  name: string
  created_by: string
  invite_code: string
  created_at: string
}

export interface FamilyWorshipEvent {
  id: string
  household_id: string
  scheduled_at: string
  title?: string
  notes?: string
  topic_id?: string
  created_by: string
  created_at: string
}

export interface StudyMaterial {
  id: string
  event_id: string
  title: string
  url: string
  type: 'article' | 'video' | 'song'
  read_ahead: boolean
  created_at: string
}

export interface MemberInstruction {
  id: string
  event_id: string
  profile_id: string
  instruction: string
  created_at: string
}

export interface Topic {
  id: string
  household_id: string
  title: string
  description?: string
  source_url?: string
  created_by: string
  created_at: string
}

export interface TopicVote {
  id: string
  topic_id: string
  profile_id: string
  vote: 'yes' | 'no'
  created_at: string
}

export interface FeedbackEntry {
  id: string
  event_id: string
  profile_id: string
  rating: number
  comment?: string
  created_at: string
}

export interface DateChangeRequest {
  id: string
  event_id: string
  requested_by: string
  requested_date: string
  reason?: string
  status: 'pending' | 'approved' | 'denied'
  created_at: string
}

export interface Notification {
  id: string
  household_id: string
  message: string
  created_by: string
  read_by: string[]
  created_at: string
}
