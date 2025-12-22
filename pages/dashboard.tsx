import Layout from '../components/Layout'
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react'

export default function Dashboard() {
  return (
    <Layout>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Stat>
          <StatLabel>Active Loans</StatLabel>
          <StatNumber>12</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Disbursed</StatLabel>
          <StatNumber>₹ 5,00,000</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pending Applications</StatLabel>
          <StatNumber>3</StatNumber>
        </Stat>
      </SimpleGrid>
      <Box mt={8}>Use the sidebar to navigate between modules.</Box>
    </Layout>
  )
}
