/**
 * Dashboard Component - Cyberpunk Command Center
 * [INPUT]: SEO metrics, backlink data, analytics
 * [OUTPUT]: Full dashboard layout with all visualizations
 */

import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/motion"
import { MetricCard } from "./MetricCard"
import { LineChart, BarChart, ProgressRing, Sparkline } from "./Charts"
import { BacklinkTable } from "./BacklinkTable"
import {
  Link2,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Globe,
  Activity,
  BarChart3,
  Calendar,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data - In production, this would come from API
const SAMPLE_METRICS = {
  totalBacklinks: 47,
  submittedToday: 8,
  averageDR: 52,
  successRate: 87,
  pendingCount: 12,
  targetProgress: 47 // out of 300
}

const SAMPLE_TREND_DATA = {
  daily: [3, 5, 8, 6, 10, 7, 8],
  weekly: [25, 32, 28, 45, 38, 47],
  drDistribution: [12, 28, 7] // low, medium, high
}

const SAMPLE_BACKLINKS = [
  { id: 1, date: "2026-01-08", site: "Product Hunt", url: "https://producthunt.com", category: "Startup", dr: 91, type: "dofollow", status: "submitted" },
  { id: 2, date: "2026-01-08", site: "Hacker News", url: "https://news.ycombinator.com", category: "Tech", dr: 91, type: "nofollow", status: "submitted" },
  { id: 3, date: "2026-01-08", site: "Indie Hackers", url: "https://indiehackers.com", category: "Startup", dr: 71, type: "dofollow", status: "submitted" },
  { id: 4, date: "2026-01-08", site: "Dev.to", url: "https://dev.to", category: "Tech", dr: 78, type: "dofollow", status: "pending" },
  { id: 5, date: "2026-01-07", site: "AlternativeTo", url: "https://alternativeto.net", category: "Directory", dr: 73, type: "dofollow", status: "submitted" },
  { id: 6, date: "2026-01-07", site: "Toolify", url: "https://toolify.ai", category: "AI Tools", dr: 58, type: "dofollow", status: "submitted" },
  { id: 7, date: "2026-01-07", site: "There's An AI", url: "https://theresanai.com", category: "AI Tools", dr: 45, type: "dofollow", status: "pending" },
  { id: 8, date: "2026-01-07", site: "SaaSHub", url: "https://saashub.com", category: "SaaS", dr: 62, type: "dofollow", status: "submitted" },
  { id: 9, date: "2026-01-06", site: "BetaList", url: "https://betalist.com", category: "Startup", dr: 67, type: "dofollow", status: "submitted" },
  { id: 10, date: "2026-01-06", site: "Futurepedia", url: "https://futurepedia.io", category: "AI Tools", dr: 55, type: "dofollow", status: "failed" },
  { id: 11, date: "2026-01-06", site: "TopAI.tools", url: "https://topai.tools", category: "AI Tools", dr: 48, type: "dofollow", status: "submitted" },
  { id: 12, date: "2026-01-06", site: "AIToolsDirectory", url: "https://aitoolsdirectory.com", category: "AI Tools", dr: 35, type: "dofollow", status: "pending" },
]

export function Dashboard({ onBack }) {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,170,0.03),transparent_50%)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/5 bg-zinc-900/30 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="text-zinc-400 hover:text-zinc-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0,240,255,0.3)",
                        "0 0 40px rgba(0,240,255,0.5)",
                        "0 0 20px rgba(0,240,255,0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center"
                  >
                    <Activity className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">SEO Command Center</h1>
                    <p className="text-xs text-zinc-500 font-mono">Imposter Game Generator</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Time Range Selector */}
                <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1">
                  {["24h", "7d", "30d"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-mono rounded-md transition-all",
                        timeRange === range
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                {/* Live Indicator */}
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-400"
                  />
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Metric Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Backlinks"
              value={SAMPLE_METRICS.totalBacklinks}
              suffix="/300"
              icon={Link2}
              color="cyan"
              trend="up"
              change={12}
              delay={0}
            />
            <MetricCard
              title="Submitted Today"
              value={SAMPLE_METRICS.submittedToday}
              suffix="/10"
              icon={Calendar}
              color="magenta"
              trend="up"
              change={25}
              delay={0.1}
            />
            <MetricCard
              title="Average DR"
              value={SAMPLE_METRICS.averageDR}
              icon={Target}
              color="green"
              trend="up"
              change={3}
              delay={0.2}
            />
            <MetricCard
              title="Success Rate"
              value={SAMPLE_METRICS.successRate}
              suffix="%"
              icon={Zap}
              color="orange"
              trend="neutral"
              delay={0.3}
            />
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Daily Submissions Chart */}
            <div className="lg:col-span-2">
              <LineChart
                title="Daily Submissions"
                data={SAMPLE_TREND_DATA.daily}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                color="cyan"
                height={220}
              />
            </div>

            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springs.gentle, delay: 0.2 }}
              className="relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-6 flex flex-col items-center justify-center"
            >
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <ProgressRing
                value={SAMPLE_METRICS.targetProgress}
                max={300}
                size={140}
                strokeWidth={10}
                color="cyan"
                title="30-Day Progress"
                subtitle={`${SAMPLE_METRICS.targetProgress} of 300 backlinks`}
              />
            </motion.div>
          </section>

          {/* Secondary Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* DR Distribution */}
            <BarChart
              title="DR Distribution"
              data={SAMPLE_TREND_DATA.drDistribution}
              labels={["Low (<40)", "Medium (40-69)", "High (≥70)"]}
              color="magenta"
              height={200}
            />

            {/* Weekly Trend */}
            <LineChart
              title="Weekly Submission Trend"
              data={SAMPLE_TREND_DATA.weekly}
              labels={["W1", "W2", "W3", "W4", "W5", "W6"]}
              color="green"
              height={200}
              showDots={false}
            />
          </section>

          {/* Quick Stats Row */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Dofollow Links", value: 38, sparkData: [2, 4, 3, 5, 6, 5, 7], color: "cyan" },
              { label: "Nofollow Links", value: 9, sparkData: [1, 1, 2, 1, 2, 1, 1], color: "magenta" },
              { label: "Pending Review", value: SAMPLE_METRICS.pendingCount, sparkData: [3, 2, 4, 2, 3, 2, 3], color: "orange" },
              { label: "Days Remaining", value: 23, sparkData: [30, 29, 28, 27, 26, 25, 24, 23], color: "green" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: 0.3 + i * 0.05 }}
                className="relative rounded-xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                  <Sparkline data={stat.sparkData} color={stat.color} width={60} height={20} />
                </div>
                <div className="text-2xl font-bold font-mono text-zinc-100">{stat.value}</div>
              </motion.div>
            ))}
          </section>

          {/* Backlink Table */}
          <section>
            <BacklinkTable
              data={SAMPLE_BACKLINKS}
              title="Recent Submissions"
            />
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-zinc-600 font-mono">
              <span>Last updated: {new Date().toLocaleString()}</span>
              <span className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                impostergamegenerators.com
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
