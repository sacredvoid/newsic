interface AudioVisualizerProps {
  isPlaying: boolean
  accentColor: string
  analyserNode: AnalyserNode | null
}

export function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {isPlaying ? 'Visualizer coming soon...' : 'Generate a track to see the visualizer'}
      </p>
    </div>
  )
}
