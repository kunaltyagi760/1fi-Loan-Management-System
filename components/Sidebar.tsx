import React from 'react'
import {
  Box,
  VStack,
  HStack,
  IconButton,
  useBreakpointValue,
  Button,
  Text
} from '@chakra-ui/react'
import { HamburgerIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import Link from 'next/link'

export default function Sidebar() {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [collapsed, setCollapsed] = React.useState(false)

  // Embedded sidebar for desktop (collapsible). Mobile will use the Drawer in the Layout.
  if (!isMobile) {
    return (
      <Box as="aside" w={collapsed ? '60px' : '240px'} bg="white" p={4} boxShadow="sm">
        <HStack justify="space-between" mb={4}>
          {!collapsed ? (
            <Link href="/">
              <Text as="a" fontWeight="bold" cursor="pointer">LMS</Text>
            </Link>
          ) : (
            <Link href="/">
              <Text as="a" cursor="pointer">L</Text>
            </Link>
          )}
          <IconButton aria-label="toggle" size="sm" icon={collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />} onClick={() => setCollapsed(!collapsed)} />
        </HStack>
        <VStack align={collapsed ? 'center' : 'start'} spacing={4}>
          <Link href="/dashboard"><Button variant="ghost">{!collapsed ? 'Dashboard' : 'D'}</Button></Link>
          <Link href="/loan-products"><Button variant="ghost">{!collapsed ? 'Loan Products' : 'P'}</Button></Link>
          <Link href="/loan-applications"><Button variant="ghost">{!collapsed ? 'Loan Applications' : 'A'}</Button></Link>
          <Link href="/create-application"><Button variant="ghost">{!collapsed ? 'Create Application' : '+'}</Button></Link>
        </VStack>
      </Box>
    )
  }

  // Mobile: show a small hamburger that opens Drawer handled in Layout
  return (
    <Box position="fixed" top="3" left="3" zIndex={50}>
      <IconButton aria-label="open menu" size="sm" icon={<HamburgerIcon />} onClick={() => window.dispatchEvent(new CustomEvent('openMobileMenu'))} />
    </Box>
  )
}
