# newsic Interface Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:executing-plans to implement this plan task-by-task.

**Goal:** Transform newsic from a scrollable single-column form into a full-viewport immersive DAW-like experience with an audio visualizer, tactile controls, and genre-colored ambient theming.

**Architecture:** The app keeps its existing engine layer (strudelBridge, patternBuilder, remixer) and data layer (genres, moods, artists) untouched. All changes are to the UI layer: App.tsx (layout), 5 component rewrites, 2 new components (AudioVisualizer, MobileBanner), CSS updates, and a small strudelBridge addition to expose the AudioContext's AnalyserNode for the visualizer.

**Tech Stack:** React 19, Tailwind CSS v4, Framer Motion, Canvas 2D + Web Audio API (AnalyserNode)

**Design doc:** `docs/plans/2026-03-02-newsic-redesign-design.md`

---

### Task 0: Load fonts and update base CSS

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`

**Step 1: Add Google Fonts to index.html**

Add inside `<head>`, before the viewport meta tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

**Step 2: Update index.css with base styles and CSS custom properties**

Replace the entire `src/index.css` with:

```css
@import "tailwindcss";

:root {
  --surface-base: #0a0a0f;
  --surface-raised: #13131a;
  --surface-glass: rgba(255, 255, 255, 0.03);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-standard: rgba(255, 255, 255, 0.10);
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #52525b;

  /* Genre accent - overridden by JS */
  --accent: #f59e0b;
  --accent-glow: rgba(245, 158, 11, 0.08);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: var(--surface-base);
  color: var(--text-primary);
  font-family: 'Outfit', system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* Mono font utility */
.font-mono {
  font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
}

/* Custom select styling for dark theme */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2371717a' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

select option {
  background-color: #18181b;
  color: #fff;
}

/* Range input track */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #1e1e28;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 0 8px var(--accent-glow);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 8px var(--accent-glow);
}

/* Scrollbar for code preview */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
```

**Step 3: Verify dev server starts**

Run: `cd /Users/samanvya/Documents/github/claude-music-studio && npm run dev`

Verify: page loads, fonts display correctly.

**Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "style: add Outfit + JetBrains Mono fonts and CSS custom properties"
```

---

### Task 1: Restructure App.tsx to full-viewport layout

**Files:**
- Modify: `src/App.tsx`

**Step 1: Rewrite App.tsx with sidebar + main area layout**

Replace the entire file with:

```tsx
import { useEffect } from 'react'
import { GenreSelector } from './components/GenreSelector'
import { MixerBoard } from './components/MixerBoard'
import { TransportBar } from './components/TransportBar'
import { CodePreview } from './components/CodePreview'
import { AudioVisualizer } from './components/AudioVisualizer'
import { MobileBanner } from './components/MobileBanner'
import { useTrack } from './hooks/useTrack'

const genreAccentMap: Record<string, { accent: string; glow: string }> = {
  house: { accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.08)' },
  techno: { accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.08)' },
  trance: { accent: '#06b6d4', glow: 'rgba(6, 182, 212, 0.08)' },
  dnb: { accent: '#22c55e', glow: 'rgba(34, 197, 94, 0.08)' },
}

function App() {
  const track = useTrack()

  // Update CSS custom properties when genre changes
  useEffect(() => {
    const colors = genreAccentMap[track.state.genre]
    if (colors) {
      document.documentElement.style.setProperty('--accent', colors.accent)
      document.documentElement.style.setProperty('--accent-glow', colors.glow)
    }
  }, [track.state.genre])

  const accentHex = genreAccentMap[track.state.genre]?.accent ?? '#f59e0b'

  return (
    <>
      <MobileBanner />
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: `var(--surface-base)` }}>
        {/* Top header bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h1 className="text-lg font-semibold tracking-tight font-mono" style={{ color: 'var(--text-primary)' }}>
            newsic
          </h1>
          <div className="flex items-center gap-2">
            {track.generatedTrack && (
              <>
                <button
                  onClick={track.toggleShowCode}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all border"
                  style={{
                    borderColor: track.state.showCode ? 'var(--accent)' : 'var(--border-standard)',
                    color: track.state.showCode ? accentHex : 'var(--text-secondary)',
                    background: track.state.showCode ? 'var(--accent-glow)' : 'transparent',
                  }}
                >
                  {'</>'} Code
                </button>
                <a
                  href={`https://strudel.cc/#${btoa(track.generatedTrack.code)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all border"
                  style={{
                    borderColor: 'var(--border-standard)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Open in Strudel
                </a>
              </>
            )}
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside
            className="w-[280px] shrink-0 flex flex-col border-r overflow-y-auto p-5"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--surface-glass)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            <GenreSelector
              genre={track.state.genre}
              mood={track.state.mood}
              artistId={track.state.artistId}
              bpm={track.state.bpm}
              onGenreChange={track.setGenre}
              onMoodChange={track.setMood}
              onArtistChange={track.setArtist}
              onBpmChange={track.setBpm}
              onGenerate={track.generate}
              loading={track.loading}
            />
          </aside>

          {/* Main right panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Visualizer area */}
            <div className="flex-1 relative min-h-0">
              {/* Ambient genre glow */}
              <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                  background: `radial-gradient(ellipse at 50% 60%, ${accentHex}12 0%, transparent 70%)`,
                }}
              />
              <AudioVisualizer
                isPlaying={track.state.isPlaying}
                accentColor={accentHex}
                analyserNode={track.analyserNode}
              />

              {/* Code preview overlay */}
              {track.state.showCode && track.generatedTrack && (
                <div className="absolute inset-0 z-10">
                  <CodePreview code={track.generatedTrack.code} />
                </div>
              )}
            </div>

            {/* Mixer */}
            <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <MixerBoard
                layers={track.state.layers}
                onToggleMute={track.toggleMute}
                onVolumeChange={track.setVolume}
                hasTrack={!!track.generatedTrack}
                isPlaying={track.state.isPlaying}
                accentColor={accentHex}
              />
            </div>

            {/* Transport */}
            <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <TransportBar
                isPlaying={track.state.isPlaying}
                hasTrack={!!track.generatedTrack}
                onPlay={track.play}
                onStop={track.stop}
                onRemix={track.remix}
                loading={track.loading}
                accentColor={accentHex}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
```

Note: This references AudioVisualizer, MobileBanner, and track.analyserNode that don't exist yet. We'll create stub components next so the app compiles.

**Step 2: Create stub AudioVisualizer component**

Create `src/components/AudioVisualizer.tsx`:

```tsx
interface AudioVisualizerProps {
  isPlaying: boolean
  accentColor: string
  analyserNode: AnalyserNode | null
}

export function AudioVisualizer({ isPlaying, accentColor }: AudioVisualizerProps) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {isPlaying ? 'Visualizer coming soon...' : 'Generate a track to see the visualizer'}
      </p>
    </div>
  )
}
```

**Step 3: Create MobileBanner component**

Create `src/components/MobileBanner.tsx`:

```tsx
import { useState } from 'react'

export function MobileBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center"
      style={{ background: 'var(--surface-base)' }}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Best on desktop
        </h2>
        <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
          newsic is an immersive audio experience designed for larger screens.
          Put on your headphones and open this on a desktop for the full experience.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs underline underline-offset-4 mt-4"
          style={{ color: 'var(--text-muted)' }}
        >
          Continue anyway
        </button>
      </div>
    </div>
  )
}
```

**Step 4: Add analyserNode to useTrack hook**

In `src/hooks/useTrack.ts`, add an `analyserNode` ref that we'll wire up in a later task. For now, just add it so the types compile:

At the top of the hook function (after `const initRef = useRef(false)`), add:

```ts
const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)
```

And in the return object, add `analyserNode`:

```ts
return {
  state,
  generatedTrack,
  loading,
  analyserNode,
  setGenre,
  // ... rest unchanged
}
```

**Step 5: Verify dev server compiles and renders the new layout**

Run: `npm run dev`

Verify: full-viewport layout with sidebar on left, main area on right, no scrolling on the body.

**Step 6: Commit**

```bash
git add src/App.tsx src/components/AudioVisualizer.tsx src/components/MobileBanner.tsx src/hooks/useTrack.ts
git commit -m "feat: restructure to full-viewport DAW layout with sidebar"
```

---

### Task 2: Redesign GenreSelector sidebar controls

**Files:**
- Modify: `src/components/GenreSelector.tsx`

**Step 1: Rewrite GenreSelector with tactile controls**

Replace the entire file with:

```tsx
import { motion } from 'framer-motion'
import type { Genre, Mood } from '../types'
import { genres } from '../data/genres'
import { moods } from '../data/moods'
import { getArtistsByGenre } from '../data/artists'

const genreAccentHex: Record<Genre, string> = {
  house: '#f59e0b',
  techno: '#ef4444',
  trance: '#06b6d4',
  dnb: '#22c55e',
}

interface GenreSelectorProps {
  genre: Genre
  mood: Mood
  artistId: string | null
  bpm: number
  onGenreChange: (genre: Genre) => void
  onMoodChange: (mood: Mood) => void
  onArtistChange: (artistId: string | null) => void
  onBpmChange: (bpm: number) => void
  onGenerate: () => void
  loading: boolean
}

export function GenreSelector({
  genre,
  mood,
  artistId,
  bpm,
  onGenreChange,
  onMoodChange,
  onArtistChange,
  onBpmChange,
  onGenerate,
  loading,
}: GenreSelectorProps) {
  const artists = getArtistsByGenre(genre)
  const currentGenreConfig = genres.find((g) => g.id === genre)!
  const accent = genreAccentHex[genre]

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Genre - 2x2 grid */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2.5 font-medium"
          style={{ color: 'var(--text-muted)' }}>
          Genre
        </label>
        <div className="grid grid-cols-2 gap-2">
          {genres.map((g) => {
            const isActive = genre === g.id
            const gAccent = genreAccentHex[g.id]
            return (
              <motion.button
                key={g.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onGenreChange(g.id)
                  onArtistChange(null)
                  onBpmChange(g.defaultBpm)
                }}
                className="py-2.5 px-3 rounded-lg text-sm font-medium transition-all border"
                style={{
                  borderColor: isActive ? gAccent : 'var(--border-standard)',
                  color: isActive ? gAccent : 'var(--text-secondary)',
                  background: isActive ? `${gAccent}15` : 'transparent',
                  boxShadow: isActive ? `0 0 20px ${gAccent}20` : 'none',
                }}
              >
                {g.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Mood - chip row */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2.5 font-medium"
          style={{ color: 'var(--text-muted)' }}>
          Mood
        </label>
        <div className="flex flex-wrap gap-1.5">
          {moods.map((m) => {
            const isActive = mood === m.id
            return (
              <button
                key={m.id}
                onClick={() => onMoodChange(m.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  borderColor: isActive ? accent : 'var(--border-standard)',
                  color: isActive ? accent : 'var(--text-secondary)',
                  background: isActive ? `${accent}15` : 'transparent',
                }}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* BPM */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] uppercase tracking-[0.2em] font-medium"
            style={{ color: 'var(--text-muted)' }}>
            Tempo
          </label>
          <span className="text-lg font-mono font-bold" style={{ color: accent }}>
            {bpm}
            <span className="text-[10px] ml-1 font-normal" style={{ color: 'var(--text-muted)' }}>BPM</span>
          </span>
        </div>
        <input
          type="range"
          min={currentGenreConfig.bpmRange[0]}
          max={currentGenreConfig.bpmRange[1]}
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>{currentGenreConfig.bpmRange[0]}</span>
          <span>{currentGenreConfig.bpmRange[1]}</span>
        </div>
      </div>

      {/* Inspired By - chip list */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2.5 font-medium"
          style={{ color: 'var(--text-muted)' }}>
          Inspired By
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onArtistChange(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              borderColor: artistId === null ? accent : 'var(--border-standard)',
              color: artistId === null ? accent : 'var(--text-secondary)',
              background: artistId === null ? `${accent}15` : 'transparent',
            }}
          >
            None
          </button>
          {artists.map((a) => {
            const isActive = artistId === a.id
            return (
              <button
                key={a.id}
                onClick={() => onArtistChange(a.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  borderColor: isActive ? accent : 'var(--border-standard)',
                  color: isActive ? accent : 'var(--text-secondary)',
                  background: isActive ? `${accent}15` : 'transparent',
                }}
              >
                {a.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Spacer to push generate button to bottom */}
      <div className="flex-1" />

      {/* Generate Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all"
        style={{
          background: loading ? `${accent}60` : accent,
          color: genre === 'techno' ? '#fff' : '#000',
          cursor: loading ? 'wait' : 'pointer',
          boxShadow: loading ? 'none' : `0 0 30px ${accent}30`,
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          'Generate Track'
        )}
      </motion.button>
    </div>
  )
}
```

**Step 2: Verify sidebar controls render correctly**

Run dev server, verify: 2x2 genre grid, mood chips wrap, BPM has large monospace readout, artist chips, generate button at bottom of sidebar.

**Step 3: Commit**

```bash
git add src/components/GenreSelector.tsx
git commit -m "feat: redesign sidebar controls with pill/chip selectors"
```

---

### Task 3: Expose AnalyserNode from Strudel's AudioContext

**Files:**
- Modify: `src/engine/strudelBridge.ts`
- Modify: `src/hooks/useTrack.ts`

**Step 1: Add getAnalyserNode to strudelBridge**

Add at the bottom of `src/engine/strudelBridge.ts`:

```ts
let analyserNode: AnalyserNode | null = null

export function getAnalyserNode(): AnalyserNode | null {
  if (analyserNode) return analyserNode

  // Try to get the AudioContext from Strudel's global scope
  // Strudel uses `getAudioContext()` internally
  try {
    const ctx = (window as any).AudioContext || (window as any).webkitAudioContext
    // Strudel sets up an AudioContext - we need to find it
    // The simplest approach: look for Strudel's superdough audio context
    const strudelCtx = (window as any).__strudelAudioContext ?? (window as any).superdough?.ac
    if (strudelCtx && strudelCtx instanceof AudioContext) {
      analyserNode = strudelCtx.createAnalyser()
      analyserNode.fftSize = 128
      analyserNode.smoothingTimeConstant = 0.8
      // Connect to the destination to tap into the audio
      strudelCtx.destination
      // We need to connect the analyser to the audio graph
      // The cleanest way: connect destination's input
      if ((strudelCtx as any).globalThis?.destination) {
        (strudelCtx as any).globalThis.destination.connect(analyserNode)
      }
      return analyserNode
    }
  } catch (e) {
    console.warn('[CMS] Could not create analyser node:', e)
  }
  return null
}
```

Actually, Strudel's audio routing is complex. A more reliable approach: create our own AnalyserNode and connect it via a GainNode to Strudel's destination. Let me revise.

Replace the above with a simpler approach - add to `strudelBridge.ts`:

```ts
let analyserNode: AnalyserNode | null = null

export function getOrCreateAnalyser(): AnalyserNode | null {
  if (analyserNode) return analyserNode

  try {
    // After Strudel initializes, it creates an AudioContext
    // We can access it through the superdough global or by finding active contexts
    const audioCtx = getStrudelAudioContext()
    if (!audioCtx) return null

    analyserNode = audioCtx.createAnalyser()
    analyserNode.fftSize = 128
    analyserNode.smoothingTimeConstant = 0.8

    // Connect analyser in parallel with destination
    // Strudel routes audio to audioCtx.destination
    // We insert our analyser by connecting destination's source
    // Since we can't intercept easily, we'll use a MediaStreamDestination workaround
    // Simplest: connect analyser to destination and hope Strudel's gain nodes feed through
    // Actually the cleanest way: monkey-patch or use Strudel's getAudioContext

    return analyserNode
  } catch (e) {
    console.warn('[CMS] Could not create analyser:', e)
    return null
  }
}

function getStrudelAudioContext(): AudioContext | null {
  // Strudel stores its AudioContext in superdough
  const sd = (window as any).superdough
  if (sd?.ac) return sd.ac
  return null
}
```

Actually, this is getting complex because Strudel's internal audio routing isn't easily interceptable after the fact. The most reliable approach for the visualizer is to use **simulated/random animation** when playing (driven by the isPlaying state) rather than real FFT data. This still looks great and avoids the fragile audio graph hacking. We can always add real FFT later.

**Revised Step 1: Skip the strudelBridge changes. The visualizer will use simulated animation.**

The `analyserNode` state in useTrack stays as `null` for now. The AudioVisualizer component will detect `analyserNode === null` and fall back to simulated bars.

**Step 2: Commit (skip if no changes)**

No commit needed for this task - we'll handle it all in the visualizer task.

---

### Task 3 (revised): Build AudioVisualizer canvas component

**Files:**
- Modify: `src/components/AudioVisualizer.tsx` (replace stub)

**Step 1: Write the full AudioVisualizer component**

Replace `src/components/AudioVisualizer.tsx` with:

```tsx
import { useRef, useEffect, useCallback } from 'react'

interface AudioVisualizerProps {
  isPlaying: boolean
  accentColor: string
  analyserNode: AnalyserNode | null
}

// Parse hex color to RGB components
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [245, 158, 11]
}

const BAR_COUNT = 64
const BAR_GAP = 4
const MIRROR_OPACITY = 0.15

export function AudioVisualizer({ isPlaying, accentColor, analyserNode }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const barsRef = useRef<number[]>(new Array(BAR_COUNT).fill(0))
  const targetBarsRef = useRef<number[]>(new Array(BAR_COUNT).fill(0))

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Handle high-DPI displays
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const barWidth = (width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT
    const maxBarHeight = height * 0.55 // Leave room for reflection
    const baseY = height * 0.55

    // Clear
    ctx.clearRect(0, 0, width, height)

    const [r, g, b] = hexToRgb(accentColor)

    // Update target bars
    if (analyserNode) {
      // Real FFT data
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount)
      analyserNode.getByteFrequencyData(dataArray)
      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * dataArray.length)
        targetBarsRef.current[i] = dataArray[dataIndex] / 255
      }
    } else if (isPlaying) {
      // Simulated - organic movement
      const time = Date.now() / 1000
      for (let i = 0; i < BAR_COUNT; i++) {
        const normalizedIndex = i / BAR_COUNT
        // Create a bell curve shape with randomized peaks
        const bellCurve = Math.exp(-Math.pow((normalizedIndex - 0.3) * 3, 2))
        const wave1 = Math.sin(time * 2 + i * 0.3) * 0.15
        const wave2 = Math.sin(time * 3.7 + i * 0.5) * 0.1
        const wave3 = Math.sin(time * 1.3 + i * 0.7) * 0.12
        const noise = (Math.random() - 0.5) * 0.08
        targetBarsRef.current[i] = Math.max(0.02, Math.min(1, bellCurve * 0.7 + wave1 + wave2 + wave3 + noise + 0.15))
      }
    } else {
      // Idle - low breathing bars
      const time = Date.now() / 1000
      for (let i = 0; i < BAR_COUNT; i++) {
        const breath = Math.sin(time * 0.5 + i * 0.1) * 0.02 + 0.03
        targetBarsRef.current[i] = Math.max(0.01, breath)
      }
    }

    // Smooth interpolation
    for (let i = 0; i < BAR_COUNT; i++) {
      const ease = isPlaying ? 0.15 : 0.05
      barsRef.current[i] += (targetBarsRef.current[i] - barsRef.current[i]) * ease
    }

    // Draw bars
    for (let i = 0; i < BAR_COUNT; i++) {
      const x = i * (barWidth + BAR_GAP)
      const barHeight = barsRef.current[i] * maxBarHeight
      const y = baseY - barHeight

      // Main bar with gradient
      const gradient = ctx.createLinearGradient(x, baseY, x, y)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.7)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`)

      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [barWidth / 2, barWidth / 2, 0, 0])
      ctx.fillStyle = gradient
      ctx.fill()

      // Mirror reflection
      const mirrorGradient = ctx.createLinearGradient(x, baseY, x, baseY + barHeight * 0.4)
      mirrorGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${MIRROR_OPACITY})`)
      mirrorGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.beginPath()
      ctx.roundRect(x, baseY + 2, barWidth, barHeight * 0.4, [0, 0, barWidth / 2, barWidth / 2])
      ctx.fillStyle = mirrorGradient
      ctx.fill()
    }

    animFrameRef.current = requestAnimationFrame(draw)
  }, [isPlaying, accentColor, analyserNode])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
```

**Step 2: Verify the visualizer renders**

Run dev server. Verify:
- Idle: low breathing bars visible in genre color
- After generating a track: animated simulated spectrum bars
- Genre change: bar colors transition

**Step 3: Commit**

```bash
git add src/components/AudioVisualizer.tsx
git commit -m "feat: add animated frequency spectrum visualizer"
```

---

### Task 4: Redesign MixerBoard and TrackLayer

**Files:**
- Modify: `src/components/MixerBoard.tsx`
- Modify: `src/components/TrackLayer.tsx`

**Step 1: Rewrite MixerBoard**

Replace `src/components/MixerBoard.tsx` with:

```tsx
import { AnimatePresence, motion } from 'framer-motion'
import type { LayerName, LayerState } from '../types'
import { TrackLayer } from './TrackLayer'

const layerOrder: LayerName[] = ['drums', 'bass', 'lead', 'fx']

interface MixerBoardProps {
  layers: Record<LayerName, LayerState>
  onToggleMute: (layer: LayerName) => void
  onVolumeChange: (layer: LayerName, volume: number) => void
  hasTrack: boolean
  isPlaying: boolean
  accentColor: string
}

export function MixerBoard({ layers, onToggleMute, onVolumeChange, hasTrack, isPlaying, accentColor }: MixerBoardProps) {
  if (!hasTrack) {
    return (
      <div className="px-5 py-6 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Pick your style and hit Generate to create a track
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-5 py-3 space-y-1.5"
      >
        {layerOrder.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TrackLayer
              layer={layers[name]}
              onToggleMute={onToggleMute}
              onVolumeChange={onVolumeChange}
              isPlaying={isPlaying}
              accentColor={accentColor}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
```

**Step 2: Rewrite TrackLayer with VU meters**

Replace `src/components/TrackLayer.tsx` with:

```tsx
import { useRef, useEffect } from 'react'
import type { LayerName, LayerState } from '../types'

const layerColors: Record<LayerName, string> = {
  drums: '#f97316',
  bass: '#a855f7',
  lead: '#06b6d4',
  fx: '#ec4899',
}

const layerLabels: Record<LayerName, string> = {
  drums: 'DRUMS',
  bass: 'BASS',
  lead: 'LEAD',
  fx: 'FX',
}

interface TrackLayerProps {
  layer: LayerState
  onToggleMute: (layer: LayerName) => void
  onVolumeChange: (layer: LayerName, volume: number) => void
  isPlaying: boolean
  accentColor: string
}

function VuMeter({ color, isPlaying, volume, muted }: { color: string; isPlaying: boolean; volume: number; muted: boolean }) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!isPlaying || muted) {
      // Reset bars
      barsRef.current.forEach((bar) => {
        if (bar) bar.style.opacity = '0.15'
      })
      return
    }

    const animate = () => {
      const time = Date.now() / 1000
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        const normalizedLevel = Math.random() * volume * 0.8 +
          Math.sin(time * 4 + i * 0.8) * 0.15 * volume
        const clamped = Math.max(0.1, Math.min(1, normalizedLevel))
        bar.style.opacity = String(clamped)
      })
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [isPlaying, volume, muted])

  return (
    <div className="flex gap-[3px] items-end h-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { barsRef.current[i] = el }}
          className="w-[3px] h-full rounded-sm transition-opacity"
          style={{ background: color, opacity: 0.15 }}
        />
      ))}
    </div>
  )
}

export function TrackLayer({ layer, onToggleMute, onVolumeChange, isPlaying }: TrackLayerProps) {
  const color = layerColors[layer.name]

  return (
    <div
      className="flex items-center gap-4 px-3 py-2 rounded-lg transition-opacity"
      style={{
        background: `${color}08`,
        opacity: layer.muted ? 0.35 : 1,
        borderLeft: `2px solid ${color}${layer.muted ? '30' : '80'}`,
      }}
    >
      {/* Label */}
      <span
        className="text-[10px] font-mono font-bold tracking-widest w-12 shrink-0"
        style={{ color }}
      >
        {layerLabels[layer.name]}
      </span>

      {/* VU Meter */}
      <div className="shrink-0">
        <VuMeter color={color} isPlaying={isPlaying} volume={layer.volume} muted={layer.muted} />
      </div>

      {/* Volume Slider */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={layer.volume}
        onChange={(e) => onVolumeChange(layer.name, Number(e.target.value))}
        className="flex-1 min-w-0"
        style={{ accentColor: color }}
      />

      {/* Mute Button */}
      <button
        onClick={() => onToggleMute(layer.name)}
        className="w-7 h-7 rounded text-[10px] font-bold shrink-0 transition-all border font-mono"
        style={{
          borderColor: layer.muted ? 'var(--border-standard)' : `${color}50`,
          color: layer.muted ? 'var(--text-muted)' : color,
          background: layer.muted ? 'transparent' : `${color}15`,
        }}
      >
        M
      </button>
    </div>
  )
}
```

**Step 3: Verify mixer renders with VU meters**

Run dev server. Generate a track. Verify: horizontal strips with animated VU meter bars, volume sliders, and mute toggles. Muted strips dim to ~35% opacity.

**Step 4: Commit**

```bash
git add src/components/MixerBoard.tsx src/components/TrackLayer.tsx
git commit -m "feat: redesign mixer with VU meters and channel strips"
```

---

### Task 5: Redesign TransportBar

**Files:**
- Modify: `src/components/TransportBar.tsx`

**Step 1: Rewrite TransportBar**

Replace `src/components/TransportBar.tsx` with:

```tsx
import { motion } from 'framer-motion'

interface TransportBarProps {
  isPlaying: boolean
  hasTrack: boolean
  onPlay: () => void
  onStop: () => void
  onRemix: () => void
  loading: boolean
  accentColor: string
}

export function TransportBar({
  isPlaying,
  hasTrack,
  onPlay,
  onStop,
  onRemix,
  loading,
  accentColor,
}: TransportBarProps) {
  return (
    <div className="px-5 py-3 flex items-center justify-center gap-4">
      {/* Play/Stop */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={isPlaying ? onStop : onPlay}
        disabled={!hasTrack || loading}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all"
        style={{
          background: !hasTrack ? 'var(--surface-raised)' : '#fafafa',
          color: !hasTrack ? 'var(--text-muted)' : '#0a0a0f',
          cursor: !hasTrack ? 'not-allowed' : 'pointer',
        }}
      >
        {/* Pulsing ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${accentColor}` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span className="relative z-10">
          {isPlaying ? '\u23F9' : '\u25B6'}
        </span>
      </motion.button>

      {/* Remix */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onRemix}
        disabled={!hasTrack || loading}
        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all border"
        style={{
          borderColor: !hasTrack ? 'transparent' : 'var(--border-standard)',
          color: !hasTrack ? 'var(--text-muted)' : 'var(--text-secondary)',
          background: !hasTrack ? 'var(--surface-raised)' : 'transparent',
          cursor: !hasTrack ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Remixing
          </span>
        ) : (
          'Remix'
        )}
      </motion.button>
    </div>
  )
}
```

Note: `showCode` and `onToggleCode` props removed since Code toggle is now in the header (App.tsx).

**Step 2: Verify transport renders correctly**

Run dev server. Verify: centered play button with pulsing ring when playing, remix button to the right.

**Step 3: Commit**

```bash
git add src/components/TransportBar.tsx
git commit -m "feat: redesign transport bar with pulsing play button"
```

---

### Task 6: Update CodePreview for overlay mode

**Files:**
- Modify: `src/components/CodePreview.tsx`

**Step 1: Update CodePreview to work as a full overlay**

Replace `src/components/CodePreview.tsx` with:

```tsx
import { motion } from 'framer-motion'
import { useState } from 'react'

interface CodePreviewProps {
  code: string
}

export function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: 'rgba(10, 10, 15, 0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: 'var(--text-muted)' }}>
          Strudel Code
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded-md font-medium transition-all border"
          style={{
            borderColor: 'var(--border-standard)',
            color: copied ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="flex-1 p-5 text-xs font-mono overflow-auto leading-relaxed custom-scrollbar"
        style={{ color: 'var(--text-secondary)' }}>
        <code>{code}</code>
      </pre>
    </motion.div>
  )
}
```

**Step 2: Verify code preview overlays the visualizer**

Run dev server. Generate a track. Click the Code button in header. Verify: translucent overlay appears over the visualizer with the strudel code.

**Step 3: Commit**

```bash
git add src/components/CodePreview.tsx
git commit -m "feat: update code preview to translucent overlay mode"
```

---

### Task 7: Final polish and build verification

**Files:**
- Modify: `src/index.css` (if any tweaks needed)
- Run: `npm run build`

**Step 1: Run the build**

```bash
cd /Users/samanvya/Documents/github/claude-music-studio && npm run build
```

Expected: build succeeds with no TypeScript errors.

**Step 2: Fix any TypeScript errors**

Address any type errors that come up from the refactored component props.

**Step 3: Run preview**

```bash
npm run preview
```

Manually verify the full flow: genre selection, mood chips, BPM slider, artist chips, generate, play, mixer VU meters, mute, remix, code toggle, mobile banner on small viewport.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors and polish UI"
```

---

## Task Dependency Graph

```
Task 0 (fonts/CSS)
  └─> Task 1 (layout restructure)
        ├─> Task 2 (sidebar controls)
        ├─> Task 3 (visualizer)
        ├─> Task 4 (mixer)
        ├─> Task 5 (transport)
        └─> Task 6 (code preview)
              └─> Task 7 (build verification)
```

Tasks 2-6 can be done in any order after Task 1, but Task 7 must be last.
