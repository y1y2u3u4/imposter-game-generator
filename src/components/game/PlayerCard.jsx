/**
 * PlayerCard Component - F001/F002/F009/F013 Enhanced
 * [INPUT]: player, isRevealed, isLocked, isDisabled, isCurrentPlayer, gameMode, onReveal, onLock
 * [OUTPUT]: Holographic flip card with lock mechanism and AI images
 * [POS]: UI Layer - Game Components
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Skull, User, Fingerprint, Lock, Check, ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/motion"
import { Button } from "@/components/ui/button"

export function PlayerCard({
  player,
  isRevealed,
  isLocked = false,
  isDisabled = false,
  isCurrentPlayer = false,
  gameMode = "free",
  onReveal,
  onLock
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    // F001: Don't allow interaction if locked or disabled
    if (isLocked || isDisabled) return

    // Toggle flip state
    if (!isFlipped) {
      setIsFlipped(true)
      onReveal?.()
    }
  }

  // F001: Handle "I Remember" confirmation
  const handleConfirm = (e) => {
    e.stopPropagation()
    setIsFlipped(false)
    onLock?.()
  }

  const isImposter = player.role === "imposter"

  return (
    <motion.div
      className={cn(
        "flip-card w-full aspect-[4/5] group relative",
        !isLocked && !isDisabled && "cursor-pointer",
        isDisabled && "opacity-50",
        isCurrentPlayer && !isLocked && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl"
      )}
      onClick={handleClick}
      whileHover={!isLocked && !isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isLocked && !isDisabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      {/* F002: Locked overlay with checkmark */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 rounded-2xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-success" />
            </div>
            <span className="text-success font-bold tracking-wider text-sm">VIEWED</span>
            <span className="text-muted-foreground text-xs mt-1">Player {player.number}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* F013: Current player indicator glow */}
      {isCurrentPlayer && !isLocked && gameMode === "sequential" && (
        <motion.div
          className="absolute -inset-1 rounded-2xl bg-primary/30 blur-md z-0"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div
        className={cn(
          "flip-card-inner relative w-full h-full",
          isFlipped && !isLocked && "flipped"
        )}
      >
        {/* Front - Hidden State */}
        <div
          className={cn(
            "flip-card-front rounded-2xl flex flex-col items-center justify-between p-6",
            "bg-gradient-to-b from-card via-card/80 to-card/50 border border-white/5",
            "shadow-lg backdrop-blur-sm",
            isDisabled && "grayscale"
          )}
        >
          {/* Top ID */}
          <div className="w-full flex justify-between items-center opacity-50 text-xs font-mono">
            <span>ID-0{player.number}</span>
            <div className={cn(
              "h-2 w-2 rounded-full",
              isCurrentPlayer && !isLocked ? "bg-primary animate-pulse" : "bg-white/30"
            )} />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className={cn(
                "absolute inset-0 blur-xl rounded-full transition-opacity",
                isCurrentPlayer && !isLocked ? "bg-primary/30 opacity-100" : "bg-primary/20 opacity-0 group-hover:opacity-100"
              )} />
              <div className={cn(
                "w-20 h-20 rounded-2xl border flex items-center justify-center transition-colors",
                isDisabled
                  ? "bg-white/5 border-white/5"
                  : isCurrentPlayer && !isLocked
                    ? "bg-primary/10 border-primary/50"
                    : "bg-white/5 border-white/10 group-hover:border-primary/50"
              )}>
                {isDisabled ? (
                  <Lock className="w-10 h-10 text-white/30" />
                ) : (
                  <Fingerprint className={cn(
                    "w-10 h-10 transition-colors",
                    isCurrentPlayer ? "text-primary" : "text-primary/70 group-hover:text-primary"
                  )} />
                )}
              </div>
            </div>
            <span className={cn(
              "font-bold tracking-widest text-sm uppercase",
              isDisabled ? "text-white/30" : "text-primary"
            )}>
              {isDisabled ? "Wait..." : "Tap Declassify"}
            </span>
          </div>

          {/* Bottom Bar */}
          <div className="w-12 h-1 rounded-full bg-white/10" />
        </div>

        {/* Back - Revealed State */}
        <div
          className={cn(
            "flip-card-back rounded-2xl p-4 flex flex-col items-center justify-center",
            "border shadow-[0_0_30px_-5px]",
            isImposter
              ? "bg-destructive/10 border-destructive"
              : "bg-success/10 border-success"
          )}
          style={{
            boxShadow: isImposter ? 'inset 0 0 20px 0 var(--destructive)' : 'inset 0 0 20px 0 var(--success)'
          }}
        >
          {/* F009: AI Generated Image */}
          {player.image && (
            <div className={cn(
              "w-16 h-16 rounded-xl overflow-hidden mb-2 border-2",
              isImposter ? "border-destructive/50" : "border-success/50"
            )}>
              <img
                src={player.image}
                alt={player.word}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center bg-white/5">
                <ImageOff className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Role Icon - smaller when image present */}
          <div
            className={cn(
              "rounded-full flex items-center justify-center border-2",
              player.image ? "w-10 h-10 mb-1" : "w-14 h-14 mb-3 border-4",
              isImposter
                ? "border-destructive bg-destructive/20 text-destructive"
                : "border-success bg-success/20 text-success"
            )}
          >
            {isImposter ? (
              <Skull className={player.image ? "w-5 h-5" : "w-7 h-7"} />
            ) : (
              <User className={player.image ? "w-5 h-5" : "w-7 h-7"} />
            )}
          </div>

          {/* Role Text */}
          <span
            className={cn(
              "font-black tracking-widest mb-1",
              player.image ? "text-xs" : "text-sm",
              isImposter ? "text-destructive" : "text-success"
            )}
          >
            {isImposter ? "IMPOSTER" : "CIVILIAN"}
          </span>

          {/* Secret Word */}
          <div className="mb-2 text-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Secret Key</span>
            <div className={cn(
              "font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/5",
              player.image ? "text-lg" : "text-xl",
              isImposter ? "text-destructive" : "text-success"
            )}>
              {player.word}
            </div>
          </div>

          {/* F001: "I Remember" Confirmation Button */}
          <Button
            onClick={handleConfirm}
            size="sm"
            className={cn(
              "font-bold tracking-wider text-xs px-3 py-1 h-8",
              isImposter
                ? "bg-destructive hover:bg-destructive/80"
                : "bg-success hover:bg-success/80"
            )}
          >
            <Check className="w-3 h-3 mr-1" />
            I Remember
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
