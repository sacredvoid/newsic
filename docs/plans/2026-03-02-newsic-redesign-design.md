# newsic Interface Redesign

## Intent

**Who:** A curious music explorer, headphones on, wanting to play with electronic music. Not a producer, an explorer.

**What:** Pick a vibe, hear it, tweak it, be delighted. The loop: select, generate, listen, adjust, remix.

**Feel:** The inside of a club at 1am. Dark, pulsing, alive. When music plays, the interface breathes.

## Design Decisions

### Layout: Full-Viewport DAW

No scrolling. Everything visible at once. `h-screen` with a fixed layout:

```
+----------------------------------------------------------+
|  newsic                              [</>]  [Open Strudel]|
+------------+---------------------------------------------+
|            |                                             |
|  GENRE     |         AUDIO VISUALIZER                   |
|  [pills]   |         (frequency spectrum canvas)        |
|            |         (genre-colored, reactive)           |
|  MOOD      |                                             |
|  [chips]   |                                             |
|            |                                             |
|  TEMPO     +---------------------------------------------+
|  [slider]  |  DRUMS ▮▮▮▮▯▯  ──●────  [M]               |
|            |  BASS  ▮▮▮▯▯▯  ────●──  [M]               |
|  ARTIST    |  LEAD  ▮▮▯▯▯▯  ──●────  [M]               |
|  [chips]   |  FX    ▮▯▯▯▯▯  ─●─────  [M]               |
|            +---------------------------------------------+
| [GENERATE] |    [⏮]  [ ▶ PLAY ]  [⏭]    [🎲 Remix]     |
+------------+---------------------------------------------+
```

- Left sidebar: ~280px, glassmorphism (`bg-white/[0.03]`, `backdrop-blur-xl`)
- Main area: ~65% visualizer, ~20% mixer, ~15% transport
- Genre-colored radial gradient bleeds from visualizer into the background

### Visualizer: Frequency Spectrum Canvas

The hero element. A `<canvas>` rendering real-time FFT data from Strudel's AudioContext.

- ~64 vertical bars with rounded tops, 4px gaps
- Color: genre accent with opacity gradient (bright at peak, dim at base)
- Background glow: radial gradient in genre color at ~10% opacity
- Subtle mirror reflection below bars at 20% opacity
- Idle state: low random baseline with gentle breathing animation
- Playing state: real-time AnalyserNode frequency data, smoothly interpolated

### Sidebar Controls

Tactile, not form-like:

- **Genre**: 2x2 pill grid. Active pill has genre-color border glow. No emoji, use SVG waveform icons
- **Mood**: Horizontal wrapping chip row. Selected fills with muted genre color
- **Tempo**: Styled range with large monospace BPM readout. Track fills with genre color
- **Inspired By**: Chip list of artist names. "None" is default
- **Generate**: Full-width genre-colored button. Idle pulse animation inviting interaction. Loading shimmer state

### Mixer Strips

Horizontal channel strips:

- Layout per strip: icon + label | VU meter (8-10 animated bars) | volume fader | mute toggle
- VU meters animate with random values when playing, using layer's color
- Volume faders: custom styled, genre-colored fill
- Mute: dims entire strip to ~40% opacity. Toggle between filled/outlined
- Subtle top border separates mixer from visualizer

### Transport Bar

Bottom of main area:

- Large centered play/stop (circular, 56px, white/dark)
- Remix button (dice + "Remix") to the right
- Code toggle and "Open in Strudel" live in the top header bar
- Playing state: pulsing ring around play button at BPM tempo

### Ambient Theming

The signature. Genre color permeates the entire environment:

- Genre accent colors: house=#f59e0b, techno=#ef4444, trance=#06b6d4, dnb=#22c55e
- Background: radial gradient from genre color at 8-12% behind visualizer
- All interactive accents shift with genre (slider fills, active states, VU meters)
- Framer Motion animates color transitions between genre switches

### Mobile Banner

Viewports < 768px show an overlay:
- "newsic is best experienced on desktop"
- "Put on your headphones and open this on a larger screen"
- "Continue anyway" dismisses to the existing stacked layout

### Typography

- Display/headings: Geist Mono (or JetBrains Mono) for the technical-creative vibe
- Body/labels: Geist Sans (or system sans-serif stack)
- BPM readout: monospace, large, high contrast

### Color Tokens

```
--surface-base: #0a0a0f
--surface-raised: #16161e
--surface-glass: rgba(255, 255, 255, 0.03)
--border-subtle: rgba(255, 255, 255, 0.06)
--border-standard: rgba(255, 255, 255, 0.10)
--text-primary: #fafafa
--text-secondary: #a1a1aa
--text-muted: #52525b
--accent-house: #f59e0b
--accent-techno: #ef4444
--accent-trance: #06b6d4
--accent-dnb: #22c55e
```

## Technical Notes

- Web Audio API AnalyserNode for FFT data (tap into Strudel's existing AudioContext)
- Canvas 2D for visualizer rendering (requestAnimationFrame loop)
- CSS custom properties for genre color theming (switchable via JS)
- Framer Motion for layout animations and genre transitions
- No new dependencies needed (canvas + Web Audio are browser APIs)

## Out of Scope

- Circular/radial visualizer variants
- Actual VU metering from audio (use simulated levels from layer state)
- Keyboard shortcuts
- Dark/light theme toggle (dark only)
