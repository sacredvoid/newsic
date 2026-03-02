# Newsic Audio & Visualizer Fix Plan

## Problems Identified

### 0. CRITICAL: Samples not loaded - drums literally cannot play
- `initStrudel()` in `strudelBridge.ts` is called WITHOUT a `prebake` option
- Without prebake, ONLY built-in synth sounds are available: `triangle`, `sawtooth`, `square`, `sine`, `sbd`, `supersaw`, `pulse`, `noise`
- Sample-based sounds like `bd`, `sd`, `hh`, `cp`, `oh`, `rim`, `crash`, `ride` are NOT loaded
- This is why drums don't play in our app but DO play when pasted into strudel.cc (which loads Dirt-Samples by default)
- FIX: Pass `prebake` option to load the Dirt-Samples collection:
  ```ts
  await strudel.initStrudel({
    prebake: () => strudel.samples('github:tidalcycles/dirt-samples'),
  })
  ```
- Note: Samples are lazily fetched on first use, so there may be silence on the very first trigger. Subsequent triggers play fine.
- The `strudel.d.ts` type declarations need to add `samples()` export

### 1. Patterns sound bad / off-beat / no cohesion
- House default drums `bd sd:1 bd [sd:1 bd]` has NO hihats - sounds empty
- Effect stacking: multiple `.gain()` and `.lpf()` calls chain up where only the last wins, so genre-level tuning is ignored
- `.cutoff()` and `.lpf()` are aliases in Strudel - they conflict when mood overrides add `.cutoff(3000)` on top of a bass `.lpf(900)`
- The `arrange()` approach creates a 32-cycle structured track with intro/buildup/drop/breakdown/drop2/outro, but the section-specific drums (getIntroDrums, getBuildupDrums, etc.) strip base effects, causing tonal inconsistency
- Drum effects disappear in intro/outro but appear in buildup
- No limiter/compressor - stacked layers clip at high gains
- Key selection is cosmetic only (never transposes patterns)
- Remix is nearly identical to generate (only +/-3 BPM variation)

### 2. Visualizer only peaks on left side
- FFT data from AnalyserNode maps linearly from 0 to Nyquist (~22kHz)
- Most musical energy is in low frequencies (0-4kHz), so linear mapping bunches all the action into the first ~20% of bars
- Need logarithmic frequency mapping so bass gets fewer bars and mids/highs get proper representation
- Currently: `dataIndex = Math.floor((i / BAR_COUNT) * dataArray.length)` - this is linear, needs to be logarithmic

### 3. Muting doesn't work
- The full track code is evaluated as a single string by `evaluate(code, true)`
- React state for mute/volume has zero connection to the running Strudel patterns
- The `$:` prefix patterns run independently once evaluated - there's no API to mute individual `$:` blocks from JS
- **Fix approach**: Instead of `$:` blocks, use `stack()` and apply `.gain(0)` or `.gain(volume)` per layer based on mute state. OR re-evaluate the full code string with muted layers replaced by `silence`.

## Fix Plan

### Fix A: Rewrite patternBuilder.ts - Simpler, better-sounding output

**Drop the `arrange()` approach entirely.** It creates complexity that doesn't translate to good music. Instead, generate a simple `stack()` of 4 layers that loop. This matches what sounds good in Strudel and what exports cleanly to the Strudel REPL.

**New output format:**
```javascript
setcpm(128 / 4)

stack(
  // Drums
  sound("bd*4, [~ cp]*2, hh*8")
    .bank("RolandTR909")
    .gain(0.9),

  // Bass
  note("c2 [~ c2] eb2 [~ g1]")
    .sound("sawtooth")
    .lpf(800)
    .gain(0.7),

  // Lead
  note("c4 eb4 g4 [c5 ~]")
    .sound("sawtooth")
    .lpf(2000)
    .delay(0.25)
    .gain(0.5),

  // FX
  sound("~ ~ oh ~")
    .room(0.5)
    .gain(0.25)
)
```

**Key changes:**
1. Use `stack()` instead of multiple `$: arrange()` blocks
2. Fix house drums to include hihats: `bd*4, [~ cp]*2, hh*8` (four-on-the-floor)
3. Use `.bank("RolandTR909")` for drum machine character
4. Apply effects as single clean chains - no stacking/conflicting
5. Mood modifiers adjust parameters directly (e.g., dark mood = lower lpf values) instead of appending extra effect calls
6. Gain levels properly balanced: drums 0.9, bass 0.7, lead 0.5, fx 0.25

**Genre default drum patterns (FIXED):**
- House: `bd*4, [~ cp]*2, hh*8` (classic four-on-the-floor)
- Techno: `bd*4, [~ cp]*2, [hh hh:3]*4` (driving)
- Trance: `bd*4, [~ cp]*2, hh*4 oh hh*4 oh` (offbeat open hats)
- DnB: `bd ~ [~ bd] sd, [~ sd]*2, hh*8` (breakbeat)

### Fix B: Visualizer - logarithmic frequency mapping

Replace the linear FFT bin mapping with logarithmic:

```typescript
// Instead of:
const dataIndex = Math.floor((i / BAR_COUNT) * dataArray.length)

// Use logarithmic mapping:
const minFreq = 20    // 20 Hz
const maxFreq = 16000 // 16 kHz
const logMin = Math.log10(minFreq)
const logMax = Math.log10(maxFreq)
const logFreq = logMin + (i / BAR_COUNT) * (logMax - logMin)
const freq = Math.pow(10, logFreq)
const nyquist = 44100 / 2 // assuming 44.1kHz sample rate
const dataIndex = Math.round((freq / nyquist) * dataArray.length)
```

This spreads bass (20-200Hz), mids (200-4kHz), and highs (4-16kHz) evenly across the bars.

Also: average multiple FFT bins per bar for smoother display, especially in the high frequency range where multiple bins map to one bar.

### Fix C: Make muting work

**Approach: Re-evaluate code with muted layers replaced by `silence`**

When mute state changes:
1. Rebuild the code string with muted layers replaced by `silence` in the stack
2. Call `evaluate(newCode, true)` to seamlessly transition
3. For volume changes, rebuild with `.gain(newVolume)` on the affected layer

This requires:
- `patternBuilder.ts` to return individual layer code strings (already does via `layers` property)
- A new function `buildCodeFromLayers(layers, muteState, volumeState)` that assembles the stack
- `useTrack.ts` to re-evaluate on mute/volume change

**Alternative simpler approach:** Store each layer's code separately, and when building the final code, check mute state:
```javascript
stack(
  muteState.drums ? silence : drumsCode,
  muteState.bass ? silence : bassCode,
  muteState.lead ? silence : leadCode,
  muteState.fx ? silence : fxCode
)
```

### Fix D: Better remix variation

When remixing:
- Randomly mutate drum patterns (add/remove hits, change samples)
- Shift bass notes by intervals
- Reverse or rotate lead pattern
- Adjust effect parameters randomly within genre-appropriate ranges
- More than just +/-3 BPM

## File Changes

| File | Change |
|------|--------|
| `src/engine/patternBuilder.ts` | Complete rewrite - simpler `stack()` output, proper effect chains, mute-aware code generation |
| `src/data/genres.ts` | Fix house drums, add `.bank()` to drum configs, clean up effects |
| `src/data/moods.ts` | Change from effect string appending to parameter adjustments |
| `src/components/AudioVisualizer.tsx` | Logarithmic FFT mapping, bin averaging |
| `src/hooks/useTrack.ts` | Re-evaluate code on mute/volume change |
| `src/engine/remixer.ts` | Actual pattern mutation logic |
| `src/data/artists/profiles.ts` | Ensure all artist patterns use proper Strudel syntax |

### 4. Spacebar play/pause
- Add a global keydown listener for spacebar that toggles play/stop
- Must prevent default (so page doesn't scroll)
- Should only work when no input/textarea is focused
- Add in `useTrack.ts` or `App.tsx` via a `useEffect` with keydown handler
- Calls `track.play()` or `track.stop()` based on `track.state.isPlaying`

## Priority Order

0. **Fix samples loading** (strudelBridge.ts) - Without this, NO drum samples play at all. This is the root cause of "drums not present in playback". One-line fix in `initStrudel()` call + type def update.
1. **Fix A** (pattern builder) - Simpler stack() output, proper effect chains, better default patterns
2. **Fix B** (visualizer) - Logarithmic FFT mapping so bars spread across full width
3. **Fix C** (muting) - Re-evaluate code on mute/volume change
4. **Fix D** (remix) - Actual pattern mutation, not just BPM jitter
5. **Spacebar** - Global keydown for play/pause toggle
