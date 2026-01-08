/**
 * RoomLobby Component - F003/F004/F005
 * [INPUT]: room, playerId, isHost, onLeave, onStartGame
 * [OUTPUT]: Waiting room with player list and game controls
 * [POS]: UI Layer - Room Components
 */

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Crown, UserPlus, Settings, Play, LogOut, Loader2,
  Copy, Check, Share2, Wifi, WifiOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { springs } from "@/lib/motion"
import { subscribeToRoom } from "@/services/roomService"
import { InviteModal } from "./InviteModal"

export function RoomLobby({
  room: initialRoom,
  playerId,
  isHost,
  onLeave,
  onStartGame,
  onSettingsClick,
  onGameStarted  // F005: Callback when game_state changes to 'playing'
}) {
  const [room, setRoom] = useState(initialRoom)
  const [showInvite, setShowInvite] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [copied, setCopied] = useState(false)

  const players = room?.players || []
  const settings = room?.settings || {}
  const maxPlayers = settings.playerCount || 6
  const canStart = players.length >= 3 && isHost

  // Subscribe to room updates
  useEffect(() => {
    if (!room?.room_code) return

    const unsubscribe = subscribeToRoom(room.room_code, (newData, eventType) => {
      if (eventType === 'DELETE') {
        // Room was deleted
        onLeave?.()
        return
      }
      setRoom(newData)
      setIsConnected(true)

      // F005: Check if game has started and notify parent
      if (newData.game_state === 'playing' && onGameStarted) {
        onGameStarted(newData)
      }
    })

    // Heartbeat check
    const heartbeat = setInterval(() => {
      // Could add ping logic here
    }, 30000)

    return () => {
      unsubscribe()
      clearInterval(heartbeat)
    }
  }, [room?.room_code, onLeave])

  // Update room when prop changes
  useEffect(() => {
    setRoom(initialRoom)
  }, [initialRoom])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room?.room_code || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleStartGame = () => {
    if (canStart && onStartGame) {
      onStartGame(room)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Room</span>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 font-mono text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
                  >
                    {room?.room_code}
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3 text-success" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-destructive" />
                      <span>Reconnecting...</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLeave}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Leave
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Player Count */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Waiting Room</h2>
            <p className="text-sm text-muted-foreground">
              {players.length} / {maxPlayers} players joined
            </p>
          </div>

          <Button
            onClick={() => setShowInvite(true)}
            className="rounded-xl bg-primary hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(players.length / maxPlayers) * 100}%` }}
              transition={springs.gentle}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            {players.length < 3
              ? `Need ${3 - players.length} more player${3 - players.length > 1 ? 's' : ''} to start`
              : `Ready to start! Waiting for host...`}
          </p>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ ...springs.bouncy, delay: index * 0.05 }}
                className={cn(
                  "relative rounded-xl p-4 border transition-colors",
                  player.id === playerId
                    ? "bg-primary/10 border-primary/30"
                    : "bg-white/5 border-white/10"
                )}
              >
                {player.isHost && (
                  <div className="absolute -top-2 -right-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 shadow-lg">
                      <Crown className="h-3 w-3 text-amber-950" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2",
                    player.id === playerId
                      ? "bg-primary/20 text-primary"
                      : "bg-white/10 text-white"
                  )}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-sm truncate max-w-full">
                    {player.name}
                    {player.id === playerId && (
                      <span className="text-xs text-muted-foreground ml-1">(You)</span>
                    )}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: maxPlayers - players.length }).map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl p-4 border border-dashed border-white/10 bg-white/[0.02]"
              >
                <div className="flex flex-col items-center text-center opacity-30">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <span className="text-xs">Waiting...</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Game Settings Summary */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Game Settings</h3>
            {isHost && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSettingsClick}
                className="h-7 text-xs"
              >
                <Settings className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="capitalize">{settings.category || 'Animals'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Imposters</span>
              <span>{settings.imposterCount || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode</span>
              <span className="capitalize">{settings.gameMode || 'Sequential'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Images</span>
              <span>{settings.enableImages ? 'On' : 'Off'}</span>
            </div>
          </div>
        </div>

        {/* Start Button (Host Only) */}
        {isHost && (
          <Button
            onClick={handleStartGame}
            disabled={!canStart}
            className={cn(
              "w-full h-14 rounded-xl text-lg font-bold transition-all",
              canStart
                ? "bg-gradient-to-r from-primary to-accent hover:opacity-90"
                : "bg-white/10"
            )}
          >
            {canStart ? (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Game
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Waiting for Players...
              </>
            )}
          </Button>
        )}

        {!isHost && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Waiting for host to start the game...
            </p>
          </div>
        )}
      </main>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        room={room}
      />
    </div>
  )
}
