/**
 * Footer Component
 * [INPUT]: None
 * [OUTPUT]: Site footer with links
 * [POS]: UI Layer - Landing Components
 */

import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/ui/Logo"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 bg-muted/30 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Logo size="default" />

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How to Play
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </nav>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} Imposter Game Generator. Free party game for
            everyone.
          </p>
        </div>
      </div>
    </footer>
  )
}
