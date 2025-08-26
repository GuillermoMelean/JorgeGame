"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, RotateCcw } from "lucide-react"
import { GameSetupScreen } from "@/components/game-setup-screen"
import { GameRoundScreen } from "@/components/game-round-screen"
import { VotingScreen } from "@/components/voting-screen"
import { RoundResultScreen } from "@/components/round-result-screen"
import { GameEndScreen } from "@/components/game-end-screen"
import type { Player, GameSettings } from "@/lib/game-types"
import { GameLogic } from "@/lib/game-logic"

type Screen = "home" | "setup" | "round" | "voting" | "roundResult" | "gameEnd"

export function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [gameLogic, setGameLogic] = useState<GameLogic | null>(null)
  const [gameState, setGameState] = useState<{
    players: Player[]
    settings: GameSettings
    baseWord: string
    roundNumber: number
    votedPlayerId?: string
    gameResult?: "jorge_wins" | "group_wins"
  } | null>(null)
  const [lastGame, setLastGame] = useState<{ players: string[]; date: string } | null>(null)

  // Load saved game on mount
  useEffect(() => {
    const savedLogic = GameLogic.loadFromStorage()
    if (savedLogic) {
      const data = savedLogic.getGameData()
      if (data.state !== "idle" && data.players.length > 0) {
        setLastGame({
          players: data.players.map((p) => p.name),
          date: new Date().toISOString(),
        })
      }
    }
  }, [])

  const handleNewGame = () => {
    setCurrentScreen("setup")
    setGameLogic(null)
    setGameState(null)
  }

  const handleBackToHome = () => {
    setCurrentScreen("home")
    if (gameLogic) {
      gameLogic.saveToStorage()
    }
  }

  const handleStartRound = (players: Player[], settings: GameSettings, baseWord: string) => {
    const logic = new GameLogic(players, settings)
    const round = logic.startRound(baseWord)

    setGameLogic(logic)
    setGameState({
      players: logic.getGameData().players,
      settings,
      baseWord,
      roundNumber: round.number,
    })
    setCurrentScreen("round")
    logic.saveToStorage()
  }

  const handleStartVoting = () => {
    if (!gameLogic || !gameState) return

    setCurrentScreen("voting")
    gameLogic.saveToStorage()
  }

  const handleVoteComplete = (votedPlayerId: string) => {
    if (!gameLogic || !gameState) return

    const result = gameLogic.processVote(votedPlayerId)
    const updatedGameData = gameLogic.getGameData()

    setGameState({
      ...gameState,
      players: updatedGameData.players,
      votedPlayerId,
      gameResult: result.gameResult,
    })

    if (result.isGameOver) {
      setCurrentScreen("gameEnd")
    } else {
      setCurrentScreen("roundResult")
    }

    gameLogic.saveToStorage()
  }

  const handleNextRound = () => {
    if (!gameLogic || !gameState) return

    const round = gameLogic.startRound(gameState.baseWord)
    setGameState({
      ...gameState,
      players: gameLogic.getGameData().players,
      roundNumber: round.number,
    })
    setCurrentScreen("round")
    gameLogic.saveToStorage()
  }

  const handleEndGame = () => {
    if (gameLogic) {
      GameLogic.clearStorage()
    }
    setCurrentScreen("home")
    setGameLogic(null)
    setGameState(null)
  }

  const handleContinueGame = () => {
    const savedLogic = GameLogic.loadFromStorage()
    if (savedLogic) {
      const data = savedLogic.getGameData()
      setGameLogic(savedLogic)
      setGameState({
        players: data.players,
        settings: data.settings,
        baseWord: data.currentRound?.baseWord || "",
        roundNumber: data.currentRound?.number || 1,
      })

      // Navigate to appropriate screen based on game state
      switch (data.state) {
        case "speaking":
        case "discussion":
          setCurrentScreen("round")
          break
        case "voting":
          setCurrentScreen("voting")
          break
        case "roundResult":
          setCurrentScreen("roundResult")
          break
        case "gameOver":
          setCurrentScreen("gameEnd")
          break
        default:
          setCurrentScreen("setup")
      }
    }
  }

  // Screen routing
  if (currentScreen === "setup") {
    return <GameSetupScreen onBack={handleBackToHome} onStartRound={handleStartRound} />
  }

  if (currentScreen === "round" && gameState && gameLogic) {
    return (
      <GameRoundScreen
        players={gameState.players}
        baseWord={gameState.baseWord}
        roundNumber={gameState.roundNumber}
        turnSeconds={gameState.settings.turnSeconds}
        discussionSeconds={gameState.settings.discussionSeconds}
        onBack={handleBackToHome}
        onStartVoting={handleStartVoting}
      />
    )
  }

  if (currentScreen === "voting" && gameState) {
    return (
      <VotingScreen
        players={gameState.players}
        roundNumber={gameState.roundNumber}
        onBack={handleBackToHome}
        onVoteComplete={handleVoteComplete}
      />
    )
  }

  if (currentScreen === "roundResult" && gameState && gameState.votedPlayerId) {
    const votedPlayer = gameState.players.find((p) => p.id === gameState.votedPlayerId)!
    const jorgePlayer = gameState.players.find((p) => p.isJorge)!
    const isCorrectGuess = votedPlayer.isJorge

    return (
      <RoundResultScreen
        players={gameState.players}
        votedPlayer={votedPlayer}
        jorgePlayer={jorgePlayer}
        roundNumber={gameState.roundNumber}
        isCorrectGuess={isCorrectGuess}
        onBack={handleBackToHome}
        onNextRound={handleNextRound}
        onEndGame={handleEndGame}
      />
    )
  }

  if (currentScreen === "gameEnd" && gameState && gameLogic) {
    const jorgePlayer = gameState.players.find((p) => p.isJorge)!
    const totalRounds = gameLogic.getGameData().rounds.length

    return (
      <GameEndScreen
        players={gameState.players}
        jorgePlayer={jorgePlayer}
        gameResult={gameState.gameResult!}
        totalRounds={totalRounds}
        onNewGame={handleNewGame}
        onBackToHome={handleEndGame}
      />
    )
  }

  // Home Screen
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-4xl font-bold text-primary">Jorge</h1>
          <p className="text-muted-foreground">O jogo de festa mais divertido</p>
        </div>

        {/* Main Actions */}
        <div className="space-y-4">
          <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-2xl" onClick={handleNewGame}>
            <Play className="mr-2 h-5 w-5" />
            Novo Jogo
          </Button>

          {/* Last Game Card */}
          {lastGame && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Último Jogo</CardTitle>
                <CardDescription className="text-xs">
                  {new Date(lastGame.date).toLocaleDateString("pt-PT")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {lastGame.players.slice(0, 3).map((player, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                      >
                        {player[0]}
                      </div>
                    ))}
                    {lastGame.players.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{lastGame.players.length - 3}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-transparent"
                    onClick={handleContinueGame}
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Continuar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Secondary Actions */}
        {/* <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl bg-transparent"
            onClick={() => { 
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Como Jogar
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-xl bg-transparent"
            onClick={() => { 
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Definições
          </Button>
        </div> */}

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-xs text-muted-foreground">Versão 1.0 • Feito com ❤️ por  <a target="_blank" href="https://github.com/GuillermoMelean">Guillermo Melean</a></p>
        </div>
      </div>
    </div>
  )
}
