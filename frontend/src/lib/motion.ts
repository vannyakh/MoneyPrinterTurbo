import type { Transition, Variants } from 'framer-motion'

export const spring: Transition = { type: 'spring', stiffness: 320, damping: 26 }
export const ease: Transition     = { duration: 0.2, ease: 'easeOut' }
export const easeFast: Transition = { duration: 0.15, ease: 'easeOut' }

// ── Page enter / exit (opacity only) ──────────────────────────────────────────
export const pageFade: Transition = { duration: 0.24, ease: 'easeOut' }
export const pageFadeFast: Transition = { duration: 0.16, ease: 'easeOut' }

export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: pageFade },
  exit:    { opacity: 0, transition: pageFadeFast },
}

// ── In-panel content swap (preview states, tabs) ──────────────────────────────
export const contentFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: ease },
  exit:    { opacity: 0, transition: easeFast },
}

// ── Slide down (error banners, alerts) ────────────────────────────────────────
export const slideDown: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: ease },
  exit:    { opacity: 0, y: -6, transition: easeFast },
}

// ── Pop in (logo, icon, badge) ────────────────────────────────────────────────
export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: ease },
}

// ── Sidebar nav – stagger container ──────────────────────────────────────────
export const navContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
}

// ── Sidebar nav – individual item ─────────────────────────────────────────────
export const navItem: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: ease },
}

// ── Preview panel (opacity only, same as page fade) ───────────────────────────
export const panelSlide: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: pageFade },
  exit:    { opacity: 0, transition: pageFadeFast },
}

// ── Stagger list / grid ───────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.035, delayChildren: 0.03 } },
}

export const fadeUpItem: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: ease },
  exit:    { opacity: 0, transition: easeFast },
}

export const viewSwitch: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: ease },
  exit:    { opacity: 0, transition: easeFast },
}
