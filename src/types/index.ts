export type Genre = 'house' | 'techno' | 'trance' | 'dnb'

export type Mood = 'energetic' | 'dark' | 'dreamy' | 'hypnotic' | 'uplifting' | 'aggressive'

export type LayerName = 'drums' | 'bass' | 'lead' | 'fx'

export interface LayerConfig {
  pattern: string
  sound?: string
  samples?: string[]
  effects: string[]
}

export interface ArtistProfile {
  id: string
  name: string
  genre: Genre
  bpmRange: [number, number]
  preferredKeys: string[]
  drums: LayerConfig
  bass: LayerConfig
  lead: LayerConfig
  fx: LayerConfig
  tags: string[]
}

export interface GenreConfig {
  id: Genre
  label: string
  defaultBpm: number
  bpmRange: [number, number]
  defaultDrums: LayerConfig
  defaultBass: LayerConfig
  defaultLead: LayerConfig
  defaultFx: LayerConfig
}

export interface MoodModifier {
  id: Mood
  label: string
  bpmAdjust: number
  gainMultiplier?: number
  filterCutoff?: number
  reverbAmount?: number
  delayAmount?: number
  distortAmount?: number
}

export interface TrackState {
  genre: Genre
  mood: Mood
  artistId: string | null
  bpm: number
  layers: Record<LayerName, LayerState>
  isPlaying: boolean
  showCode: boolean
}

export interface LayerState {
  name: LayerName
  volume: number
  muted: boolean
  solo: boolean
  pattern: string
}

export interface GeneratedTrack {
  code: string
  layers: Record<LayerName, string>
  bpm: number
  key: string
}
