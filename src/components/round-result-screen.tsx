"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, X, RotateCcw, Home } from "lucide-react"
import type { Player } from "@/lib/game-types"

interface RoundResultScreenProps {
  players: Player[]
  votedPlayer: Player
  jorgePlayer: Player
  roundNumber: number
  isCorrectGuess: boolean
  onBack: () => void
  onNextRound?: () => void
  onEndGame: () => void
}

export function RoundResultScreen({
  players,
  votedPlayer,
  jorgePlayer,
  roundNumber,
  isCorrectGuess,
  onBack,
  onNextRound,
  onEndGame,
}: RoundResultScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isCorrectGuess) {
      setShowConfetti(true)
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isCorrectGuess])

  const remainingPlayers = players.filter((p) => !p.isEliminated && p.id !== votedPlayer.id)
  const isGameOver = isCorrectGuess || remainingPlayers.length <= 2

  return (
    <div className="min-h-screen bg-background p-4 relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-accent/20 animate-pulse" />
          {/* Simple confetti simulation with animated dots */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="mx-auto max-w-md space-y-6 relative z-20">
        {/* Header */}
        <div className="flex items-center space-x-4 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Resultado</h1>
              <Badge variant="outline" className="rounded-full">
                Ronda {roundNumber}
              </Badge>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <Card
          className={`border-2 ${isCorrectGuess ? "border-success bg-success/5" : "border-destructive bg-destructive/5"}`}
        >
          <CardContent className="p-8 text-center space-y-6">
            {isCorrectGuess ? (
              <>
                <Trophy className="w-16 h-16 mx-auto text-success" />
                <div>
                  <h2 className="text-2xl font-bold text-success mb-2">Acertaram!</h2>
                  <p className="text-lg">
                    O Jorge era <span className="font-semibold text-foreground">{jorgePlayer.name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">O grupo descobriu o Jorge!</p>
                </div>
              </>
            ) : (
              <>
                <X className="w-16 h-16 mx-auto text-destructive" />
                <div>
                  <h2 className="text-2xl font-bold text-destructive mb-2">Falharam!</h2>
                  <p className="text-lg">
                    <span className="font-semibold text-foreground">{votedPlayer.name}</span> está eliminado
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Game Status */}
        {!isCorrectGuess && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Jogadores Restantes:</h3>
              <div className="space-y-2">
                {remainingPlayers.map((player) => (
                  <div key={player.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-sm font-medium">
                      {player.name[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium">{player.name}</span>
                    {player.isJorge && (
                      <Badge variant="secondary" className="text-xs">
                        Jorge
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              {remainingPlayers.length <= 2 && (
                <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm text-warning font-medium">
                    Só restam 2 jogadores! O Jorge ganha automaticamente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          {isGameOver ? (
            <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-2xl" onClick={onEndGame}>
              <Home className="mr-2 h-5 w-5" />
              Terminar Jogo
            </Button>
          ) : (
            <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-2xl" onClick={onNextRound}>
              <RotateCcw className="mr-2 h-5 w-5" />
              Próxima Ronda
            </Button>
          )}
          <Button variant="outline" size="lg" className="w-full h-12 rounded-xl bg-transparent" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}
