"use client"
import { useEffect, useRef, useState } from "react"

interface CircularTimerProps {
  duration: number
  isRunning: boolean
  onComplete?: () => void
  size?: number
  strokeWidth?: number
  className?: string
  soundEnabled?: boolean
}

export function CircularTimer({
  duration,
  isRunning,
  onComplete,
  size = 120,
  strokeWidth = 8,
  className = "",
  soundEnabled = true,
}: CircularTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [hasCompleted, setHasCompleted] = useState(false)

  // --- Áudio ---
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioUnlockedRef = useRef(false)
  const prevLeftRef = useRef(duration)
  const prevRunningRef = useRef(false)
  const altTickRef = useRef(false)

  // cria/reinicia audio context
  const ensureAudio = async () => {
    if (!soundEnabled) return
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!audioCtxRef.current) audioCtxRef.current = new AC()
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      try { await audioCtxRef.current.resume() } catch { }
    }
    audioUnlockedRef.current = !!audioCtxRef.current && audioCtxRef.current.state === "running"
  }

  // desbloqueio global na 1.ª interação em qualquer sítio
  useEffect(() => {
    const unlock = () => { ensureAudio(); window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); window.removeEventListener("touchstart", unlock); window.removeEventListener("click", unlock) }
    window.addEventListener("pointerdown", unlock, { once: true, passive: true })
    window.addEventListener("keydown", unlock, { once: true })
    window.addEventListener("touchstart", unlock, { once: true, passive: true })
    window.addEventListener("click", unlock, { once: true, passive: true })
    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
      window.removeEventListener("touchstart", unlock)
      window.removeEventListener("click", unlock)
    }
  }, [])

  // garante áudio ativo quando o timer começa
  useEffect(() => {
    if (isRunning && !prevRunningRef.current) ensureAudio()
    prevRunningRef.current = isRunning
  }, [isRunning])

  const playTick = () => {
    if (!soundEnabled || !audioUnlockedRef.current || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // alternar “tic/tac”
    osc.type = "square"
    osc.frequency.value = altTickRef.current ? 900 : 1200
    altTickRef.current = !altTickRef.current

    const now = ctx.currentTime
    const dur = 0.09

    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + dur + 0.01)
  }

  // reset quando muda a duração
  useEffect(() => {
    setTimeLeft(duration)
    setHasCompleted(false)
    prevLeftRef.current = duration
  }, [duration])

  // intervalo do contador
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            if (!hasCompleted) {
              setHasCompleted(true)
              onComplete?.()
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isRunning, timeLeft, hasCompleted, onComplete])

  // tocar “tick” quando desce 1 segundo
  useEffect(() => {
    if (isRunning && timeLeft > 0 && timeLeft < prevLeftRef.current) playTick()
    prevLeftRef.current = timeLeft
  }, [timeLeft, isRunning])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = timeLeft / duration
  const strokeDasharray = circumference
  const strokeDashoffset = circumference * (1 - progress)

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`
  const getTimerColor = () => (timeLeft <= 10 ? "stroke-destructive" : timeLeft <= 30 ? "stroke-warning" : "stroke-primary")
  const getTextColor = () => (timeLeft <= 10 ? "text-destructive" : timeLeft <= 30 ? "text-warning" : "text-primary")

  return (
    <div className={`relative flex justify-center gap-4 ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-muted/20" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
          strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className={`transition-all duration-1000 ease-linear ${getTimerColor()}`} />
      </svg>
      <div className="inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTextColor()}`}>{formatTime(timeLeft)}</div>
          {timeLeft <= 10 && timeLeft > 0 && <div className="text-xs text-muted-foreground animate-pulse">Tempo quase esgotado!</div>}
          {!audioUnlockedRef.current && soundEnabled && <div className="mt-2 text-[10px] opacity-70">Toque no ecrã para ativar o som 🔊</div>}
        </div>
      </div>
    </div>
  )
}
