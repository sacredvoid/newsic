import { useCallback, useEffect, useRef, useState } from 'react'
import type { Genre, GeneratedTrack, LayerName, Mood, TrackState } from '../types'
import { buildTrack } from '../engine/patternBuilder'
import { remixTrack } from '../engine/remixer'
import {
  initStrudelEngine,
  playPattern,
  stopPlayback,
  getAnalyserNode,
  preloadStrudel,
} from '../engine/strudelBridge'

const initialState: TrackState = {
  genre: 'house',
  mood: 'energetic',
  artistId: null,
  bpm: 124,
  layers: {
    drums: { name: 'drums', volume: 0.8, muted: false, solo: false, pattern: '' },
    bass: { name: 'bass', volume: 0.7, muted: false, solo: false, pattern: '' },
    lead: { name: 'lead', volume: 0.6, muted: false, solo: false, pattern: '' },
    fx: { name: 'fx', volume: 0.4, muted: false, solo: false, pattern: '' },
  },
  isPlaying: false,
  showCode: false,
}

export function useTrack() {
  const [state, setState] = useState<TrackState>(initialState)
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)
  const initRef = useRef(false)

  // Pre-load Strudel on first user interaction to reduce delay on Generate
  useEffect(() => {
    const handler = () => {
      preloadStrudel()
      document.removeEventListener('click', handler)
      document.removeEventListener('keydown', handler)
    }
    document.addEventListener('click', handler, { once: true })
    document.addEventListener('keydown', handler, { once: true })
    return () => {
      document.removeEventListener('click', handler)
      document.removeEventListener('keydown', handler)
    }
  }, [])

  const ensureInit = useCallback(async () => {
    if (!initRef.current) {
      await initStrudelEngine()
      initRef.current = true
      // Grab the analyser node after initialization
      const node = getAnalyserNode()
      if (node) setAnalyserNode(node)
    }
  }, [])

  const setGenre = useCallback((genre: Genre) => {
    setState((prev) => ({ ...prev, genre }))
  }, [])

  const setMood = useCallback((mood: Mood) => {
    setState((prev) => ({ ...prev, mood }))
  }, [])

  const setArtist = useCallback((artistId: string | null) => {
    setState((prev) => ({ ...prev, artistId }))
  }, [])

  const setBpm = useCallback((bpm: number) => {
    setState((prev) => ({ ...prev, bpm }))
  }, [])

  const toggleMute = useCallback((layer: LayerName) => {
    setState((prev) => ({
      ...prev,
      layers: {
        ...prev.layers,
        [layer]: { ...prev.layers[layer], muted: !prev.layers[layer].muted },
      },
    }))
  }, [])

  const setVolume = useCallback((layer: LayerName, volume: number) => {
    setState((prev) => ({
      ...prev,
      layers: {
        ...prev.layers,
        [layer]: { ...prev.layers[layer], volume },
      },
    }))
  }, [])

  const toggleShowCode = useCallback(() => {
    setState((prev) => ({ ...prev, showCode: !prev.showCode }))
  }, [])

  const generate = useCallback(async () => {
    setLoading(true)
    try {
      await ensureInit()

      const track = buildTrack(state.genre, state.bpm, state.mood, state.artistId)
      setGeneratedTrack(track)

      setState((prev) => ({
        ...prev,
        layers: {
          drums: { ...prev.layers.drums, pattern: track.layers.drums },
          bass: { ...prev.layers.bass, pattern: track.layers.bass },
          lead: { ...prev.layers.lead, pattern: track.layers.lead },
          fx: { ...prev.layers.fx, pattern: track.layers.fx },
        },
      }))

      await playPattern(track.code)
      setState((prev) => ({ ...prev, isPlaying: true }))
    } catch (err) {
      console.error('[newsic] Generate error:', err)
    }
    setLoading(false)
  }, [state.genre, state.bpm, state.mood, state.artistId, ensureInit])

  const remix = useCallback(async () => {
    setLoading(true)
    try {
      await ensureInit()

      const track = remixTrack(state.genre, state.bpm, state.mood, state.artistId)
      setGeneratedTrack(track)

      setState((prev) => ({
        ...prev,
        layers: {
          drums: { ...prev.layers.drums, pattern: track.layers.drums },
          bass: { ...prev.layers.bass, pattern: track.layers.bass },
          lead: { ...prev.layers.lead, pattern: track.layers.lead },
          fx: { ...prev.layers.fx, pattern: track.layers.fx },
        },
      }))

      await playPattern(track.code)
      setState((prev) => ({ ...prev, isPlaying: true }))
    } catch (err) {
      console.error('[newsic] Remix error:', err)
    }
    setLoading(false)
  }, [state.genre, state.bpm, state.mood, state.artistId, ensureInit])

  const stop = useCallback(() => {
    stopPlayback()
    setState((prev) => ({ ...prev, isPlaying: false }))
  }, [])

  const play = useCallback(async () => {
    if (generatedTrack) {
      await ensureInit()
      await playPattern(generatedTrack.code)
      setState((prev) => ({ ...prev, isPlaying: true }))
    }
  }, [generatedTrack, ensureInit])

  return {
    state,
    generatedTrack,
    loading,
    analyserNode,
    setGenre,
    setMood,
    setArtist,
    setBpm,
    toggleMute,
    setVolume,
    toggleShowCode,
    generate,
    remix,
    stop,
    play,
  }
}
