import type { Player, GameSettings, Round, GameData, WordCategory } from "./game-types"
import { WORD_CATEGORIES } from "./game-types"

export class GameLogic {
  private gameData: GameData

  constructor(players: Player[], settings: GameSettings) {
    this.gameData = {
      state: "setup",
      players: [...players],
      settings: { ...settings },
      rounds: [],
    }
  }

  // Initialize game with word distribution
  initializeGame(): { baseWord: string; playersWithWords: Player[] } {
    const words = this.gameData.settings.customWord
      ? [this.gameData.settings.customWord]
      : WORD_CATEGORIES[this.gameData.settings.category as WordCategory]

    const baseWord = words[Math.floor(Math.random() * words.length)]
    const jorgeIndex = Math.floor(Math.random() * this.gameData.players.length)

    const playersWithWords = this.gameData.players.map((player, index) => ({
      ...player,
      isJorge: index === jorgeIndex,
    }))

    this.gameData.players = playersWithWords
    this.gameData.state = "reveal"

    return { baseWord, playersWithWords }
  }

  // Start a new round
  startRound(baseWord: string): Round {
    const activePlayers = this.gameData.players.filter((p) => !p.isEliminated)
    const speakingOrder = [...activePlayers].sort(() => Math.random() - 0.5).map((p) => p.id)

    const round: Round = {
      number: this.gameData.rounds.length + 1,
      speakingOrder,
      baseWord,
      votes: {},
    }

    this.gameData.rounds.push(round)
    this.gameData.currentRound = round
    this.gameData.state = "speaking"

    return round
  }

  // Process voting result
  processVote(votedPlayerId: string): {
    isCorrectGuess: boolean
    votedPlayer: Player
    jorgePlayer: Player
    isGameOver: boolean
    gameResult?: "jorge_wins" | "group_wins"
  } {
    const votedPlayer = this.gameData.players.find((p) => p.id === votedPlayerId)!
    const jorgePlayer = this.gameData.players.find((p) => p.isJorge)!
    const isCorrectGuess = votedPlayer.isJorge

    if (isCorrectGuess) {
      // Group wins - game over
      this.gameData.state = "gameOver"
      return {
        isCorrectGuess: true,
        votedPlayer,
        jorgePlayer,
        isGameOver: true,
        gameResult: "group_wins",
      }
    } else {
      // Wrong guess - eliminate voted player
      votedPlayer.isEliminated = true
      const remainingPlayers = this.gameData.players.filter((p) => !p.isEliminated)

      if (remainingPlayers.length <= 2) {
        // Jorge wins - game over
        this.gameData.state = "gameOver"
        return {
          isCorrectGuess: false,
          votedPlayer,
          jorgePlayer,
          isGameOver: true,
          gameResult: "jorge_wins",
        }
      } else {
        // Continue to next round
        this.gameData.state = "roundResult"
        return {
          isCorrectGuess: false,
          votedPlayer,
          jorgePlayer,
          isGameOver: false,
        }
      }
    }
  }

  // Get current game state
  getGameData(): GameData {
    return { ...this.gameData }
  }

  // Get active players
  getActivePlayers(): Player[] {
    return this.gameData.players.filter((p) => !p.isEliminated)
  }

  // Get current round
  getCurrentRound(): Round | undefined {
    return this.gameData.currentRound
  }

  // Reset game
  reset(): void {
    this.gameData.state = "idle"
    this.gameData.players.forEach((player) => {
      player.isEliminated = false
      player.isJorge = false
    })
    this.gameData.rounds = []
    this.gameData.currentRound = undefined
  }

  // Save game state to localStorage
  saveToStorage(): void {
    try {
      localStorage.setItem("jorge-game-state", JSON.stringify(this.gameData))
    } catch (error) {
      console.warn("Failed to save game state:", error)
    }
  }

  // Load game state from localStorage
  static loadFromStorage(): GameLogic | null {
    try {
      const saved = localStorage.getItem("jorge-game-state")
      if (saved) {
        const gameData: GameData = JSON.parse(saved)
        const logic = new GameLogic([], { turnSeconds: 60, discussionSeconds: 120, category: "Geral", sounds: true })
        logic.gameData = gameData
        return logic
      }
    } catch (error) {
      console.warn("Failed to load game state:", error)
    }
    return null
  }

  // Clear saved game
  static clearStorage(): void {
    try {
      localStorage.removeItem("jorge-game-state")
    } catch (error) {
      console.warn("Failed to clear game state:", error)
    }
  }
}
