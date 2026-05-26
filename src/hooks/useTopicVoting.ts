import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Topic, TopicVote, Profile } from '../types'

interface UseTopicVotingReturn {
  votes: TopicVote[]
  members: Profile[]
  hasEveryoneVoted: boolean
  agreedTopic: Topic | null
  castVote: (topic_id: string, vote: 'yes' | 'no') => Promise<void>
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTopicVoting(
  _event_id: string | undefined,
  household_id: string | undefined
): UseTopicVotingReturn {
  const [votes, setVotes] = useState<TopicVote[]>([])
  const [members, setMembers] = useState<Profile[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    if (!household_id) return
    setLoading(true)
    setError(null)

    Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('household_id', household_id),
      supabase
        .from('topics')
        .select('*')
        .eq('household_id', household_id),
    ]).then(([profilesRes, topicsRes]) => {
      if (profilesRes.error) { setError(profilesRes.error.message); setLoading(false); return }
      if (topicsRes.error) { setError(topicsRes.error.message); setLoading(false); return }

      const fetchedMembers = (profilesRes.data ?? []) as Profile[]
      const fetchedTopics = (topicsRes.data ?? []) as Topic[]
      const topicIds = fetchedTopics.map(t => t.id)

      setMembers(fetchedMembers)
      setTopics(fetchedTopics)

      if (topicIds.length === 0) {
        setVotes([])
        setLoading(false)
        return
      }

      supabase
        .from('topic_votes')
        .select('*')
        .in('topic_id', topicIds)
        .then(({ data, error: vErr }) => {
          if (vErr) setError(vErr.message)
          else setVotes((data ?? []) as TopicVote[])
          setLoading(false)
        })
    })
  }, [household_id, tick])

  const castVote = useCallback(
    async (topic_id: string, vote: 'yes' | 'no') => {
      const { error: err } = await supabase
        .from('topic_votes')
        .upsert({ topic_id, vote }, { onConflict: 'topic_id,profile_id' })
      if (err) throw new Error(err.message)
      refetch()
    },
    [refetch]
  )

  const memberIds = members.map(m => m.id)

  const hasEveryoneVoted =
    memberIds.length > 0 &&
    topics.length > 0 &&
    memberIds.every(memberId =>
      topics.every(topic =>
        votes.some(v => v.topic_id === topic.id && v.profile_id === memberId)
      )
    )

  const agreedTopic =
    topics.find(topic =>
      memberIds.length > 0 &&
      memberIds.every(memberId =>
        votes.some(v => v.topic_id === topic.id && v.profile_id === memberId && v.vote === 'yes')
      )
    ) ?? null

  return { votes, members, hasEveryoneVoted, agreedTopic, castVote, loading, error, refetch }
}
