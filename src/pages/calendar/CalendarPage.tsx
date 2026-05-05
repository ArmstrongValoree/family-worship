import { CalendarDays, Plus } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { AppShell } from '../../components/layout/AppShell'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarPage() {
  const today = new Date()
  const month = today.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-paradise-cream">Calendar</h1>
            <p className="text-paradise-cream/60 text-sm">{month}</p>
          </div>
          <Button variant="primary" size="sm">
            <Plus size={16} />
            Schedule
          </Button>
        </div>

        {/* Calendar grid placeholder */}
        <Card variant="glass">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-paradise-cream/50 text-xs font-medium py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3
              const isToday = day === today.getDate()
              return (
                <button
                  key={i}
                  className={[
                    'aspect-square flex items-center justify-center rounded-xl text-sm transition-colors',
                    day < 1 || day > 31
                      ? 'opacity-0 pointer-events-none'
                      : isToday
                      ? 'bg-paradise-gold text-paradise-green-deep font-bold'
                      : 'text-paradise-cream/70 hover:bg-white/10',
                  ].join(' ')}
                >
                  {day > 0 && day <= 31 ? day : ''}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Upcoming sessions */}
        <div>
          <h2 className="font-display text-xl text-paradise-cream mb-3">Upcoming Sessions</h2>
          <Card variant="glass" className="flex items-center gap-3 text-paradise-cream/50">
            <CalendarDays size={18} className="text-paradise-gold/40" />
            <p className="text-sm">No sessions scheduled — tap Schedule to add one.</p>
          </Card>
        </div>

        {/* Past sessions */}
        <div>
          <h2 className="font-display text-xl text-paradise-cream mb-3">Past Sessions</h2>
          <Card variant="glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-paradise-cream text-sm font-medium">Bible Study — Romans 12</p>
                <p className="text-paradise-cream/50 text-xs mt-0.5">April 28, 2026</p>
              </div>
              <Badge variant="green">Completed</Badge>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
