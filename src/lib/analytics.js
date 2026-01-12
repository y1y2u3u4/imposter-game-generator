/**
 * Unified Analytics Integration
 * [INPUT]: Event data from components
 * [OUTPUT]: Tracked events to GA4, Plausible, Clarity
 * [POS]: Service Layer - Analytics
 *
 * Single module for tracking events across:
 * - Google Analytics 4 (GA4) - Full analytics
 * - Plausible Analytics - Privacy-friendly, GDPR compliant
 * - Microsoft Clarity - Session recordings & heatmaps
 */

// Environment variables (Vite uses VITE_ prefix)
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
export const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'impostergamegenerators.com'
export const PLAUSIBLE_SCRIPT_ID = import.meta.env.VITE_PLAUSIBLE_SCRIPT_ID
export const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID

// ============================================================
// SERVICE AVAILABILITY CHECKS
// ============================================================

export const isGAEnabled = () => {
  return typeof window !== 'undefined' && !!GA_MEASUREMENT_ID && typeof window.gtag === 'function'
}

export const isPlausibleEnabled = () => {
  return typeof window !== 'undefined' && typeof window.plausible === 'function'
}

export const isClarityEnabled = () => {
  return typeof window !== 'undefined' && typeof window.clarity === 'function'
}

// ============================================================
// INTERNAL HELPERS
// ============================================================

const trackPlausible = (eventName, props) => {
  if (!isPlausibleEnabled()) return
  try {
    window.plausible?.(eventName, props ? { props } : undefined)
  } catch (error) {
    console.error('Plausible tracking error:', error)
  }
}

const trackClarity = (eventName) => {
  if (!isClarityEnabled()) return
  try {
    window.clarity?.('event', eventName)
  } catch (error) {
    console.error('Clarity tracking error:', error)
  }
}

const upgradeClarity = (reason) => {
  if (!isClarityEnabled()) return
  try {
    window.clarity?.('upgrade', reason)
  } catch (error) {
    console.error('Clarity upgrade error:', error)
  }
}

// ============================================================
// CORE GA4 TRACKING
// ============================================================

export const trackPageview = (url) => {
  if (!isGAEnabled()) return
  try {
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  } catch (error) {
    console.error('GA pageview error:', error)
  }
}

export const trackEvent = (action, params = {}) => {
  if (!isGAEnabled()) return
  try {
    window.gtag?.('event', action, params)
  } catch (error) {
    console.error('GA event error:', error)
  }
}

// ============================================================
// GAME-SPECIFIC TRACKING EVENTS
// ============================================================

/**
 * Track game generation
 */
export const trackGameGenerated = (params = {}) => {
  const { playerCount, imposterCount, category, gameMode } = params

  // GA4
  trackEvent('game_generated', {
    player_count: playerCount,
    imposter_count: imposterCount,
    category: category,
    game_mode: gameMode,
  })

  // Plausible
  trackPlausible('Game Generated', {
    category: category || 'unknown',
    players: playerCount || 0,
  })

  // Clarity
  trackClarity('game_generated')
}

/**
 * Track card flip (player viewing their word)
 */
export const trackCardFlip = (params = {}) => {
  const { playerNumber, isImposter } = params

  // GA4
  trackEvent('card_flip', {
    player_number: playerNumber,
    is_imposter: isImposter,
  })

  // Plausible
  trackPlausible('Card Flip')

  // Clarity
  trackClarity('card_flip')
}

/**
 * Track category selection
 */
export const trackCategorySelect = (category) => {
  // GA4
  trackEvent('category_select', { category })

  // Plausible
  trackPlausible('Category Select', { category })

  // Clarity
  trackClarity('category_select')
}

/**
 * Track multiplayer room creation
 */
export const trackRoomCreated = (params = {}) => {
  const { playerCount, category } = params

  // GA4
  trackEvent('room_created', {
    player_count: playerCount,
    category: category,
  })

  // Plausible
  trackPlausible('Room Created', { players: playerCount || 0 })

  // Clarity
  trackClarity('room_created')
  upgradeClarity('multiplayer_session')
}

/**
 * Track room join
 */
export const trackRoomJoined = (roomCode) => {
  // GA4
  trackEvent('room_joined', { room_code: roomCode })

  // Plausible
  trackPlausible('Room Joined')

  // Clarity
  trackClarity('room_joined')
}

/**
 * Track game start in multiplayer
 */
export const trackGameStarted = (params = {}) => {
  const { playerCount, imposterCount, isMultiplayer } = params

  // GA4
  trackEvent('game_started', {
    player_count: playerCount,
    imposter_count: imposterCount,
    is_multiplayer: isMultiplayer,
  })

  // Plausible
  trackPlausible('Game Started', {
    multiplayer: isMultiplayer ? 'yes' : 'no',
    players: playerCount || 0,
  })

  // Clarity
  trackClarity('game_started')
  if (isMultiplayer) {
    upgradeClarity('multiplayer_game')
  }
}

/**
 * Track AI image generation
 */
export const trackImageGenerated = (params = {}) => {
  const { category, success } = params

  // GA4
  trackEvent('image_generated', {
    category: category,
    success: success,
  })

  // Plausible
  if (success) {
    trackPlausible('AI Image Generated', { category: category || 'unknown' })
  } else {
    trackPlausible('AI Image Failed')
  }

  // Clarity
  trackClarity(success ? 'image_generated' : 'image_failed')
}

/**
 * Track feature usage
 */
export const trackFeatureUsed = (featureName, details = {}) => {
  // GA4
  trackEvent('feature_used', {
    feature_name: featureName,
    ...details,
  })

  // Plausible
  trackPlausible('Feature Used', { feature: featureName })

  // Clarity
  trackClarity(`feature_${featureName}`)
}

/**
 * Track error occurrence
 */
export const trackError = (errorType, errorMessage) => {
  // GA4
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
  })

  // Plausible
  trackPlausible('Error', { type: errorType })

  // Clarity
  trackClarity('error')
}

// ============================================================
// CLARITY-SPECIFIC UTILITIES
// ============================================================

export const identifyUserInClarity = (userId) => {
  if (!isClarityEnabled()) return
  try {
    window.clarity?.('identify', userId)
  } catch (error) {
    console.error('Clarity identify error:', error)
  }
}

export const setClarityTag = (key, value) => {
  if (!isClarityEnabled()) return
  try {
    window.clarity?.('set', key, value)
  } catch (error) {
    console.error('Clarity tag error:', error)
  }
}

// ============================================================
// INITIALIZATION CHECK
// ============================================================

export const checkAnalyticsStatus = () => {
  return {
    ga4: {
      enabled: isGAEnabled(),
      measurementId: GA_MEASUREMENT_ID || 'not set',
    },
    plausible: {
      enabled: isPlausibleEnabled(),
      domain: PLAUSIBLE_DOMAIN,
    },
    clarity: {
      enabled: isClarityEnabled(),
      projectId: CLARITY_PROJECT_ID || 'not set',
    },
  }
}

// Debug helper (only in development)
if (import.meta.env.DEV) {
  window.__checkAnalytics = checkAnalyticsStatus
}
