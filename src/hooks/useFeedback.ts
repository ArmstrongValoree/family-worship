import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'
import type { FeedbackEntry } from '../types'

interface ProfileSnippet {
  id: string
  full_name: string
  avatar_url?: string | null
}

export interface FeedbackWithProfile extends FeedbackEntry {
  profiles: ProfileSnippet | null
}

interface UseFeedbackReturn {
  feedback: FeedbackWithProfile[]
  averageRating: number
  userFeedback: FeedbackWithProfile | null
  hasSubmitted: boolean
  submitFeedback: (rating: number, comment?: string) => Promise<void>
  memberCount: number
  loading: boolean
  error: string | null
}

export function useFeedback(
  event_id: string | undefined,
  household_id?: string
): UseFeedbackReturn {
  const { profile } = useAuthContext()
  const [feedback, setFeedback] = useState<FeedbackWithProfile[]>([])
  const [memberCount, setMemberCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!event_id) return
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('feedback_entries')
      .select('*, profiles(id, full_name, avatar_url)')
      .eq('event_id', event_id)
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setFeedback((data ?? []) as FeedbackWithProfile[])
    }

    if (household_id) {
      const { count, error: countErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('household_id', household_id)
      if (!countErr && count !== null) setMemberCount(count)
    }

    setLoading(false)
  }, [event_id, household_id])

  useEffect(() => { load() }, [load])

  const submitFeedback = useCallback(
    async (rating: number, comment?: string) => {
      if (!event_id || !profile) throw new Error('Not ready')

      const commentVal = comment?.trim() || null
      const existing = feedback.find(f => f.profile_id === profile.id)

      if (existing) {
        const { error: err } = await supabase
          .from('feedback_entries')
          .update({ rating, comment: commentVal } as Record<string, unknown>)
          .eq('id', existing.id)
        if (err) throw new Error(err.message)
      } else {
        const { error: err } = await supabase
          .from('feedback_entries')
          .insert({ event_id, profile_id: profile.id, rating, comment: commentVal } as Record<string, unknown>)
        if (err) throw new Error(err.message)
      }

      await load()
    },
    [event_id, profile, feedback, load]
  )

  const userFeedback = profile
    ? (feedback.find(f => f.profile_id === profile.id) ?? null)
    : null
  const hasSubmitted = userFeedback !== null
  const averageRating =
    feedback.length === 0
      ? 0
      : Math.round((feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length) * 10) / 10

  return { feedback, averageRating, userFeedback, hasSubmitted, submitFeedback, memberCount, loading, error }
}
