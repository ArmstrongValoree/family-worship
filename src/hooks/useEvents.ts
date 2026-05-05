import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { FamilyWorshipEvent, StudyMaterial } from '../types'

export interface EventWithMaterials extends FamilyWorshipEvent {
  study_materials: StudyMaterial[]
}

interface UseEventsReturn {
  events: EventWithMaterials[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useEvents(household_id: string | undefined): UseEventsReturn {
  const [events, setEvents] = useState<EventWithMaterials[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!household_id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('family_worship_events')
      .select('*, study_materials(*)')
      .eq('household_id', household_id)
      .order('scheduled_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setEvents((data ?? []) as EventWithMaterials[])
    }
    setLoading(false)
  }, [household_id])

  useEffect(() => { load() }, [load])

  return { events, loading, error, refetch: load }
}
