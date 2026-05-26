import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

interface UsePushNotificationsReturn {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const { profile } = useAuthContext()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window

  useEffect(() => {
    if (!isSupported || !profile) return

    navigator.serviceWorker.ready
      .then(registration => registration.pushManager.getSubscription())
      .then(sub => setIsSubscribed(sub !== null))
      .catch(() => setIsSubscribed(false))
  }, [isSupported, profile])

  const subscribe = useCallback(async () => {
    if (!isSupported || !profile) return
    setIsLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY as string
        ),
      })

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(
          { profile_id: profile.id, subscription: subscription.toJSON() },
          { onConflict: 'profile_id' }
        )
      if (error) throw new Error(error.message)

      setIsSubscribed(true)
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, profile])

  const unsubscribe = useCallback(async () => {
    if (!isSupported || !profile) return
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }

      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('profile_id', profile.id)
      if (error) throw new Error(error.message)

      setIsSubscribed(false)
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, profile])

  return { isSupported, isSubscribed, isLoading, subscribe, unsubscribe }
}
