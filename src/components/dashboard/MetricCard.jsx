/**
 * MetricCard Component - Cyberpunk glassmorphism metric display
 * [INPUT]: title, value, change, icon, trend, color
 * [OUTPUT]: Animated metric card with neon accents
 */

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

function AnimatedCounter({ value, duration = 1.5 }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value
    const controls = animate(0, numValue, {
      duration,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (v) => setDisplayValue(Math.round(v))
    })
    return () => controls.stop()
  }, [value, duration])

  return <span>{displayValue.toLocaleString()}</span>
}

export function MetricCard({
  title,
  value,
  suffix = "",
  change,
  icon: Icon,
  trend = "neutral",
  color = "cyan",
  delay = 0
}) {
  const colorMap = {
    cyan: {
      glow: "shadow-[0_0_30px_rgba(0,240,255,0.15)]",
      border: "border-cyan-500/30",
      accent: "text-cyan-400",
      bg: "bg-cyan-500/10",
      gradient: "from-cyan-500/20 to-transparent"
    },
    magenta: {
      glow: "shadow-[0_0_30px_rgba(255,0,170,0.15)]",
      border: "border-pink-500/30",
      accent: "text-pink-400",
      bg: "bg-pink-500/10",
      gradient: "from-pink-500/20 to-transparent"
    },
    green: {
      glow: "shadow-[0_0_30px_rgba(0,255,136,0.15)]",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      gradient: "from-emerald-500/20 to-transparent"
    },
    orange: {
      glow: "shadow-[0_0_30px_rgba(255,170,0,0.15)]",
      border: "border-orange-500/30",
      accent: "text-orange-400",
      bg: "bg-orange-500/10",
      gradient: "from-orange-500/20 to-transparent"
    }
  }

  const colors = colorMap[color] || colorMap.cyan

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-zinc-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springs.gentle, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-zinc-900/60 backdrop-blur-xl",
        "border border-white/5",
        colors.glow,
        "group cursor-default"
      )}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent animate-scan" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Top accent line */}
      <div className={cn("absolute top-0 left-0 right-0 h-px bg-gradient-to-r", colors.gradient)} />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl",
            colors.bg,
            "border border-white/5"
          )}>
            {Icon && <Icon className={cn("w-6 h-6", colors.accent)} />}
          </div>

          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm font-mono", trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span>{change > 0 ? "+" : ""}{change}%</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className={cn("text-3xl font-bold font-mono tracking-tight", colors.accent)}>
            <AnimatedCounter value={value} />
            {suffix && <span className="text-lg ml-1 text-zinc-500">{suffix}</span>}
          </div>
        </div>

        {/* Bottom pulse indicator */}
        <motion.div
          className={cn("absolute bottom-2 right-2 w-2 h-2 rounded-full", colors.bg)}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  )
}

export default MetricCard
