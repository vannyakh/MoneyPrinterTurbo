import { Tooltip as ChakraTooltip } from '@chakra-ui/react'
import type { PropsWithChildren } from 'react'

interface TooltipProps extends PropsWithChildren {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ children, content, placement = 'top' }: TooltipProps) {
  return (
    <ChakraTooltip.Root positioning={{ placement }}>
      <ChakraTooltip.Trigger asChild>
        {children}
      </ChakraTooltip.Trigger>
      <ChakraTooltip.Positioner>
        <ChakraTooltip.Content>
          <ChakraTooltip.Arrow>
            <ChakraTooltip.ArrowTip />
          </ChakraTooltip.Arrow>
          {content}
        </ChakraTooltip.Content>
      </ChakraTooltip.Positioner>
    </ChakraTooltip.Root>
  )
}
