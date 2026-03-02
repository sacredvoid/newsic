let initPromise: Promise<void> | null = null
let evaluateFn: ((code: string, autoplay?: boolean) => Promise<any>) | null = null
let hushFn: (() => void) | null = null
let analyser: AnalyserNode | null = null
let preloadStarted = false

// Pre-load the Strudel module on first user interaction to reduce delay on Generate
export function preloadStrudel(): void {
  if (preloadStarted) return
  preloadStarted = true
  // Fire-and-forget: start downloading the module
  import('@strudel/web').catch(() => {
    preloadStarted = false
  })
}

export async function initStrudelEngine(): Promise<void> {
  if (initPromise) return initPromise

  initPromise = (async () => {
    console.log('[newsic] Loading @strudel/web...')
    const strudel = await import('@strudel/web')

    // Set up analyser node BEFORE initStrudel so we can intercept audio routing
    // initStrudel creates an AudioContext internally, but we need it to exist first
    // We'll set up the analyser after init using getAudioContext
    console.log('[newsic] Calling initStrudel()...')
    await strudel.initStrudel({
      prebake: () => strudel.samples('github:tidalcycles/dirt-samples'),
    })

    evaluateFn = strudel.evaluate
    hushFn = strudel.hush

    // Now tap into the AudioContext for visualization
    try {
      const ctx = strudel.getAudioContext()
      if (ctx) {
        analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.75

        // Intercept future connections to ctx.destination so audio flows through our analyser
        const realDestination = ctx.destination
        const origConnect = AudioNode.prototype.connect as Function
        AudioNode.prototype.connect = function (
          this: AudioNode,
          dest: AudioNode | AudioParam,
          ...args: unknown[]
        ): AudioNode | void {
          if (dest === realDestination && this !== analyser) {
            origConnect.call(this, analyser, ...args)
            return dest as AudioNode
          }
          return origConnect.call(this, dest, ...args)
        } as typeof AudioNode.prototype.connect

        // Connect analyser to the real destination so audio still plays
        origConnect.call(analyser, realDestination)
        console.log('[newsic] AnalyserNode connected to audio graph')
      }
    } catch (e) {
      console.warn('[newsic] Could not set up analyser:', e)
    }

    console.log('[newsic] Strudel initialized successfully')
  })()

  return initPromise
}

export async function playPattern(code: string): Promise<void> {
  await initStrudelEngine()
  if (evaluateFn) {
    await evaluateFn(code, true)
  }
}

export function stopPlayback(): void {
  if (hushFn) {
    hushFn()
  }
}

export function getAnalyserNode(): AnalyserNode | null {
  return analyser
}
