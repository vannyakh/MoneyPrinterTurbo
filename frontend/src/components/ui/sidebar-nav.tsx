import {
  Box,
  Flex,
  HStack,
  IconButton,
  NativeSelect,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Cog, ListVideo, Moon, Sun, Video } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { LOCALES } from '../../constants/app'
import { ROUTES } from '../../constants/routes'
import { useColorModeStore } from '../../store/color-mode-store'
import { useVideoStore } from '../../store/video-store'

const navItems = [
  { to: ROUTES.create,   label: 'Create',   icon: Video },
  { to: ROUTES.tasks,    label: 'Tasks',     icon: ListVideo },
  { to: ROUTES.settings, label: 'Settings',  icon: Cog },
] as const

export function SidebarNav() {
  const { colorMode, toggleColorMode } = useColorModeStore()
  const isDark = colorMode === 'dark'

  const locale    = useVideoStore((s) => s.locale)
  const setLocale = useVideoStore((s) => s.setLocale)

  return (
    <Flex
      as="nav"
      direction="column"
      w="240px"
      flexShrink={0}
      minH="100vh"
      bg="bg.sidebar"
      borderRight="1px solid"
      borderColor="border.default"
      py={5}
      px={3}
      gap={0}
    >
      {/* ── Logo / brand ── */}
      <HStack gap={3} px={3} pb={6}>
        <Flex
          w="36px"
          h="36px"
          align="center"
          justify="center"
          bg="blue.500"
          borderRadius="logo"
          flexShrink={0}
        >
          <Text fontSize="lg" lineHeight={1}>💸</Text>
        </Flex>
        <Box>
          <Text fontWeight="800" fontSize="sm" color="text.primary" lineHeight={1.2}>
            MoneyPrinter
          </Text>
          <Text fontWeight="600" fontSize="xs" color="text.secondary" lineHeight={1.4}>
            Turbo
          </Text>
        </Box>
      </HStack>

      {/* ── Nav items ── */}
      <Stack gap={1} flex={1}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-semibold transition-all duration-150 select-none',
                isActive
                  ? 'bg-blue-500/[0.15] text-blue-400 dark:text-blue-300'
                  : 'hover:bg-white/[0.05] dark:hover:bg-white/[0.05]',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <HStack gap={3}>
                <Icon
                  size={18}
                  className={
                    isActive
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }
                />
                <Text
                  fontWeight="600"
                  fontSize="sm"
                  color={isActive ? 'text.nav.active' : 'text.nav.inactive'}
                >
                  {label}
                </Text>
              </HStack>
            )}
          </NavLink>
        ))}
      </Stack>

      {/* ── Bottom: language + theme toggle ── */}
      <Stack
        gap={3}
        pt={4}
        borderTop="1px solid"
        borderColor="border.default"
        px={1}
      >
        <NativeSelect.Root size="sm">
          <NativeSelect.Field
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            borderRadius="input"
            fontWeight="500"
            fontSize="xs"
            bg="bg.subtle"
            borderColor="border.default"
          >
            {Object.entries(LOCALES).map(([code, name]) => (
              <option key={code} value={code}>
                {code} – {name}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        <HStack justify="space-between" px={1}>
          <Text fontSize="xs" fontWeight="600" color="text.muted">
            {isDark ? 'Dark mode' : 'Light mode'}
          </Text>
          <IconButton
            aria-label="Toggle color mode"
            size="sm"
            variant="ghost"
            onClick={toggleColorMode}
            borderRadius="nav"
            color="text.secondary"
            _hover={{ bg: 'bg.hover', color: 'text.primary' }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>
        </HStack>
      </Stack>
    </Flex>
  )
}
