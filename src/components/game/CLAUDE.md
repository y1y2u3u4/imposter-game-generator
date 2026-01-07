# Game Components

Core game functionality for the Imposter Game Generator.

## Components

### PlayerCard
- **Purpose**: Flip card displaying player role and secret word
- **Props**: `player`, `isRevealed`, `onReveal`
- **Animation**: 3D flip with spring physics, imposter pulse effect

### GameGenerator
- **Purpose**: Main game controller with settings and player grid
- **State**: playerCount, imposterCount, category, players, gameStarted
- **Features**:
  - Category selection (5 categories)
  - Player count slider (3-20)
  - Imposter count slider (1-3)
  - Shuffle players
  - New game reset

## Data Flow

```
GameGenerator
  ├── Settings → Generate Game → Create Players Array
  └── Players Grid → PlayerCard × N
                      └── Tap to Flip → Reveal Word
```

## Dependencies

- framer-motion: Animations
- lucide-react: Icons
- @/components/ui/*: shadcn components
- @/data/wordPairs: Word pair database
- @/lib/motion: Animation presets
