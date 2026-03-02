import { AnimatePresence, motion } from 'framer-motion'
import type { LayerName, LayerState } from '../types'
import { TrackLayer } from './TrackLayer'

const layerOrder: LayerName[] = ['drums', 'bass', 'lead', 'fx']

interface MixerBoardProps {
  layers: Record<LayerName, LayerState>
  onToggleMute: (layer: LayerName) => void
  onVolumeChange: (layer: LayerName, volume: number) => void
  hasTrack: boolean
  isPlaying: boolean
  accentColor: string
}

export function MixerBoard({ layers, onToggleMute, onVolumeChange, hasTrack, isPlaying, accentColor }: MixerBoardProps) {
  if (!hasTrack) {
    return (
      <div className="px-5 py-6 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Pick your style and hit Generate to create a track
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-5 py-3 space-y-1.5"
      >
        {layerOrder.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TrackLayer
              layer={layers[name]}
              onToggleMute={onToggleMute}
              onVolumeChange={onVolumeChange}
              isPlaying={isPlaying}
              accentColor={accentColor}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
