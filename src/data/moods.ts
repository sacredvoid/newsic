import type { MoodModifier } from '../types'

export const moods: MoodModifier[] = [
  {
    id: 'energetic',
    label: 'Energetic',
    effectOverrides: ['.gain(0.9)'],
    bpmAdjust: 4,
  },
  {
    id: 'dark',
    label: 'Dark',
    effectOverrides: ['.lpf(600)', '.room(0.6)'],
    bpmAdjust: -2,
    filterCutoff: 600,
    reverbAmount: 0.6,
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    effectOverrides: ['.delay(0.5)', '.room(0.7)'],
    bpmAdjust: -4,
    reverbAmount: 0.7,
  },
  {
    id: 'hypnotic',
    label: 'Hypnotic',
    effectOverrides: ['.delay(0.25)'],
    bpmAdjust: 0,
  },
  {
    id: 'uplifting',
    label: 'Uplifting',
    effectOverrides: ['.cutoff(3000)', '.gain(0.85)'],
    bpmAdjust: 2,
  },
  {
    id: 'aggressive',
    label: 'Aggressive',
    effectOverrides: ['.distort(0.3)', '.gain(0.95)'],
    bpmAdjust: 6,
    filterCutoff: 2000,
  },
]

export function getMood(id: string): MoodModifier | undefined {
  return moods.find((m) => m.id === id)
}
