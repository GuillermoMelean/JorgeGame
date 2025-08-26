"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, MessageCircle, Play, Pause } from "lucide-react"
import type { Player } from "@/lib/game-types"
import { PlayerChip } from "@/components/player-chip"
import { CircularTimer } from "@/components/circular-timer"

interface GameRoundScreenProps {
  players: Player[]
  baseWord: string
  roundNumber: number
  turnSeconds: number
  discussionSeconds: number
  onBack: () => void
  onStartVoting: (speakingOrder: string[]) => void
}

export function GameRoundScreen({
  players,
  roundNumber,
  discussionSeconds,
  onBack,
  onStartVoting,
}: GameRoundScreenProps) {
  const [gamePhase, setGamePhase] = useState<"speaking" | "discussion">("speaking")
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [speakingOrder, setSpeakingOrder] = useState<string[]>([])
  const [spokenPlayers, setSpokenPlayers] = useState<Set<string>>(new Set())

  const activePlayers = players.filter((p) => !p.isEliminated)

  useEffect(() => {
    // Randomize speaking order
    const shuffled = [...activePlayers].sort(() => Math.random() - 0.5)
    setSpeakingOrder(shuffled.map((p) => p.id))
  }, [])

  const currentSpeaker = activePlayers.find((p) => p.id === speakingOrder[currentSpeakerIndex])
  const isLastSpeaker = currentSpeakerIndex === speakingOrder.length - 1

  const handleTimerComplete = () => {
    setIsTimerRunning(false)
    // Auto-advance when timer completes
    if (gamePhase === "speaking") {
      handleNextPlayer()
    } else {
      // Discussion time ended, go to voting
      onStartVoting(speakingOrder)
    }
  }

  const handleNextPlayer = () => {
    if (currentSpeaker) {
      setSpokenPlayers((prev) => new Set([...prev, currentSpeaker.id]))
    }

    if (isLastSpeaker) {
      setGamePhase("discussion")
      setIsTimerRunning(true)
    } else {
      setCurrentSpeakerIndex((prev) => prev + 1)
      setIsTimerRunning(false)
    }
  }

  const handleSkipToVoting = () => {
    setIsTimerRunning(false)
    onStartVoting(speakingOrder)
  }

  if (gamePhase === "speaking") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-md space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 pt-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">Ronda {roundNumber}</h1>
                <Badge variant="outline" className="rounded-full">
                  {currentSpeakerIndex + 1}/{speakingOrder.length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Current Speaker */}
          {currentSpeaker && (
            <Card className="border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{currentSpeaker.name[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{currentSpeaker.name}</h2>
                  <p className="text-muted-foreground">É a sua vez de falar</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Circular Timer */}
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex space-x-3">
                <Button size="lg" className="flex-1 rounded-xl" onClick={handleNextPlayer}>
                  {isLastSpeaker ? "Iniciar Discussão" : "Próximo Jogador"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Players List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5" />
                Jogadores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activePlayers.map((player) => (
                <div key={player.id} className="flex items-center space-x-3">
                  <PlayerChip player={player} showStatus />
                  <div className="flex space-x-1">
                    {spokenPlayers.has(player.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Falou
                      </Badge>
                    )}
                    {currentSpeaker?.id === player.id && <Badge className="text-xs">A falar</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Discussion Phase
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Discussão</h1>
            <p className="text-sm text-muted-foreground">Discutam quem é o Jorge</p>
          </div>
        </div>

        {/* Discussion Timer */}
        <Card className="border-accent/20">
          <CardContent className="p-8 text-center space-y-6">
            <MessageCircle className="w-12 h-12 mx-auto text-accent" />
            <h2 className="text-2xl font-semibold">Tempo de Discussão</h2>
            <CircularTimer
              duration={discussionSeconds}
              isRunning={isTimerRunning}
              onComplete={handleTimerComplete}
              size={180}
              className="mx-auto"
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 rounded-xl bg-transparent"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isTimerRunning ? "Pausar" : "Retomar"}
              </Button>
              <Button size="lg" className="flex-1 rounded-xl" onClick={handleSkipToVoting}>
                Saltar para Votação
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5" />
              Jogadores Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activePlayers.map((player) => (
              <PlayerChip key={player.id} player={player} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
