/**
 * Unified Logo Component
 * [INPUT]: size, showText, className
 * [OUTPUT]: Consistent brand logo across the app
 * [POS]: UI Layer - Brand
 */

import { cn } from "@/lib/utils"

// SVG Icon - Stylized "?" mark representing mystery/imposter
function LogoIcon({ className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="url(#logoGradient)" />

      {/* Question mark - represents mystery/imposter */}
      <path
        d="M16 22.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
        fill="white"
      />
      <path
        d="M16 6c-3.5 0-6 2.5-6 6h3c0-1.5 1.5-3 3-3s3 1.5 3 3c0 2-3 2.5-3 6h3c0-2 3-3 3-6 0-3.5-2.5-6-6-6z"
        fill="white"
      />
    </svg>
  )
}

// Main Logo Component
export function Logo({
  size = "default",
  showText = true,
  className,
  textClassName
}) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-sm", gap: "gap-1.5" },
    default: { icon: "w-8 h-8", text: "text-lg", gap: "gap-2" },
    lg: { icon: "w-10 h-10", text: "text-xl", gap: "gap-2.5" },
    xl: { icon: "w-12 h-12", text: "text-2xl", gap: "gap-3" },
  }

  const { icon, text, gap } = sizes[size] || sizes.default

  return (
    <div className={cn("flex items-center", gap, className)}>
      <LogoIcon className={icon} />
      {showText && (
        <span className={cn("font-bold tracking-tight", text, textClassName)}>
          <span className="text-foreground">Imposter</span>
          <span className="text-primary">Game</span>
        </span>
      )}
    </div>
  )
}

// Export icon separately for favicon/small uses
export { LogoIcon }

export default Logo
