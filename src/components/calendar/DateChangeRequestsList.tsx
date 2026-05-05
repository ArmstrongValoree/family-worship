import { useState, useEffect, useCallback } from 'react'
import { Check, X, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { EventWithMaterials } from '../../hooks/useEvents'
import type { DateChangeRequest } from '../../types'

interface RequestWithProfile extends DateChangeRequest {
  profiles: { full_name: string } | null
}

interface DateChangeRequestsListProps {
  events: EventWithMaterials[]
  onUpdated: () => void
}

function formatDateTime(isoString: string) {
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function DateChangeRequestsList({ events, onUpdated }: DateChangeRequestsListProps) {
  const [requests, setRequests] = useState<RequestWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  const eventIds = events.map(e => e.id)

  const load = useCallback(async () => {
    if (eventIds.length === 0) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('date_change_requests')
      .select('*, profiles(full_name)')
      .eq('status', 'pending')
      .in('event_id', eventIds)
      .order('created_at', { ascending: true })

    setRequests((data ?? []) as RequestWithProfile[])
    setLoading(false)
  }, [eventIds.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load() }, [load])

  async function approve(request: RequestWithProfile) {
    await Promise.all([
      supabase
        .from('date_change_requests')
        .update({ status: 'approved' })
        .eq('id', request.id),
      supabase
        .from('family_worship_events')
        .update({ scheduled_at: request.requested_date })
        .eq('id', request.event_id),
    ])
    load()
    onUpdated()
  }

  async function deny(requestId: string) {
    await supabase
      .from('date_change_requests')
      .update({ status: 'denied' })
      .eq('id', requestId)
    load()
  }

  if (loading) return null

  if (requests.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-3 text-paradise-cream/50">
        <Clock size={16} className="text-paradise-gold/40" />
        <p className="text-sm">No pending date change requests.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map(req => (
        <div
          key={req.id}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3"
        >
          <div>
            <p className="text-paradise-cream font-semibold text-sm">
              {req.profiles?.full_name ?? 'A member'}
            </p>
            <p className="text-paradise-gold text-xs mt-0.5">
              Requesting: {formatDateTime(req.requested_date)}
            </p>
            {req.reason && (
              <p className="text-paradise-cream/60 text-xs mt-1 italic">"{req.reason}"</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => approve(req)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-paradise-green-mid/60 border border-paradise-green-light/30 text-paradise-green-mist text-xs font-semibold rounded-xl py-2 hover:bg-paradise-green-mid/80 transition-colors"
            >
              <Check size={14} /> Approve
            </button>
            <button
              onClick={() => deny(req.id)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/20 border border-red-400/30 text-red-400 text-xs font-semibold rounded-xl py-2 hover:bg-red-500/30 transition-colors"
            >
              <X size={14} /> Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
