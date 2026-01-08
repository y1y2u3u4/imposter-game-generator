/**
 * Image Generation Service - F007/F008
 * [INPUT]: word, quirkiness level (1-5)
 * [OUTPUT]: Generated image URL (base64 data URL or fallback)
 * [POS]: Service Layer - AI Integration
 */

// API endpoint for image generation
// Uses relative path - works with vercel dev and production
const API_ENDPOINT = '/api/generate-image'

// Quirkiness level descriptions (for UI)
export const QUIRKINESS_LABELS = {
  1: "Realistic",
  2: "Cute",
  3: "Quirky",
  4: "Funny",
  5: "Absurd"
}

/**
 * Generate image using Gemini API via serverless function
 */
export async function generateImage(word, quirkiness = 3, options = {}) {
  const { onProgress } = options

  // Report start
  onProgress?.({ status: 'generating', progress: 10 })

  try {
    // Call the API endpoint
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ word, quirkiness })
    })

    onProgress?.({ status: 'generating', progress: 50 })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate image')
    }

    const result = await response.json()

    onProgress?.({ status: 'complete', progress: 100 })

    return {
      success: true,
      imageUrl: result.imageUrl,
      prompt: `Generated for: ${word}`
    }

  } catch (error) {
    console.warn('Gemini image generation failed, using fallback:', error.message)
    onProgress?.({ status: 'fallback', progress: 100 })

    // Fallback to DiceBear placeholder
    const fallbackUrl = getFallbackImage(word, quirkiness)
    return {
      success: true,
      imageUrl: fallbackUrl,
      fallback: true,
      error: error.message
    }
  }
}

/**
 * Get fallback image using DiceBear
 */
function getFallbackImage(word, quirkiness) {
  const styles = ['bottts', 'fun-emoji', 'thumbs', 'shapes', 'icons']
  const style = styles[Math.min(quirkiness - 1, styles.length - 1)]
  const seed = encodeURIComponent(word.toLowerCase())
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=transparent`
}

/**
 * Generate images for a word pair (civilian word and imposter word)
 * F010+F012: Uses caching for better performance
 */
export async function generateWordPairImages(civilianWord, imposterWord, quirkiness = 3, options = {}) {
  const { onProgress } = options

  onProgress?.({ status: 'starting', civilian: 0, imposter: 0 })

  // Generate both images in parallel with caching
  const [civilianResult, imposterResult] = await Promise.all([
    generateImageWithCache(civilianWord, quirkiness, {
      onProgress: (p) => onProgress?.({ ...p, type: 'civilian' })
    }),
    generateImageWithCache(imposterWord, quirkiness, {
      onProgress: (p) => onProgress?.({ ...p, type: 'imposter' })
    })
  ])

  return {
    civilian: civilianResult,
    imposter: imposterResult,
    success: civilianResult.success && imposterResult.success
  }
}

/**
 * Check if image is cached in localStorage
 */
export function getCachedImage(word, quirkiness) {
  const key = `img_${word}_q${quirkiness}`
  const cached = localStorage.getItem(key)
  if (cached) {
    try {
      const data = JSON.parse(cached)
      // Check if cache is still valid (7 days) and is a real image (not fallback)
      const isValid = Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000
      const isRealImage = !data.fallback && data.imageUrl?.startsWith('data:image')

      if (isValid && isRealImage) {
        return data.imageUrl
      }
    } catch (e) {
      // Invalid cache, ignore
    }
  }
  return null
}

/**
 * Cache image in localStorage
 */
export function cacheImage(word, quirkiness, imageUrl, isFallback = false) {
  // Only cache real Gemini images, not fallbacks
  if (isFallback) return

  const key = `img_${word}_q${quirkiness}`
  const data = {
    imageUrl,
    timestamp: Date.now(),
    fallback: isFallback
  }
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    // localStorage full or unavailable, ignore
    console.warn('Failed to cache image:', e)
  }
}

/**
 * Generate image with caching
 */
export async function generateImageWithCache(word, quirkiness = 3, options = {}) {
  // Check cache first
  const cached = getCachedImage(word, quirkiness)
  if (cached) {
    options.onProgress?.({ status: 'complete', progress: 100, cached: true })
    return { success: true, imageUrl: cached, cached: true }
  }

  // Generate new image
  const result = await generateImage(word, quirkiness, options)

  // Cache if successful and not a fallback
  if (result.success && result.imageUrl && !result.fallback) {
    cacheImage(word, quirkiness, result.imageUrl, false)
  }

  return result
}

/**
 * Clear image cache
 */
export function clearImageCache() {
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('img_')) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
  console.log(`Cleared ${keysToRemove.length} cached images`)
}
