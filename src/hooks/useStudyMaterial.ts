import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { StudyMaterial } from '../types'

interface UseStudyMaterialReturn {
  materials: StudyMaterial[]
  loading: boolean
  error: string | null
  refetch: () => void
  addMaterial: (material: Omit<StudyMaterial, 'id' | 'created_at'>) => Promise<void>
  removeMaterial: (id: string) => Promise<void>
}

export function useStudyMaterial(event_id: string | undefined): UseStudyMaterialReturn {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!event_id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('study_materials')
      .select('*')
      .eq('event_id', event_id)
      .order('created_at', { ascending: true })
    if (fetchError) {
      setError(fetchError.message)
    } else {
      setMaterials((data ?? []) as StudyMaterial[])
    }
    setLoading(false)
  }, [event_id])

  useEffect(() => {
    load()
  }, [load])

  const addMaterial = async (material: Omit<StudyMaterial, 'id' | 'created_at'>) => {
    const { error: insertError } = await supabase.from('study_materials').insert(material)
    if (insertError) throw new Error(insertError.message)
    await load()
  }

  const removeMaterial = async (id: string) => {
    const { error: deleteError } = await supabase.from('study_materials').delete().eq('id', id)
    if (deleteError) throw new Error(deleteError.message)
    await load()
  }

  return { materials, loading, error, refetch: load, addMaterial, removeMaterial }
}
