import type { GeneratedTrack, Genre, Mood } from '../types'
import { buildTrack } from './patternBuilder'

export function remixTrack(
  genre: Genre,
  bpm: number,
  mood: Mood,
  artistId: string | null,
): GeneratedTrack {
  const bpmVariation = Math.floor(Math.random() * 7) - 3
  return buildTrack(genre, bpm + bpmVariation, mood, artistId)
}
