import { ExternalLink, Trash2, ThumbsUp } from 'lucide-react'
import type { Topic, TopicVote, Profile } from '../../types'

interface TopicCardProps {
  topic: Topic
  votes: TopicVote[]
  members: Profile[]
  isHH: boolean
  onRemove?: (id: string) => void
}

export function TopicCard({ topic, votes, members, isHH, onRemove }: TopicCardProps) {
  const yesVotes = votes.filter(v => v.topic_id === topic.id && v.vote === 'yes').length
  const totalMembers = members.length

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-paradise-cream text-lg leading-snug truncate">
            {topic.title}
          </h3>
          {topic.description && (
            <p className="text-paradise-cream/60 text-sm mt-0.5 line-clamp-2">{topic.description}</p>
          )}
        </div>
        {isHH && onRemove && (
          <button
            onClick={() => onRemove(topic.id)}
            className="text-paradise-cream/30 hover:text-red-400 transition-colors shrink-0 p-1"
            aria-label="Remove topic"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {topic.source_url && (
        <a
          href={topic.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-paradise-gold text-xs hover:underline"
        >
          View on JW.org <ExternalLink size={11} />
        </a>
      )}

      <div className="flex items-center gap-1.5 pt-1">
        <ThumbsUp size={13} className="text-paradise-green-light" />
        <span className="text-paradise-green-light text-xs font-medium">
          {yesVotes} / {totalMembers} interested
        </span>
      </div>
    </div>
  )
}
