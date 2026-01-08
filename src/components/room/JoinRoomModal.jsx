/**
 * JoinRoomModal Component - F004
 * [INPUT]: onClose, onRoomJoined, initialCode
 * [OUTPUT]: Modal for joining an existing room
 * [POS]: UI Layer - Room Components
 */

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, LogIn, Loader2, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { joinRoom } from "@/services/roomService"

export function JoinRoomModal({ isOpen, onClose, onRoomJoined, initialCode = "" }) {
  const [roomCode, setRoomCode] = useState(initialCode)
  const [playerName, setPlayerName] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState("")

  // Update room code if initialCode changes
  useEffect(() => {
    if (initialCode) {
      setRoomCode(initialCode.toUpperCase())
    }
  }, [initialCode])

  const handleRoomCodeChange = (e) => {
    // Only allow alphanumeric and convert to uppercase
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    setRoomCode(value.slice(0, 6))
  }

  const handleJoin = async () => {
    if (!roomCode.trim() || roomCode.length < 6) {
      setError("Please enter a valid 6-character room code")
      return
    }

    if (!playerName.trim()) {
      setError("Please enter your name")
      return
    }

    if (playerName.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    setIsJoining(true)
    setError("")

    const result = await joinRoom(roomCode.trim(), playerName.trim())

    if (result.success) {
      onRoomJoined(result.room, result.playerId)
      onClose()
    } else {
      setError(result.error || "Failed to join room")
    }

    setIsJoining(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isJoining) {
      handleJoin()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-2xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                    <LogIn className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Join Room</h2>
                    <p className="text-xs text-muted-foreground">Enter a room code to join</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomCode" className="text-sm font-medium">
                    Room Code
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="roomCode"
                      placeholder="XXXXXX"
                      value={roomCode}
                      onChange={handleRoomCodeChange}
                      onKeyDown={handleKeyDown}
                      className="h-12 rounded-xl bg-background/50 pl-10 font-mono text-lg tracking-widest uppercase"
                      maxLength={6}
                      disabled={isJoining}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playerName" className="text-sm font-medium">
                    Your Codename
                  </Label>
                  <Input
                    id="playerName"
                    placeholder="Enter your name..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-12 rounded-xl bg-background/50"
                    maxLength={20}
                    disabled={isJoining}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl"
                  disabled={isJoining}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleJoin}
                  className="flex-1 h-11 rounded-xl bg-accent hover:bg-accent/90"
                  disabled={isJoining || roomCode.length < 6 || !playerName.trim()}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Join Room
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
