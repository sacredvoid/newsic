import { useRef, useEffect, useCallback } from 'react'

interface AudioVisualizerProps {
  isPlaying: boolean
  accentColor: string
  analyserNode: AnalyserNode | null
}

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

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const barWidth = (width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT
    const maxBarHeight = height * 0.55
    const baseY = height * 0.55

    ctx.clearRect(0, 0, width, height)

    const [r, g, b] = hexToRgb(accentColor)

    if (analyserNode) {
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount)
      analyserNode.getByteFrequencyData(dataArray)
      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * dataArray.length)
        targetBarsRef.current[i] = dataArray[dataIndex] / 255
      }
    } else if (isPlaying) {
      const time = Date.now() / 1000
      for (let i = 0; i < BAR_COUNT; i++) {
        const normalizedIndex = i / BAR_COUNT
        const bellCurve = Math.exp(-Math.pow((normalizedIndex - 0.3) * 3, 2))
        const wave1 = Math.sin(time * 2 + i * 0.3) * 0.15
        const wave2 = Math.sin(time * 3.7 + i * 0.5) * 0.1
        const wave3 = Math.sin(time * 1.3 + i * 0.7) * 0.12
        const noise = (Math.random() - 0.5) * 0.08
        targetBarsRef.current[i] = Math.max(0.02, Math.min(1, bellCurve * 0.7 + wave1 + wave2 + wave3 + noise + 0.15))
      }
    } else {
      const time = Date.now() / 1000
      for (let i = 0; i < BAR_COUNT; i++) {
        const breath = Math.sin(time * 0.5 + i * 0.1) * 0.02 + 0.03
        targetBarsRef.current[i] = Math.max(0.01, breath)
      }
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const ease = isPlaying ? 0.15 : 0.05
      barsRef.current[i] += (targetBarsRef.current[i] - barsRef.current[i]) * ease
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const x = i * (barWidth + BAR_GAP)
      const barHeight = barsRef.current[i] * maxBarHeight
      const y = baseY - barHeight

      const gradient = ctx.createLinearGradient(x, baseY, x, y)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.7)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`)

      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [barWidth / 2, barWidth / 2, 0, 0])
      ctx.fillStyle = gradient
      ctx.fill()

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
