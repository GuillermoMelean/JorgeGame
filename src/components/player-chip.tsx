"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Edit2, Check } from "lucide-react"
import type { Player } from "@/lib/game-types"

interface PlayerChipProps {
  player: Player
  onNameChange?: (name: string) => void
  onRemove?: () => void
  editable?: boolean
  showStatus?: boolean
}

export function PlayerChip({ player, onNameChange, onRemove, editable = false, showStatus = false }: PlayerChipProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(player.name)

  const handleSave = () => {
    if (editName.trim() && onNameChange) {
      onNameChange(editName.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(player.name)
    setIsEditing(false)
  }

  const getStatusBadge = () => {
    if (!showStatus) return null

    if (player.isEliminated) {
      return (
        <Badge variant="destructive" className="text-xs">
          Eliminado
        </Badge>
      )
    }

    return null
  }

  const getAvatarColor = () => {
    if (player.isEliminated) return "bg-muted text-muted-foreground"
    return "bg-primary/20 text-primary border-primary/30"
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-xl bg-card/50 border border-border/50">
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${getAvatarColor()}`}
      >
        {player.name[0]?.toUpperCase() || "?"}
      </div>

      {/* Name */}
      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") handleCancel()
              }}
              className="h-8 text-sm rounded-lg"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
              <Check className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${player.isEliminated ? "text-muted-foreground line-through" : ""}`}>
              {player.name}
            </span>
            {getStatusBadge()}
            {editable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Remove Button */}
      {onRemove && !isEditing && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
