# Imposter Game Generator

Free online party word game generator for playing the "Imposter" (卧底词) game.

## Architecture

### Tech Stack
- **Framework**: Vite + React 19
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Animation**: Framer Motion (Apple-level springs)
- **Icons**: Lucide React

### Directory Structure
```
src/
├── components/
│   ├── game/           # Game-specific components
│   │   ├── PlayerCard.jsx    # Flip card for player words
│   │   └── GameGenerator.jsx # Main game logic
│   ├── landing/        # Landing page sections
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── FAQ.jsx
│   │   └── Footer.jsx
│   └── ui/             # shadcn/ui components
├── data/
│   └── wordPairs.js    # 150+ word pairs across 5 categories
├── lib/
│   ├── utils.js        # cn() utility
│   └── motion.js       # Framer Motion presets
├── index.css           # TailwindCSS + theme variables
└── App.jsx             # Root component
```

## Design System

### Color Tokens (oklch)
- **Primary**: Purple (290 hue) - Mystery/Party
- **Secondary**: Deep Blue (250 hue) - Trust/Safety
- **Accent**: Hot Pink (350 hue) - Fun/Energy
- **Destructive**: Red (25 hue) - Imposter Alert
- **Success**: Green (145 hue) - Civilian Safe

### Typography
- Font: Inter, system-ui fallback
- Responsive scale with Tailwind

### Component Library
- All base components from shadcn/ui
- Custom variants in index.css

## Conventions

### File Naming
- Components: PascalCase (`PlayerCard.jsx`)
- Utilities: camelCase (`wordPairs.js`)
- CSS: kebab-case variables

### Code Patterns
- Functional components with hooks
- Framer Motion for animations
- CSS variables for theming (no hardcoded colors)

### Animation Standards
- Spring physics (stiffness: 200-500, damping: 25-40)
- Reduced motion support via MotionConfig
- Stagger children for list animations

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## SEO

- Target: "imposter game generator" (1.6K monthly searches)
- Meta tags configured in index.html
- Semantic HTML structure
