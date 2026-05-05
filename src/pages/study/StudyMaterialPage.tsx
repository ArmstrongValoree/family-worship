import { BookOpen, FileText, Music, Video } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { AppShell } from '../../components/layout/AppShell'

const MATERIAL_TYPES = [
  { icon: FileText, label: 'Scripture', count: 3 },
  { icon: Music, label: 'Songs', count: 2 },
  { icon: Video, label: 'Videos', count: 1 },
]

const SAMPLE_MATERIALS = [
  { type: 'Scripture', title: 'Romans 12:1-2', desc: 'Living Sacrifices', badge: 'green' as const },
  { type: 'Song', title: 'Come Thou Fount', desc: 'Traditional hymn of dedication', badge: 'sky' as const },
  { type: 'Scripture', title: 'Psalm 23', desc: 'The Lord is My Shepherd', badge: 'green' as const },
]

export function StudyMaterialPage() {
  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="font-display text-3xl text-paradise-cream">Study Materials</h1>
          <p className="text-paradise-cream/60 text-sm mt-1">Prepare for your next worship session</p>
        </div>

        {/* Type counts */}
        <div className="grid grid-cols-3 gap-3">
          {MATERIAL_TYPES.map(({ icon: Icon, label, count }) => (
            <Card key={label} variant="glass" className="flex flex-col items-center gap-1 py-4">
              <Icon size={20} className="text-paradise-gold" />
              <span className="text-paradise-cream text-xs font-medium">{label}</span>
              <span className="text-paradise-gold text-lg font-display font-semibold">{count}</span>
            </Card>
          ))}
        </div>

        {/* Materials list */}
        <div>
          <h2 className="font-display text-xl text-paradise-cream mb-3">This Session</h2>
          <div className="space-y-3">
            {SAMPLE_MATERIALS.map((m) => (
              <Card key={m.title} variant="glass" className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-paradise-gold shrink-0" />
                  <div>
                    <p className="text-paradise-cream text-sm font-semibold">{m.title}</p>
                    <p className="text-paradise-cream/50 text-xs">{m.desc}</p>
                  </div>
                </div>
                <Badge variant={m.badge}>{m.type}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
