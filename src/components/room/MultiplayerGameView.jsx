/**
 * MultiplayerGameView Component - F005/F007/F008
 * [INPUT]: room, playerId
 * [OUTPUT]: Player's assigned card view for multiplayer mode with AI images
 * [POS]: UI Layer - Room Components
 */

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Shield, Skull, Check, Users, ImageOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { springs } from "@/lib/motion"
import { getPlayerAssignment, subscribeToRoom } from "@/services/roomService"
import { generateImageWithCache } from "@/services/imageGeneration"

export function MultiplayerGameView({ room: initialRoom, playerId, onEndGame }) {
  const [room, setRoom] = useState(initialRoom)
  const [isRevealed, setIsRevealed] = useState(false)
  const [hasViewed, setHasViewed] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Subscribe to room updates
  useEffect(() => {
    if (!room?.room_code) return

    const unsubscribe = subscribeToRoom(room.room_code, (newData, eventType) => {
      if (eventType === 'DELETE') {
        onEndGame?.()
        return
      }
      setRoom(newData)
    })

    return () => unsubscribe()
  }, [room?.room_code, onEndGame])

  // Update room when prop changes
  useEffect(() => {
    setRoom(initialRoom)
  }, [initialRoom])

  // Get this player's assignment
  const assignment = getPlayerAssignment(room, playerId)
  const player = room?.players?.find(p => p.id === playerId)
  const isImposter = assignment?.role === 'imposter'
  const word = isImposter ? room?.imposter_word : room?.civilian_word

  // Check if AI images are enabled
  const enableImages = room?.settings?.enableImages !== false
  const quirkiness = room?.settings?.quirkiness || 3

  // Generate AI image when card is revealed
  useEffect(() => {
    if (!isRevealed || !enableImages || !word || imageUrl) return

    const generateImage = async () => {
      setIsLoadingImage(true)
      setImageError(false)
      try {
        const result = await generateImageWithCache(word, quirkiness)
        if (result.success && result.imageUrl) {
          setImageUrl(result.imageUrl)
        } else {
          setImageError(true)
        }
      } catch (error) {
        console.error('Failed to generate image:', error)
        setImageError(true)
      } finally {
        setIsLoadingImage(false)
      }
    }

    generateImage()
  }, [isRevealed, enableImages, word, quirkiness, imageUrl])

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const handleConfirm = () => {
    setIsRevealed(false)
    setHasViewed(true)
  }

  // Count how many players have viewed
  const viewedCount = room?.assignments?.filter(a => a.viewed).length || 0
  const totalPlayers = room?.players?.length || 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                isImposter ? "bg-destructive/20" : "bg-primary/20"
              )}>
                {isImposter ? (
                  <Skull className="h-5 w-5 text-destructive" />
                ) : (
                  <Shield className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="font-bold">{player?.name || "Player"}</div>
                <div className="text-xs text-muted-foreground">
                  Room: {room?.room_code}
                </div>
              </div>
            </div>

            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {viewedCount}/{totalPlayers} viewed
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {!hasViewed ? (
              /* Card to reveal */
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                {/* Card container */}
                <div
                  className={cn(
                    "aspect-[3/4] rounded-3xl overflow-hidden relative cursor-pointer",
                    "border-2 transition-all duration-300",
                    isRevealed
                      ? (isImposter ? "border-destructive/50 bg-destructive/10" : "border-primary/50 bg-primary/10")
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                  )}
                  onClick={!isRevealed ? handleReveal : undefined}
                >
                  <AnimatePresence mode="wait">
                    {!isRevealed ? (
                      /* Hidden state */
                      <motion.div
                        key="hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-6"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4"
                        >
                          <Eye className="w-10 h-10 text-white/60" />
                        </motion.div>
                        <p className="text-lg font-medium text-center mb-2">
                          Tap to Reveal
                        </p>
                        <p className="text-sm text-muted-foreground text-center">
                          Your secret identity awaits...
                        </p>
                      </motion.div>
                    ) : (
                      /* Revealed state */
                      <motion.div
                        key="revealed"
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        transition={springs.bouncy}
                        className="absolute inset-0 flex flex-col items-center justify-center p-6"
                      >
                        {/* Role badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, ...springs.bouncy }}
                        >
                          <Badge
                            className={cn(
                              "mb-4 px-4 py-1 text-sm font-bold",
                              isImposter
                                ? "bg-destructive text-destructive-foreground"
                                : "bg-primary text-primary-foreground"
                            )}
                          >
                            {isImposter ? "🕵️ IMPOSTER" : "👤 CIVILIAN"}
                          </Badge>
                        </motion.div>

                        {/* AI Generated Image */}
                        {enableImages && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.25, ...springs.gentle }}
                            className={cn(
                              "w-24 h-24 rounded-xl overflow-hidden mb-3 border-2 flex items-center justify-center",
                              isImposter ? "border-destructive/50 bg-destructive/10" : "border-primary/50 bg-primary/10"
                            )}
                          >
                            {isLoadingImage ? (
                              <Loader2 className={cn(
                                "w-8 h-8 animate-spin",
                                isImposter ? "text-destructive" : "text-primary"
                              )} />
                            ) : imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={word}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                              />
                            ) : imageError ? (
                              <ImageOff className="w-8 h-8 text-muted-foreground" />
                            ) : null}
                          </motion.div>
                        )}

                        {/* Word */}
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, ...springs.gentle }}
                          className="text-center mb-4"
                        >
                          <p className="text-sm text-muted-foreground mb-2">Your word is:</p>
                          <h2 className={cn(
                            "font-black tracking-tight",
                            enableImages ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
                          )}>
                            {word}
                          </h2>
                        </motion.div>

                        {/* Hint for imposter */}
                        {isImposter && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs text-muted-foreground text-center max-w-[200px]"
                          >
                            Blend in! Others have a different word. Try to figure it out!
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Confirm button */}
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={handleConfirm}
                      className={cn(
                        "w-full h-14 rounded-xl text-lg font-bold",
                        isImposter
                          ? "bg-destructive hover:bg-destructive/90"
                          : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      I Remember
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* After viewing - waiting screen */
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className={cn(
                  "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
                  isImposter ? "bg-destructive/20" : "bg-primary/20"
                )}>
                  <Check className={cn(
                    "w-12 h-12",
                    isImposter ? "text-destructive" : "text-primary"
                  )} />
                </div>

                <h2 className="text-2xl font-bold mb-2">Card Memorized!</h2>
                <p className="text-muted-foreground mb-6">
                  You are a <span className={cn(
                    "font-bold",
                    isImposter ? "text-destructive" : "text-primary"
                  )}>{isImposter ? "IMPOSTER" : "CIVILIAN"}</span>
                </p>

                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  {/* Show image if available */}
                  {enableImages && imageUrl && (
                    <div className={cn(
                      "w-16 h-16 rounded-lg overflow-hidden mx-auto mb-3 border-2",
                      isImposter ? "border-destructive/50" : "border-primary/50"
                    )}>
                      <img
                        src={imageUrl}
                        alt={word}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-1">Your word:</p>
                  <p className="text-xl font-bold">{word}</p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Wait for all players to view their cards, then start the discussion!
                </p>

                {/* View again button */}
                <Button
                  variant="ghost"
                  onClick={() => setHasViewed(false)}
                  className="mt-4"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Card Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
