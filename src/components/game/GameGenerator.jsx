/**
 * GameGenerator Component - Premium Redesign
 * [INPUT]: None (self-contained)
 * [OUTPUT]: High-tech game interface
 * [POS]: UI Layer - Game Components
 */

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shuffle, Play, RotateCcw, Users, UserX, Sparkles, Settings2, Hash, ListOrdered, LayoutGrid, Wand2, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlayerCard } from "./PlayerCard"
import {
  getRandomPair,
  getCategories,
  categoryLabels,
  categoryEmojis,
} from "@/data/wordPairs"
import { staggerContainer, staggerItem, springs } from "@/lib/motion"
import { generateWordPairImages } from "@/services/imageGeneration"
import { Switch } from "@/components/ui/switch"

// F008: Quirkiness level labels
const QUIRKINESS_LABELS = {
  1: "Realistic",
  2: "Cute",
  3: "Quirky",
  4: "Funny",
  5: "Absurd"
}

export function GameGenerator() {
  const [playerCount, setPlayerCount] = useState(6)
  const [imposterCount, setImposterCount] = useState(1)
  const [category, setCategory] = useState("animals")
  const [players, setPlayers] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPair, setCurrentPair] = useState(null)
  // F013: Sequential mode state
  const [gameMode, setGameMode] = useState("sequential") // "free" or "sequential"
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

  // F007/F008: Image generation state
  const [enableImages, setEnableImages] = useState(true)
  const [quirkiness, setQuirkiness] = useState(3)
  const [images, setImages] = useState({ civilian: null, imposter: null })
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [imageProgress, setImageProgress] = useState({ civilian: 0, imposter: 0 })

  const generateGame = useCallback(async () => {
    const [civilianWord, imposterWord] = getRandomPair(category)
    setCurrentPair({ civilian: civilianWord, imposter: imposterWord })

    // F007: Generate images if enabled
    let generatedImages = { civilian: null, imposter: null }
    if (enableImages) {
      setIsGeneratingImages(true)
      setImageProgress({ civilian: 0, imposter: 0 })

      try {
        const result = await generateWordPairImages(civilianWord, imposterWord, quirkiness, {
          onProgress: (p) => {
            if (p.type === 'civilian') {
              setImageProgress(prev => ({ ...prev, civilian: p.progress || 0 }))
            } else if (p.type === 'imposter') {
              setImageProgress(prev => ({ ...prev, imposter: p.progress || 0 }))
            }
          }
        })

        if (result.success) {
          generatedImages = {
            civilian: result.civilian.imageUrl,
            imposter: result.imposter.imageUrl
          }
        }
      } catch (error) {
        console.error('Failed to generate images:', error)
      }

      setIsGeneratingImages(false)
    }

    setImages(generatedImages)

    const newPlayers = []
    const imposterPositions = new Set()
    while (imposterPositions.size < imposterCount) {
      imposterPositions.add(Math.floor(Math.random() * playerCount))
    }

    for (let i = 0; i < playerCount; i++) {
      const isImposter = imposterPositions.has(i)
      newPlayers.push({
        number: i + 1,
        role: isImposter ? "imposter" : "civilian",
        word: isImposter ? imposterWord : civilianWord,
        image: isImposter ? generatedImages.imposter : generatedImages.civilian, // F009: Add image to player
        revealed: false,
        locked: false, // F001: Add locked state
      })
    }

    setPlayers(newPlayers)
    setGameStarted(true)
    setCurrentPlayerIndex(0) // F013: Reset current player index
  }, [playerCount, imposterCount, category, enableImages, quirkiness])

  const shufflePlayers = useCallback(() => {
    setPlayers((prev) => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled.map((p, i) => ({ ...p, number: i + 1 }))
    })
  }, [])

  const resetGame = useCallback(() => {
    setPlayers([])
    setGameStarted(false)
    setCurrentPair(null)
    setCurrentPlayerIndex(0) // F013: Reset current player index
    setImages({ civilian: null, imposter: null }) // F007: Reset images
    setImageProgress({ civilian: 0, imposter: 0 })
  }, [])

  // F001: Lock a card after player confirms
  const handleLockCard = useCallback((playerNumber) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.number === playerNumber
          ? { ...p, locked: true, revealed: true }
          : p
      )
    )
    // F013: In sequential mode, advance to next player
    if (gameMode === "sequential") {
      setCurrentPlayerIndex((prev) => prev + 1)
    }
  }, [gameMode])

  // F013: Check if all players have viewed their cards
  const allPlayersLocked = players.length > 0 && players.every(p => p.locked)

  const categories = getCategories()

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">

      {/* Settings Phase */}
      <AnimatePresence mode="wait">
        {!gameStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={springs.gentle}
            className="glass-panel p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <Settings2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Mission Config</h2>
                  <p className="text-muted-foreground text-sm">Configure parameters for deployment</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Category Selection */}
              <div className="space-y-3">
                <Label className="text-base text-white font-medium">Target Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 text-lg hover:border-primary/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <span className="flex items-center gap-2">
                          <span>{categoryEmojis[cat]}</span>
                          <span>{categoryLabels[cat]}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* F013: Game Mode Selection */}
              <div className="space-y-3">
                <Label className="text-base text-white font-medium">Pass Mode</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGameMode("sequential")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      gameMode === "sequential"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    <ListOrdered className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Sequential</div>
                      <div className="text-xs opacity-70">One by one</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameMode("free")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      gameMode === "free"
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Free</div>
                      <div className="text-xs opacity-70">Any order</div>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {gameMode === "sequential"
                    ? "Players view cards one by one in order. Best for preventing peeking."
                    : "Any player can view their card anytime. Best for trusted groups."}
                </p>
              </div>

              {/* F007/F008: AI Image Generation Settings */}
              <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg text-accent">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                      <Label className="text-base text-white font-medium">AI Images</Label>
                      <p className="text-xs text-muted-foreground">Generate fun images for words</p>
                    </div>
                  </div>
                  <Switch
                    checked={enableImages}
                    onCheckedChange={setEnableImages}
                  />
                </div>

                {/* F008: Quirkiness Slider - only show when images enabled */}
                <AnimatePresence>
                  {enableImages && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-accent">
                          <Sparkles className="w-4 h-4" />
                          Quirkiness Level
                        </Label>
                        <Badge variant="outline" className="bg-accent/20 border-accent/50 text-white font-mono px-3 py-1">
                          {QUIRKINESS_LABELS[quirkiness]}
                        </Badge>
                      </div>
                      <Slider
                        value={[quirkiness]}
                        onValueChange={([value]) => setQuirkiness(value)}
                        min={1}
                        max={5}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Realistic</span>
                        <span>Absurd</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Player Count */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-primary">
                      <Users className="w-4 h-4" />
                      Agents
                    </Label>
                    <Badge variant="outline" className="bg-primary/20 border-primary/50 text-white font-mono text-lg px-3 py-1">{playerCount}</Badge>
                  </div>
                  <Slider
                    value={[playerCount]}
                    onValueChange={([value]) => {
                      setPlayerCount(value)
                      if (imposterCount >= value) {
                        setImposterCount(Math.max(1, value - 2))
                      }
                    }}
                    min={3}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Imposter Count */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-destructive">
                      <UserX className="w-4 h-4" />
                      Imposters
                    </Label>
                    <Badge variant="outline" className="bg-destructive/20 border-destructive/50 text-white font-mono text-lg px-3 py-1">{imposterCount}</Badge>
                  </div>
                  <Slider
                    value={[imposterCount]}
                    onValueChange={([value]) => setImposterCount(value)}
                    min={1}
                    max={Math.min(3, playerCount - 2)}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={generateGame}
                disabled={isGeneratingImages}
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-xl font-bold shadow-[0_0_30px_-5px_var(--primary)] mt-4 disabled:opacity-70"
              >
                {isGeneratingImages ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Generating Images...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-3 fill-current" />
                    Initialize Protocol
                  </>
                )}
              </Button>

              {/* F011: Image generation progress */}
              <AnimatePresence>
                {isGeneratingImages && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ImageIcon className="w-4 h-4 text-accent animate-pulse" />
                      <span>Generating AI images...</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Civilian</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-success"
                            initial={{ width: 0 }}
                            animate={{ width: `${imageProgress.civilian}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Imposter</div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-destructive"
                            initial={{ width: 0 }}
                            animate={{ width: `${imageProgress.imposter}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Board */}
      <AnimatePresence mode="wait">
        {gameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* HUD / Status Bar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white/5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-2xl">{categoryEmojis[category]}</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Category</span>
                    <span className="font-bold">{categoryLabels[category]}</span>
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-mono">{playerCount} Agents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-destructive" />
                    <span className="font-mono text-destructive">{imposterCount} Imposter{imposterCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={shufflePlayers} className="border-white/10 hover:bg-white/5">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </Button>
                <Button variant="outline" size="sm" onClick={resetGame} className="border-white/10 hover:bg-white/5 text-destructive hover:text-destructive">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Abort
                </Button>
              </div>
            </div>

            {/* F013: Progress indicator for sequential mode */}
            {gameMode === "sequential" && !allPlayersLocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4 rounded-xl border border-primary/30 bg-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {currentPlayerIndex + 1}
                    </div>
                    <div>
                      <p className="font-medium text-primary">Player {currentPlayerIndex + 1}'s Turn</p>
                      <p className="text-xs text-muted-foreground">Pass the phone to Player {currentPlayerIndex + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{players.filter(p => p.locked).length} / {players.length}</p>
                    <p className="text-xs text-muted-foreground">Viewed</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* F013: All players done message */}
            {allPlayersLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 rounded-xl border border-success/30 bg-success/5 text-center"
              >
                <p className="text-success font-bold text-lg mb-1">All Players Ready!</p>
                <p className="text-muted-foreground text-sm">Everyone has viewed their role. Start describing your word!</p>
              </motion.div>
            )}

            {/* Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {players.map((player, index) => {
                // F013: In sequential mode, only current player can interact
                const isCurrentPlayer = gameMode === "free" || index === currentPlayerIndex
                const isDisabled = gameMode === "sequential" && index !== currentPlayerIndex && !player.locked

                return (
                  <motion.div key={player.number} variants={staggerItem}>
                    <PlayerCard
                      player={player}
                      isRevealed={player.revealed}
                      isLocked={player.locked}
                      isDisabled={isDisabled}
                      isCurrentPlayer={isCurrentPlayer && !player.locked}
                      gameMode={gameMode}
                      onReveal={() => {
                        setPlayers((prev) =>
                          prev.map((p) =>
                            p.number === player.number
                              ? { ...p, revealed: true }
                              : p
                          )
                        )
                      }}
                      onLock={() => handleLockCard(player.number)}
                    />
                  </motion.div>
                )
              })}
            </motion.div>

            <p className="text-center text-muted-foreground text-sm opacity-50">
              {gameMode === "sequential"
                ? "Tap your card to reveal, then confirm with 'I Remember' button."
                : "Tap card to reveal. Tap 'I Remember' to lock your card."}
            </p>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

