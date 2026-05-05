import { useState } from 'react'
import type { Household } from '../types'

export function useHousehold() {
  const [household] = useState<Household | null>(null)
  const [isLoading] = useState(false)

  // Placeholder — real household logic connects to Supabase in a later phase
  return {
    household,
    isLoading,
  }
}
