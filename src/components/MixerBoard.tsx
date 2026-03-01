import { AnimatePresence, motion } from 'framer-motion'
import type { LayerName, LayerState } from '../types'
import { TrackLayer } from './TrackLayer'

const layerOrder: LayerName[] = ['drums', 'bass', 'lead', 'fx']

interface MixerBoardProps {
  layers: Record<LayerName, LayerState>
  onToggleMute: (layer: LayerName) => void
  onVolumeChange: (layer: LayerName, volume: number) => void
  hasTrack: boolean
}

export function MixerBoard({ layers, onToggleMute, onVolumeChange, hasTrack }: MixerBoardProps) {
  if (!hasTrack) {
    return (
      <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-zinc-600 text-sm">
          Pick your style and hit Generate to create a track
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
        className="space-y-2"
      >
        {layerOrder.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <TrackLayer
              layer={layers[name]}
              onToggleMute={onToggleMute}
              onVolumeChange={onVolumeChange}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
