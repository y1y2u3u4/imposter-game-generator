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
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          className="text-center mb-20 md:mb-32"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            How to <span className="text-primary">Play</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Easy to learn, impossible to master. Here's how the game works:
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <motion.div
          className="relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Central Line (Desktop Only) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-primary via-accent to-success hidden md:block" />

          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={step.step}
                variants={staggerItem}
                className="relative flex flex-col md:flex-row items-center mb-16 last:mb-0 md:h-48 group"
              >
                {/* LEFT SIDE */}
                <div className={`flex-1 w-full md:w-auto flex flex-col items-center md:items-end md:pr-16 text-center md:text-right order-2 md:order-1 ${!isLeft ? "md:invisible" : ""}`}>
                  {isLeft && (
                    <>
                      {/* Mobile Icon (Only for Left Items on Mobile) */}
                      <div className={`md:hidden w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>

                      <span className="text-sm font-bold text-primary tracking-widest uppercase mb-2">
                        Step {step.step}
                      </span>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed max-w-sm">
                        {step.description}
                      </p>
                    </>
                  )}
                </div>

                {/* CENTER ICON (Desktop) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 order-1">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-[1px] shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-primary/30 transition-transform duration-300 group-hover:scale-110`}>
                    <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className={`flex-1 w-full md:w-auto flex flex-col items-center md:items-start md:pl-16 text-center md:text-left order-3 md:order-3 ${isLeft ? "md:invisible" : ""}`}>
                  {!isLeft && (
                    <>
                      {/* Mobile Icon (Only for Right Items on Mobile) */}
                      <div className={`md:hidden w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>

                      <span className="text-sm font-bold text-primary tracking-widest uppercase mb-2">
                        Step {step.step}
                      </span>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed max-w-sm">
                        {step.description}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
