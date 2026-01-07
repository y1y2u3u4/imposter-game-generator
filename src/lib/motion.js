/**
 * Framer Motion Animation Presets
 * Apple-level spring physics for party game feel
 */

// Spring Configurations
export const springs = {
  // Standard interaction - buttons, cards hover
  snappy: { type: "spring", stiffness: 400, damping: 30 },

  // Gentle transition - panels, modals
  gentle: { type: "spring", stiffness: 300, damping: 35 },

  // Bouncy emphasis - success feedback, key elements
  bouncy: { type: "spring", stiffness: 500, damping: 25, mass: 0.8 },

  // Elegant settling - page transitions, large elements
  smooth: { type: "spring", stiffness: 200, damping: 40, mass: 1.2 },

  // Card flip - special for player cards
  flip: { type: "spring", stiffness: 350, damping: 35 },
}

// Fade In Up
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
}

// Scale In (Bouncy)
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.bouncy,
  },
}

// Stagger Container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// Stagger Item
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy,
  },
}

// Hover Lift (Apple Card Effect)
export const hoverLift = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
    transition: springs.snappy,
  },
}

// Tap Scale (Bounce Back)
export const tapScale = {
  rest: { scale: 1 },
  pressed: {
    scale: 0.96,
    transition: springs.bouncy,
  },
}

// Card Flip Animation
export const cardFlip = {
  front: {
    rotateY: 0,
    transition: springs.flip,
  },
  back: {
    rotateY: 180,
    transition: springs.flip,
  },
}

// Pulse Animation for Imposter Card
export const imposterPulse = {
  animate: {
    scale: [1, 1.02, 1],
    boxShadow: [
      "0 0 0 0 rgba(239, 68, 68, 0)",
      "0 0 20px 4px rgba(239, 68, 68, 0.4)",
      "0 0 0 0 rgba(239, 68, 68, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

// Shake Animation for Reveal
export const shake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
}

// Viewport Settings
export const viewport = {
  once: true,
  margin: "-100px",
}

// Page Transition
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
}
