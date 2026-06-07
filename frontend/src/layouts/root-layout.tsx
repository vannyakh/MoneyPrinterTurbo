import { Flex } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LoadingScreen } from '../components/ui/loading-screen'
import { PageTransition } from '../components/ui/page-transition'
import { SidebarNav } from '../components/ui/sidebar-nav'

export default function RootLayout() {
  const location = useLocation()

  return (
    // h="100vh" + overflow="hidden" makes both columns fixed to viewport
    // so the sidebar stays in place while page content scrolls independently
    <Flex h="100vh" overflow="hidden">
      <SidebarNav />
      <Flex flex={1} direction="column" overflow="hidden">
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </Flex>
    </Flex>
  )
}
