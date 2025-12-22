import { ReactNode, useEffect, useState } from 'react'
import { Box, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, VStack, Button } from '@chakra-ui/react'
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function handler() {
      setMobileOpen(true)
    }
    window.addEventListener('openMobileMenu', handler as EventListener)
    return () => window.removeEventListener('openMobileMenu', handler as EventListener)
  }, [])

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" p={{ base: 4, md: 6 }} pt={{ base: 12, md: 6 }} bg="gray.50">
        {children}
      </Box>

      <Drawer isOpen={mobileOpen} placement="left" onClose={() => setMobileOpen(false)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <a href="/" onClick={() => setMobileOpen(false)}>LMS</a>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start">
              <Button variant="ghost" onClick={() => { window.location.href = '/dashboard'; setMobileOpen(false) }}>Dashboard</Button>
              <Button variant="ghost" onClick={() => { window.location.href = '/loan-products'; setMobileOpen(false) }}>Loan Products</Button>
              <Button variant="ghost" onClick={() => { window.location.href = '/loan-applications'; setMobileOpen(false) }}>Loan Applications</Button>
              <Button variant="ghost" onClick={() => { window.location.href = '/create-application'; setMobileOpen(false) }}>Create Application</Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}
