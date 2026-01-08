/**
 * Vercel Serverless Function - Gemini Image Generation
 * [INPUT]: POST { prompt, style, aspect, quality }
 * [OUTPUT]: { success, imageUrl (base64 data URL) }
 * [POS]: API Layer - Image Generation
 */

export const config = {
  maxDuration: 60, // Gemini can take up to 30s
}

// Style prompts based on quirkiness level
const STYLE_PROMPTS = {
  1: {
    style: "realistic",
    modifier: "clean lines, professional, minimalist, clear illustration"
  },
  2: {
    style: "artistic",
    modifier: "kawaii style, cute cartoon, soft colors, friendly character"
  },
  3: {
    style: "vibrant",
    modifier: "playful, quirky, vibrant colors, fun cartoonish style"
  },
  4: {
    style: "dramatic",
    modifier: "exaggerated features, bold colors, comedic, humorous caricature"
  },
  5: {
    style: "artistic",
    modifier: "surrealist, dreamlike, psychedelic colors, bizarre abstract"
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  }

  try {
    const { word, quirkiness = 3 } = req.body

    if (!word) {
      return res.status(400).json({ error: 'Word is required' })
    }

    const styleConfig = STYLE_PROMPTS[quirkiness] || STYLE_PROMPTS[3]

    // Build the prompt for Gemini
    const prompt = `Generate a fun, quirky illustration of "${word}" for a party game.
Style: ${styleConfig.modifier}.
The image should be a single centered illustration with NO text, NO words, NO letters in the image.
Square format (1:1 aspect ratio).
Make it visually interesting and slightly humorous while still being recognizable as "${word}".
The style should be suitable for a social deduction game card.`

    console.log(`Generating image for: ${word} (quirkiness: ${quirkiness})`)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192,
            responseModalities: ['IMAGE', 'TEXT']
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return res.status(500).json({
        error: `Gemini API error: ${response.status}`,
        details: errorText
      })
    }

    const result = await response.json()

    // Extract image from response
    if (!result.candidates || result.candidates.length === 0) {
      return res.status(500).json({ error: 'No candidates in Gemini response' })
    }

    const candidate = result.candidates[0]
    const parts = candidate.content?.parts || []

    let imageData = null
    let mimeType = 'image/png'

    for (const part of parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data
        mimeType = part.inlineData.mimeType || 'image/png'
        break
      }
    }

    if (!imageData) {
      console.error('No image in Gemini response:', JSON.stringify(result, null, 2).substring(0, 500))
      return res.status(500).json({ error: 'No image data in Gemini response' })
    }

    // Return as data URL
    const dataUrl = `data:${mimeType};base64,${imageData}`

    return res.status(200).json({
      success: true,
      imageUrl: dataUrl,
      word,
      quirkiness
    })

  } catch (error) {
    console.error('Image generation error:', error)
    return res.status(500).json({
      error: 'Failed to generate image',
      message: error.message
    })
  }
}
