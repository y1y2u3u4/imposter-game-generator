/**
 * PlayerCard Component
 * [INPUT]: player (object), isRevealed (boolean), onReveal (function)
 * [OUTPUT]: Flip card showing player role and word
 * [POS]: UI Layer - Game Components
 */

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Skull, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/motion"

export function PlayerCard({ player, isRevealed, onReveal }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    if (!isRevealed) {
      setIsFlipped(!isFlipped)
      if (!isFlipped) {
        onReveal?.()
      }
    }
  }

  const isImposter = player.role === "imposter"

  return (
    <motion.div
      className="flip-card w-full aspect-[3/4] cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      <div
        className={cn(
          "flip-card-inner relative w-full h-full",
          isFlipped && "flipped"
        )}
      >
        {/* Front - Hidden State */}
        <div
          className={cn(
            "flip-card-front rounded-2xl p-6 flex flex-col items-center justify-center",
            "bg-gradient-to-br from-card to-muted border border-border",
            "shadow-lg hover:shadow-xl transition-shadow"
          )}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Player {player.number}
          </span>
          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Tap to reveal</span>
          </div>
        </div>

        {/* Back - Revealed State */}
        <motion.div
          className={cn(
            "flip-card-back rounded-2xl p-6 flex flex-col items-center justify-center",
            "border shadow-lg",
            isImposter
              ? "bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/50"
              : "bg-gradient-to-br from-success/20 to-success/10 border-success/50"
          )}
          animate={
            isImposter && isFlipped
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                    "0 0 20px 4px rgba(239, 68, 68, 0.3)",
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                  ],
                }
              : {}
          }
          transition={
            isImposter
              ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        >
          {/* Role Icon */}
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4",
              isImposter ? "bg-destructive/30" : "bg-success/30"
            )}
          >
            {isImposter ? (
              <Skull className="w-8 h-8 text-destructive" />
            ) : (
              <User className="w-8 h-8 text-success" />
            )}
          </div>

          {/* Player Number */}
          <span className="text-lg font-medium text-muted-foreground mb-2">
            Player {player.number}
          </span>

          {/* Role Badge */}
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold mb-4",
              isImposter
                ? "bg-destructive text-destructive-foreground"
                : "bg-success text-success-foreground"
            )}
          >
            {isImposter ? "IMPOSTER" : "CIVILIAN"}
          </span>

          {/* Secret Word */}
          <div
            className={cn(
              "text-2xl font-bold text-center",
              isImposter ? "text-destructive" : "text-success"
            )}
          >
            {player.word}
          </div>

          {/* Hide Hint */}
          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <EyeOff className="w-4 h-4" />
            <span className="text-sm">Tap to hide</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
