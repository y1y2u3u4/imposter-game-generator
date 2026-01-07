/**
 * GameGenerator Component
 * [INPUT]: None (self-contained)
 * [OUTPUT]: Complete game interface with settings and player cards
 * [POS]: UI Layer - Game Components
 */

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shuffle, Play, RotateCcw, Users, UserX, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    // Get random word pair
    const [civilianWord, imposterWord] = getRandomPair(category)
    setCurrentPair({ civilian: civilianWord, imposter: imposterWord })

    // Create player array
    const newPlayers = []

    // Assign imposter positions randomly
    const imposterPositions = new Set()
    while (imposterPositions.size < imposterCount) {
      imposterPositions.add(Math.floor(Math.random() * playerCount))
    }

    // Create players
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
      // Reassign numbers after shuffle
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
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      {/* Settings Panel */}
      <AnimatePresence mode="wait">
        {!gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springs.gentle}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Game Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label>Word Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {categoryEmojis[cat]} {categoryLabels[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Player Count */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Players
                    </Label>
                    <Badge variant="secondary">{playerCount}</Badge>
                  </div>
                  <Slider
                    value={[playerCount]}
                    onValueChange={([value]) => {
                      setPlayerCount(value)
                      // Adjust imposter count if needed
                      if (imposterCount >= value) {
                        setImposterCount(Math.max(1, value - 2))
                      }
                    }}
                    min={3}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Imposter Count */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-destructive" />
                      Imposters
                    </Label>
                    <Badge variant="destructive">{imposterCount}</Badge>
                  </div>
                  <Slider
                    value={[imposterCount]}
                    onValueChange={([value]) => setImposterCount(value)}
                    min={1}
                    max={Math.min(3, playerCount - 2)}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>{Math.min(3, playerCount - 2)}</span>
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  onClick={generateGame}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
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
            className="space-y-6"
          >
            {/* Game Info */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {categoryEmojis[category]} {categoryLabels[category]}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {playerCount} Players
                </Badge>
                <Badge variant="destructive" className="text-sm">
                  {imposterCount} Imposter{imposterCount > 1 ? "s" : ""}
                </Badge>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={shufflePlayers}>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </Button>
                <Button variant="outline" size="sm" onClick={resetGame}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </div>
            </div>

            {/* Player Cards Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
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

            {/* Game Tip */}
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground text-center">
                  💡 <strong>Tip:</strong> Pass the device around. Each player
                  taps their card to see their secret word, then taps again to
                  hide it before passing.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
