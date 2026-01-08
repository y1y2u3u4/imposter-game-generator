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
import { CreateRoomModal, JoinRoomModal, RoomLobby, MultiplayerGameView } from "@/components/room"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Skull, Sparkles, Users, LogIn } from "lucide-react"
import { leaveRoom, startGame as startRoomGame, getRoom, subscribeToRoom } from "@/services/roomService"
import { isSupabaseConfigured } from "@/lib/supabase"
import { getRandomPair } from "@/data/wordPairs"

function App() {
  const [showGame, setShowGame] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // F003/F004: Room state
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showRoomLobby, setShowRoomLobby] = useState(false)
  const [showMultiplayerGame, setShowMultiplayerGame] = useState(false)
  const [room, setRoom] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [joinCode, setJoinCode] = useState("")

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // F004: Check URL for join code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("join")
    if (code) {
      setJoinCode(code.toUpperCase())
      setShowJoinRoom(true)
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  // F005: Subscribe to room changes for game state updates
  useEffect(() => {
    if (!room?.room_code) return

    const unsubscribe = subscribeToRoom(room.room_code, (newData, eventType) => {
      if (eventType === 'DELETE') {
        // Room was deleted (host left)
        handleLeaveRoom()
        return
      }
      setRoom(newData)
      // Check if game started (host clicked start, non-host players also need to see)
      if (newData.game_state === 'playing' && !showMultiplayerGame) {
        setShowRoomLobby(false)
        setShowMultiplayerGame(true)
      }
    })

    return () => unsubscribe()
  }, [room?.room_code, showMultiplayerGame])

  const handleStartGame = () => {
    setShowGame(true)
  }

  const handleBackToHome = () => {
    setShowGame(false)
  }

  // F003: Handle room creation
  const handleRoomCreated = (newRoom, newPlayerId) => {
    setRoom(newRoom)
    setPlayerId(newPlayerId)
    setIsHost(true)
    setShowCreateRoom(false)
    setShowRoomLobby(true)
  }

  // F004: Handle room join
  const handleRoomJoined = (joinedRoom, joinedPlayerId) => {
    setRoom(joinedRoom)
    setPlayerId(joinedPlayerId)
    setIsHost(false)
    setShowJoinRoom(false)
    setShowRoomLobby(true)
  }

  // Handle leaving room
  const handleLeaveRoom = async () => {
    if (room && playerId) {
      await leaveRoom(room.id, playerId)
    }
    setRoom(null)
    setPlayerId(null)
    setIsHost(false)
    setShowRoomLobby(false)
  }

  // F005: Handle starting multiplayer game
  const handleStartMultiplayerGame = async (roomData) => {
    if (!roomData || !playerId) return

    // Get word pair based on room settings
    const category = roomData.settings?.category || 'animals'
    const [civilianWord, imposterWord] = getRandomPair(category)

    // Generate role assignments
    const players = roomData.players || []
    const imposterCount = roomData.settings?.imposterCount || 1

    // Shuffle players for random imposter selection
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5)

    // Assign roles: first N players are imposters
    const assignments = players.map(player => {
      const isImposter = shuffledPlayers.slice(0, imposterCount).some(p => p.id === player.id)
      return {
        playerId: player.id,
        role: isImposter ? 'imposter' : 'civilian',
        viewed: false
      }
    })

    // Call Supabase to start game with assignments
    const result = await startRoomGame(roomData.id, playerId, {
      civilianWord,
      imposterWord,
      assignments
    })

    if (result.success) {
      // Update local state (room subscription will also trigger this)
      setRoom(prev => ({
        ...prev,
        game_state: 'playing',
        civilian_word: civilianWord,
        imposter_word: imposterWord,
        assignments
      }))
      setShowRoomLobby(false)
      setShowMultiplayerGame(true)
    } else {
      console.error('Failed to start game:', result.error)
    }
  }

  // Handle ending multiplayer game
  const handleEndMultiplayerGame = () => {
    setShowMultiplayerGame(false)
    setRoom(null)
    setPlayerId(null)
    setIsHost(false)
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
              <Hero
                onStartGame={handleStartGame}
                onCreateRoom={() => setShowCreateRoom(true)}
                onJoinRoom={() => setShowJoinRoom(true)}
              />
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

        {/* F003/F004: Room Lobby Layer */}
        <AnimatePresence>
          {showRoomLobby && room && (
            <motion.div
              key="room-lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background"
            >
              <RoomLobby
                room={room}
                playerId={playerId}
                isHost={isHost}
                onLeave={handleLeaveRoom}
                onStartGame={handleStartMultiplayerGame}
                onGameStarted={(roomData) => {
                  // F005: Non-host players receive game start notification
                  setRoom(roomData)
                  setShowRoomLobby(false)
                  setShowMultiplayerGame(true)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* F005: Multiplayer Game View Layer */}
        <AnimatePresence>
          {showMultiplayerGame && room && (
            <motion.div
              key="multiplayer-game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background"
            >
              <MultiplayerGameView
                room={room}
                playerId={playerId}
                onEndGame={handleEndMultiplayerGame}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* F003: Create Room Modal */}
        <CreateRoomModal
          isOpen={showCreateRoom}
          onClose={() => setShowCreateRoom(false)}
          onRoomCreated={handleRoomCreated}
        />

        {/* F004: Join Room Modal */}
        <JoinRoomModal
          isOpen={showJoinRoom}
          onClose={() => setShowJoinRoom(false)}
          onRoomJoined={handleRoomJoined}
          initialCode={joinCode}
        />

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
