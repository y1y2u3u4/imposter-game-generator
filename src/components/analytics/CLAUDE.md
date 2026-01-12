# Analytics Components

Unified analytics integration for tracking across GA4, Plausible, and Clarity.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    lib/analytics.js                         │
│                 (Unified Analytics Module)                  │
├─────────────────────────────────────────────────────────────┤
│  trackGameGenerated()   ──┬──► GA4 trackEvent()            │
│  trackCardFlip()          │                                 │
│  trackCategorySelect()    ├──► Plausible trackPlausible()  │
│  trackImageGenerated()    │                                 │
│  trackRoomCreated()       └──► Clarity trackClarity()       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  AnalyticsProvider.jsx                      │
├─────────────────────────────────────────────────────────────┤
│  - Dynamic script loading                                   │
│  - Route change tracking                                    │
│  - Development status logging                               │
└─────────────────────────────────────────────────────────────┘
```

## Components

### AnalyticsProvider
- **Purpose**: Load analytics scripts and track page views
- **Props**: children
- **Features**:
  - Loads GA4, Plausible, Clarity scripts dynamically
  - Tracks route changes for SPA navigation
  - Development mode status logging

## Environment Variables

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX    # Google Analytics 4
VITE_PLAUSIBLE_DOMAIN=yourdomain.com   # Plausible domain
VITE_CLARITY_PROJECT_ID=xxxxxxxxxx     # Microsoft Clarity
```

## Game-Specific Events

| Event | GA4 | Plausible | Clarity |
|-------|-----|-----------|---------|
| Game Generated | ✅ | ✅ | ✅ |
| Card Flip | ✅ | ✅ | ✅ |
| Category Select | ✅ | ✅ | ✅ |
| Room Created | ✅ | ✅ | ✅ + upgrade |
| Room Joined | ✅ | ✅ | ✅ |
| Image Generated | ✅ | ✅ | ✅ |

## Usage

```jsx
// In main.jsx
import { AnalyticsProvider } from './components/analytics'

<AnalyticsProvider>
  <App />
</AnalyticsProvider>

// In components
import { trackGameGenerated } from '@/lib/analytics'

trackGameGenerated({
  playerCount: 6,
  imposterCount: 1,
  category: 'animals',
  gameMode: 'sequential',
})
```

## Debug

In development console:
```javascript
window.__checkAnalytics()
// Returns: { ga4: {...}, plausible: {...}, clarity: {...} }
```

## Dependencies

- No external dependencies (native browser APIs)
