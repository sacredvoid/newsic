import type { GenreConfig } from '../types'

export const genres: GenreConfig[] = [
  {
    id: 'house',
    label: 'House',
    defaultBpm: 124,
    bpmRange: [118, 132],
    defaultDrums: {
      pattern: 'bd*4, [~ cp]*2, hh*8',
      samples: ['bd', 'cp', 'hh'],
      effects: [],
    },
    defaultBass: {
      pattern: 'c2 [~ c2] eb2 [~ g1]',
      sound: 'sawtooth',
      effects: ['.lpf(900)', '.gain(0.7)'],
    },
    defaultLead: {
      pattern: 'c4 eb4 g4 [c5 ~]',
      sound: 'sawtooth',
      effects: ['.cutoff(2000)', '.delay(0.25)'],
    },
    defaultFx: {
      pattern: '~ ~ oh ~',
      effects: ['.room(0.4)', '.gain(0.3)'],
    },
  },
  {
    id: 'techno',
    label: 'Techno',
    defaultBpm: 132,
    bpmRange: [125, 150],
    defaultDrums: {
      pattern: 'bd bd bd bd, ~ cp ~ cp, hh*8',
      samples: ['bd:4', 'cp', 'hh:3'],
      effects: [],
    },
    defaultBass: {
      pattern: 'c1 ~ [c1 ~] ~',
      sound: 'square',
      effects: ['.lpf(400)', '.gain(0.8)'],
    },
    defaultLead: {
      pattern: 'c3 [eb3 c3] g3 [~ eb3]',
      sound: 'sawtooth',
      effects: ['.lpf(1200)', '.delay(0.125)'],
    },
    defaultFx: {
      pattern: '~ ~ ~ oh:1',
      effects: ['.room(0.6)', '.gain(0.2)'],
    },
  },
  {
    id: 'trance',
    label: 'Trance',
    defaultBpm: 138,
    bpmRange: [132, 145],
    defaultDrums: {
      pattern: 'bd bd bd bd, ~ cp ~ cp, hh*4 oh hh*4 oh',
      samples: ['bd:5', 'cp:1', 'hh:1', 'oh:1'],
      effects: [],
    },
    defaultBass: {
      pattern: 'c2*4 f2*4 g2*4 ab2*4',
      sound: 'sawtooth',
      effects: ['.lpf(600)', '.gain(0.7)'],
    },
    defaultLead: {
      pattern: 'c4 eb4 g4 c5 g4 eb4 c4 ~',
      sound: 'sawtooth',
      effects: ['.cutoff(3000)', '.delay(0.5)', '.room(0.4)'],
    },
    defaultFx: {
      pattern: '~ ~ ~ ~',
      effects: ['.room(0.7)', '.gain(0.25)'],
    },
  },
  {
    id: 'dnb',
    label: 'Drum & Bass',
    defaultBpm: 174,
    bpmRange: [165, 180],
    defaultDrums: {
      pattern: 'bd ~ [~ bd] ~, ~ [~ cp] ~ cp, hh*8',
      samples: ['bd:6', 'cp:2', 'hh:4'],
      effects: [],
    },
    defaultBass: {
      pattern: 'c1 ~ [~ c1] [c2 ~]',
      sound: 'square',
      effects: ['.lpf(300)', '.gain(0.9)'],
    },
    defaultLead: {
      pattern: 'c4 ~ g4 [eb4 ~]',
      sound: 'triangle',
      effects: ['.cutoff(2500)', '.delay(0.125)'],
    },
    defaultFx: {
      pattern: '~ oh ~ ~',
      effects: ['.room(0.3)', '.gain(0.2)'],
    },
  },
]

export function getGenre(id: string): GenreConfig | undefined {
  return genres.find((g) => g.id === id)
}
