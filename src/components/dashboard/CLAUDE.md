# Dashboard Components

Cyberpunk Command Center for SEO metrics tracking and backlink submission monitoring.

## Design Language

- **Theme**: Cyberpunk / Neo-noir with glassmorphism
- **Color Palette**:
  - Background: #0a0a0f (deep dark)
  - Cyan: #00f0ff (primary data)
  - Magenta: #ff00aa (secondary highlights)
  - Green: #00ff88 (success/positive)
  - Orange: #ffaa00 (warning/medium)
- **Effects**: Neon glows, grid overlays, scan lines, pulse animations

## Components

### MetricCard
- **Purpose**: Display key metrics with animated counters
- **Props**: title, value, suffix, change, icon, trend, color, delay
- **Features**: Glassmorphism, scan line hover effect, pulse indicator

### Charts (LineChart, BarChart, ProgressRing, Sparkline)
- **Purpose**: SVG-based data visualizations
- **Features**:
  - Path length animation for line/area
  - Staggered bar animation
  - Ring progress with glow effect
  - Compact sparklines for inline stats

### BacklinkTable
- **Purpose**: Sortable, filterable data table for backlink tracking
- **Features**:
  - Search and status filter
  - Sortable columns (date, site, DR, status)
  - Status badges (submitted/pending/failed)
  - DR color coding (green/cyan/orange)
  - Footer stats summary

### Dashboard
- **Purpose**: Main layout combining all components
- **Features**:
  - Responsive grid layout
  - Time range selector
  - Live indicator
  - Animated background mesh

## Usage

Access via URL: `/?view=dashboard`

```jsx
import { Dashboard } from "@/components/dashboard"

<Dashboard onBack={() => handleBackNavigation()} />
```

## Data Integration

Currently using sample data. To connect to real data:

1. Replace `SAMPLE_METRICS` with API fetch
2. Replace `SAMPLE_BACKLINKS` with Supabase query
3. Add real-time subscription for live updates

## Dependencies

- framer-motion: Animations
- lucide-react: Icons
- @/lib/motion: Spring presets
- @/lib/utils: cn() utility
