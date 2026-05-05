import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Household, Profile } from '../types'

interface HouseholdHook {
  household: Household | null
  members: Profile[]
  loading: boolean
  error: string | null
}

export function useHousehold(household_id: string | undefined): HouseholdHook {
  const [household, setHousehold] = useState<Household | null>(null)
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!household_id) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)

      const [householdRes, membersRes] = await Promise.all([
        supabase.from('households').select('*').eq('id', household_id).single(),
        supabase.from('profiles').select('*').eq('household_id', household_id),
      ])

      if (householdRes.error) {
        setError(householdRes.error.message)
      } else {
        setHousehold(householdRes.data as Household)
      }

      if (!membersRes.error && membersRes.data) {
        setMembers(membersRes.data as Profile[])
      }

      setLoading(false)
    }

    load()
  }, [household_id])

  return { household, members, loading, error }
}
