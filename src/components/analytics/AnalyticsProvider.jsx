/**
 * Analytics Provider Component
 * [INPUT]: Children components
 * [OUTPUT]: Analytics tracking context
 * [POS]: Component Layer - Analytics
 *
 * Handles:
 * - Route change tracking
 * - Initial page load tracking
 * - Analytics status logging (dev only)
 */

import { useEffect, useRef } from 'react'
import {
  trackPageview,
  checkAnalyticsStatus,
  GA_MEASUREMENT_ID,
  CLARITY_PROJECT_ID,
  PLAUSIBLE_DOMAIN,
  PLAUSIBLE_SCRIPT_ID,
} from '@/lib/analytics'

// Script loading helper
const loadScript = (src, id, async = true) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = async
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Initialize inline script
const initScript = (id, code) => {
  if (document.getElementById(id)) return

  const script = document.createElement('script')
  script.id = id
  script.innerHTML = code
  document.head.appendChild(script)
}

export function AnalyticsProvider({ children }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initAnalytics = async () => {
      // 1. Google Analytics 4
      if (GA_MEASUREMENT_ID) {
        try {
          await loadScript(
            `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
            'ga4-script'
          )
          initScript('ga4-init', `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `)
          console.log('✅ GA4 initialized:', GA_MEASUREMENT_ID)
        } catch (e) {
          console.error('❌ GA4 failed to load:', e)
        }
      }

      // 2. Plausible Analytics
      if (PLAUSIBLE_SCRIPT_ID || PLAUSIBLE_DOMAIN) {
        try {
          // Use custom script ID if available, otherwise fallback to generic
          const scriptUrl = PLAUSIBLE_SCRIPT_ID
            ? `https://plausible.io/js/${PLAUSIBLE_SCRIPT_ID}.js`
            : 'https://plausible.io/js/script.js'

          await loadScript(scriptUrl, 'plausible-script')

          // Set data-domain attribute for generic script
          if (!PLAUSIBLE_SCRIPT_ID) {
            const plausibleScript = document.getElementById('plausible-script')
            if (plausibleScript) {
              plausibleScript.setAttribute('data-domain', PLAUSIBLE_DOMAIN)
            }
          }

          initScript('plausible-init', `
            window.plausible = window.plausible || function() {
              (window.plausible.q = window.plausible.q || []).push(arguments)
            };
            plausible.init = plausible.init || function(i) { plausible.o = i || {} };
            plausible.init();
          `)
          console.log('✅ Plausible initialized:', PLAUSIBLE_SCRIPT_ID || PLAUSIBLE_DOMAIN)
        } catch (e) {
          console.error('❌ Plausible failed to load:', e)
        }
      }

      // 3. Microsoft Clarity
      if (CLARITY_PROJECT_ID) {
        try {
          initScript('clarity-init', `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `)
          console.log('✅ Clarity initialized:', CLARITY_PROJECT_ID)
        } catch (e) {
          console.error('❌ Clarity failed to load:', e)
        }
      }

      // Log status in development
      if (import.meta.env.DEV) {
        setTimeout(() => {
          console.log('📊 Analytics Status:', checkAnalyticsStatus())
        }, 2000)
      }
    }

    initAnalytics()

    // Track initial pageview
    trackPageview(window.location.pathname)

    // Listen for route changes (for SPA navigation)
    const handleRouteChange = () => {
      trackPageview(window.location.pathname)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return children
}

export default AnalyticsProvider
