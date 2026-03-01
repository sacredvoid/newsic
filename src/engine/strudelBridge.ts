let initialized = false

export async function initStrudelEngine(): Promise<void> {
  if (initialized) return
  await import('@strudel/web')
  const initStrudel = (window as any).initStrudel
  if (initStrudel) {
    initStrudel()
  }
  initialized = true
}

export async function playPattern(code: string): Promise<void> {
  if (!initialized) {
    await initStrudelEngine()
  }
  const evaluate = (window as any).evaluate
  if (evaluate) {
    await evaluate(code)
  }
}

export function stopPlayback(): void {
  const hush = (window as any).hush
  if (hush) {
    hush()
  }
}

export function isInitialized(): boolean {
  return initialized
}
