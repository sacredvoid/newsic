import type { GeneratedTrack, Genre, LayerConfig, Mood } from '../types'
import { getGenre } from '../data/genres'
import { getMood } from '../data/moods'
import { getArtist } from '../data/artists'

export function buildTrack(
  genre: Genre,
  bpm: number,
  mood: Mood,
  artistId: string | null,
): GeneratedTrack {
  const genreConfig = getGenre(genre)!
  const moodConfig = getMood(mood)
  const artist = artistId ? getArtist(artistId) : null

  const adjustedBpm = bpm + (moodConfig?.bpmAdjust ?? 0)

  const drumsConfig = artist?.drums ?? genreConfig.defaultDrums
  const bassConfig = artist?.bass ?? genreConfig.defaultBass
  const leadConfig = artist?.lead ?? genreConfig.defaultLead
  const fxConfig = artist?.fx ?? genreConfig.defaultFx

  const drumsCode = buildDrumsLayer(drumsConfig)
  const bassCode = buildMelodicLayer(bassConfig, moodConfig?.effectOverrides)
  const leadCode = buildMelodicLayer(leadConfig, moodConfig?.effectOverrides)
  const fxCode = buildFxLayer(fxConfig, moodConfig?.effectOverrides)

  const keys = artist?.preferredKeys ?? ['Cm']
  const key = keys[Math.floor(Math.random() * keys.length)]

  const fullCode = [
    `setcpm(${adjustedBpm} / 4)`,
    '',
    '// Drums',
    drumsCode,
    '',
    '// Bass',
    bassCode,
    '',
    '// Lead',
    leadCode,
    '',
    '// FX',
    fxCode,
  ].join('\n')

  return {
    code: fullCode,
    layers: { drums: drumsCode, bass: bassCode, lead: leadCode, fx: fxCode },
    bpm: adjustedBpm,
    key,
  }
}

function buildDrumsLayer(config: LayerConfig): string {
  const effects = config.effects.join('')
  return `sound("${config.pattern}")${effects}`
}

function buildMelodicLayer(config: LayerConfig, moodEffects?: string[]): string {
  const sound = config.sound ? `.sound("${config.sound}")` : ''
  const baseEffects = config.effects.join('')
  const extraEffects = moodEffects ? moodEffects.join('') : ''

  if (config.pattern.includes('note(')) {
    return `${config.pattern}${sound}${baseEffects}${extraEffects}`
  }
  return `note("${config.pattern}")${sound}${baseEffects}${extraEffects}`
}

function buildFxLayer(config: LayerConfig, moodEffects?: string[]): string {
  const baseEffects = config.effects.join('')
  const extraEffects = moodEffects ? moodEffects.join('') : ''

  if (config.pattern.trim() === '~ ~ ~ ~' || config.pattern.trim() === '') {
    return `sound("~")${baseEffects}${extraEffects}`
  }
  return `sound("${config.pattern}")${baseEffects}${extraEffects}`
}
