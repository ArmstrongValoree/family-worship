import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Topic } from '../types'

interface UseTopicsReturn {
  topics: Topic[]
  loading: boolean
  error: string | null
  refetch: () => void
  addTopic: (topic: Omit<Topic, 'id' | 'created_at'>) => Promise<void>
  removeTopic: (id: string) => Promise<void>
}

export function useTopics(household_id: string | undefined): UseTopicsReturn {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    if (!household_id) return
    setLoading(true)
    setError(null)

    supabase
      .from('topics')
      .select('*')
      .eq('household_id', household_id)
      .order('created_at', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setTopics((data ?? []) as Topic[])
        setLoading(false)
      })
  }, [household_id, tick])

  const addTopic = useCallback(
    async (topic: Omit<Topic, 'id' | 'created_at'>) => {
      const { error: err } = await supabase.from('topics').insert(topic)
      if (err) throw new Error(err.message)
      refetch()
    },
    [refetch]
  )

  const removeTopic = useCallback(
    async (id: string) => {
      const { error: err } = await supabase.from('topics').delete().eq('id', id)
      if (err) throw new Error(err.message)
      refetch()
    },
    [refetch]
  )

  return { topics, loading, error, refetch, addTopic, removeTopic }
}
