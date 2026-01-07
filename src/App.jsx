/**
 * Imposter Game Generator - OnePage Experience
 * [INPUT]: None
 * [OUTPUT]: A seamless, single-page seamless experience with high-end transitions
 * [POS]: App Layer - Root
 */

import { useState, useEffect } from "react"
import { AnimatePresence, motion, MotionConfig } from "framer-motion"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { WhatIsImposter } from "@/components/landing/WhatIsImposter"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { FAQ } from "@/components/landing/FAQ"
import { Footer } from "@/components/landing/Footer"
import { GameGenerator } from "@/components/game/GameGenerator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Skull, Sparkles } from "lucide-react"

function App() {
  const [showGame, setShowGame] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleStartGame = () => {
    setShowGame(true)
    // Optional: Lock body scroll when game is active if we want it to feel like a modal
    // document.body.style.overflow = "hidden" 
  }

  const handleBackToHome = () => {
    setShowGame(false)
    // document.body.style.overflow = "auto"
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen font-sans selection:bg-primary/30 text-foreground relative">
        
        {/* GLOBAL BACKGROUND MESH (Fixed) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="gradient-mesh" />
        </div>

        {/* 
            LANDING PAGE LAYER 
            Always mounted, but scales down/fades when game is active 
        */}
        <motion.div
           animate={{ 
             scale: showGame ? 0.95 : 1,
             opacity: showGame ? 0 : 1,
             filter: showGame ? "blur(10px)" : "blur(0px)"
           }}
           transition={{ duration: 0.5, ease: "easeInOut" }}
           className="relative z-10"
           style={{ display: showGame ? "none" : "block" }} // Optimization: hide when fully transitioned? Actually let's just pointer-events opacity
        >
            <Navbar scrolled={scrolled} />
            <main>
              <Hero onStartGame={handleStartGame} />
              <Features />
              <WhatIsImposter />
              <HowItWorks />
              <FAQ />
            </main>
            <Footer />
        </motion.div>


        {/* 
            GAME LAYER (Overlay)
            Slides up or Fades in like a "App" launching
        */}
        <AnimatePresence>
          {showGame && (
            <motion.div
              key="game-overlay"
              initial={{ opacity: 0, scale: 1.1, y: "100%" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-3xl overflow-y-auto"
            >
              {/* Game Top Bar */}
              <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 glass-panel mt-4 mx-4 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <Skull className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Imposter Protocol</span>
                 </div>

                 <Button 
                    variant="ghost" 
                    onClick={handleBackToHome}
                    className="hover:bg-white/5 text-muted-foreground hover:text-white"
                 >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Exit Game
                 </Button>
              </div>

              {/* Game Canvas */}
              <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <GameGenerator /> 
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </MotionConfig>
  )
}

function Navbar({ scrolled }) {
    return (
        <motion.header 
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'}`}
        >
            <div className={`mx-auto max-w-6xl px-6 rounded-2xl transition-all duration-300 ${scrolled ? 'bg-background/50 backdrop-blur-xl border border-white/5 shadow-lg mx-4' : 'bg-transparent'}`}>
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <span className="text-primary">Imposter</span>
                        <span className="text-foreground">.AI</span>
                    </div>
                    
                    {/* Only show simplified nav for now, can expand later */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}

export default App
