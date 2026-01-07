/**
 * How It Works Section Component
 * [INPUT]: None
 * [OUTPUT]: Step-by-step game instructions
 * [POS]: UI Layer - Landing Components
 */

import { motion } from "framer-motion"
import { Settings, Eye, MessageCircle, Vote } from "lucide-react"
import { staggerContainer, staggerItem, viewport } from "@/lib/motion"

const steps = [
  {
    step: 1,
    icon: Settings,
    title: "Set Up the Game",
    description:
      "Choose a category, set the number of players (3-20), and decide how many imposters you want (1-3).",
    color: "from-primary to-primary/50",
  },
  {
    step: 2,
    icon: Eye,
    title: "Reveal Your Word",
    description:
      "Pass the device around. Each player taps their card to see their secret word, then hides it before passing.",
    color: "from-accent to-accent/50",
  },
  {
    step: 3,
    icon: MessageCircle,
    title: "Give Clues",
    description:
      "Take turns giving one-word clues about your word. Be careful - imposters must blend in without knowing the real word!",
    color: "from-secondary to-secondary/50",
  },
  {
    step: 4,
    icon: Vote,
    title: "Find the Imposter",
    description:
      "After discussion, vote on who you think the imposter is. The imposter tries to guess the civilian word to win!",
    color: "from-success to-success/50",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How to <span className="text-primary">Play</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Easy to learn, impossible to master. Here's how the game works:
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Connector Line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-success hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={staggerItem}
              className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Step Number */}
              <div
                className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
              >
                <step.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div
                className={`flex-1 pt-2 ${
                  index % 2 === 1 ? "md:text-right" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Step {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
