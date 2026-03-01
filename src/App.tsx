import { GenreSelector } from './components/GenreSelector'
import { MixerBoard } from './components/MixerBoard'
import { TransportBar } from './components/TransportBar'
import { CodePreview } from './components/CodePreview'
import { useTrack } from './hooks/useTrack'

function App() {
  const track = useTrack()

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-tight">Claude Music Studio</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Make EDM with AI-crafted patterns</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 space-y-6 pb-24">
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

        <MixerBoard
          layers={track.state.layers}
          onToggleMute={track.toggleMute}
          onVolumeChange={track.setVolume}
          hasTrack={!!track.generatedTrack}
        />

        {track.state.showCode && track.generatedTrack && (
          <CodePreview code={track.generatedTrack.code} />
        )}
      </main>

      {/* Transport bar */}
      <TransportBar
        isPlaying={track.state.isPlaying}
        showCode={track.state.showCode}
        hasTrack={!!track.generatedTrack}
        onPlay={track.play}
        onStop={track.stop}
        onRemix={track.remix}
        onToggleCode={track.toggleShowCode}
        loading={track.loading}
      />
    </div>
  )
}

export default App
