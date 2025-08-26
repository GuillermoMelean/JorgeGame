"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, ArrowRight } from "lucide-react"
import type { Player, GameSettings } from "@/lib/game-types"
import { WORD_CATEGORIES } from "@/lib/game-types"

interface RevealWordsScreenProps {
  players: Player[]
  settings: GameSettings
  onBack: () => void
  onStartGame: (playersWithWords: Player[], baseWord: string) => void
}

export function RevealWordsScreen({ players, settings, onBack, onStartGame }: RevealWordsScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [wordRevealed, setWordRevealed] = useState(false)
  const [baseWord, setBaseWord] = useState("")
  const [playersWithWords, setPlayersWithWords] = useState<Player[]>([])

  useEffect(() => {
    const uniq = (arr: readonly string[]) =>
      Array.from(new Map(arr.map(w => [w.trim().toLocaleLowerCase("pt-PT"), w.trim()])).values())

    const ALL_WORDS: string[] = uniq(Object.values(WORD_CATEGORIES).flat())

    const words =
      settings.customWord?.trim()
        ? [settings.customWord.trim()]
        : (settings.category === "Geral"
          ? ALL_WORDS
          : (WORD_CATEGORIES[settings.category as keyof typeof WORD_CATEGORIES] ?? ALL_WORDS))

    const selectedWord = words[Math.floor(Math.random() * words.length)]
    const jorgeIndex = Math.floor(Math.random() * players.length)

    const updatedPlayers = players.map((player, index) => ({
      ...player,
      isJorge: index === jorgeIndex,
    }))

    setBaseWord(selectedWord)
    setPlayersWithWords(updatedPlayers)
  }, [players, settings])

  const currentPlayer = playersWithWords[currentPlayerIndex]
  const isLastPlayer = currentPlayerIndex === playersWithWords.length - 1
  const wordToShow = currentPlayer?.isJorge ? "jorge" : baseWord

  const handleRevealWord = () => {
    setWordRevealed(true)
  }

  const handleHideWord = () => {
    setWordRevealed(false)
  }

  const handleNextPlayer = () => {
    if (isLastPlayer) {
      onStartGame(playersWithWords, baseWord)
    } else {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setWordRevealed(false)
    }
  }

  if (!currentPlayer) return null

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Revelar Palavras</h1>
            <p className="text-sm text-muted-foreground">
              Jogador {currentPlayerIndex + 1} de {playersWithWords.length}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex space-x-2">
          {playersWithWords.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${index < currentPlayerIndex ? "bg-primary" : index === currentPlayerIndex ? "bg-primary/50" : "bg-muted"
                }`}
            />
          ))}
        </div>

        {/* Current Player */}
        <Card className="border-primary/20">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{currentPlayer.name[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{currentPlayer.name}</h2>
              <p className="text-muted-foreground">veja a sua palavra</p>
            </div>
          </CardContent>
        </Card>

        {/* Word Reveal Section */}
        <div className="space-y-4">
          {!wordRevealed ? (
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-8 text-center space-y-4">
                <Eye className="w-12 h-12 mx-auto text-accent" />
                <div>
                  <h3 className="text-lg font-semibold">Pronto para ver?</h3>
                  <p className="text-sm text-muted-foreground">Esconde o ecrã dos outros 😉</p>
                </div>
                <Button size="lg" className="w-full h-12 rounded-2xl" onClick={handleRevealWord}>
                  Ver Palavra
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">A sua palavra é:</p>
                  <div className="text-4xl font-bold text-primary bg-background/50 rounded-2xl py-4 px-6">
                    {wordToShow}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 rounded-xl bg-transparent"
                    onClick={handleHideWord}
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Ocultar
                  </Button>
                  <Button size="lg" className="flex-1 rounded-xl" onClick={handleNextPlayer} disabled={!wordRevealed}>
                    {isLastPlayer ? "Iniciar Jogo" : "Próximo Jogador"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Certifica-te que os outros jogadores não conseguem ver o ecrã</p>
        </div>
      </div>
    </div>
  )
}
