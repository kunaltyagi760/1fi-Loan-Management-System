import Layout from '../components/Layout'
import useSWR from 'swr'
import api from '../lib/api'
import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export default function LoanProducts() {
  const { data } = useSWR('/products', fetcher)

  return (
    <Layout>
      <Heading mb={6}>Loan Products</Heading>
      <Box bg="white" p={4} boxShadow="sm">
        <List>
          {(data?.products ?? fallbackProducts)?.map((p: any) => (
            <ListItem key={p.id} mb={3}>
              <Text fontWeight="bold">{p.name}</Text>
              <Text fontSize="sm">Interest: {p.interest}%</Text>
              <Text fontSize="sm">{p.description}</Text>
            </ListItem>
          ))}
        </List>
      </Box>
    </Layout>
  )
}

const fallbackProducts = [
  { id: 'p1', name: 'Home Loan', interest: 8.5, description: 'Home Loan against mutual funds' },
  { id: 'p2', name: 'Car Loan', interest: 10.0, description: 'Car Loan' },
  { id: 'p3', name: 'Personal Loan', interest: 14.5, description: 'Personal Loan' },
  { id: 'p4', name: 'Bike Loan', interest: 12.0, description: 'Bike Loan' },
  { id: 'p5', name: 'Gold Loan', interest: 11.0, description: 'Gold-backed' }
]
