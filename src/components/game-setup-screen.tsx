"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Users, Settings2, Eye } from "lucide-react"
import { type Player, type GameSettings, WORD_CATEGORIES } from "@/lib/game-types"
import { PlayerChip } from "@/components/player-chip"
import { RevealWordsScreen } from "@/components/reveal-words-screen"

interface GameSetupScreenProps {
  onBack: () => void
  onStartRound: (players: Player[], settings: GameSettings, baseWord: string) => void
}

export function GameSetupScreen({ onBack, onStartRound }: GameSetupScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<"setup" | "reveal">("setup")
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [settings, setSettings] = useState<GameSettings>({
    turnSeconds: 60,
    discussionSeconds: 120,
    category: "Geral",
    sounds: true,
  })

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.some((p) => p.name === newPlayerName.trim())) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        isEliminated: false,
        isJorge: false,
      }
      setPlayers([...players, newPlayer])
      setNewPlayerName("")
    }
  }

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id))
  }

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  const handleRevealWords = () => {
    setCurrentScreen("reveal")
  }

  const handleBackToSetup = () => {
    setCurrentScreen("setup")
  }

  const handleStartGame = (playersWithWords: Player[], baseWord: string) => {
    onStartRound(playersWithWords, settings, baseWord)
  }

  const canProceed = players.length >= 2

  if (currentScreen === "reveal") {
    return (
      <RevealWordsScreen
        players={players}
        settings={settings}
        onBack={handleBackToSetup}
        onStartGame={handleStartGame}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Configurar Jogo</h1>
            <p className="text-sm text-muted-foreground">Adiciona jogadores e define as regras</p>
          </div>
        </div>

        {/* Players Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5" />
              Jogadores ({players.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Player Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Nome do jogador"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                className="rounded-xl"
              />
              <Button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.some((p) => p.name === newPlayerName.trim())}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Validation Messages */}
            {newPlayerName.trim() && players.some((p) => p.name === newPlayerName.trim()) && (
              <p className="text-sm text-destructive">Nome já utilizado.</p>
            )}
            {players.length < 2 && <p className="text-sm text-muted-foreground">Adiciona pelo menos 2 jogadores.</p>}
            {players.length >= 2 && players.length < 3 && (
              <p className="text-sm text-warning">Recomendado: 3 ou mais jogadores para mais diversão.</p>
            )}

            {/* Players List */}
            <div className="space-y-2">
              {players.map((player) => (
                <PlayerChip
                  key={player.id}
                  player={player}
                  onNameChange={(name) => updatePlayerName(player.id, name)}
                  onRemove={() => removePlayer(player.id)}
                  editable
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Settings2 className="mr-2 h-5 w-5" />
              Opções da Partida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Turn Duration */}
            <div className="space-y-2">
              <Label>Duração do Turno</Label>
              <div className="flex space-x-2">
                {[30, 45, 60, 90].map((seconds) => (
                  <Button
                    key={seconds}
                    variant={settings.turnSeconds === seconds ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings({ ...settings, turnSeconds: seconds })}
                    className="rounded-xl"
                  >
                    {seconds}s
                  </Button>
                ))}
              </div>
            </div>

            {/* Discussion Duration */}
            <div className="space-y-2">
              <Label>Duração da Discussão</Label>
              <div className="flex space-x-2">
                {[60, 120, 180].map((seconds) => (
                  <Button
                    key={seconds}
                    variant={settings.discussionSeconds === seconds ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSettings({ ...settings, discussionSeconds: seconds })}
                    className="rounded-xl"
                  >
                    {seconds / 60}min
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Categoria de Palavras</Label>
              <Select
                value={settings.category}
                onValueChange={(value) => setSettings({ ...settings, category: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(WORD_CATEGORIES).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Word */}
            {settings.category === "Personalizada" && (
              <div className="space-y-2">
                <Label>Palavra Personalizada</Label>
                <Input
                  placeholder="Insere uma palavra"
                  value={settings.customWord || ""}
                  onChange={(e) => setSettings({ ...settings, customWord: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            )}

            {/* Sounds Toggle */}
            <div className="flex items-center justify-between">
              <Label>Sons e Haptics</Label>
              <Switch checked={settings.sounds} onCheckedChange={(sounds) => setSettings({ ...settings, sounds })} />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-2xl"
            disabled={!canProceed}
            onClick={handleRevealWords}
          >
            <Eye className="mr-2 h-5 w-5" />
            Revelar Palavras
          </Button>
          <Button variant="outline" size="lg" className="w-full h-12 rounded-xl bg-transparent" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}
