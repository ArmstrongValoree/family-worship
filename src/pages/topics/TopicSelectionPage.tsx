import { Search, Heart } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { AppShell } from '../../components/layout/AppShell'
import { TOPIC_CATEGORIES } from '../../lib/constants'

const SAMPLE_TOPICS = [
  { title: 'Faith & Trust', category: 'devotional', scripture: 'Proverbs 3:5-6', duration: 30 },
  { title: 'Family Prayer', category: 'prayer', scripture: 'Matthew 18:20', duration: 20 },
  { title: 'Fruits of the Spirit', category: 'bible-study', scripture: 'Galatians 5:22-23', duration: 45 },
  { title: 'Praise & Worship', category: 'song', scripture: 'Psalm 150', duration: 25 },
  { title: 'Serving Others', category: 'discussion', scripture: 'Mark 10:45', duration: 35 },
]

export function TopicSelectionPage() {
  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="font-display text-3xl text-paradise-cream">Topics</h1>
          <p className="text-paradise-cream/60 text-sm mt-1">Choose a focus for your next session</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-paradise-cream/40" />
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-paradise-cream placeholder-paradise-cream/30 focus:outline-none focus:border-paradise-gold/60 text-sm"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button className="shrink-0 px-3 py-1.5 rounded-full bg-paradise-gold text-paradise-green-deep text-xs font-semibold">
            All
          </button>
          {TOPIC_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-paradise-cream/70 text-xs font-medium hover:bg-white/20 transition-colors"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Topics list */}
        <div className="space-y-3">
          {SAMPLE_TOPICS.map((topic) => (
            <Card key={topic.title} variant="glass" className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-paradise-cream font-semibold text-sm">{topic.title}</p>
                  <Badge variant="mist" className="capitalize">{topic.category.replace('-', ' ')}</Badge>
                </div>
                <p className="text-paradise-cream/50 text-xs mt-1">{topic.scripture} · {topic.duration} min</p>
              </div>
              <button className="shrink-0 p-1.5 rounded-lg text-paradise-cream/40 hover:text-paradise-gold transition-colors">
                <Heart size={18} />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
