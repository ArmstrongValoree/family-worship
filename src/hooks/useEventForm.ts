import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { FamilyWorshipEvent, StudyMaterial } from '../types'

export interface EventFormFields {
  title: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM
  notes: string
  topic_id: string
}

export interface MaterialDraft {
  type: StudyMaterial['type']
  title: string
  url: string
}

interface UseEventFormReturn {
  fields: EventFormFields
  materials: MaterialDraft[]
  setField: <K extends keyof EventFormFields>(key: K, value: EventFormFields[K]) => void
  addMaterial: (draft: MaterialDraft) => void
  removeMaterial: (index: number) => void
  reset: () => void
  submit: (householdId: string, profileId: string, eventId?: string) => Promise<FamilyWorshipEvent>
  loading: boolean
  error: string | null
}

const defaultFields: EventFormFields = {
  title: '',
  date: '',
  time: '19:00',
  notes: '',
  topic_id: '',
}

export function useEventForm(initial?: Partial<EventFormFields>): UseEventFormReturn {
  const [fields, setFields] = useState<EventFormFields>({ ...defaultFields, ...initial })
  const [materials, setMaterials] = useState<MaterialDraft[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setField<K extends keyof EventFormFields>(key: K, value: EventFormFields[K]) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  function addMaterial(draft: MaterialDraft) {
    setMaterials(prev => [...prev, draft])
  }

  function removeMaterial(index: number) {
    setMaterials(prev => prev.filter((_, i) => i !== index))
  }

  function reset() {
    setFields({ ...defaultFields, ...initial })
    setMaterials([])
    setError(null)
  }

  async function submit(
    householdId: string,
    profileId: string,
    eventId?: string
  ): Promise<FamilyWorshipEvent> {
    setLoading(true)
    setError(null)

    const scheduled_at = new Date(`${fields.date}T${fields.time}`).toISOString()

    try {
      let event: FamilyWorshipEvent

      const formattedDate = new Date(`${fields.date}T${fields.time}`).toLocaleDateString(
        'en-US',
        { weekday: 'long', month: 'long', day: 'numeric' }
      )

      if (eventId) {
        const { data, error: updateError } = await supabase
          .from('family_worship_events')
          .update({
            title: fields.title || null,
            scheduled_at,
            notes: fields.notes || null,
            topic_id: fields.topic_id || null,
          })
          .eq('id', eventId)
          .select()
          .single()
        if (updateError) throw updateError
        event = data as FamilyWorshipEvent
      } else {
        const { data, error: insertError } = await supabase
          .from('family_worship_events')
          .insert({
            household_id: householdId,
            created_by: profileId,
            title: fields.title || null,
            scheduled_at,
            notes: fields.notes || null,
            topic_id: fields.topic_id || null,
          })
          .select()
          .single()
        if (insertError) throw insertError
        event = data as FamilyWorshipEvent

        // Fire-and-forget push notification to household members
        supabase.functions.invoke('send-push-notification', {
          body: {
            household_id: householdId,
            title: 'Family Worship Scheduled 🌿',
            body: `A Family Worship evening has been scheduled for ${formattedDate}`,
            url: '/calendar',
          },
        }).catch(() => null)
      }

      if (materials.length > 0) {
        const { error: matError } = await supabase.from('study_materials').insert(
          materials.map(m => ({
            event_id: event.id,
            title: m.title,
            url: m.url,
            type: m.type,
            read_ahead: false,
          }))
        )
        if (matError) throw matError
      }

      return event
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save event.'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { fields, materials, setField, addMaterial, removeMaterial, reset, submit, loading, error }
}
