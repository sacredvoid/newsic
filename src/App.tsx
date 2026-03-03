import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { GenreSelector } from './components/GenreSelector'
import { MixerBoard } from './components/MixerBoard'
import { TransportBar } from './components/TransportBar'
import { CodePreview } from './components/CodePreview'
import { AudioVisualizer } from './components/AudioVisualizer'
import { MobileBanner } from './components/MobileBanner'
import { useTrack } from './hooks/useTrack'

const genreAccentMap: Record<string, { accent: string; glow: string }> = {
  house: { accent: '#3b82f6', glow: 'rgba(59, 130, 246, 0.08)' },
  techno: { accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.08)' },
  trance: { accent: '#06b6d4', glow: 'rgba(6, 182, 212, 0.08)' },
  dnb: { accent: '#22c55e', glow: 'rgba(34, 197, 94, 0.08)' },
}

function App() {
  const track = useTrack()

  // Update CSS custom properties when genre changes
  useEffect(() => {
    const colors = genreAccentMap[track.state.genre]
    if (colors) {
      document.documentElement.style.setProperty('--accent', colors.accent)
      document.documentElement.style.setProperty('--accent-glow', colors.glow)
    }
  }, [track.state.genre])

  const accentHex = genreAccentMap[track.state.genre]?.accent ?? '#3b82f6'

  return (
    <>
      <Analytics />
      <MobileBanner />
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: `var(--surface-base)` }}>
        {/* Top header bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h1 className="text-lg font-semibold tracking-tight font-mono" style={{ color: 'var(--text-primary)' }}>
            newsic
          </h1>
          <div className="flex items-center gap-2">
            {track.generatedTrack && (
              <>
                <button
                  onClick={track.toggleShowCode}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all border"
                  style={{
                    borderColor: track.state.showCode ? 'var(--accent)' : 'var(--border-standard)',
                    color: track.state.showCode ? accentHex : 'var(--text-secondary)',
                    background: track.state.showCode ? 'var(--accent-glow)' : 'transparent',
                  }}
                >
                  {'</>'} Code
                </button>
                <a
                  href={`https://strudel.cc/#${btoa(track.generatedTrack.code)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all border"
                  style={{
                    borderColor: 'var(--border-standard)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Open in Strudel
                </a>
              </>
            )}
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside
            className="w-[280px] shrink-0 flex flex-col border-r overflow-y-auto p-5"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--surface-glass)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            <GenreSelector
              genre={track.state.genre}
              mood={track.state.mood}
              artistId={track.state.artistId}
              bpm={track.state.bpm}
              onGenreChange={track.setGenre}
              onMoodChange={track.setMood}
              onArtistChange={track.setArtist}
              onBpmChange={track.setBpm}
              onGenerate={track.generate}
              loading={track.loading}
            />
          </aside>

          {/* Main right panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Visualizer area */}
            <div className="flex-1 relative min-h-0">
              {/* Ambient genre glow */}
              <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                  background: `radial-gradient(ellipse at 50% 60%, ${accentHex}12 0%, transparent 70%)`,
                }}
              />
              <AudioVisualizer
                isPlaying={track.state.isPlaying}
                accentColor={accentHex}
                analyserNode={track.analyserNode}
              />

              {/* Code preview overlay */}
              {track.state.showCode && track.generatedTrack && (
                <div className="absolute inset-0 z-10">
                  <CodePreview code={track.generatedTrack.code} />
                </div>
              )}
            </div>

            {/* Mixer */}
            <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <MixerBoard
                layers={track.state.layers}
                onToggleMute={track.toggleMute}
                onVolumeChange={track.setVolume}
                hasTrack={!!track.generatedTrack}
                isPlaying={track.state.isPlaying}
                accentColor={accentHex}
              />
            </div>

            {/* Transport */}
            <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <TransportBar
                isPlaying={track.state.isPlaying}
                hasTrack={!!track.generatedTrack}
                onPlay={track.play}
                onStop={track.stop}
                onRemix={track.remix}
                loading={track.loading}
                accentColor={accentHex}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
