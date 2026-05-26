import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push'

serve(async (req) => {
  const { household_id, title, body, url } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  webpush.setVapidDetails(
    Deno.env.get('VAPID_EMAIL')!,
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!
  )

  // Get all push subscriptions for household members
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('household_id', household_id)

  if (!profiles?.length) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 })
  }

  const profileIds = profiles.map((p: { id: string }) => p.id)

  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .in('profile_id', profileIds)

  let sent = 0
  for (const row of subscriptions ?? []) {
    try {
      await webpush.sendNotification(
        row.subscription,
        JSON.stringify({ title, body, url })
      )
      sent++
    } catch (err) {
      console.error('Push failed:', err)
    }
  }

  return new Response(JSON.stringify({ sent }), { status: 200 })
})
