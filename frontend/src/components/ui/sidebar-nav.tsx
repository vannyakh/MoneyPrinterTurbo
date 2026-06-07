import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Cog,
  ChevronsLeft,
  ChevronsRight,
  ListVideo,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { navContainer, navItem } from '../../lib/motion'
import { useSidebarStore } from '../../store/sidebar-store'
import { SettingsModal } from './settings-modal'
import { Tooltip } from './tooltip'

const EXPANDED_W = 240
const COLLAPSED_W = 68

const mainNavItems = [
  { to: ROUTES.create, label: 'Create', icon: Video },
  { to: ROUTES.tasks,  label: 'Tasks',  icon: ListVideo },
] as const

function NavTooltip({ show, label, children }: { show: boolean; label: string; children: React.ReactNode }) {
  if (!show) return <>{children}</>
  return <Tooltip content={label} placement="right">{children}</Tooltip>
}

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, width: 'auto' }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: 0.18, ease: 'easeInOut' }}
      style={{ overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 0 }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ visible, children }: { visible: boolean; children: string }) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15 }}
          style={{ overflow: 'hidden', paddingLeft: 16, paddingBottom: 6, paddingTop: 2 }}
        >
          <Text
            fontSize="10px"
            fontWeight="700"
            color="text.muted"
            letterSpacing="wider"
            textTransform="uppercase"
          >
            {children}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SidebarNav() {
  const { collapsed, toggle } = useSidebarStore()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <motion.div
        animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{ flexShrink: 0, position: 'relative' }}
      >
        <Flex
          as="nav"
          direction="column"
          w="full"
          h="100vh"
          bg="bg.sidebar"
          borderRight="1px solid"
          borderColor="border.default"
          overflow="hidden"
          gap={0}
        >
          <Box px={collapsed ? '10px' : '12px'} pt={5} pb={4}>
            <AnimatePresence mode="wait" initial={false}>
              {collapsed ? (
                <motion.div
                  key="c-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                  >
                    <Flex
                      w="36px"
                      h="36px"
                      align="center"
                      justify="center"
                      bg="blue.500"
                      borderRadius="logo"
                    >
                      <Text fontSize="lg" lineHeight={1}>💸</Text>
                    </Flex>
                  </motion.div>

                  <Tooltip content="Expand sidebar" placement="right">
                    <motion.div whileTap={{ scale: 0.85, x: 2 }}>
                      <IconButton
                        aria-label="Expand sidebar"
                        size="xs"
                        variant="ghost"
                        borderRadius="nav"
                        color="text.muted"
                        _hover={{ bg: 'bg.active', color: 'blue.500' }}
                        onClick={toggle}
                      >
                        <ChevronsRight size={14} />
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                </motion.div>
              ) : (
                <motion.div
                  key="e-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <HStack justify="space-between" align="center">
                    <HStack gap={2.5} overflow="hidden" minW={0}>
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                        style={{ flexShrink: 0 }}
                      >
                        <Flex
                          w="36px"
                          h="36px"
                          align="center"
                          justify="center"
                          bg="blue.500"
                          borderRadius="logo"
                        >
                          <Text fontSize="lg" lineHeight={1}>💸</Text>
                        </Flex>
                      </motion.div>
                      <Box overflow="hidden">
                        <Text fontWeight="800" fontSize="sm" color="text.primary" lineHeight={1.2} whiteSpace="nowrap">
                          MoneyPrinter
                        </Text>
                      </Box>
                    </HStack>

                    <Tooltip content="Collapse sidebar">
                      <motion.div whileTap={{ scale: 0.85, x: -2 }}>
                        <IconButton
                          aria-label="Collapse sidebar"
                          size="xs"
                          variant="ghost"
                          borderRadius="nav"
                          color="text.muted"
                          _hover={{ bg: 'bg.active', color: 'text.primary' }}
                          onClick={toggle}
                          flexShrink={0}
                        >
                          <ChevronsLeft size={14} />
                        </IconButton>
                      </motion.div>
                    </Tooltip>
                  </HStack>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          <SectionLabel visible={!collapsed}>Menu</SectionLabel>
          <motion.div
            variants={navContainer}
            initial="initial"
            animate="animate"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              padding: collapsed ? '4px 10px' : '4px 12px',
            }}
          >
            {mainNavItems.map(({ to, label, icon: Icon }) => (
              <motion.div key={to} variants={navItem}>
                <NavTooltip show={collapsed} label={label}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [
                        'block rounded-[14px] transition-all duration-150 select-none',
                        isActive
                          ? 'bg-blue-500/[0.10] dark:bg-blue-500/[0.20]'
                          : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.05]',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <motion.div
                        className={[
                          'flex items-center gap-3 py-2.5',
                          collapsed ? 'justify-center px-1.5' : 'px-2.5',
                        ].join(' ')}
                        whileHover={{ x: collapsed ? 0 : 2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      >
                        <div
                          className={[
                            'flex items-center justify-center w-8 h-8 rounded-[10px] flex-shrink-0 transition-colors duration-150',
                            isActive && collapsed
                              ? 'bg-blue-500/[0.18] dark:bg-blue-500/[0.28]'
                              : '',
                          ].join(' ')}
                        >
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-400 dark:text-slate-500'
                            }
                          />
                        </div>

                        {/* Label */}
                        <AnimatePresence initial={false}>
                          {!collapsed && (
                            <SideLabel>
                              <Text
                                fontWeight={isActive ? '700' : '600'}
                                fontSize="sm"
                                color={isActive ? 'text.nav.active' : 'text.nav.inactive'}
                              >
                                {label}
                              </Text>
                            </SideLabel>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </NavLink>
                </NavTooltip>
              </motion.div>
            ))}
          </motion.div>

          <Box flex={1} />

          <Box px={collapsed ? '10px' : '12px'} pb={3}>
            <NavTooltip show={collapsed} label="Settings">
              <motion.button
                className={[
                  'w-full flex items-center gap-3 rounded-[14px] transition-all duration-150 select-none',
                  'hover:bg-black/[0.05] dark:hover:bg-white/[0.05]',
                  collapsed ? 'justify-center px-1.5 py-2.5' : 'px-2.5 py-2.5',
                ].join(' ')}
                onClick={() => setSettingsOpen(true)}
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-[10px] flex-shrink-0">
                  <Cog size={18} className="text-slate-400 dark:text-slate-500" />
                </div>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <SideLabel>
                      <Text fontWeight="600" fontSize="sm" color="text.nav.inactive">
                        Settings
                      </Text>
                    </SideLabel>
                  )}
                </AnimatePresence>
              </motion.button>
            </NavTooltip>
          </Box>

          <Box pb={4} />
        </Flex>

        <motion.div
          onClick={toggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            right: -3,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: 'col-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <Box
            h="52px"
            w="3px"
            borderRadius="full"
            bg="blue.400"
          />
        </motion.div>
      </motion.div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
