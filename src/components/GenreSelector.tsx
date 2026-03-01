import { motion } from 'framer-motion'
import type { Genre, Mood } from '../types'
import { genres } from '../data/genres'
import { moods } from '../data/moods'
import { getArtistsByGenre } from '../data/artists'

const genreAccentHex: Record<Genre, string> = {
  house: '#f59e0b',
  techno: '#ef4444',
  trance: '#06b6d4',
  dnb: '#22c55e',
}

const genreButtonStyles: Record<Genre, string> = {
  house: 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20',
  techno: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20',
  trance: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20',
  dnb: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20',
}

const genreActiveStyles: Record<Genre, string> = {
  house: 'bg-amber-500/30 border-amber-500 text-amber-300 shadow-amber-500/20 shadow-lg',
  techno: 'bg-red-500/30 border-red-500 text-red-300 shadow-red-500/20 shadow-lg',
  trance: 'bg-cyan-500/30 border-cyan-500 text-cyan-300 shadow-cyan-500/20 shadow-lg',
  dnb: 'bg-green-500/30 border-green-500 text-green-300 shadow-green-500/20 shadow-lg',
}

const generateButtonStyles: Record<Genre, string> = {
  house: 'bg-amber-500 hover:bg-amber-400 text-black',
  techno: 'bg-red-500 hover:bg-red-400 text-white',
  trance: 'bg-cyan-500 hover:bg-cyan-400 text-black',
  dnb: 'bg-green-500 hover:bg-green-400 text-black',
}

interface GenreSelectorProps {
  genre: Genre
  mood: Mood
  artistId: string | null
  bpm: number
  onGenreChange: (genre: Genre) => void
  onMoodChange: (mood: Mood) => void
  onArtistChange: (artistId: string | null) => void
  onBpmChange: (bpm: number) => void
  onGenerate: () => void
  loading: boolean
}

export function GenreSelector({
  genre,
  mood,
  artistId,
  bpm,
  onGenreChange,
  onMoodChange,
  onArtistChange,
  onBpmChange,
  onGenerate,
  loading,
}: GenreSelectorProps) {
  const artists = getArtistsByGenre(genre)
  const currentGenreConfig = genres.find((g) => g.id === genre)!
  const accentHex = genreAccentHex[genre]

  return (
    <div className="space-y-5">
      {/* Genre Selection */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Genre</label>
        <div className="flex gap-2">
          {genres.map((g) => (
            <motion.button
              key={g.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onGenreChange(g.id)
                onArtistChange(null)
                onBpmChange(g.defaultBpm)
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                genre === g.id ? genreActiveStyles[g.id] : genreButtonStyles[g.id]
              }`}
            >
              {g.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mood + Artist Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Mood</label>
          <select
            value={mood}
            onChange={(e) => onMoodChange(e.target.value as Mood)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
          >
            {moods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
            Inspired By
          </label>
          <select
            value={artistId ?? ''}
            onChange={(e) => onArtistChange(e.target.value || null)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
          >
            <option value="">None (genre default)</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BPM Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Tempo</label>
          <span className="text-sm font-mono text-zinc-300">{bpm} BPM</span>
        </div>
        <input
          type="range"
          min={currentGenreConfig.bpmRange[0]}
          max={currentGenreConfig.bpmRange[1]}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: accentHex }}
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>{currentGenreConfig.bpmRange[0]}</span>
          <span>{currentGenreConfig.bpmRange[1]}</span>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        onClick={onGenerate}
        disabled={loading}
        className={`w-full py-3.5 rounded-xl text-base font-bold tracking-wide transition-all ${generateButtonStyles[genre]} ${
          loading ? 'opacity-60 cursor-wait' : ''
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          'Generate Track'
        )}
      </motion.button>
    </div>
  )
}
