/**
 * PlayerCard Component
 * [INPUT]: player (object), isRevealed (boolean), onReveal (function)
 * [OUTPUT]: Holographic flip card showing player role
 * [POS]: UI Layer - Game Components
 */

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Skull, User, Fingerprint } from "lucide-react"
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
      className="flip-card w-full aspect-[4/5] cursor-pointer group"
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
            "flip-card-front rounded-2xl flex flex-col items-center justify-between p-6",
            "bg-gradient-to-b from-card via-card/80 to-card/50 border border-white/5",
            "shadow-lg backdrop-blur-sm"
          )}
        >
          {/* Top ID */}
          <div className="w-full flex justify-between items-center opacity-50 text-xs font-mono">
            <span>ID-0{player.number}</span>
            <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <Fingerprint className="w-10 h-10 text-primary/70 group-hover:text-primary transition-colors" />
              </div>
            </div>
            <span className="font-bold tracking-widest text-sm text-primary uppercase">Tap Declassify</span>
          </div>

          {/* Bottom Bar */}
          <div className="w-12 h-1 rounded-full bg-white/10" />
        </div>

        {/* Back - Revealed State */}
        <div
          className={cn(
            "flip-card-back rounded-2xl p-6 flex flex-col items-center justify-center",
            "border shadow-[0_0_30px_-5px]",
            isImposter
              ? "bg-destructive/10 border-destructive play-shadow-destructive"
              : "bg-success/10 border-success shadow-success/20"
          )}
          style={{
            boxShadow: isImposter ? 'inset 0 0 20px 0 var(--destructive)' : 'inset 0 0 20px 0 var(--success)'
          }}
        >
          {/* Role Icon */}
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4",
              isImposter
                ? "border-destructive bg-destructive/20 text-destructive"
                : "border-success bg-success/20 text-success"
            )}
          >
            {isImposter ? (
              <Skull className="w-10 h-10" />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>

          {/* Role Text */}
          <span
            className={cn(
              "text-lg font-black tracking-widest mb-1",
              isImposter ? "text-destructive" : "text-success"
            )}
          >
            {isImposter ? "IMPOSTER" : "CIVILIAN"}
          </span>

          {/* Secret Word */}
          <div className="mt-4 mb-8 text-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Secret Key</span>
            <div className={cn(
              "text-3xl font-bold px-4 py-2 rounded-lg bg-black/40 border border-white/5",
              isImposter ? "text-destructive" : "text-success"
            )}>
              {player.word}
            </div>
          </div>

          {/* Hide Hint */}
          <div className="flex items-center gap-2 text-muted-foreground opacity-60 text-xs uppercase tracking-wider">
            <EyeOff className="w-3 h-3" />
            Tap to Conceal
          </div>
        </div>
      </div>
    </motion.div>
  )
}

