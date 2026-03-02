import type { GeneratedTrack, Genre, LayerConfig, LayerName, Mood, MoodModifier } from '../types'
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

  // Build individual layer code strings
  const drumsCode = buildDrumsLayer(drumsConfig)
  const bassCode = buildMelodicLayer(bassConfig, moodConfig)
  const leadCode = buildMelodicLayer(leadConfig, moodConfig)
  const fxCode = buildFxLayer(fxConfig, moodConfig)

  const layers = { drums: drumsCode, bass: bassCode, lead: leadCode, fx: fxCode }

  // Build full code using stack()
  const code = buildCodeFromLayers(layers, adjustedBpm, {
    drums: false, bass: false, lead: false, fx: false,
  }, {
    drums: 1, bass: 1, lead: 1, fx: 1,
  })

  return { code, layers, bpm: adjustedBpm, key }
}

// Exported so useTrack can rebuild code with mute/volume changes
export function buildCodeFromLayers(
  layers: Record<LayerName, string>,
  bpm: number,
  muteState: Record<LayerName, boolean>,
  volumeState: Record<LayerName, number>,
): string {
  const lines: string[] = [`setcpm(${bpm} / 4)`, '']

  const layerEntries: string[] = []
  const layerNames: LayerName[] = ['drums', 'bass', 'lead', 'fx']

  for (const name of layerNames) {
    if (muteState[name]) {
      layerEntries.push(`  // ${name} (muted)\n  silence`)
    } else {
      const vol = volumeState[name]
      const gainSuffix = vol < 1 ? `.gain(${vol.toFixed(2)})` : ''
      layerEntries.push(`  // ${name}\n  ${layers[name]}${gainSuffix}`)
    }
  }

  lines.push(`stack(\n${layerEntries.join(',\n\n')}\n)`)
  return lines.join('\n')
}

function buildDrumsLayer(config: LayerConfig): string {
  const bank = config.samples?.[0] ? getBankFromSample(config.samples[0]) : ''
  const bankStr = bank ? `.bank("${bank}")` : ''
  // Include non-gain effects from config, then always end with .gain(0.9)
  const effects = buildEffectChain(config.effects, undefined, new Set(['gain']))
  return `sound("${config.pattern}")${bankStr}${effects}.gain(0.9)`
}

function buildMelodicLayer(config: LayerConfig, mood?: MoodModifier | undefined): string {
  const hasNote = config.pattern.includes('note(')
  const patternStr = hasNote ? config.pattern : `note("${config.pattern}")`
  const soundStr = config.sound ? `.sound("${config.sound}")` : ''

  const fx = buildEffectChain(config.effects, mood)

  // Ensure gain is always present
  if (!fx.includes('.gain(')) {
    return `${patternStr}${soundStr}${fx}.gain(0.6)`
  }
  return `${patternStr}${soundStr}${fx}`
}

function buildFxLayer(config: LayerConfig, mood?: MoodModifier | undefined): string {
  if (config.pattern.trim() === '~ ~ ~ ~' || config.pattern.trim() === '') {
    return `sound("~").gain(0.25)`
  }

  const hasNote = config.pattern.includes('note(')
  let patternStr: string
  if (hasNote) {
    const soundStr = config.sound ? `.sound("${config.sound}")` : ''
    patternStr = `${config.pattern}${soundStr}`
  } else {
    patternStr = `sound("${config.pattern}")`
  }

  const fx = buildEffectChain(config.effects, mood)

  // Ensure room and gain are present
  let result = `${patternStr}${fx}`
  if (!fx.includes('.room(')) {
    result += `.room(0.4)`
  }
  if (!fx.includes('.gain(')) {
    result += `.gain(0.25)`
  }
  return result
}

/**
 * Build a chain of Strudel effects from an array of effect strings.
 *
 * Effects containing Strudel pattern syntax (angle brackets like <400 800>)
 * are included verbatim. Numeric effects are extracted and may be adjusted
 * by mood parameters. The `cutoff` effect is normalized to `lpf`.
 *
 * Mood adjustments that don't correspond to an existing effect are appended.
 */
function buildEffectChain(
  effects: string[],
  mood?: MoodModifier,
  skipEffects?: Set<string>,
): string {
  let fx = ''
  const used = new Set<string>()

  for (const e of effects) {
    // Extract the effect name from the string
    const nameMatch = e.match(/\.(\w+)\(/)
    if (!nameMatch) {
      // Not a recognized effect format, include as-is
      fx += e
      continue
    }

    const rawName = nameMatch[1]
    const effectName = rawName === 'cutoff' ? 'lpf' : rawName

    // Skip effects in the skip set (e.g., skip gain for drums)
    if (skipEffects?.has(effectName)) continue

    // If effect contains Strudel pattern syntax (< >), include verbatim
    if (e.includes('<')) {
      // For pattern-based lpf/cutoff, mood filterCutoff doesn't apply
      // since it's already a dynamic pattern
      if (rawName === 'cutoff') {
        // Normalize .cutoff() to .lpf() but keep the pattern value
        fx += e.replace('.cutoff(', '.lpf(')
      } else {
        fx += e
      }
      used.add(effectName)
      continue
    }

    // Try to extract numeric value
    const numMatch = e.match(/\.\w+\(([\d.]+)\)/)
    if (!numMatch) {
      // Non-numeric, non-pattern value - include as-is
      fx += e
      used.add(effectName)
      continue
    }

    let value = parseFloat(numMatch[1])

    // Apply mood adjustments to numeric values
    if (mood) {
      if ((effectName === 'lpf') && mood.filterCutoff !== undefined) {
        value = Math.min(value, mood.filterCutoff)
      }
      if (effectName === 'gain' && mood.gainMultiplier !== undefined) {
        value = parseFloat((value * mood.gainMultiplier).toFixed(3))
      }
      if (effectName === 'room' && mood.reverbAmount !== undefined) {
        value = mood.reverbAmount
      }
      if (effectName === 'delay' && mood.delayAmount !== undefined) {
        value = mood.delayAmount
      }
      if (effectName === 'distort' && mood.distortAmount !== undefined) {
        value = mood.distortAmount
      }
    }

    fx += `.${effectName}(${value})`
    used.add(effectName)
  }

  // Add mood effects that weren't already present in the effect chain
  if (mood) {
    if (mood.reverbAmount !== undefined && !used.has('room')) {
      fx += `.room(${mood.reverbAmount})`
      used.add('room')
    }
    if (mood.delayAmount !== undefined && !used.has('delay')) {
      fx += `.delay(${mood.delayAmount})`
      used.add('delay')
    }
    if (mood.distortAmount !== undefined && !used.has('distort')) {
      fx += `.distort(${mood.distortAmount})`
      used.add('distort')
    }
  }

  return fx
}

function getBankFromSample(sample: string): string {
  // Map common sample prefixes to banks
  if (sample.startsWith('bd') || sample === 'bd') return 'RolandTR909'
  return ''
}
