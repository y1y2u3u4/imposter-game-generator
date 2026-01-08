/**
 * Hero Section Component - Redesigned
 * [INPUT]: None
 * [OUTPUT]: High-impact landing with cyberpunk aesthetics
 * [POS]: UI Layer - Landing Components
 */

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Users, Zap, Play, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { springs } from "@/lib/motion"

export function Hero({ onStartGame, onCreateRoom, onJoinRoom }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">

      {/* Background Ambience (Local) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">

        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Badge variant="outline" className="px-4 py-2 bg-background/50 backdrop-blur border-primary/40 text-primary animate-pulse shadow-[0_0_15px_-5px_var(--primary)]">
            <Sparkles className="w-3 h-3 mr-2 fill-primary" />
            <span>The #1 Party Game Protocol</span>
          </Badge>
        </motion.div>

        {/* Main Title with Layers */}
        <div className="relative mb-6 group cursor-default">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter"
          >
            <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent block">IMPOSTER</span>
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent block mt-[-0.2em]">PROTOCOL</span>
          </motion.h1>

          {/* Decorative decorative lines/glitches */}
          <div className="absolute -inset-4 border border-white/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 pointer-events-none" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          Initiate the ultimate social deduction engine. <br className="hidden md:block" />
          <span className="text-foreground font-semibold">150+ Word Pairs</span>. <span className="text-foreground font-semibold">5 Categories</span>. <span className="text-foreground font-semibold">Zero Trust</span>.
        </motion.p>

        {/* Action Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Primary: Single Player */}
          <Button
            size="lg"
            onClick={onStartGame}
            className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_40px_-10px_var(--primary)] border border-white/20 hover:scale-105 transition-all duration-300 group"
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Quick Game (Offline)
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Multiplayer Options */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={onCreateRoom}
              className="h-12 px-6 rounded-full border-accent/50 text-accent hover:bg-accent/10 hover:border-accent transition-all"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Room
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onJoinRoom}
              className="h-12 px-6 rounded-full border-secondary/50 text-secondary hover:bg-secondary/10 hover:border-secondary transition-all"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join Room
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white hover:bg-white/5"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            How does this work?
          </Button>
        </motion.div>

        {/* Floating Stats UI */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          {[
            { label: "Active Players", value: "3-20", icon: Users, color: "text-primary" },
            { label: "Database", value: "150+", icon: Zap, color: "text-accent" },
            { label: "Latency", value: "0ms", icon: Play, color: "text-secondary" },
            { label: "Cost", value: "FREE", icon: Sparkles, color: "text-success" }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition-colors group">
              <stat.icon className={`w-6 h-6 mb-2 ${stat.color} group-hover:scale-110 transition-transform`} />
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
