"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Crown, Users, RotateCcw, Home } from "lucide-react"
import type { Player } from "@/lib/game-types"

interface GameEndScreenProps {
  players: Player[]
  jorgePlayer: Player
  gameResult: "jorge_wins" | "group_wins"
  totalRounds: number
  onNewGame: () => void
  onBackToHome: () => void
}

export function GameEndScreen({
  players,
  jorgePlayer,
  gameResult,
  totalRounds,
  onNewGame,
  onBackToHome,
}: GameEndScreenProps) {
  const isJorgeWin = gameResult === "jorge_wins"
  const survivingPlayers = players.filter((p) => !p.isEliminated)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="text-center pt-8 space-y-2">
          <h1 className="text-3xl font-bold">Fim de Jogo</h1>
          <Badge variant="outline" className="rounded-full">
            {totalRounds} {totalRounds === 1 ? "Ronda" : "Rondas"}
          </Badge>
        </div>

        {/* Winner Announcement */}
        <Card
          className={`border-2 ${isJorgeWin ? "border-accent bg-accent/5" : "border-success bg-success/5"
            } relative overflow-hidden`}
        >
          <CardContent className="p-8 text-center space-y-6">
            {/* Confetti Background Effect */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${isJorgeWin ? "bg-accent" : "bg-success"} animate-pulse`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {isJorgeWin ? (
                <>
                  <Crown className="w-20 h-20 mx-auto mb-4 text-accent" />
                  <h2 className="text-3xl font-bold mb-2 text-accent">Vitória do Jorge!</h2>
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">{jorgePlayer.name[0]?.toUpperCase()}</span>
                    </div>
                    <p className="text-xl font-semibold">{jorgePlayer.name}</p>
                    <p className="text-muted-foreground">conseguiu enganar toda a gente!</p>
                  </div>
                </>
              ) : (
                <>
                  <Trophy className="w-20 h-20 mx-auto text-success mb-4" />
                  <h2 className="text-3xl font-bold text-success mb-2">Vitória do Grupo!</h2>
                  <div className="space-y-2">
                    <Users className="w-12 h-12 mx-auto text-success" />
                    <p className="text-xl font-semibold">Parabéns!</p>
                    <p className="text-muted-foreground">Descobriram que o Jorge era {jorgePlayer.name}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Summary */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Resumo do Jogo</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total de Rondas:</span>
                <Badge variant="outline">{totalRounds}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">O Jorge era:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-medium">
                    {jorgePlayer.name[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium">{jorgePlayer.name}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Jogadores Finais:</span>
                <span className="font-medium">{survivingPlayers.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Players List */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Classificação Final</h3>
            <div className="space-y-2">
              {/* Winners first */}
              {(isJorgeWin ? [jorgePlayer] : survivingPlayers.filter((p) => !p.isJorge)).map((player) => (
                <div key={player.id} className="flex items-center space-x-3 p-2 rounded-lg bg-success/10">
                  <div className="w-8 h-8 rounded-full bg-success/20 border-2 border-success/30 flex items-center justify-center text-sm font-medium">
                    {player.name[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium flex-1">{player.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {isJorgeWin && player.isJorge ? "Vencedor" : "Vencedor"}
                  </Badge>
                </div>
              ))}

              {/* Eliminated players */}
              {players
                .filter((p) => p.isEliminated)
                .map((player) => (
                  <div key={player.id} className="flex items-center space-x-3 p-2 rounded-lg opacity-60">
                    <div className="w-8 h-8 rounded-full bg-muted/20 border-2 border-muted/30 flex items-center justify-center text-sm font-medium">
                      {player.name[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium flex-1 line-through">{player.name}</span>
                    <Badge variant="outline" className="text-xs">
                      Eliminado
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-2xl" onClick={onNewGame}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Novo Jogo
          </Button>
          <Button variant="outline" size="lg" className="w-full h-12 rounded-xl bg-transparent" onClick={onBackToHome}>
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  )
}
