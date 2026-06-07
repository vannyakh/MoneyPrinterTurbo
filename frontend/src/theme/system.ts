import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    // ── Custom keyframes ──────────────────────────────────────────────────────
    keyframes: {
      fadeSlideUp: {
        from: { opacity: '0', transform: 'translateY(12px)' },
        to:   { opacity: '1', transform: 'translateY(0)' },
      },
      pulseDot: {
        '0%, 100%': { opacity: '1' },
        '50%':       { opacity: '0.4' },
      },
    },

    // ── Design tokens ─────────────────────────────────────────────────────────
    tokens: {
      radii: {
        card:  { value: '20px' },
        btn:   { value: '12px' },
        input: { value: '12px' },
        badge: { value: '8px' },
        nav:   { value: '14px' },
        logo:  { value: '14px' },
      },
      fonts: {
        body:    { value: "'Inter', system-ui, -apple-system, sans-serif" },
        heading: { value: "'Inter', system-ui, -apple-system, sans-serif" },
        mono:    { value: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" },
      },
    },

    // ── Text styles ───────────────────────────────────────────────────────────
    textStyles: {
      'page.title': {
        value: {
          fontSize: '1.5rem',
          fontWeight: '800',
          lineHeight: '1.25',
          letterSpacing: '-0.025em',
          color: '{colors.text.primary}',
        },
      },
      'section.title': {
        value: {
          fontSize: '1rem',
          fontWeight: '700',
          lineHeight: '1.3',
          color: '{colors.text.primary}',
        },
      },
      'label': {
        value: {
          fontSize: '0.875rem',
          fontWeight: '700',
          lineHeight: '1.4',
          color: '{colors.text.primary}',
        },
      },
      'body.sm': {
        value: {
          fontSize: '0.875rem',
          fontWeight: '500',
          lineHeight: '1.6',
          color: '{colors.text.secondary}',
        },
      },
    },

    // ── Semantic color tokens ─────────────────────────────────────────────────
    semanticTokens: {
      colors: {
        bg: {
          canvas:  { value: { _light: '#f0f4ff', _dark: '#0b1020' } },
          surface: { value: { _light: '#ffffff',  _dark: '#0f1b30' } },
          subtle:  { value: { _light: '#e8edf8',  _dark: '#162035' } },
          accent:  { value: { _light: '#dbeafe',  _dark: '#1e3a5f' } },
          error:   { value: { _light: '#fee2e2',  _dark: 'rgba(127,29,29,0.4)' } },
          sidebar: { value: { _light: '#ffffff',  _dark: '#0c1626' } },
          hover:   { value: { _light: 'rgba(59,130,246,0.08)', _dark: 'rgba(255,255,255,0.05)' } },
          active:  { value: { _light: 'rgba(59,130,246,0.14)', _dark: 'rgba(59,130,246,0.18)' } },
        },
        border: {
          default: { value: { _light: 'rgba(0,0,0,0.09)',    _dark: 'rgba(148,163,184,0.14)' } },
          strong:  { value: { _light: 'rgba(0,0,0,0.18)',    _dark: 'rgba(148,163,184,0.28)' } },
          error:   { value: { _light: 'rgba(239,68,68,0.5)', _dark: 'rgba(248,113,113,0.5)' } },
        },
        text: {
          primary:   { value: { _light: '#0f172a', _dark: '#f1f5f9' } },
          secondary: { value: { _light: '#475569', _dark: '#94a3b8' } },
          muted:     { value: { _light: '#94a3b8', _dark: '#4b5680' } },
          success:   { value: { _light: '#15803d', _dark: '#86efac' } },
          error:     { value: { _light: '#dc2626', _dark: '#fca5a5' } },
          link:      { value: { _light: '#2563eb', _dark: '#60a5fa' } },
          nav: {
            active:   { value: { _light: '#1d4ed8', _dark: '#93c5fd' } },
            inactive: { value: { _light: '#475569', _dark: '#64748b' } },
          },
        },
        brand: {
          50:  { value: { _light: '#eff6ff', _dark: '#1e3a8a' } },
          100: { value: { _light: '#dbeafe', _dark: '#1e40af' } },
          200: { value: { _light: '#bfdbfe', _dark: '#1d4ed8' } },
          300: { value: { _light: '#93c5fd', _dark: '#2563eb' } },
          400: { value: { _light: '#60a5fa', _dark: '#3b82f6' } },
          500: { value: { _light: '#3b82f6', _dark: '#60a5fa' } },
          600: { value: { _light: '#2563eb', _dark: '#93c5fd' } },
        },
      },

      // ── Animation style tokens ─────────────────────────────────────────────
      animations: {
        'fade-slide-up': {
          value: 'fadeSlideUp 0.25s ease-out both',
        },
        'pulse-dot': {
          value: 'pulseDot 1.8s ease-in-out infinite',
        },
      },
    },
  },

  // ── Global CSS ───────────────────────────────────────────────────────────────
  globalCss: {
    body: {
      bg: 'bg.canvas',
      color: 'text.primary',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontWeight: '400',
    },
    '::selection': {
      bg: 'blue.200',
      color: 'blue.900',
    },
    ':focus-visible': {
      outlineColor: 'blue.500',
      outlineOffset: '2px',
    },
  },
})

export const appSystem = createSystem(defaultConfig, config)
