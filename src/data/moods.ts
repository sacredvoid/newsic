import type { MoodModifier } from '../types'

export const moods: MoodModifier[] = [
  {
    id: 'energetic',
    label: 'Energetic',
    bpmAdjust: 4,
    gainMultiplier: 1.1,
  },
  {
    id: 'dark',
    label: 'Dark',
    bpmAdjust: -2,
    filterCutoff: 600,
    reverbAmount: 0.6,
  },
  {
    id: 'dreamy',
    label: 'Dreamy',
    bpmAdjust: -4,
    delayAmount: 0.5,
    reverbAmount: 0.7,
  },
  {
    id: 'hypnotic',
    label: 'Hypnotic',
    bpmAdjust: 0,
    delayAmount: 0.25,
  },
  {
    id: 'uplifting',
    label: 'Uplifting',
    bpmAdjust: 2,
    filterCutoff: 3000,
    gainMultiplier: 1.05,
  },
  {
    id: 'aggressive',
    label: 'Aggressive',
    bpmAdjust: 6,
    distortAmount: 0.3,
    gainMultiplier: 1.15,
  },
]

export function getMood(id: string): MoodModifier | undefined {
  return moods.find((m) => m.id === id)
}
