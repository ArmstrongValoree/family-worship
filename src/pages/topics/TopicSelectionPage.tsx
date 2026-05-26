import { useState, useMemo, useRef } from 'react'
import { Plus, BookOpen, ShieldAlert, Loader2 } from 'lucide-react'
import { AppShell } from '../../components/layout/AppShell'
import { TopicCard } from '../../components/topics/TopicCard'
import { TopicSwipeCard } from '../../components/topics/TopicSwipeCard'
import { TopicAddModal } from '../../components/topics/TopicAddModal'
import { VotingResultsBanner } from '../../components/topics/VotingResultsBanner'
import { HHOverrideModal } from '../../components/topics/HHOverrideModal'
import { useAuthContext } from '../../context/AuthContext'
import { useTopics } from '../../hooks/useTopics'
import { useTopicVoting } from '../../hooks/useTopicVoting'
import { useEvents } from '../../hooks/useEvents'
import { supabase } from '../../lib/supabase'

function formatEventDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function TopicSelectionPage() {
  const { profile } = useAuthContext()
  const isHH = profile?.role === 'head_of_household'

  // Memoize so hooks don't re-run on every auth context update
  const householdId = useMemo(() => profile?.household_id, [profile?.household_id])

  // Persist the last known value — prevents flash to empty state during auth re-fires
  const lastKnownHouseholdId = useRef<string | undefined>(undefined)
  if (householdId) lastKnownHouseholdId.current = householdId
  const stableHouseholdId = lastKnownHouseholdId.current ?? householdId

  const { topics, loading: topicsLoading, addTopic, removeTopic, refetch: refetchTopics } = useTopics(stableHouseholdId)
  const { events, refetch: refetchEvents } = useEvents(stableHouseholdId)

  // Next upcoming event without a topic set
  const activeEvent = events.find(
    e => new Date(e.scheduled_at) >= new Date() && !e.topic_id
  ) ?? null

  const { votes, members, hasEveryoneVoted, agreedTopic, castVote, refetch: refetchVotes } =
    useTopicVoting(activeEvent?.id, householdId)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [votingDeadline, setVotingDeadline] = useState('')
  const [deadlineSaving, setDeadlineSaving] = useState(false)

  // Topic the current user hasn't voted on yet
  const unvotedTopic = profile
    ? topics.find(t => !votes.some(v => v.topic_id === t.id && v.profile_id === profile.id))
    : null

  async function handleConfirmTopic(topicId: string) {
    if (!activeEvent) return
    await supabase
      .from('family_worship_events')
      .update({ topic_id: topicId })
      .eq('id', activeEvent.id)
    refetchEvents()
  }

  async function handleStartNewRound() {
    if (!activeEvent) return
    const topicIds = topics.map(t => t.id)
    if (topicIds.length > 0) {
      await supabase.from('topic_votes').delete().in('topic_id', topicIds)
    }
    refetchVotes()
  }

  async function saveDeadline() {
    if (!activeEvent || !votingDeadline) return
    setDeadlineSaving(true)
    try {
      const existingNotes = activeEvent.notes ? (() => {
        try { return JSON.parse(activeEvent.notes ?? '{}') } catch { return {} }
      })() : {}
      await supabase
        .from('family_worship_events')
        .update({ notes: JSON.stringify({ ...existingNotes, voting_deadline: votingDeadline }) })
        .eq('id', activeEvent.id)
      refetchEvents()
    } finally {
      setDeadlineSaving(false)
    }
  }

  // Profile hasn't arrived yet — show spinner rather than flashing empty state
  if (!profile && !stableHouseholdId) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={32} className="text-paradise-gold animate-spin" />
        </div>
      </AppShell>
    )
  }

  // Profile loaded but user has no household
  if (!stableHouseholdId) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center gap-3">
          <BookOpen size={40} className="text-paradise-gold/60" />
          <p className="font-display text-xl text-paradise-cream">Family Worship Topics</p>
          <p className="text-paradise-cream/50 text-sm max-w-xs">
            Join or create a household to manage topics
          </p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-8">

        <div>
          <h1 className="font-display text-3xl text-paradise-cream">Family Worship Topics</h1>
          <p className="text-paradise-cream/60 text-sm mt-1">Vote on topics for your next evening</p>
        </div>

        {/* Active voting round */}
        {activeEvent && (
          <section className="space-y-4">
            <div>
              <p className="text-paradise-gold text-xs font-semibold uppercase tracking-widest mb-0.5">
                Active Voting Round
              </p>
              <p className="font-display text-xl text-paradise-cream">
                {activeEvent.title || 'Family Worship Evening'} —{' '}
                {formatEventDate(activeEvent.scheduled_at)}
              </p>
            </div>

            <VotingResultsBanner
              topics={topics}
              votes={votes}
              members={members}
              hasEveryoneVoted={hasEveryoneVoted}
              agreedTopic={agreedTopic}
              isHH={isHH}
              onConfirmTopic={handleConfirmTopic}
              onStartNewRound={handleStartNewRound}
            />

            {unvotedTopic && !hasEveryoneVoted && (
              <TopicSwipeCard
                topic={unvotedTopic}
                onVote={vote => castVote(unvotedTopic.id, vote)}
              />
            )}

            {!unvotedTopic && !hasEveryoneVoted && topics.length > 0 && (
              <p className="text-paradise-cream/50 text-sm text-center py-4">
                You have voted on all topics — waiting for others.
              </p>
            )}

            {isHH && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="flex items-center gap-2 text-paradise-cream/60 hover:text-paradise-cream transition-colors text-sm"
                >
                  <ShieldAlert size={15} />
                  Override Selection
                </button>

                <div className="flex items-center gap-3">
                  <label className="text-paradise-cream/50 text-xs font-semibold uppercase tracking-wide shrink-0">
                    Voting deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={votingDeadline}
                    onChange={e => setVotingDeadline(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-paradise-cream text-xs focus:outline-none focus:border-paradise-gold transition-colors"
                  />
                  <button
                    onClick={saveDeadline}
                    disabled={!votingDeadline || deadlineSaving}
                    className="bg-paradise-gold text-paradise-green-deep text-xs font-semibold rounded-xl px-3 py-2 hover:bg-paradise-gold-light transition-colors disabled:opacity-50 shrink-0"
                  >
                    {deadlineSaving ? 'Saving…' : 'Set'}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Topic library */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-paradise-cream">Your Topic Library</h2>
            {isHH && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 bg-paradise-gold text-paradise-green-deep text-sm font-semibold px-3 py-2 rounded-xl hover:bg-paradise-gold-light transition-colors"
              >
                <Plus size={15} />
                Add Topic
              </button>
            )}
          </div>

          {topicsLoading ? (
            <p className="text-paradise-cream/40 text-sm text-center py-6">Loading…</p>
          ) : topics.length === 0 ? (
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 text-center space-y-2">
              <BookOpen size={32} className="text-paradise-gold/50 mx-auto" />
              <p className="text-paradise-cream/60 text-sm">
                No topics added yet — add your first topic from JW.org
              </p>
              {isHH && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-2 text-paradise-gold text-sm hover:underline"
                >
                  Add a topic
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {topics.map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  votes={votes}
                  members={members}
                  isHH={isHH}
                  onRemove={isHH ? removeTopic : undefined}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {showAddModal && profile?.id && (
        <TopicAddModal
          householdId={stableHouseholdId}
          profileId={profile.id}
          onAdd={async (topic) => {
            await addTopic(topic)
            refetchTopics()
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showOverrideModal && activeEvent && profile && (
        <HHOverrideModal
          event={activeEvent}
          topics={topics}
          profile={profile}
          onClose={() => setShowOverrideModal(false)}
          onOverridden={() => { refetchEvents(); refetchVotes() }}
        />
      )}
    </AppShell>
  )
}
