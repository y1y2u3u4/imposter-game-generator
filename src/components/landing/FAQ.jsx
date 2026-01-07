/**
 * FAQ Section Component
 * [INPUT]: None
 * [OUTPUT]: Frequently asked questions with accordion
 * [POS]: UI Layer - Landing Components
 */

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { viewport } from "@/lib/motion"

const faqs = [
  {
    question: "How many players can play?",
    answer:
      "The game supports 3 to 20 players. For the best experience, we recommend 5-10 players. You can have 1-3 imposters depending on your group size.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No! The Imposter Game Generator is completely free and requires no registration. Just open the website and start playing immediately.",
  },
  {
    question: "Can I play on my phone?",
    answer:
      "Absolutely! The game is fully responsive and works great on phones, tablets, and computers. You can pass one device around or have each player use their own.",
  },
  {
    question: "What if I run out of word pairs?",
    answer:
      "We have over 150 unique word pairs across 5 categories. The game randomly selects pairs, so you'll rarely see repeats. We're also constantly adding new words!",
  },
  {
    question: "Is this game suitable for kids?",
    answer:
      "Yes! All word pairs are family-friendly. The game is great for ages 8 and up, though younger kids can play with easier categories like Animals or Food.",
  },
  {
    question: "Can the imposter win?",
    answer:
      "Yes! If the imposter isn't caught, they win. Even if caught, the imposter gets one chance to guess the civilian word - if correct, they still win!",
  },
]

export function FAQ() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about the Imposter Game
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
