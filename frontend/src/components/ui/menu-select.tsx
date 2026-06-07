import { Field, Portal, Select, createListCollection } from '@chakra-ui/react'
import { useMemo } from 'react'
import { fieldTriggerStyle } from '../../lib/field-styles'

export type MenuSelectOption = {
  value: string
  label: string
}

type MenuSelectProps = {
  options: MenuSelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  inDialog?: boolean
}

export function MenuSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  inDialog = false,
}: MenuSelectProps) {
  const collection = useMemo(
    () => createListCollection({ items: options }),
    [options],
  )

  const positioner = (
    <Select.Positioner>
      <Select.Content
        borderRadius="input"
        borderColor="border.default"
        bg="bg.surface"
        shadow="md"
        maxH="280px"
        overflowY="auto"
      >
        {collection.items.map((item) => (
          <Select.Item item={item} key={item.value}>
            {item.label}
            <Select.ItemIndicator />
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Positioner>
  )

  return (
    <Select.Root
      collection={collection}
      value={value !== undefined && value !== null ? [String(value)] : []}
      onValueChange={(details) => onChange(details.value[0] ?? '')}
      disabled={disabled}
      size="md"
      width="full"
      positioning={
        inDialog ? { strategy: 'fixed', hideWhenDetached: true } : undefined
      }
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger {...fieldTriggerStyle}>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      {inDialog ? positioner : <Portal>{positioner}</Portal>}
    </Select.Root>
  )
}

const defaultLabelStyle = { fontWeight: '700', color: 'text.primary', fontSize: 'sm' } as const

type FieldMenuSelectProps = MenuSelectProps & {
  label: string
  helperText?: string
  labelStyle?: typeof defaultLabelStyle
}

/** Field label + custom menu select + optional helper text */
export function FieldMenuSelect({
  label,
  helperText,
  labelStyle = defaultLabelStyle,
  ...selectProps
}: FieldMenuSelectProps) {
  return (
    <Field.Root>
      <Field.Label {...labelStyle}>{label}</Field.Label>
      <MenuSelect {...selectProps} />
      {helperText ? (
        <Field.HelperText fontSize="xs" color="text.muted">
          {helperText}
        </Field.HelperText>
      ) : null}
    </Field.Root>
  )
}

/** Build options from numeric presets */
export function numberOptions(values: readonly number[]): MenuSelectOption[] {
  return values.map((v) => ({ value: String(v), label: String(v) }))
}
