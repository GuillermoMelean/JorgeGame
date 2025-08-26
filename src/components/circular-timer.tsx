"use client"

import { useEffect, useState } from "react"

interface CircularTimerProps {
  duration: number
  isRunning: boolean
  onComplete?: () => void
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularTimer({
  duration,
  isRunning,
  onComplete,
  size = 120,
  strokeWidth = 8,
  className = "",
}: CircularTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    setTimeLeft(duration)
    setHasCompleted(false)
  }, [duration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            if (!hasCompleted) {
              setHasCompleted(true)
              onComplete?.()
            }
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, hasCompleted, onComplete])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = timeLeft / duration
  const strokeDasharray = circumference
  const strokeDashoffset = circumference * (1 - progress)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    if (timeLeft <= 10) return "stroke-destructive"
    if (timeLeft <= 30) return "stroke-warning"
    return "stroke-primary"
  }

  const getTextColor = () => {
    if (timeLeft <= 10) return "text-destructive"
    if (timeLeft <= 30) return "text-warning"
    return "text-primary"
  }

  return (
    <div className={`relative flex justify-center gap-4 ${className}`}>
      <svg width={size} height={size} className=" transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-linear ${getTimerColor()}`}
        />
      </svg>
      {/* Timer text */}
      <div className="inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTextColor()}`}>{formatTime(timeLeft)}</div>
          {timeLeft <= 10 && timeLeft > 0 && (
            <div className="text-xs text-muted-foreground animate-pulse">Tempo quase esgotado!</div>
          )}
        </div>
      </div>
    </div>
  )
}
