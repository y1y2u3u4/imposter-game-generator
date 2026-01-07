/**
 * GameGenerator Component - Premium Redesign
 * [INPUT]: None (self-contained)
 * [OUTPUT]: High-tech game interface
 * [POS]: UI Layer - Game Components
 */

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shuffle, Play, RotateCcw, Users, UserX, Sparkles, Settings2, Hash } from "lucide-react"
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

export function GameGenerator() {
  const [playerCount, setPlayerCount] = useState(6)
  const [imposterCount, setImposterCount] = useState(1)
  const [category, setCategory] = useState("animals")
  const [players, setPlayers] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPair, setCurrentPair] = useState(null)

  const generateGame = useCallback(() => {
    const [civilianWord, imposterWord] = getRandomPair(category)
    setCurrentPair({ civilian: civilianWord, imposter: imposterWord })

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
        revealed: false,
      })
    }

    setPlayers(newPlayers)
    setGameStarted(true)
  }, [playerCount, imposterCount, category])

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
  }, [])

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
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all text-xl font-bold shadow-[0_0_30px_-5px_var(--primary)] mt-4"
              >
                <Play className="w-6 h-6 mr-3 fill-current" />
                Initialize Protocol
              </Button>

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

            {/* Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {players.map((player) => (
                <motion.div key={player.number} variants={staggerItem}>
                  <PlayerCard
                    player={player}
                    isRevealed={player.revealed}
                    onReveal={() => {
                      setPlayers((prev) =>
                        prev.map((p) =>
                          p.number === player.number
                            ? { ...p, revealed: true }
                            : p
                        )
                      )
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <p className="text-center text-muted-foreground text-sm opacity-50">
              Tap card to reveal intelligence. Double-tap/click again to conceal.
            </p>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

