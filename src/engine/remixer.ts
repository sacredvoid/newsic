import type { GeneratedTrack, Genre, Mood } from '../types'
import { buildTrack, buildCodeFromLayers } from './patternBuilder'

export function remixTrack(
  genre: Genre,
  bpm: number,
  mood: Mood,
  artistId: string | null,
): GeneratedTrack {
  // Wider BPM variation: +/- 8 BPM
  const bpmVariation = Math.floor(Math.random() * 17) - 8
  const base = buildTrack(genre, bpm + bpmVariation, mood, artistId)

  // Mutate individual layers
  const mutatedLayers = {
    drums: mutateDrums(base.layers.drums),
    bass: mutateMelodic(base.layers.bass),
    lead: mutateMelodic(base.layers.lead),
    fx: mutateFx(base.layers.fx),
  }

  // Rebuild full code with mutated layers
  const code = buildCodeFromLayers(
    mutatedLayers,
    base.bpm,
    { drums: false, bass: false, lead: false, fx: false },
    { drums: 1, bass: 1, lead: 1, fx: 1 },
  )

  return { code, layers: mutatedLayers, bpm: base.bpm, key: base.key }
}

function mutateDrums(code: string): string {
  // Extract the pattern string from sound("...")
  const match = code.match(/sound\("([^"]+)"\)/)
  if (!match) return code

  let pattern = match[1]

  // Randomly apply drum mutations
  const mutations = [
    // Double or halve hihat speed
    () => {
      pattern = pattern.replace(/hh\*(\d+)/, (_, n) => {
        const num = parseInt(n)
        return `hh*${Math.random() > 0.5 ? Math.min(16, num * 2) : Math.max(2, num / 2)}`
      })
    },
    // Add or remove ghost notes
    () => {
      if (Math.random() > 0.5) {
        pattern = pattern.replace('~ cp', '[~ cp:2] cp')
      }
    },
    // Swap bd pattern
    () => {
      const bdPatterns = ['bd*4', 'bd ~ bd ~', 'bd [~ bd] ~ bd', 'bd bd [bd ~] bd']
      if (pattern.includes('bd')) {
        const newBd = bdPatterns[Math.floor(Math.random() * bdPatterns.length)]
        pattern = pattern.replace(/bd[\*\d]*(?:\s*(?:\[[\w\s~:]*\])?\s*(?:bd[\w:]*)?)*/, newBd)
      }
    },
    // Add open hihat variation
    () => {
      if (pattern.includes('hh') && !pattern.includes('oh') && Math.random() > 0.5) {
        pattern = pattern.replace(/hh\*(\d+)/, (_, n) => `hh*${Math.max(1, parseInt(n) - 2)} oh`)
      }
    },
  ]

  // Apply 1-2 random mutations
  const numMutations = 1 + Math.floor(Math.random() * 2)
  for (let i = 0; i < numMutations; i++) {
    const mutation = mutations[Math.floor(Math.random() * mutations.length)]
    mutation()
  }

  return code.replace(/sound\("[^"]+"\)/, `sound("${pattern}")`)
}

function mutateMelodic(code: string): string {
  // Extract the note pattern from note("...")
  const match = code.match(/note\("([^"]+)"\)/)
  if (!match) return code

  let pattern = match[1]
  const notes = pattern.split(/\s+/)

  const mutations = [
    // Rotate pattern (shift notes left or right)
    () => {
      if (Math.random() > 0.5) {
        notes.push(notes.shift()!)
      } else {
        notes.unshift(notes.pop()!)
      }
    },
    // Reverse the pattern
    () => {
      notes.reverse()
    },
    // Add rests randomly
    () => {
      const idx = Math.floor(Math.random() * notes.length)
      if (notes[idx] !== '~') {
        notes[idx] = `[${notes[idx]} ~]`
      }
    },
    // Shift octave on random note
    () => {
      const idx = Math.floor(Math.random() * notes.length)
      const note = notes[idx]
      if (note && note !== '~' && !note.includes('[')) {
        const octaveMatch = note.match(/(\D+)(\d)/)
        if (octaveMatch) {
          const newOctave = parseInt(octaveMatch[2]) + (Math.random() > 0.5 ? 1 : -1)
          if (newOctave >= 1 && newOctave <= 6) {
            notes[idx] = octaveMatch[1] + newOctave
          }
        }
      }
    },
  ]

  // Apply 1-2 random mutations
  const numMutations = 1 + Math.floor(Math.random() * 2)
  for (let i = 0; i < numMutations; i++) {
    const mutation = mutations[Math.floor(Math.random() * mutations.length)]
    mutation()
  }

  const newPattern = notes.join(' ')
  return code.replace(/note\("[^"]+"\)/, `note("${newPattern}")`)
}

function mutateFx(code: string): string {
  // Randomly adjust effect parameters
  let mutated = code

  // Adjust room/reverb
  mutated = mutated.replace(/\.room\(([\d.]+)\)/, (_, val) => {
    const v = parseFloat(val)
    const newVal = Math.max(0.1, Math.min(0.9, v + (Math.random() - 0.5) * 0.3))
    return `.room(${newVal.toFixed(2)})`
  })

  // Adjust delay
  mutated = mutated.replace(/\.delay\(([\d.]+)\)/, (_, val) => {
    const v = parseFloat(val)
    const newVal = Math.max(0.05, Math.min(0.6, v + (Math.random() - 0.5) * 0.2))
    return `.delay(${newVal.toFixed(2)})`
  })

  // Adjust gain slightly
  mutated = mutated.replace(/\.gain\(([\d.]+)\)/, (_, val) => {
    const v = parseFloat(val)
    const newVal = Math.max(0.1, Math.min(0.95, v + (Math.random() - 0.5) * 0.15))
    return `.gain(${newVal.toFixed(2)})`
  })

  return mutated
}
