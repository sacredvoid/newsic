import { motion } from 'framer-motion'

interface TransportBarProps {
  isPlaying: boolean
  showCode: boolean
  hasTrack: boolean
  onPlay: () => void
  onStop: () => void
  onRemix: () => void
  onToggleCode: () => void
  loading: boolean
}

export function TransportBar({
  isPlaying,
  showCode,
  hasTrack,
  onPlay,
  onStop,
  onRemix,
  onToggleCode,
  loading,
}: TransportBarProps) {
  return (
    <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 p-3">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        {/* Play/Stop */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isPlaying ? onStop : onPlay}
          disabled={!hasTrack || loading}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
            !hasTrack
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              : isPlaying
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {isPlaying ? '\u23F9' : '\u25B6'}
        </motion.button>

        {/* Remix */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRemix}
          disabled={!hasTrack || loading}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            !hasTrack
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Remixing
            </span>
          ) : (
            '\u{1F3B2} Remix'
          )}
        </motion.button>

        {/* Show Code Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggleCode}
          disabled={!hasTrack}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
            !hasTrack
              ? 'bg-zinc-800 text-zinc-600 border-zinc-800 cursor-not-allowed'
              : showCode
                ? 'bg-zinc-700 text-white border-zinc-600'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
          }`}
        >
          {'</>'} Code
        </motion.button>
      </div>
    </div>
  )
}
