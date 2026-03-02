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

  const keys = artist?.preferredKeys ?? ['Cm']
  const key = keys[Math.floor(Math.random() * keys.length)]

  // Build individual layer code strings (for the mixer display)
  const drumsCode = buildDrumsLayer(drumsConfig)
  const bassCode = buildMelodicLayer(bassConfig, moodConfig?.effectOverrides)
  const leadCode = buildMelodicLayer(leadConfig, moodConfig?.effectOverrides)
  const fxCode = buildFxLayer(fxConfig, moodConfig?.effectOverrides)

  // Build the FULL structured track with arrangement
  const fullCode = buildArrangedTrack(
    adjustedBpm,
    genre,
    drumsConfig,
    bassConfig,
    leadConfig,
    fxConfig,
    moodConfig?.effectOverrides,
  )

  return {
    code: fullCode,
    layers: { drums: drumsCode, bass: bassCode, lead: leadCode, fx: fxCode },
    bpm: adjustedBpm,
    key,
  }
}

// Build a full EDM-structured track using Strudel's arrange() and gain automation
// Structure: Intro (4 cycles) -> Buildup (4) -> Drop (8) -> Breakdown (4) -> Drop 2 (8) -> Outro (4)
function buildArrangedTrack(
  bpm: number,
  genre: Genre,
  drums: LayerConfig,
  bass: LayerConfig,
  lead: LayerConfig,
  fx: LayerConfig,
  moodEffects?: string[],
): string {
  const moodFx = moodEffects ? moodEffects.join('') : ''

  // Get the raw pattern strings
  const drumPattern = drums.pattern
  const drumEffects = drums.effects.join('')

  const bassHasNote = bass.pattern.includes('note(')
  const bassPatternStr = bassHasNote ? bass.pattern : `note("${bass.pattern}")`
  const bassSound = bass.sound ? `.sound("${bass.sound}")` : ''
  const bassFx = bass.effects.join('')

  const leadHasNote = lead.pattern.includes('note(')
  const leadPatternStr = leadHasNote ? lead.pattern : `note("${lead.pattern}")`
  const leadSound = lead.sound ? `.sound("${lead.sound}")` : ''
  const leadFx = lead.effects.join('')

  const fxHasNote = fx.pattern.includes('note(')
  const fxIsEmpty = fx.pattern.trim() === '~ ~ ~ ~' || fx.pattern.trim() === ''
  let fxPatternStr: string
  if (fxIsEmpty) {
    fxPatternStr = 'sound("~")'
  } else if (fxHasNote) {
    const fxSound = fx.sound ? `.sound("${fx.sound}")` : ''
    fxPatternStr = `${fx.pattern}${fxSound}`
  } else {
    fxPatternStr = `sound("${fx.pattern}")`
  }
  const fxFx = fx.effects.join('')

  // Build the tempo and structure comment
  const lines: string[] = [
    `setcpm(${bpm} / 4)`,
    '',
    `// ====== ${genre.toUpperCase()} TRACK ======`,
    `// Structure: Intro -> Buildup -> Drop -> Breakdown -> Drop 2 -> Outro`,
    '',
  ]

  // ---- DRUMS with arrangement ----
  // Intro: just hihats/light percussion
  // Buildup: add kick, filter sweep up
  // Drop: full drums
  // Breakdown: stripped back
  // Drop 2: full drums again
  // Outro: fade out kicks
  lines.push(
    '// Drums - full arrangement',
    `$: arrange(`,
    `  [4, sound("${getIntroDrums(genre)}").gain(0.6)],`,
    `  [4, sound("${getBuildupDrums(genre, drumPattern)}").lpf(sine.slow(4).range(400, 8000))${drumEffects}],`,
    `  [8, sound("${drumPattern}")${drumEffects}.gain(0.9)],`,
    `  [4, sound("${getBreakdownDrums(genre)}").gain(0.5)],`,
    `  [8, sound("${drumPattern}")${drumEffects}.gain(0.95)],`,
    `  [4, sound("${getOutroDrums(genre, drumPattern)}").gain(saw.slow(4).range(0.7, 0.1))]`,
    `)`,
    '',
  )

  // ---- BASS with arrangement ----
  // Intro: silent
  // Buildup: low-passed, rising filter
  // Drop: full bass
  // Breakdown: quiet bass
  // Drop 2: full bass
  // Outro: fading bass
  lines.push(
    '// Bass - enters at buildup, full at drop',
    `$: arrange(`,
    `  [4, silence],`,
    `  [4, ${bassPatternStr}${bassSound}${bassFx}.lpf(saw.slow(4).range(200, 2000)).gain(0.5)${moodFx}],`,
    `  [8, ${bassPatternStr}${bassSound}${bassFx}.gain(0.8)${moodFx}],`,
    `  [4, ${bassPatternStr}${bassSound}${bassFx}.lpf(800).gain(0.3)${moodFx}],`,
    `  [8, ${bassPatternStr}${bassSound}${bassFx}.gain(0.85)${moodFx}],`,
    `  [4, ${bassPatternStr}${bassSound}${bassFx}.gain(saw.slow(4).range(0.6, 0))${moodFx}]`,
    `)`,
    '',
  )

  // ---- LEAD with arrangement ----
  // Intro: silent
  // Buildup: teaser notes, filtered
  // Drop: full lead
  // Breakdown: melodic, reverb-heavy
  // Drop 2: full lead with variation
  // Outro: fading
  lines.push(
    '// Lead - melodic hook at the drops',
    `$: arrange(`,
    `  [4, silence],`,
    `  [4, ${leadPatternStr}${leadSound}${leadFx}.lpf(sine.slow(4).range(500, 4000)).gain(0.3)${moodFx}],`,
    `  [8, ${leadPatternStr}${leadSound}${leadFx}.gain(0.65)${moodFx}],`,
    `  [4, ${leadPatternStr}${leadSound}${leadFx}.room(0.6).gain(0.4)${moodFx}],`,
    `  [8, ${leadPatternStr}${leadSound}${leadFx}.gain(0.7).delay(0.2)${moodFx}],`,
    `  [4, ${leadPatternStr}${leadSound}${leadFx}.gain(saw.slow(4).range(0.5, 0))${moodFx}]`,
    `)`,
    '',
  )

  // ---- FX/ATMOSPHERE with arrangement ----
  // FX plays throughout with varying intensity
  if (!fxIsEmpty) {
    lines.push(
      '// FX/Atmosphere - ambient throughout',
      `$: arrange(`,
      `  [4, ${fxPatternStr}${fxFx}.room(0.7).gain(0.2)${moodFx}],`,
      `  [4, ${fxPatternStr}${fxFx}.room(0.5).gain(0.35)${moodFx}],`,
      `  [8, ${fxPatternStr}${fxFx}.gain(0.25)${moodFx}],`,
      `  [4, ${fxPatternStr}${fxFx}.room(0.8).gain(0.4)${moodFx}],`,
      `  [8, ${fxPatternStr}${fxFx}.gain(0.3)${moodFx}],`,
      `  [4, ${fxPatternStr}${fxFx}.gain(saw.slow(4).range(0.3, 0))${moodFx}]`,
      `)`,
    )
  }

  return lines.join('\n')
}

// Genre-specific intro drums (light, building anticipation)
function getIntroDrums(genre: Genre): string {
  switch (genre) {
    case 'house':
      return 'hh*4 oh , ~ ~ ~ ~'
    case 'techno':
      return 'hh*8'
    case 'trance':
      return 'hh*4 oh hh*4 oh'
    case 'dnb':
      return 'hh*8 , ~ ~ ride ~'
  }
}

// Buildup drums (adding energy, may include kick)
function getBuildupDrums(genre: Genre, fullPattern: string): string {
  switch (genre) {
    case 'house':
      return `bd ~ bd ~ , hh*8 , ~ cp ~ ~`
    case 'techno':
      return `bd bd bd bd , hh*16`
    case 'trance':
      return `bd bd bd bd , hh*8 , ~ ~ cp ~`
    case 'dnb':
      return fullPattern
  }
}

// Breakdown drums (stripped back, tension)
function getBreakdownDrums(genre: Genre): string {
  switch (genre) {
    case 'house':
      return '~ ~ ~ ~ , hh*4 oh , ~ cp ~ ~'
    case 'techno':
      return 'hh*8 , ~ cp ~ cp'
    case 'trance':
      return 'hh*4 , ~ ~ ~ cp'
    case 'dnb':
      return '~ ~ ~ ~ , hh*4 , ~ ~ ride ~'
  }
}

// Outro drums (fading out)
function getOutroDrums(genre: Genre, fullPattern: string): string {
  switch (genre) {
    case 'house':
    case 'techno':
      return `bd bd bd bd , hh*4`
    case 'trance':
      return `bd ~ bd ~ , hh*4`
    case 'dnb':
      return fullPattern
  }
}

// Simple layer builders for the mixer board display
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

  if (config.pattern.includes('note(')) {
    const sound = config.sound ? `.sound("${config.sound}")` : ''
    return `${config.pattern}${sound}${baseEffects}${extraEffects}`
  }
  return `sound("${config.pattern}")${baseEffects}${extraEffects}`
}
