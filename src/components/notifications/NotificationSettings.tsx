import { Bell, Loader2 } from 'lucide-react'
import { usePushNotifications } from '../../hooks/usePushNotifications'

export function NotificationSettings() {
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushNotifications()

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white/10 shrink-0 mt-0.5">
          <Bell size={16} className="text-paradise-gold" />
        </div>
        <div>
          <p className="text-paradise-cream text-sm font-semibold">
            Family Worship Reminders
          </p>
          <p className="text-paradise-cream/50 text-xs mt-0.5">
            {isSupported
              ? 'Get notified before your Family Worship evening'
              : 'Push notifications are not supported in your browser'}
          </p>
        </div>
      </div>

      {isSupported && (
        <button
          type="button"
          disabled={isLoading}
          onClick={isSubscribed ? unsubscribe : subscribe}
          className={[
            'relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200',
            isSubscribed ? 'bg-paradise-gold' : 'bg-white/20',
            isLoading ? 'opacity-60 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {isLoading ? (
            <Loader2
              size={12}
              className="absolute inset-0 m-auto text-paradise-green-deep animate-spin"
            />
          ) : (
            <span
              className={[
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                isSubscribed ? 'translate-x-6' : 'translate-x-0.5',
              ].join(' ')}
            />
          )}
        </button>
      )}
    </div>
  )
}
