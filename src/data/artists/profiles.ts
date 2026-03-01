import type { ArtistProfile } from '../../types'

export const artistProfiles: ArtistProfile[] = [
  // ============================================================
  // HOUSE (5)
  // ============================================================

  // 1. Daft Punk - French house, disco-funk, filtered house
  {
    id: 'daft-punk',
    name: 'Daft Punk',
    genre: 'house',
    bpmRange: [115, 130],
    preferredKeys: ['Fm', 'Gm', 'Am', 'Dm'],
    drums: {
      pattern: 'bd [~ bd] sd [~ hh:2] , hh*8 , [~ cp] ~ [~ cp] ~',
      sound: 'bd',
      samples: ['bd:3', 'sd:2', 'hh:2', 'cp'],
      effects: ['.gain(0.9)', '.room(0.15)'],
    },
    bass: {
      pattern: 'note("f2 ~ [f2 ab2] ~ f2 ~ [eb2 f2] ~")',
      sound: 'sawtooth',
      effects: ['.lpf(900)', '.gain(0.8)', '.phaser(4)'],
    },
    lead: {
      pattern: 'note("f4 ab4 c5 ab4 f4 eb4 f4 ~")',
      sound: 'square',
      effects: ['.lpf(1800)', '.phaser(2)', '.gain(0.5)', '.room(0.3)'],
    },
    fx: {
      pattern: 'note("f3 ~ ab3 ~")',
      sound: 'sawtooth',
      effects: ['.lpf("<600 1200 2400 1200>")', '.gain(0.35)', '.room(0.2)'],
    },
    tags: ['french-house', 'disco', 'funk', 'filtered', 'vocoder'],
  },

  // 2. Disclosure - UK garage-influenced house, two-step
  {
    id: 'disclosure',
    name: 'Disclosure',
    genre: 'house',
    bpmRange: [120, 130],
    preferredKeys: ['Cm', 'Dm', 'Am', 'Em'],
    drums: {
      pattern: 'bd ~ [~ bd] ~ , [~ sd] ~ sd ~ , hh*4 [hh oh] hh*4 hh',
      sound: 'bd',
      samples: ['bd:4', 'sd:3', 'hh', 'oh'],
      effects: ['.gain(0.85)', '.room(0.1)'],
    },
    bass: {
      pattern: 'note("c2 ~ [~ c2] ~ eb2 ~ [~ g2] ~")',
      sound: 'triangle',
      effects: ['.lpf(1200)', '.gain(0.85)'],
    },
    lead: {
      pattern: 'note("[c4 eb4] ~ [g4 ~] [~ bb4] c5 ~ [~ g4] ~")',
      sound: 'sine',
      effects: ['.lpf(3000)', '.room(0.25)', '.gain(0.45)', '.delay(0.15)'],
    },
    fx: {
      pattern: 'note("<c3 eb3 g3 bb3>")',
      sound: 'triangle',
      effects: ['.lpf(2000)', '.gain(0.3)', '.room(0.4)'],
    },
    tags: ['uk-garage', 'two-step', 'vocal-chops', 'warm', 'bass-house'],
  },

  // 3. Fisher - Tech house, heavy rolling bass, minimal
  {
    id: 'fisher',
    name: 'Fisher',
    genre: 'house',
    bpmRange: [124, 128],
    preferredKeys: ['Am', 'Dm', 'Gm'],
    drums: {
      pattern: 'bd*4 , [~ cp] ~ [~ cp] ~ , [hh hh] [hh oh] [hh hh] [hh oh]',
      sound: 'bd',
      samples: ['bd:5', 'cp', 'hh:3', 'oh'],
      effects: ['.gain(0.95)', '.room(0.05)'],
    },
    bass: {
      pattern: 'note("a1 ~ a1 [~ a1] a1 ~ [a1 c2] ~")',
      sound: 'sawtooth',
      effects: ['.lpf(600)', '.gain(0.9)', '.distort(0.15)'],
    },
    lead: {
      pattern: 'note("[a3 ~] ~ [~ c4] ~ [a3 ~] ~ ~ ~")',
      sound: 'square',
      effects: ['.lpf(1400)', '.gain(0.35)', '.hpf(400)'],
    },
    fx: {
      pattern: '[~ ride] ~ [~ ride] ~ , crash ~ ~ ~',
      sound: 'ride',
      samples: ['ride:2', 'crash'],
      effects: ['.gain(0.3)', '.room(0.15)', '.hpf(3000)'],
    },
    tags: ['tech-house', 'rolling-bass', 'driving', 'minimal', 'groovy'],
  },

  // 4. Chris Lake - Tech house, bouncy bass, percussive
  {
    id: 'chris-lake',
    name: 'Chris Lake',
    genre: 'house',
    bpmRange: [124, 128],
    preferredKeys: ['Fm', 'Am', 'Dm', 'Cm'],
    drums: {
      pattern: 'bd [~ bd:2] ~ bd , ~ cp ~ [cp ~] , hh*8',
      sound: 'bd',
      samples: ['bd:2', 'cp:2', 'hh:4'],
      effects: ['.gain(0.9)', '.room(0.08)'],
    },
    bass: {
      pattern: 'note("f1 [~ f1] ~ [f1 ~] ab1 [~ f1] ~ ~")',
      sound: 'square',
      effects: ['.lpf(800)', '.gain(0.85)', '.distort(0.1)'],
    },
    lead: {
      pattern: 'note("[f3 ab3] [~ c4] [~ ab3] ~ [f3 ab3] [~ c4] ~ ~")',
      sound: 'sawtooth',
      effects: ['.lpf(2200)', '.hpf(500)', '.gain(0.4)', '.room(0.15)'],
    },
    fx: {
      pattern: '[~ hh:5]*4 , [~ ~] [~ cp:3] ~ ~',
      sound: 'hh',
      samples: ['hh:5', 'cp:3'],
      effects: ['.gain(0.25)', '.hpf(5000)', '.delay(0.1)'],
    },
    tags: ['tech-house', 'bouncy', 'percussive', 'bass-heavy', 'groove'],
  },

  // 5. Peggy Gou - Melodic house, warm analog sounds
  {
    id: 'peggy-gou',
    name: 'Peggy Gou',
    genre: 'house',
    bpmRange: [118, 126],
    preferredKeys: ['Dm', 'Gm', 'Am', 'Cm'],
    drums: {
      pattern: 'bd ~ bd ~ , ~ [~ sd] ~ sd , oh [hh hh] oh [hh hh]',
      sound: 'bd',
      samples: ['bd:1', 'sd:1', 'hh:1', 'oh:1'],
      effects: ['.gain(0.85)', '.room(0.12)'],
    },
    bass: {
      pattern: 'note("d2 ~ [a2 d2] ~ g2 ~ [f2 d2] ~")',
      sound: 'sawtooth',
      effects: ['.lpf(1100)', '.gain(0.75)', '.room(0.1)'],
    },
    lead: {
      pattern: 'note("d4 f4 a4 [g4 f4] d4 ~ [c4 d4] ~")',
      sound: 'sawtooth',
      effects: ['.lpf(2800)', '.room(0.3)', '.gain(0.45)', '.delay(0.2)'],
    },
    fx: {
      pattern: 'note("<d3 f3 a3 g3>")',
      sound: 'triangle',
      effects: ['.lpf(1800)', '.gain(0.3)', '.room(0.45)', '.delay(0.25)'],
    },
    tags: ['melodic-house', 'analog', 'warm', 'retro', 'catchy'],
  },

  // ============================================================
  // TECHNO (5)
  // ============================================================

  // 6. Carl Cox - Peak-time techno, relentless energy
  {
    id: 'carl-cox',
    name: 'Carl Cox',
    genre: 'techno',
    bpmRange: [130, 138],
    preferredKeys: ['Am', 'Dm', 'Em'],
    drums: {
      pattern: 'bd*4 , ~ cp ~ cp , hh*8 , [~ ride]*4',
      sound: 'bd',
      samples: ['bd:6', 'cp:1', 'hh:2', 'ride:1'],
      effects: ['.gain(1.0)', '.room(0.08)', '.distort(0.05)'],
    },
    bass: {
      pattern: 'note("a1*4")',
      sound: 'sawtooth',
      effects: ['.lpf(500)', '.gain(0.9)', '.distort(0.2)'],
    },
    lead: {
      pattern: 'note("[a3 ~] [~ c4] [a3 ~] [~ e3]")',
      sound: 'square',
      effects: ['.lpf(1600)', '.hpf(600)', '.gain(0.35)', '.delay(0.12)'],
    },
    fx: {
      pattern: '[~ ~ ~ crash] , [~ hh:6]*4',
      sound: 'crash',
      samples: ['crash:1', 'hh:6'],
      effects: ['.gain(0.25)', '.room(0.2)', '.hpf(4000)'],
    },
    tags: ['peak-time', 'driving', 'relentless', 'classic-techno', 'energy'],
  },

  // 7. Charlotte de Witte - Dark, industrial techno, acid
  {
    id: 'charlotte-de-witte',
    name: 'Charlotte de Witte',
    genre: 'techno',
    bpmRange: [135, 145],
    preferredKeys: ['Cm', 'Bbm', 'Fm'],
    drums: {
      pattern: 'bd bd [bd bd:3] bd , [~ cp:2] ~ [~ cp:2] ~ , hh*8',
      sound: 'bd',
      samples: ['bd:8', 'cp:2', 'hh:5'],
      effects: ['.gain(1.0)', '.distort(0.15)', '.room(0.05)'],
    },
    bass: {
      pattern: 'note("c1 [~ c1] c1 [c1 eb1] c1 [~ c1] [c1 ~] c1")',
      sound: 'sawtooth',
      effects: ['.lpf("<400 800 1600 800>")', '.gain(0.95)', '.distort(0.3)'],
    },
    lead: {
      pattern: 'note("[c3 eb3 c3 ~] [~ c3 eb3 gb3] [c3 ~ c3 eb3] [~ gb3 eb3 c3]")',
      sound: 'square',
      effects: ['.lpf("<600 1200 2400 600>")', '.distort(0.25)', '.gain(0.4)', '.hpf(300)'],
    },
    fx: {
      pattern: 'note("c2 ~ ~ ~ c2 ~ ~ [~ c2]")',
      sound: 'sawtooth',
      effects: ['.lpf(300)', '.distort(0.4)', '.gain(0.3)', '.room(0.15)'],
    },
    tags: ['dark', 'industrial', 'acid', 'hard-techno', 'distorted'],
  },

  // 8. Amelie Lens - Hard techno, rave-influenced
  {
    id: 'amelie-lens',
    name: 'Amelie Lens',
    genre: 'techno',
    bpmRange: [138, 148],
    preferredKeys: ['Am', 'Dm', 'Em', 'Bm'],
    drums: {
      pattern: 'bd*4 , [~ cp] ~ [~ cp] ~ , [hh hh:3]*4 , ~ ~ ~ crash',
      sound: 'bd',
      samples: ['bd:7', 'cp:4', 'hh:3', 'crash:2'],
      effects: ['.gain(1.0)', '.distort(0.1)', '.room(0.06)'],
    },
    bass: {
      pattern: 'note("a1*8")',
      sound: 'sawtooth',
      effects: ['.lpf("<300 600 1200 600>")', '.gain(0.95)', '.distort(0.25)'],
    },
    lead: {
      pattern: 'note("[a3 ~ a3 ~] [c4 ~ ~ a3] [~ a3 c4 ~] [e4 ~ c4 a3]")',
      sound: 'sawtooth',
      effects: ['.lpf(1800)', '.hpf(500)', '.distort(0.15)', '.gain(0.4)', '.delay(0.08)'],
    },
    fx: {
      pattern: 'note("<a2 ~ c3 ~>")',
      sound: 'sine',
      effects: ['.room(0.5)', '.gain(0.25)', '.lpf(800)', '.delay(0.3)'],
    },
    tags: ['hard-techno', 'rave', 'pounding', 'eerie', 'relentless'],
  },

  // 9. Adam Beyer - Driving Swedish techno, tight percussion
  {
    id: 'adam-beyer',
    name: 'Adam Beyer',
    genre: 'techno',
    bpmRange: [130, 140],
    preferredKeys: ['Dm', 'Am', 'Em'],
    drums: {
      pattern: 'bd*4 , ~ [cp ~] ~ cp , [hh hh:2]*4 , [~ ride] [ride ~] [~ ride] ride',
      sound: 'bd',
      samples: ['bd:4', 'cp:1', 'hh:2', 'ride:3'],
      effects: ['.gain(0.95)', '.room(0.06)'],
    },
    bass: {
      pattern: 'note("d1 ~ [d1 ~] ~ d1 ~ [~ d1] ~")',
      sound: 'sine',
      effects: ['.lpf(600)', '.gain(0.9)', '.distort(0.1)'],
    },
    lead: {
      pattern: 'note("[d3 ~ f3 ~] [~ a3 ~ d3]")',
      sound: 'triangle',
      effects: ['.lpf(2000)', '.hpf(800)', '.gain(0.3)', '.delay(0.15)'],
    },
    fx: {
      pattern: '[hh:5 ~]*8 , [~ ~ ~ cp:3]',
      sound: 'hh',
      samples: ['hh:5', 'cp:3'],
      effects: ['.gain(0.2)', '.hpf(6000)', '.room(0.1)'],
    },
    tags: ['swedish-techno', 'tight', 'percussive', 'minimal', 'driving'],
  },

  // 10. Nina Kraviz - Trippy, hypnotic techno
  {
    id: 'nina-kraviz',
    name: 'Nina Kraviz',
    genre: 'techno',
    bpmRange: [128, 138],
    preferredKeys: ['Dm', 'Gm', 'Am', 'Cm'],
    drums: {
      pattern: 'bd ~ [bd ~] ~ , [~ sd:2] ~ ~ [sd:2 ~] , [hh oh]*2 [hh hh] [oh ~]',
      sound: 'bd',
      samples: ['bd:3', 'sd:2', 'hh:1', 'oh:2'],
      effects: ['.gain(0.85)', '.room(0.15)'],
    },
    bass: {
      pattern: 'note("d2 ~ [~ d2] ~ [g2 ~] ~ d2 ~")',
      sound: 'sine',
      effects: ['.lpf(700)', '.gain(0.8)', '.room(0.1)'],
    },
    lead: {
      pattern: 'note("[d4 ~ g4 ~] [~ a4 ~ f4] [d4 ~ ~ g4] [~ ~ a4 ~]")',
      sound: 'sine',
      effects: ['.lpf(2400)', '.delay(0.3)', '.room(0.35)', '.gain(0.35)'],
    },
    fx: {
      pattern: 'note("<d3 ~ g3 a3>")',
      sound: 'triangle',
      effects: ['.lpf("<800 1600 3200 1600>")', '.room(0.5)', '.gain(0.25)', '.delay(0.35)'],
    },
    tags: ['trippy', 'hypnotic', 'deep', 'weird', 'vocal-samples'],
  },

  // ============================================================
  // TRANCE (5)
  // ============================================================

  // 11. Armin van Buuren - Uplifting/progressive trance
  {
    id: 'armin-van-buuren',
    name: 'Armin van Buuren',
    genre: 'trance',
    bpmRange: [132, 140],
    preferredKeys: ['Am', 'Cm', 'Dm', 'Em'],
    drums: {
      pattern: 'bd*4 , ~ cp ~ cp , [hh hh oh hh]*2 , [~ ~ ~ crash]',
      sound: 'bd',
      samples: ['bd:5', 'cp:1', 'hh:1', 'oh:1', 'crash:1'],
      effects: ['.gain(0.9)', '.room(0.1)'],
    },
    bass: {
      pattern: 'note("a1 [a1 a1] c2 [a1 a1] e2 [a1 a1] c2 [a1 a1]")',
      sound: 'sawtooth',
      effects: ['.lpf(800)', '.gain(0.85)'],
    },
    lead: {
      pattern: 'note("a4 c5 e5 [d5 c5] a4 g4 [a4 c5] e5")',
      sound: 'sawtooth',
      effects: ['.lpf(4000)', '.room(0.4)', '.gain(0.5)', '.delay(0.2)'],
    },
    fx: {
      pattern: 'note("<[a3,c4,e4] [f3,a3,c4] [d3,f3,a3] [e3,g3,b3]>")',
      sound: 'sawtooth',
      effects: ['.lpf(2500)', '.room(0.55)', '.gain(0.35)', '.delay(0.3)'],
    },
    tags: ['uplifting', 'progressive', 'epic', 'euphoric', 'emotional'],
  },

  // 12. Above & Beyond - Emotional, melodic trance
  {
    id: 'above-and-beyond',
    name: 'Above & Beyond',
    genre: 'trance',
    bpmRange: [132, 138],
    preferredKeys: ['Dm', 'Am', 'Em', 'Cm'],
    drums: {
      pattern: 'bd*4 , ~ cp ~ cp , hh*8 , ~ ~ ~ [~ crash]',
      sound: 'bd',
      samples: ['bd:3', 'cp:2', 'hh:1', 'crash:1'],
      effects: ['.gain(0.85)', '.room(0.12)'],
    },
    bass: {
      pattern: 'note("d2 ~ [d2 f2] ~ a2 ~ [f2 d2] ~")',
      sound: 'sawtooth',
      effects: ['.lpf(900)', '.gain(0.8)', '.room(0.08)'],
    },
    lead: {
      pattern: 'note("d4 f4 a4 [c5 a4] f4 e4 [d4 f4] a4")',
      sound: 'sawtooth',
      effects: ['.lpf(3500)', '.room(0.5)', '.gain(0.5)', '.delay(0.25)'],
    },
    fx: {
      pattern: 'note("<[d3,f3,a3] [bb2,d3,f3] [g2,bb2,d3] [a2,c3,e3]>")',
      sound: 'sine',
      effects: ['.lpf(2000)', '.room(0.6)', '.gain(0.35)', '.delay(0.35)'],
    },
    tags: ['emotional', 'melodic', 'lush', 'beautiful', 'anjunabeats'],
  },

  // 13. Tiesto (Classic) - Classic 2000s trance, big room energy
  {
    id: 'tiesto-classic',
    name: 'Tiesto (Classic)',
    genre: 'trance',
    bpmRange: [138, 142],
    preferredKeys: ['Am', 'Cm', 'Fm', 'Dm'],
    drums: {
      pattern: 'bd*4 , ~ [cp cp:2] ~ [cp cp:2] , hh*8 , ~ ~ ~ crash',
      sound: 'bd',
      samples: ['bd:6', 'cp', 'cp:2', 'hh:2', 'crash:2'],
      effects: ['.gain(0.95)', '.room(0.1)'],
    },
    bass: {
      pattern: 'note("a1*4 [a1 c2] a1*2 [a1 e2]")',
      sound: 'sawtooth',
      effects: ['.lpf(700)', '.gain(0.9)', '.distort(0.05)'],
    },
    lead: {
      pattern: 'note("[a4 c5 e5 a5] [g5 e5 c5 a4] [a4 c5 e5 g5] [a5 ~ e5 c5]")',
      sound: 'sawtooth',
      effects: ['.lpf(5000)', '.room(0.35)', '.gain(0.55)', '.delay(0.15)'],
    },
    fx: {
      pattern: 'note("<[a3,c4,e4,a4] [f3,a3,c4,f4]>")',
      sound: 'sawtooth',
      effects: ['.lpf(3000)', '.room(0.45)', '.gain(0.4)'],
    },
    tags: ['classic-trance', 'big-room', 'supersaw', 'anthem', 'peak-time'],
  },

  // 14. Paul van Dyk - Progressive trance, euphoric breakdowns
  {
    id: 'paul-van-dyk',
    name: 'Paul van Dyk',
    genre: 'trance',
    bpmRange: [134, 140],
    preferredKeys: ['Cm', 'Dm', 'Am', 'Gm'],
    drums: {
      pattern: 'bd*4 , ~ cp ~ cp , [hh hh:2]*4 , [~ ~ ride ~]*2',
      sound: 'bd',
      samples: ['bd:4', 'cp:1', 'hh:2', 'ride:1'],
      effects: ['.gain(0.9)', '.room(0.1)'],
    },
    bass: {
      pattern: 'note("c2 [c2 c2] eb2 [c2 c2] g2 [c2 c2] eb2 [c2 c2]")',
      sound: 'sawtooth',
      effects: ['.lpf(750)', '.gain(0.85)'],
    },
    lead: {
      pattern: 'note("c4 eb4 g4 [bb4 g4] eb4 d4 [c4 eb4] g4")',
      sound: 'sawtooth',
      effects: ['.lpf(3800)', '.room(0.45)', '.gain(0.5)', '.delay(0.22)'],
    },
    fx: {
      pattern: 'note("<[c3,eb3,g3] [ab2,c3,eb3] [f2,ab2,c3] [g2,bb2,d3]>")',
      sound: 'sawtooth',
      effects: ['.lpf(2200)', '.room(0.55)', '.gain(0.35)', '.delay(0.28)'],
    },
    tags: ['progressive-trance', 'euphoric', 'driving', 'emotional', 'berlin'],
  },

  // 15. Ferry Corsten - Dutch trance, high energy, big drops
  {
    id: 'ferry-corsten',
    name: 'Ferry Corsten',
    genre: 'trance',
    bpmRange: [136, 142],
    preferredKeys: ['Am', 'Dm', 'Fm', 'Cm'],
    drums: {
      pattern: 'bd*4 , ~ cp ~ [cp cp:2] , hh*8 , [~ ~ ~ crash]',
      sound: 'bd',
      samples: ['bd:5', 'cp:2', 'hh:3', 'crash:1'],
      effects: ['.gain(0.95)', '.room(0.08)'],
    },
    bass: {
      pattern: 'note("a1 [a1 a1] [a1 c2] a1 e2 [a1 a1] [a1 c2] a1")',
      sound: 'sawtooth',
      effects: ['.lpf(800)', '.gain(0.88)'],
    },
    lead: {
      pattern: 'note("[a4 c5] [e5 ~] [d5 c5] [a4 ~] [a4 c5] [e5 a5] [g5 e5] [c5 ~]")',
      sound: 'sawtooth',
      effects: ['.lpf(4500)', '.room(0.4)', '.gain(0.55)', '.delay(0.18)'],
    },
    fx: {
      pattern: 'note("<[a3,c4,e4] [d3,f3,a3] [f3,a3,c4] [e3,g3,b3]>")',
      sound: 'sawtooth',
      effects: ['.lpf(2800)', '.room(0.5)', '.gain(0.38)'],
    },
    tags: ['dutch-trance', 'high-energy', 'catchy', 'big-drops', 'hooks'],
  },

  // ============================================================
  // DnB (5)
  // ============================================================

  // 16. Andy C - Jump-up/neurofunk DnB, complex breakbeats
  {
    id: 'andy-c',
    name: 'Andy C',
    genre: 'dnb',
    bpmRange: [172, 178],
    preferredKeys: ['Fm', 'Am', 'Dm', 'Cm'],
    drums: {
      pattern: 'bd ~ [~ sd] ~ [~ bd] [sd ~] ~ [~ sd] , [hh hh:2]*4',
      sound: 'bd',
      samples: ['bd:8', 'sd:5', 'hh:2', 'hh:4'],
      effects: ['.gain(0.95)', '.room(0.06)', '.distort(0.05)'],
    },
    bass: {
      pattern: 'note("f1 ~ [~ f1] ~ [f1 ab1] ~ [~ f1] [c2 ~]")',
      sound: 'sawtooth',
      effects: ['.lpf(600)', '.gain(0.95)', '.distort(0.3)'],
    },
    lead: {
      pattern: 'note("[f3 ab3] [~ c4] [ab3 ~] [f3 ~]")',
      sound: 'square',
      effects: ['.lpf(2000)', '.hpf(400)', '.gain(0.4)', '.distort(0.15)'],
    },
    fx: {
      pattern: 'note("[f2 ~ ab2 ~] [~ c3 ~ ab2]")',
      sound: 'sawtooth',
      effects: ['.lpf("<400 800 1600 800>")', '.distort(0.2)', '.gain(0.3)'],
    },
    tags: ['neurofunk', 'jump-up', 'complex', 'heavy-bass', 'breakbeats'],
  },

  // 17. Sub Focus - Dancefloor DnB, melodic, energetic
  {
    id: 'sub-focus',
    name: 'Sub Focus',
    genre: 'dnb',
    bpmRange: [170, 176],
    preferredKeys: ['Am', 'Cm', 'Dm', 'Em'],
    drums: {
      pattern: 'bd ~ [~ sd] ~ [~ bd] sd ~ [~ sd] , hh*8',
      sound: 'bd',
      samples: ['bd:5', 'sd:3', 'hh:2'],
      effects: ['.gain(0.9)', '.room(0.08)'],
    },
    bass: {
      pattern: 'note("a1 ~ [a1 ~] ~ [c2 a1] ~ [~ a1] ~")',
      sound: 'sawtooth',
      effects: ['.lpf(900)', '.gain(0.9)', '.distort(0.15)'],
    },
    lead: {
      pattern: 'note("a4 c5 e5 [d5 c5] a4 g4 [a4 c5] e5")',
      sound: 'sawtooth',
      effects: ['.lpf(3500)', '.room(0.3)', '.gain(0.5)', '.delay(0.15)'],
    },
    fx: {
      pattern: 'note("<[a3,c4,e4] [f3,a3,c4] [d3,f3,a3] [e3,g3,b3]>")',
      sound: 'sawtooth',
      effects: ['.lpf(2500)', '.room(0.4)', '.gain(0.35)'],
    },
    tags: ['dancefloor', 'melodic', 'energetic', 'vocal-hooks', 'festival'],
  },

  // 18. Netsky - Liquid DnB, euphoric, smooth
  {
    id: 'netsky',
    name: 'Netsky',
    genre: 'dnb',
    bpmRange: [170, 176],
    preferredKeys: ['Dm', 'Am', 'Cm', 'Gm'],
    drums: {
      pattern: 'bd ~ [~ sd] ~ [~ bd] sd ~ ~ , [hh hh oh hh]*2',
      sound: 'bd',
      samples: ['bd:2', 'sd:1', 'hh:1', 'oh:1'],
      effects: ['.gain(0.85)', '.room(0.12)'],
    },
    bass: {
      pattern: 'note("d2 ~ [~ d2] ~ [f2 ~] ~ [d2 a1] ~")',
      sound: 'sine',
      effects: ['.lpf(1200)', '.gain(0.8)', '.room(0.08)'],
    },
    lead: {
      pattern: 'note("d4 f4 a4 [c5 a4] f4 e4 [d4 f4] a4")',
      sound: 'sawtooth',
      effects: ['.lpf(4000)', '.room(0.45)', '.gain(0.5)', '.delay(0.2)'],
    },
    fx: {
      pattern: 'note("<[d3,f3,a3] [bb2,d3,f3] [g2,bb2,d3] [a2,c3,e3]>")',
      sound: 'sine',
      effects: ['.lpf(2000)', '.room(0.6)', '.gain(0.3)', '.delay(0.3)'],
    },
    tags: ['liquid', 'euphoric', 'smooth', 'beautiful', 'melodic'],
  },

  // 19. Chase & Status - Hybrid DnB/bass music, heavy, cinematic
  {
    id: 'chase-and-status',
    name: 'Chase & Status',
    genre: 'dnb',
    bpmRange: [170, 176],
    preferredKeys: ['Fm', 'Cm', 'Am', 'Dm'],
    drums: {
      pattern: 'bd ~ [~ sd] ~ [bd ~] sd ~ [sd ~] , [hh hh:3]*4 , ~ ~ ~ crash',
      sound: 'bd',
      samples: ['bd:7', 'sd:4', 'hh:3', 'crash:2'],
      effects: ['.gain(0.95)', '.room(0.08)', '.distort(0.08)'],
    },
    bass: {
      pattern: 'note("f1 ~ [f1 f1] ~ [ab1 f1] ~ [f1 ~] [c2 f1]")',
      sound: 'sawtooth',
      effects: ['.lpf(500)', '.gain(0.95)', '.distort(0.25)'],
    },
    lead: {
      pattern: 'note("[f3 ~] [ab3 ~] [c4 ~] [~ ab3] [f3 ~] ~ [eb3 f3] ~")',
      sound: 'sawtooth',
      effects: ['.lpf(2500)', '.hpf(300)', '.gain(0.45)', '.room(0.2)', '.distort(0.1)'],
    },
    fx: {
      pattern: 'note("<[f2,ab2,c3] [db2,f2,ab2]>")',
      sound: 'sawtooth',
      effects: ['.lpf(1500)', '.room(0.35)', '.gain(0.35)', '.distort(0.1)'],
    },
    tags: ['heavy', 'cinematic', 'hybrid', 'bass-music', 'aggressive'],
  },

  // 20. Pendulum - Rock-influenced DnB, distorted, live feel
  {
    id: 'pendulum',
    name: 'Pendulum',
    genre: 'dnb',
    bpmRange: [172, 178],
    preferredKeys: ['Am', 'Em', 'Dm', 'Cm'],
    drums: {
      pattern: 'bd ~ [~ sd] ~ [bd bd] sd ~ [~ sd:3] , [hh hh:2]*4 , ~ ~ ~ crash',
      sound: 'bd',
      samples: ['bd:9', 'sd:3', 'sd:6', 'hh:2', 'crash:3'],
      effects: ['.gain(1.0)', '.distort(0.1)', '.room(0.08)'],
    },
    bass: {
      pattern: 'note("a1 [a1 a1] [~ a1] [a1 c2] e2 [a1 a1] [~ a1] [c2 a1]")',
      sound: 'sawtooth',
      effects: ['.lpf(700)', '.gain(0.95)', '.distort(0.35)'],
    },
    lead: {
      pattern: 'note("[a4 c5 e5 a5] [g5 e5 c5 a4] [a4 c5 e5 g5] [a5 e5 c5 a4]")',
      sound: 'sawtooth',
      effects: ['.lpf(5000)', '.distort(0.2)', '.gain(0.55)', '.room(0.2)'],
    },
    fx: {
      pattern: 'note("<[a3,c4,e4] [f3,a3,c4] [d3,f3,a3] [e3,g3,b3]>")',
      sound: 'sawtooth',
      effects: ['.lpf(3000)', '.distort(0.15)', '.room(0.25)', '.gain(0.4)'],
    },
    tags: ['rock', 'distorted', 'live-feel', 'energetic', 'anthem'],
  },
]
