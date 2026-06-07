export const noRingFocus = {
  _focus: { outline: 'none', boxShadow: 'none' },
  _focusVisible: { outline: 'none', boxShadow: 'none' },
} as const

export const inputStyle = {
  borderRadius: 'input',
  borderColor: 'border.default',
  bg: 'bg.subtle',
  fontWeight: '500',
  ...noRingFocus,
} as const

export const fieldTriggerStyle = {
  borderRadius: 'input',
  borderColor: 'border.default',
  bg: 'bg.subtle',
  fontWeight: '500' as const,
  ...noRingFocus,
} as const

export const labelStyle = {
  fontWeight: '700',
  color: 'text.primary',
  fontSize: 'sm',
} as const
