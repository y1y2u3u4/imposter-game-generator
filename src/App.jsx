/**
 * Imposter Game Generator - Main App
 * [INPUT]: None
 * [OUTPUT]: Complete application with landing and game
 * [POS]: App Layer - Root
 */

import { useState, useRef } from "react"
import { AnimatePresence, motion, MotionConfig } from "framer-motion"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { FAQ } from "@/components/landing/FAQ"
import { Footer } from "@/components/landing/Footer"
import { GameGenerator } from "@/components/game/GameGenerator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Skull } from "lucide-react"
import { springs } from "@/lib/motion"

function App() {
  const [showGame, setShowGame] = useState(false)
  const gameRef = useRef(null)

  const handleStartGame = () => {
    setShowGame(true)
    // Scroll to top when starting game
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToHome = () => {
    setShowGame(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        <AnimatePresence mode="wait">
          {showGame ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springs.smooth}
              className="min-h-screen gradient-mesh"
            >
              {/* Game Header */}
              <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToHome}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Skull className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold hidden sm:inline">
                      Imposter Game
                    </span>
                  </div>

                  <div className="w-20" /> {/* Spacer for centering */}
                </div>
              </header>

              {/* Game Content */}
              <main ref={gameRef} className="py-8">
                <GameGenerator />
              </main>
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springs.smooth}
            >
              <Hero onStartGame={handleStartGame} />
              <Features />
              <HowItWorks />
              <FAQ />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default App
