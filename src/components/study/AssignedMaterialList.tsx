import { BookOpen, Play, Music, X } from 'lucide-react'
import type { StudyMaterial } from '../../types'

const GROUPS: { type: StudyMaterial['type']; label: string; Icon: typeof BookOpen }[] = [
  { type: 'article', label: 'Articles', Icon: BookOpen },
  { type: 'video', label: 'Videos', Icon: Play },
  { type: 'song', label: 'Songs', Icon: Music },
]

interface AssignedMaterialListProps {
  materials: StudyMaterial[]
  isHH: boolean
  onRemove?: (id: string) => void
}

export function AssignedMaterialList({ materials, isHH, onRemove }: AssignedMaterialListProps) {
  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-paradise-cream/40">
        <BookOpen size={28} />
        <p className="text-sm">No materials assigned yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {GROUPS.map(({ type, label, Icon }) => {
        const group = materials.filter(m => m.type === type)
        if (group.length === 0) return null
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className="text-paradise-gold" />
              <p className="text-paradise-cream/50 text-xs uppercase tracking-wide font-semibold">
                {label}
              </p>
            </div>
            <div className="space-y-2">
              {group.map(m => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex-1 min-w-0">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paradise-cream text-sm hover:text-paradise-gold transition-colors truncate block"
                    >
                      {m.title}
                    </a>
                  </div>
                  {m.read_ahead && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-paradise-gold/20 text-paradise-gold border border-paradise-gold/30 shrink-0">
                      Read Ahead
                    </span>
                  )}
                  {isHH && onRemove && (
                    <button
                      onClick={() => onRemove(m.id)}
                      className="p-1 rounded-lg text-paradise-cream/30 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                      aria-label="Remove material"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
