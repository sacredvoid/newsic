let initPromise: Promise<void> | null = null
let evaluateFn: ((code: string, autoplay?: boolean) => Promise<any>) | null = null
let hushFn: (() => void) | null = null

export async function initStrudelEngine(): Promise<void> {
  if (initPromise) return initPromise

  initPromise = (async () => {
    console.log('[CMS] Loading @strudel/web...')
    const strudel = await import('@strudel/web')

    console.log('[CMS] Calling initStrudel()...')
    await strudel.initStrudel()

    evaluateFn = strudel.evaluate
    hushFn = strudel.hush
    console.log('[CMS] Strudel initialized successfully')
  })()

  return initPromise
}

export async function playPattern(code: string): Promise<void> {
  await initStrudelEngine()
  if (evaluateFn) {
    console.log('[CMS] Evaluating pattern...')
    await evaluateFn(code, true)
    console.log('[CMS] Pattern playing')
  } else {
    console.error('[CMS] evaluateFn not available after init')
  }
}

export function stopPlayback(): void {
  if (hushFn) {
    hushFn()
    console.log('[CMS] Playback stopped')
  }
}
