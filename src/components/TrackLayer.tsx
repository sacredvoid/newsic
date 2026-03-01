import { motion } from 'framer-motion'
import type { LayerName, LayerState } from '../types'

const layerColors: Record<LayerName, { bg: string; text: string; accent: string; bar: string }> = {
  drums: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    accent: 'border-orange-500/30',
    bar: 'bg-orange-500',
  },
  bass: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    accent: 'border-purple-500/30',
    bar: 'bg-purple-500',
  },
  lead: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    accent: 'border-cyan-500/30',
    bar: 'bg-cyan-500',
  },
  fx: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    accent: 'border-pink-500/30',
    bar: 'bg-pink-500',
  },
}

const layerIcons: Record<LayerName, string> = {
  drums: '\u{1F941}',
  bass: '\u{1F50A}',
  lead: '\u{1F3B9}',
  fx: '\u2728',
}

const layerLabels: Record<LayerName, string> = {
  drums: 'Drums',
  bass: 'Bass',
  lead: 'Lead',
  fx: 'FX',
}

interface TrackLayerProps {
  layer: LayerState
  onToggleMute: (layer: LayerName) => void
  onVolumeChange: (layer: LayerName, volume: number) => void
}

function PatternBlocks({ pattern, color }: { pattern: string; color: string }) {
  if (!pattern) return null

  // Parse the pattern string into visual blocks
  const chars = pattern.replace(/[^a-zA-Z0-9~.*\[\] ]/g, '').split('')
  const blocks = chars
    .filter((c) => c !== ' ' && c !== '[' && c !== ']')
    .slice(0, 32)
    .map((c) => c !== '~' && c !== '.')

  return (
    <div className="flex gap-0.5 items-center h-6">
      {blocks.map((active, i) => (
        <div
          key={i}
          className={`h-full rounded-sm transition-all ${
            active ? `${color} opacity-80` : 'bg-zinc-800 opacity-40'
          }`}
          style={{ width: `${100 / blocks.length}%`, minWidth: 3 }}
        />
      ))}
    </div>
  )
}

export function TrackLayer({ layer, onToggleMute, onVolumeChange }: TrackLayerProps) {
  const colors = layerColors[layer.name]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${colors.bg} border ${colors.accent} rounded-lg p-3 ${
        layer.muted ? 'opacity-40' : ''
      } transition-opacity`}
    >
      <div className="flex items-center gap-3">
        {/* Icon + Name */}
        <div className="flex items-center gap-2 w-20 shrink-0">
          <span className="text-base">{layerIcons[layer.name]}</span>
          <span className={`text-sm font-medium ${colors.text}`}>
            {layerLabels[layer.name]}
          </span>
        </div>

        {/* Pattern Visualization */}
        <div className="flex-1 min-w-0">
          <PatternBlocks pattern={layer.pattern} color={colors.bar} />
        </div>

        {/* Volume Slider */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={layer.volume}
          onChange={(e) => onVolumeChange(layer.name, Number(e.target.value))}
          className="w-20 shrink-0 accent-current"
        />

        {/* Mute Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleMute(layer.name)}
          className={`w-8 h-8 rounded text-xs font-bold shrink-0 border transition-all ${
            layer.muted
              ? 'bg-zinc-800 border-zinc-700 text-zinc-500'
              : `${colors.bg} ${colors.accent} ${colors.text}`
          }`}
        >
          {layer.muted ? 'M' : 'M'}
        </motion.button>
      </div>
    </motion.div>
  )
}
