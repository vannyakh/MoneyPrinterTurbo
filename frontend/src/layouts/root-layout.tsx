import { Flex } from '@chakra-ui/react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LoadingScreen } from '../components/ui/loading-screen'
import { SidebarNav } from '../components/ui/sidebar-nav'

export default function RootLayout() {
  return (
    <Flex minH="100vh">
      <SidebarNav />
      <Flex flex={1} direction="column" overflow="hidden">
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </Flex>
    </Flex>
  )
}
