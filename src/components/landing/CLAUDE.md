# Landing Page Components

Marketing and information sections for the Imposter Game Generator.

## Components

### Hero
- **Purpose**: Main hero section with headline, stats, and CTA
- **Props**: `onStartGame` callback
- **Features**: Animated background blobs, gradient text, scroll indicator

### Features
- **Purpose**: 6-feature grid highlighting game benefits
- **Animation**: Stagger reveal on scroll

### HowItWorks
- **Purpose**: 4-step game tutorial
- **Layout**: Alternating left/right with connector line

### FAQ
- **Purpose**: Common questions with accordion
- **Component**: shadcn Accordion

### Footer
- **Purpose**: Site footer with links
- **Layout**: Responsive flex

## Section Order

1. Hero (full viewport)
2. Features (grid)
3. HowItWorks (alternating steps)
4. FAQ (accordion)
5. Footer

## Design Constraints

- All colors from CSS variables
- All interactive elements from shadcn/ui
- Animations use @/lib/motion presets
- Scroll-triggered animations with `whileInView`
