/**
 * Features Section Component
 * [INPUT]: None
 * [OUTPUT]: Feature highlights grid
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
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { staggerContainer, staggerItem, viewport } from "@/lib/motion"

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Get word pairs immediately. No registration, no download, just pure fun.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users,
    title: "3-20 Players",
    description:
      "Perfect for small gatherings or large parties. Customize player and imposter counts.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shuffle,
    title: "5 Categories",
    description:
      "Animals, Food, Objects, Places, and Actions. Over 150 unique word pairs.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Works seamlessly on any device. Pass the phone around or each use their own.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "No data collection, no cookies, no tracking. Your party stays private.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: Globe,
    title: "100% Free",
    description:
      "No paywalls, no premium features, no ads. Free forever for everyone.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
]

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for
            <span className="text-primary"> Party Fun</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and designed for maximum entertainment. No setup
            required.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
