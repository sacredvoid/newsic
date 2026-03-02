import { useRef, useEffect } from 'react'
import type { LayerName, LayerState } from '../types'

const layerColors: Record<LayerName, string> = {
  drums: '#f97316',
  bass: '#a855f7',
  lead: '#06b6d4',
  fx: '#ec4899',
}

const layerLabels: Record<LayerName, string> = {
  drums: 'DRUMS',
  bass: 'BASS',
  lead: 'LEAD',
  fx: 'FX',
}

interface TrackLayerProps {
  layer: LayerState
  onToggleMute: (layer: LayerName) => void
  onVolumeChange: (layer: LayerName, volume: number) => void
  isPlaying: boolean
  accentColor: string
}

function VuMeter({ color, isPlaying, volume, muted }: { color: string; isPlaying: boolean; volume: number; muted: boolean }) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!isPlaying || muted) {
      barsRef.current.forEach((bar) => {
        if (bar) bar.style.opacity = '0.15'
      })
      return
    }

    const animate = () => {
      const time = Date.now() / 1000
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        const normalizedLevel = Math.random() * volume * 0.8 +
          Math.sin(time * 4 + i * 0.8) * 0.15 * volume
        const clamped = Math.max(0.1, Math.min(1, normalizedLevel))
        bar.style.opacity = String(clamped)
      })
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [isPlaying, volume, muted])

  return (
    <div className="flex gap-[3px] items-end h-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { barsRef.current[i] = el }}
          className="w-[3px] h-full rounded-sm transition-opacity"
          style={{ background: color, opacity: 0.15 }}
        />
      ))}
    </div>
  )
}

export function TrackLayer({ layer, onToggleMute, onVolumeChange, isPlaying }: TrackLayerProps) {
  const color = layerColors[layer.name]

  return (
    <div
      className="flex items-center gap-4 px-3 py-2 rounded-lg transition-opacity"
      style={{
        background: `${color}08`,
        opacity: layer.muted ? 0.35 : 1,
        borderLeft: `2px solid ${color}${layer.muted ? '30' : '80'}`,
      }}
    >
      {/* Label */}
      <span
        className="text-[10px] font-mono font-bold tracking-widest w-12 shrink-0"
        style={{ color }}
      >
        {layerLabels[layer.name]}
      </span>

      {/* VU Meter */}
      <div className="shrink-0">
        <VuMeter color={color} isPlaying={isPlaying} volume={layer.volume} muted={layer.muted} />
      </div>

      {/* Volume Slider */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={layer.volume}
        onChange={(e) => onVolumeChange(layer.name, Number(e.target.value))}
        className="flex-1 min-w-0"
        style={{ accentColor: color }}
      />

      {/* Mute Button */}
      <button
        onClick={() => onToggleMute(layer.name)}
        className="w-7 h-7 rounded text-[10px] font-bold shrink-0 transition-all border font-mono"
        style={{
          borderColor: layer.muted ? 'var(--border-standard)' : `${color}50`,
          color: layer.muted ? 'var(--text-muted)' : color,
          background: layer.muted ? 'transparent' : `${color}15`,
        }}
      >
        M
      </button>
    </div>
  )
}
