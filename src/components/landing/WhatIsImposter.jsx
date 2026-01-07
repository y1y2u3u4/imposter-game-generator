/**
 * What Is Imposter Section - SEO Content Block
 * [INPUT]: None
 * [OUTPUT]: Rich text content for SEO (800+ words target)
 * [POS]: UI Layer - Landing Components
 */

import { motion } from "framer-motion"
import { BookOpen, Target, Users, Lightbulb, Trophy, Heart } from "lucide-react"
import { staggerContainer, staggerItem, viewport } from "@/lib/motion"

export function WhatIsImposter() {
  return (
    <section id="what-is-imposter" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Section Header */}
          <motion.div variants={staggerItem} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-4 border border-secondary/20">
              <BookOpen className="w-3 h-3" />
              <span>Game Guide</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What is the <span className="text-primary">Imposter Game</span>?
            </h2>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={staggerItem} className="prose prose-invert prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-6">
              The <strong className="text-foreground">Imposter Game</strong>, also known as the Spy Game or Word Imposter,
              is an exciting social deduction party game that has taken gatherings by storm. This thrilling word-based game
              challenges players to identify the imposter among them through clever questioning and deductive reasoning.
              Perfect for parties, family gatherings, team building events, and casual hangouts, the imposter game creates
              unforgettable moments of suspense, laughter, and friendly competition.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-6">
              Our <strong className="text-foreground">free online Imposter Game Generator</strong> eliminates the need for
              physical cards or complicated setup. Simply open the website, select your preferred category from our extensive
              collection of over 150 word pairs, choose the number of players (supporting 3 to 20 participants), and you're
              ready to play. The generator automatically assigns secret words to each player, with one or more players
              receiving the "imposter" role who must blend in without knowing the actual word.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              How Does the Imposter Game Work?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At the start of each round, our imposter game generator distributes secret words to all players. Regular players
              receive the same word (for example, "Lion"), while the imposter receives a different but related word (such as
              "Tiger"). Players take turns describing their word without saying it directly, trying to prove they know the
              real word while simultaneously identifying who might be the imposter. The imposter must listen carefully to
              other players' descriptions and bluff convincingly to avoid detection.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-6">
              After several rounds of descriptions and discussions, players vote on who they believe is the imposter.
              If the group correctly identifies the imposter, they win! However, if the imposter remains undetected or
              successfully guesses the real word, they claim victory instead. This creates an engaging dynamic where
              everyone must balance being descriptive enough to prove their innocence while not giving away too much
              information that could help the imposter.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Why Choose Our Imposter Game Generator?
            </h3>
            <ul className="text-muted-foreground space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span><strong className="text-foreground">Completely Free:</strong> No hidden costs, subscriptions, or premium features. Every word pair and game mode is available at no charge.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span><strong className="text-foreground">No Registration Required:</strong> Start playing instantly without creating an account. Your privacy is protected as no personal data is collected.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span><strong className="text-foreground">150+ Word Pairs:</strong> Our extensive database covers 5 diverse categories including Animals, Food & Drinks, Everyday Objects, Famous Places, and Action Verbs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span><strong className="text-foreground">Flexible Player Count:</strong> Whether you have a small group of 3 friends or a large party of 20 people, our generator scales perfectly to accommodate any group size.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span><strong className="text-foreground">Mobile-Friendly Design:</strong> Play on any device - smartphone, tablet, or computer. The responsive interface ensures a seamless experience on all screen sizes.</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Tips for Playing the Imposter Game
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              To maximize your imposter game experience, consider these expert tips: For regular players, give descriptions
              that are specific enough to prove you know the word but vague enough to not help the imposter. Watch other
              players' reactions carefully - hesitation or overly generic descriptions might indicate the imposter. As the
              imposter, pay close attention to patterns in other players' descriptions to deduce the real word. Use confident
              body language and don't be afraid to accuse others to deflect suspicion.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              Perfect for Any Occasion
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The imposter game generator is perfect for birthday parties, holiday gatherings, office team building events,
              classroom activities, road trips, and casual game nights. Its simple rules make it accessible to players of
              all ages (recommended for ages 8 and up), while the strategic depth keeps experienced gamers engaged. The
              game typically runs 5-15 minutes per round, making it easy to fit into any schedule or play multiple rounds
              in one session.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              Join Thousands of Happy Players
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our imposter game generator has entertained thousands of players worldwide, creating countless memorable
              moments of laughter, surprise, and friendly competition. Whether you're introducing the game to newcomers
              or hosting a championship round with experienced players, our tool provides everything you need for an
              unforgettable gaming experience. Start your first round now and discover why the imposter game has become
              one of the most popular party games of the decade!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
