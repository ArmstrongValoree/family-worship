import { useState, useMemo } from 'react'
import { CalendarDays, BookOpen, MessageSquare, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { FeedbackModal } from '../components/feedback/FeedbackModal'
import { StarRating } from '../components/feedback/StarRating'
import { useAuthContext } from '../context/AuthContext'
import { useEvents } from '../hooks/useEvents'
import { useFeedback } from '../hooks/useFeedback'
import { ROUTES } from '../lib/constants'

const quickActions = [
  {
    to: ROUTES.CALENDAR,
    icon: CalendarDays,
    label: 'View Calendar',
    desc: 'Schedule your Family Worship evenings',
    bg: 'bg-paradise-green-mid/60',
    iconColor: 'text-paradise-gold',
  },
  {
    to: ROUTES.STUDY,
    icon: BookOpen,
    label: 'Study Material',
    desc: 'Prepare materials from JW.org',
    bg: 'bg-paradise-ocean/40',
    iconColor: 'text-paradise-sky',
  },
  {
    to: ROUTES.FEEDBACK,
    icon: MessageSquare,
    label: 'Give Feedback',
    desc: 'Rate last session',
    bg: 'bg-paradise-earth/40',
    iconColor: 'text-paradise-sand',
  },
]

export function DashboardPage() {
  const { profile } = useAuthContext()
  const { events } = useEvents(profile?.household_id)
  const [dismissed, setDismissed] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const mostRecentPast = useMemo(
    () =>
      events
        .filter(e => new Date(e.scheduled_at) < new Date())
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())[0] ??
      null,
    [events]
  )

  const { hasSubmitted } = useFeedback(mostRecentPast?.id)
  const showPrompt = mostRecentPast && !hasSubmitted && !dismissed

  return (
    <AppShell>
      <div className="min-h-[calc(100dvh-136px)] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">

          {/* Hero greeting card */}
          <div
            className="rounded-3xl p-7 space-y-2 border"
            style={{
              background: 'rgba(255,255,255,0.13)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: 'rgba(82,183,136,0.22)',
            }}
          >
            <p className="text-paradise-cream/60 text-sm font-medium tracking-widest uppercase">
              Welcome back
            </p>
            <h1
              className="text-paradise-cream leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', fontWeight: 600 }}
            >
              Good morning, Family 🌿
            </h1>
            <p className="text-paradise-cream/70 text-base mt-1">
              Your next Family Worship evening is coming up{' '}
              <span className="text-paradise-gold font-semibold">Friday at 7:00 PM</span>
            </p>

            {/* Divider */}
            <div className="border-t border-white/10 pt-4 mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-3/5 rounded-full bg-paradise-gold/70" />
              </div>
              <span className="text-paradise-cream/50 text-xs">3 days away</span>
            </div>
          </div>

          {/* Feedback prompt — only when past event has no feedback yet */}
          {showPrompt && (
            <div
              className="rounded-2xl p-5 border space-y-3"
              style={{
                background: 'rgba(212,160,23,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(212,160,23,0.22)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-paradise-cream/60 text-xs uppercase tracking-wide font-semibold mb-0.5">
                    How was it?
                  </p>
                  <p className="text-paradise-cream font-semibold text-sm">
                    {mostRecentPast.title || 'Family Worship Evening'}
                  </p>
                  <p className="text-paradise-cream/40 text-xs">
                    {new Date(mostRecentPast.scheduled_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="p-1.5 rounded-lg text-paradise-cream/30 hover:text-paradise-cream/60 hover:bg-white/10 transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
              <div>
                <p className="text-paradise-cream/60 text-xs mb-2">
                  Tap a star to rate your last Family Worship evening
                </p>
                <StarRating
                  rating={0}
                  onChange={() => setShowFeedbackModal(true)}
                />
              </div>
            </div>
          )}

          {/* Quick action cards */}
          <div>
            <p className="text-paradise-cream/50 text-xs font-semibold uppercase tracking-widest mb-3 px-1">
              Quick Access
            </p>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map(({ to, icon: Icon, label, desc, bg, iconColor }) => (
                <Link key={to} to={to}>
                  <div
                    className={[
                      'rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 border transition-all duration-200 active:scale-95',
                      bg,
                    ].join(' ')}
                    style={{
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      borderColor: 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <div className="p-2 rounded-xl bg-white/10">
                      <Icon size={20} className={iconColor} />
                    </div>
                    <span className="text-paradise-cream text-xs font-semibold leading-tight">
                      {label}
                    </span>
                    <span className="text-paradise-cream/40 text-[10px] leading-tight">
                      {desc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Verse of the day teaser */}
          <div
            className="rounded-2xl px-5 py-4 border flex items-start gap-3"
            style={{
              background: 'rgba(212,160,23,0.12)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderColor: 'rgba(212,160,23,0.25)',
            }}
          >
            <span className="text-paradise-gold text-xl mt-0.5">✦</span>
            <div>
              <p className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold mb-1">
                This Week's Theme
              </p>
              <p
                className="text-paradise-cream/90 leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
              >
                "But as for me and my household, we will serve Jehovah."
              </p>
              <p className="text-paradise-gold/70 text-xs mt-1">— Joshua 24:15</p>
            </div>
          </div>

        </div>
      </div>

      {showFeedbackModal && mostRecentPast && (
        <FeedbackModal
          event={mostRecentPast}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </AppShell>
  )
}
