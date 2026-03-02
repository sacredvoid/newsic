declare module '@strudel/web' {
  export function initStrudel(options?: Record<string, any>): Promise<any>
  export function evaluate(code: string, autoplay?: boolean): Promise<any>
  export function hush(): void
  export function defaultPrebake(): Promise<void>
  export function getAudioContext(): AudioContext | undefined
}
