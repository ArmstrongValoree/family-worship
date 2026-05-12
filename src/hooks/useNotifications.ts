import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Notification } from '../types'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string, profileId: string) => Promise<void>
  loading: boolean
}

export function useNotifications(
  household_id: string | undefined,
  profileId: string | undefined
): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(() => {
    if (!household_id) return
    setLoading(true)
    supabase
      .from('notifications')
      .select('*')
      .eq('household_id', household_id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setNotifications((data ?? []) as Notification[])
        setLoading(false)
      })
  }, [household_id])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (!household_id) return

    const channel = supabase
      .channel(`notifications:${household_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `household_id=eq.${household_id}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [household_id])

  const markAsRead = useCallback(
    async (id: string, currentProfileId: string) => {
      const notification = notifications.find(n => n.id === id)
      if (!notification || notification.read_by.includes(currentProfileId)) return

      const updatedReadBy = [...notification.read_by, currentProfileId]
      const { data } = await supabase
        .from('notifications')
        .update({ read_by: updatedReadBy })
        .eq('id', id)
        .select()
        .single()

      if (data) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? data as Notification : n)
        )
      }
    },
    [notifications]
  )

  const unreadCount = profileId
    ? notifications.filter(n => !n.read_by.includes(profileId)).length
    : 0

  return { notifications, unreadCount, markAsRead, loading }
}
