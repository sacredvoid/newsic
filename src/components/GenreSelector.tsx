import { motion } from 'framer-motion'
import type { Genre, Mood } from '../types'
import { genres } from '../data/genres'
import { moods } from '../data/moods'
import { getArtistsByGenre } from '../data/artists'

const genreAccentHex: Record<Genre, string> = {
  house: '#3b82f6',
  techno: '#ef4444',
  trance: '#06b6d4',
  dnb: '#22c55e',
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
  const accent = genreAccentHex[genre]

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Genre - 2x2 grid */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2.5 font-medium"
          style={{ color: 'var(--text-muted)' }}>
          Genre
        </label>
        <div className="grid grid-cols-2 gap-2">
          {genres.map((g) => {
            const isActive = genre === g.id
            const gAccent = genreAccentHex[g.id]
            return (
              <motion.button
                key={g.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onGenreChange(g.id)
                  onArtistChange(null)
                  onBpmChange(g.defaultBpm)
                }}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-all border"
                style={{
                  borderColor: isActive ? gAccent : 'var(--border-standard)',
                  color: isActive ? gAccent : 'var(--text-secondary)',
                  background: isActive ? `${gAccent}15` : 'transparent',
                  boxShadow: isActive ? `0 0 20px ${gAccent}20` : 'none',
                }}
              >
                {g.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Mood - chip row */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2.5 font-medium"
          style={{ color: 'var(--text-muted)' }}>
          Mood
        </label>
        <div className="flex flex-wrap gap-1.5">
          {moods.map((m) => {
            const isActive = mood === m.id
            return (
              <button
                key={m.id}
                onClick={() => onMoodChange(m.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  borderColor: isActive ? accent : 'var(--border-standard)',
                  color: isActive ? accent : 'var(--text-secondary)',
                  background: isActive ? `${accent}15` : 'transparent',
                }}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* BPM */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-medium"
            style={{ color: 'var(--text-muted)' }}>
            Tempo
          </label>
          <span className="text-lg font-mono font-bold" style={{ color: accent }}>
            {bpm}
            <span className="text-[10px] ml-1 font-normal" style={{ color: 'var(--text-muted)' }}>BPM</span>
          </span>
        </div>
        <input
          type="range"
          min={currentGenreConfig.bpmRange[0]}
          max={currentGenreConfig.bpmRange[1]}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>{currentGenreConfig.bpmRange[0]}</span>
          <span>{currentGenreConfig.bpmRange[1]}</span>
        </div>
      </div>

      {/* Inspired By - chip list */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2.5 font-medium"
          style={{ color: 'var(--text-muted)' }}>
          Inspired By
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onArtistChange(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              borderColor: artistId === null ? accent : 'var(--border-standard)',
              color: artistId === null ? accent : 'var(--text-secondary)',
              background: artistId === null ? `${accent}15` : 'transparent',
            }}
          >
            None
          </button>
          {artists.map((a) => {
            const isActive = artistId === a.id
            return (
              <button
                key={a.id}
                onClick={() => onArtistChange(a.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  borderColor: isActive ? accent : 'var(--border-standard)',
                  color: isActive ? accent : 'var(--text-secondary)',
                  background: isActive ? `${accent}15` : 'transparent',
                }}
              >
                {a.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Spacer to push generate button to bottom */}
      <div className="flex-1" />

      {/* Generate Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all"
        style={{
          background: loading ? `${accent}60` : accent,
          color: (genre === 'techno' || genre === 'house') ? '#fff' : '#000',
          cursor: loading ? 'wait' : 'pointer',
          boxShadow: loading ? 'none' : `0 0 30px ${accent}30`,
        }}
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
