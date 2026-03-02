# Newsic - Claude Code Instructions

## Project Overview

Browser-based music studio that generates EDM tracks using [Strudel](https://strudel.cc) (TidalCycles for the web). React + TypeScript + Vite. Deployed on Vercel.

## Architecture

### Audio Pipeline
1. **Genre/Mood/Artist configs** (`src/data/`) define patterns and effects as structured data
2. **patternBuilder.ts** assembles configs into a Strudel code string using `stack()` for layering
3. **strudelBridge.ts** passes the code string to Strudel's `evaluate()` with `autoplay=true`
4. **useTrack.ts** orchestrates React state, mute/volume, and playback lifecycle

### Key Design Decisions

**stack() not arrange()**: We tried `arrange()` for multi-section song structure (intro/buildup/drop/etc.) but it produced unreliable playback. Simple `stack()` of 4 simultaneous layers works reliably and exports cleanly to the Strudel REPL.

**Numeric mood parameters, not string effects**: Moods use `filterCutoff`, `reverbAmount`, `gainMultiplier` etc. instead of raw effect strings like `.lpf(600)`. The `buildEffectChain()` function in patternBuilder applies these by adjusting existing effect values or appending new ones. This prevents conflicting duplicate effects (e.g., two `.lpf()` calls where only the last wins).

**Re-evaluate for mute/volume**: No Strudel API exists to mute individual layers after `evaluate()`. Instead, `buildCodeFromLayers()` rebuilds the full code string with muted layers replaced by `silence` and volume applied via `.gain()`, then re-evaluates. This is seamless.

**Dirt-Samples prebake is required**: Without passing `prebake: () => strudel.samples('github:tidalcycles/dirt-samples')` to `initStrudel()`, only built-in synth sounds work. Sample-based drums (bd, sd, hh, cp, oh, etc.) silently fail. This was the root cause of "drums not playing."

## Strudel Patterns - What Works

- `sound("bd*4, [~ cp]*2, hh*8")` - comma-separated layers within one sound() for drums
- `note("c2 [~ c2] eb2 ~").sound("sawtooth").lpf(800)` - melodic patterns
- `.bank("RolandTR909")` - use specific drum machine sample banks
- Effects with Strudel patterns: `.lpf("<400 800 1600 800>")` - angle bracket notation cycles through values
- `setcpm(128 / 4)` at top to set tempo

## File Map

| File | Purpose |
|------|---------|
| `src/engine/patternBuilder.ts` | Assembles Strudel code from configs. Exports `buildTrack()` and `buildCodeFromLayers()` |
| `src/engine/strudelBridge.ts` | Strudel init, evaluate, hush. Manages AnalyserNode for visualizer |
| `src/engine/remixer.ts` | Pattern mutation (drum variations, note rotation, octave shifts, effect jitter) |
| `src/hooks/useTrack.ts` | React hook - state, playback lifecycle, mute/volume re-evaluation, spacebar handler |
| `src/data/genres.ts` | Genre configs (house/techno/trance/dnb) with default patterns and BPM ranges |
| `src/data/moods.ts` | Mood modifiers with numeric parameters (not string effects) |
| `src/data/artists/profiles.ts` | 20 artist profiles with custom patterns per genre |
| `src/components/AudioVisualizer.tsx` | Canvas visualizer with logarithmic FFT mapping (20Hz-16kHz) |
| `src/types/index.ts` | All TypeScript interfaces |

## Common Pitfalls

- **`.cutoff()` and `.lpf()` are aliases in Strudel** - use `.lpf()` consistently. `buildEffectChain()` normalizes `cutoff` to `lpf`.
- **Artist patterns may include `note()` wrapper** - always check `pattern.includes('note(')` before wrapping
- **Effect patterns with `<>` must stay verbatim** - don't try to extract numeric values from `.lpf("<400 800>")`
- **Samples are lazily fetched** - first trigger of a new sample may be silent; subsequent triggers play fine
- **Visualizer uses logarithmic mapping** - linear FFT mapping bunches all energy into first 20% of bars
