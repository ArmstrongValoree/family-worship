import { Clock, CheckCircle, Loader2 } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import type { Topic, TopicVote, Profile } from '../../types'

interface VotingResultsBannerProps {
  topics: Topic[]
  votes: TopicVote[]
  members: Profile[]
  hasEveryoneVoted: boolean
  agreedTopic: Topic | null
  isHH: boolean
  onConfirmTopic?: (topicId: string) => void
  onStartNewRound?: () => void
}

function getMemberVotedStatus(member: Profile, votes: TopicVote[], topics: Topic[]): boolean {
  return topics.some(t => votes.some(v => v.topic_id === t.id && v.profile_id === member.id))
}

export function VotingResultsBanner({
  topics,
  votes,
  members,
  hasEveryoneVoted,
  agreedTopic,
  isHH,
  onConfirmTopic,
  onStartNewRound,
}: VotingResultsBannerProps) {
  // State 2 — everyone agreed
  if (hasEveryoneVoted && agreedTopic) {
    return (
      <div className="backdrop-blur-md bg-paradise-green-light/10 border border-paradise-green-light/30 rounded-2xl p-5 text-center space-y-3">
        <p className="text-paradise-green-light font-semibold">Everyone agreed on a topic!</p>
        <p className="font-display text-2xl text-paradise-gold">{agreedTopic.title}</p>
        {isHH && onConfirmTopic && (
          <button
            onClick={() => onConfirmTopic(agreedTopic.id)}
            className="bg-paradise-gold text-paradise-green-deep font-semibold rounded-xl px-6 py-2.5 text-sm hover:bg-paradise-gold-light transition-colors"
          >
            Confirm Topic
          </button>
        )}
      </div>
    )
  }

  // State 3 — everyone voted but no agreement
  if (hasEveryoneVoted && !agreedTopic) {
    const topicTotals = topics.map(t => ({
      topic: t,
      yes: votes.filter(v => v.topic_id === t.id && v.vote === 'yes').length,
      no: votes.filter(v => v.topic_id === t.id && v.vote === 'no').length,
    }))

    return (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 space-y-4">
        <p className="text-paradise-cream/70 text-sm font-medium text-center">No agreement reached yet</p>
        <div className="space-y-2">
          {topicTotals.map(({ topic, yes, no }) => (
            <div key={topic.id} className="flex items-center justify-between gap-3">
              <span className="text-paradise-cream text-sm truncate flex-1">{topic.title}</span>
              <span className="text-paradise-green-light text-xs shrink-0">{yes} yes</span>
              <span className="text-red-400 text-xs shrink-0">{no} no</span>
            </div>
          ))}
        </div>
        {isHH && onStartNewRound && (
          <button
            onClick={onStartNewRound}
            className="w-full border border-paradise-gold/40 text-paradise-gold font-semibold rounded-xl py-2.5 text-sm hover:bg-paradise-gold/10 transition-colors"
          >
            Start New Round
          </button>
        )}
      </div>
    )
  }

  // State 1 — voting in progress
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Loader2 size={14} className="text-paradise-gold animate-spin" />
        <p className="text-paradise-cream/70 text-sm">Waiting for everyone to vote…</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {members.map(member => {
          const hasVoted = getMemberVotedStatus(member, votes, topics)
          return (
            <div key={member.id} className="flex flex-col items-center gap-1">
              <div className="relative">
                <Avatar name={member.full_name} size="sm" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-paradise-green-deep">
                  {hasVoted
                    ? <CheckCircle size={12} className="text-paradise-green-light fill-paradise-green-light" />
                    : <Clock size={12} className="text-paradise-cream/40" />
                  }
                </span>
              </div>
              <span className="text-paradise-cream/50 text-[10px] leading-none max-w-[48px] truncate text-center">
                {member.full_name.split(' ')[0]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
