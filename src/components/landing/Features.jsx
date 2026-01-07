/**
 * Features Section Component - Bento Grid
 * [INPUT]: None
 * [OUTPUT]: Feature highlights in a bento grid layout
 * [POS]: UI Layer - Landing Components
 */

import { motion } from "framer-motion"
import {
  Smartphone,
  Zap,
  Users,
  Shuffle,
  Lock,
  Globe,
  Sparkles
} from "lucide-react"
import { staggerContainer, staggerItem, viewport } from "@/lib/motion"

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Zero latency. Get word pairs immediately. No registration required. Just pure adrenaline.",
    className: "md:col-span-2",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Massive Scale",
    description: "Support for 3-20 agents simultaneously.",
    className: "md:col-span-1",
    color: "text-primary"
  },
  {
    icon: Shuffle,
    title: "Dynamic Database",
    description: "150+ unique word pairs across 5 tactical categories.",
    className: "md:col-span-1",
    color: "text-secondary"
  },
  {
    icon: Smartphone,
    title: "Cross-Device Uplink",
    description: "Works seamlessly on any mobile terminal. Pass the device or sync manually.",
    className: "md:col-span-2",
    color: "text-success"
  },
  {
    icon: Lock,
    title: "Privacy Shield",
    description: "No data collection. Your mission intel stays strictly local.",
    className: "md:col-span-1",
    color: "text-destructive"
  },
  {
    icon: Globe,
    title: "Open Access",
    description: "100% Free. No paywalls.",
    className: "md:col-span-1 pl-more", // Just a dummy class for uniqueness
    color: "text-chart-2"
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            <span>System Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Engineered for <span className="text-glow text-primary">Maximum Chaos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to host the perfect deception game.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className={`${feature.className || 'md:col-span-1'}`}
            >
              <div className="group relative h-full glass-panel rounded-3xl p-8 overflow-hidden hover:bg-white/5 transition-all duration-500 border border-white/5 hover:border-primary/50">

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className={`mb-6 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

