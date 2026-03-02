import { useState } from 'react'

export function MobileBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center"
      style={{ background: 'var(--surface-base)' }}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Best on desktop
        </h2>
        <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
          newsic is an immersive audio experience designed for larger screens.
          Put on your headphones and open this on a desktop for the full experience.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs underline underline-offset-4 mt-4"
          style={{ color: 'var(--text-muted)' }}
        >
          Continue anyway
        </button>
      </div>
    </div>
  )
}
