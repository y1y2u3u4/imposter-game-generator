/**
 * Chart Components - Cyberpunk styled charts
 * [INPUT]: data array, labels, colors
 * [OUTPUT]: SVG-based line/bar/progress charts
 */

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/motion"

// Line Chart Component
export function LineChart({
  data = [],
  labels = [],
  color = "cyan",
  height = 200,
  showDots = true,
  showArea = true,
  title
}) {
  const colorMap = {
    cyan: { stroke: "#00f0ff", fill: "rgba(0,240,255,0.1)", dot: "#00f0ff" },
    magenta: { stroke: "#ff00aa", fill: "rgba(255,0,170,0.1)", dot: "#ff00aa" },
    green: { stroke: "#00ff88", fill: "rgba(0,255,136,0.1)", dot: "#00ff88" },
    orange: { stroke: "#ffaa00", fill: "rgba(255,170,0,0.1)", dot: "#ffaa00" }
  }
  const colors = colorMap[color] || colorMap.cyan

  const maxValue = Math.max(...data, 1)
  const minValue = Math.min(...data, 0)
  const range = maxValue - minValue || 1
  const padding = 40

  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1 || 1)) * (400 - padding * 2),
    y: height - padding - ((value - minValue) / range) * (height - padding * 2)
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || padding} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className="relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-6 overflow-hidden"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {title && (
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}

      <svg width="100%" height={height} viewBox={`0 0 400 ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={i}>
            <line
              x1={padding}
              y1={padding + ratio * (height - padding * 2)}
              x2={400 - padding}
              y2={padding + ratio * (height - padding * 2)}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
            <text
              x={padding - 8}
              y={padding + ratio * (height - padding * 2) + 4}
              fill="rgba(255,255,255,0.3)"
              fontSize="10"
              textAnchor="end"
              fontFamily="monospace"
            >
              {Math.round(maxValue - ratio * range)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {showArea && (
          <motion.path
            d={areaPath}
            fill={colors.fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        )}

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${colors.stroke})` }}
        />

        {/* Dots */}
        {showDots && points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={colors.dot}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            style={{ filter: `drop-shadow(0 0 6px ${colors.dot})` }}
          />
        ))}

        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={padding + (i / (labels.length - 1 || 1)) * (400 - padding * 2)}
            y={height - 10}
            fill="rgba(255,255,255,0.4)"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {label}
          </text>
        ))}
      </svg>
    </motion.div>
  )
}

// Bar Chart Component
export function BarChart({
  data = [],
  labels = [],
  color = "cyan",
  height = 200,
  title
}) {
  const colorMap = {
    cyan: { bar: "#00f0ff", glow: "rgba(0,240,255,0.3)" },
    magenta: { bar: "#ff00aa", glow: "rgba(255,0,170,0.3)" },
    green: { bar: "#00ff88", glow: "rgba(0,255,136,0.3)" },
    orange: { bar: "#ffaa00", glow: "rgba(255,170,0,0.3)" }
  }
  const colors = colorMap[color] || colorMap.cyan

  const maxValue = Math.max(...data, 1)
  const barWidth = Math.min(40, (400 - 80) / data.length - 8)
  const padding = 40

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
      className="relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-6 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {title && (
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}

      <svg width="100%" height={height} viewBox={`0 0 400 ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + ratio * (height - padding * 2)}
            x2={400 - padding}
            y2={padding + ratio * (height - padding * 2)}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Bars */}
        {data.map((value, i) => {
          const barHeight = (value / maxValue) * (height - padding * 2)
          const x = padding + (i / data.length) * (400 - padding * 2) + ((400 - padding * 2) / data.length - barWidth) / 2
          const y = height - padding - barHeight

          return (
            <g key={i}>
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={colors.bar}
                rx="4"
                initial={{ height: 0, y: height - padding }}
                animate={{ height: barHeight, y }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                style={{ filter: `drop-shadow(0 0 10px ${colors.glow})` }}
              />
              <text
                x={x + barWidth / 2}
                y={height - 10}
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {labels[i] || ''}
              </text>
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}

// Progress Ring Component
export function ProgressRing({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "cyan",
  title,
  subtitle
}) {
  const colorMap = {
    cyan: { stroke: "#00f0ff", glow: "0 0 20px rgba(0,240,255,0.5)" },
    magenta: { stroke: "#ff00aa", glow: "0 0 20px rgba(255,0,170,0.5)" },
    green: { stroke: "#00ff88", glow: "0 0 20px rgba(0,255,136,0.5)" },
    orange: { stroke: "#ffaa00", glow: "0 0 20px rgba(255,170,0,0.5)" }
  }
  const colors = colorMap[color] || colorMap.cyan

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = Math.min(value / max, 1)
  const strokeDashoffset = circumference - progress * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springs.gentle}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1] }}
            style={{ filter: `drop-shadow(${colors.glow})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold font-mono"
            style={{ color: colors.stroke }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress * 100)}%
          </motion.span>
        </div>
      </div>
      {title && (
        <div className="mt-3 text-center">
          <div className="text-sm font-medium text-zinc-300">{title}</div>
          {subtitle && <div className="text-xs text-zinc-500">{subtitle}</div>}
        </div>
      )}
    </motion.div>
  )
}

// Mini Sparkline Component
export function Sparkline({ data = [], color = "cyan", width = 100, height = 30 }) {
  const colorMap = {
    cyan: "#00f0ff",
    magenta: "#ff00aa",
    green: "#00ff88",
    orange: "#ffaa00"
  }
  const strokeColor = colorMap[color] || colorMap.cyan

  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1

  const points = data.map((value, index) => ({
    x: (index / (data.length - 1 || 1)) * width,
    y: height - ((value - min) / range) * height
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
      />
    </svg>
  )
}

export default { LineChart, BarChart, ProgressRing, Sparkline }
