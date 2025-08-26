"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Vote, CheckCircle } from "lucide-react"
import type { Player } from "@/lib/game-types"

interface VotingScreenProps {
  players: Player[]
  roundNumber: number
  onBack: () => void
  onVoteComplete: (votedPlayerId: string) => void
}

export function VotingScreen({ players, roundNumber, onBack, onVoteComplete }: VotingScreenProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const activePlayers = players.filter((p) => !p.isEliminated)
  const selectedPlayer = activePlayers.find((p) => p.id === selectedPlayerId)

  const handlePlayerSelect = (playerId: string) => {
    if (!hasVoted) {
      setSelectedPlayerId(playerId)
    }
  }

  const handleConfirmVote = () => {
    if (selectedPlayerId) {
      setHasVoted(true)
      onVoteComplete(selectedPlayerId)
    }
  }

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
              <h1 className="text-2xl font-bold">Votação</h1>
              <Badge variant="outline" className="rounded-full">
                Ronda {roundNumber}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Quem é o Jorge?</p>
          </div>
        </div>

        {/* Voting Instructions */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6 text-center space-y-2">
            <Vote className="w-8 h-8 mx-auto text-accent" />
            <h3 className="text-lg font-semibold">Hora de Votar!</h3>
            <p className="text-sm text-muted-foreground">Escolhe quem achas que é o Jorge. Só podes votar uma vez.</p>
          </CardContent>
        </Card>

        {/* Players List for Voting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Escolhe um jogador:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePlayers.map((player) => (
              <div
                key={player.id}
                className={`relative cursor-pointer transition-all duration-200 ${hasVoted ? "cursor-not-allowed" : "hover:scale-[1.02]"
                  }`}
                onClick={() => handlePlayerSelect(player.id)}
              >
                <div
                  className={`p-4 rounded-xl border-2 transition-all ${selectedPlayerId === player.id
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border/50 bg-card/50 hover:border-primary/50"
                    } ${hasVoted && selectedPlayerId !== player.id ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-semibold ${selectedPlayerId === player.id
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-muted/20 text-muted-foreground border-muted/30"
                        }`}
                    >
                      {player.name[0]?.toUpperCase()}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{player.name}</h4>
                      <p className="text-sm text-muted-foreground">Toca para votar</p>
                    </div>

                    {/* Selection Indicator */}
                    {selectedPlayerId === player.id && (
                      <CheckCircle className="w-6 h-6 text-primary animate-in zoom-in-50 duration-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vote Confirmation */}
        {selectedPlayer && !hasVoted && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Confirmar Voto</h3>
                <p className="text-sm text-muted-foreground">
                  Vais votar em <span className="font-semibold text-foreground">{selectedPlayer.name}</span> como o
                  Jorge?
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-xl bg-transparent"
                  onClick={() => setSelectedPlayerId(null)}
                >
                  Cancelar
                </Button>
                <Button size="lg" className="flex-1 rounded-xl" onClick={handleConfirmVote}>
                  <Vote className="mr-2 h-4 w-4" />
                  Confirmar Voto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vote Submitted */}
        {hasVoted && selectedPlayer && (
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-6 text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-success" />
              <div>
                <h3 className="text-lg font-semibold text-success">Voto Registado!</h3>
                <p className="text-sm text-muted-foreground">
                  Votaste em <span className="font-semibold text-foreground">{selectedPlayer.name}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">A aguardar resultado...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
