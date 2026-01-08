/**
 * CreateRoomModal Component - F003
 * [INPUT]: onClose, onRoomCreated
 * [OUTPUT]: Modal for creating a new game room
 * [POS]: UI Layer - Room Components
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Loader2, Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createRoom } from "@/services/roomService"

export function CreateRoomModal({ isOpen, onClose, onRoomCreated }) {
  const [hostName, setHostName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")

  const handleCreate = async () => {
    if (!hostName.trim()) {
      setError("Please enter your name")
      return
    }

    if (hostName.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    setIsCreating(true)
    setError("")

    const result = await createRoom(hostName.trim())

    if (result.success) {
      onRoomCreated(result.room, result.playerId)
      onClose()
    } else {
      setError(result.error || "Failed to create room")
    }

    setIsCreating(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isCreating) {
      handleCreate()
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Create Room</h2>
                    <p className="text-xs text-muted-foreground">Host a new game session</p>
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
                  <Label htmlFor="hostName" className="text-sm font-medium">
                    Your Codename
                  </Label>
                  <Input
                    id="hostName"
                    placeholder="Enter your name..."
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-12 rounded-xl bg-background/50"
                    maxLength={20}
                    disabled={isCreating}
                  />
                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}
                </div>

                <div className="rounded-xl bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-primary">As Host</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        You'll be able to configure game settings and invite players to join your room.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90"
                  disabled={isCreating || !hostName.trim()}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Create Room
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
