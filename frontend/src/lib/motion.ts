import type { Transition, Variants } from 'framer-motion'

export const spring: Transition = { type: 'spring', stiffness: 320, damping: 26 }
export const ease: Transition   = { duration: 0.22, ease: 'easeOut' }
export const easeMd: Transition = { duration: 0.28, ease: 'easeOut' }

// ── Page enter / exit ─────────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

// ── Slide down (error banners, alerts) ────────────────────────────────────────
export const slideDown: Variants = {
  initial: { opacity: 0, y: -10, scaleY: 0.92 },
  animate: { opacity: 1, y: 0,   scaleY: 1, transition: { ...spring } },
  exit:    { opacity: 0, y: -8,  scaleY: 0.95, transition: { ...ease } },
}

// ── Pop in (logo, icon, badge) ────────────────────────────────────────────────
export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.75 },
  animate: { opacity: 1, scale: 1, transition: { ...spring } },
}

// ── Sidebar nav – stagger container ──────────────────────────────────────────
export const navContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
}

// ── Sidebar nav – individual item ─────────────────────────────────────────────
export const navItem: Variants = {
  initial: { opacity: 0, x: -14 },
  animate: { opacity: 1, x: 0, transition: { ...spring } },
}
