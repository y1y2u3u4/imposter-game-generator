/**
 * InviteModal Component - F014
 * [INPUT]: room, onClose
 * [OUTPUT]: Modal with QR code and share link
 * [POS]: UI Layer - Room Components
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Share2, QrCode, Link } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function InviteModal({ isOpen, onClose, room }) {
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const roomCode = room?.room_code || ""
  const joinUrl = `${window.location.origin}?join=${roomCode}`

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Imposter Game!",
          text: `Join my game room with code: ${roomCode}`,
          url: joinUrl
        })
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err)
        }
      }
    } else {
      copyLink()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-2xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Invite Players</h2>
                    <p className="text-xs text-muted-foreground">Share the room code</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG
                    value={joinUrl}
                    size={180}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Scan to join instantly
                </p>
              </div>

              {/* Room Code */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2 text-center">Or enter room code</p>
                <div
                  onClick={copyCode}
                  className={cn(
                    "flex items-center justify-center gap-3 p-4 rounded-xl cursor-pointer transition-all",
                    "bg-primary/10 border-2 border-dashed border-primary/30",
                    "hover:bg-primary/20 hover:border-primary/50"
                  )}
                >
                  <span className="font-mono text-3xl font-bold tracking-[0.3em] text-primary">
                    {roomCode}
                  </span>
                  {copied ? (
                    <Check className="h-5 w-5 text-success" />
                  ) : (
                    <Copy className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  {copied ? "Copied!" : "Tap to copy code"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={copyLink}
                  className="flex-1 h-11 rounded-xl"
                >
                  {copiedLink ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Link className="mr-2 h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  onClick={share}
                  className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
