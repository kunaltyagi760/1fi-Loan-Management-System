import Layout from '../components/Layout'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <Layout>
      <Box bg="white" p={8} boxShadow="sm">
        <VStack align="start" spacing={6}>
          <Heading>LMS — Lending Against Mutual Funds (LAMF)</Heading>
          <Text>
            This demo Loan Management System focuses on Lending against Mutual Funds. It includes modules for defining loan products, creating and tracking loan applications, managing mutual fund collaterals, and viewing ongoing loans.
          </Text>
          <Text fontWeight="bold">Key features</Text>
          <ul>
            <li>Loan Products: define interest rates and product details.</li>
            <li>Loan Applications: view all applications and statuses.</li>
            <li>Create New Application: API for fintech partners to create applications programmatically.</li>
            <li>Collateral Management: track mutual fund units and folios associated with loans.</li>
            <li>JWT authentication: secure user routes and actions.</li>
          </ul>
          <Text>
            To perform user actions (create application, view personal data), please sign in. The main pages (home, login, signup) are public.
          </Text>
          <VStack direction="row" spacing={4} align="start">
            <Button colorScheme="teal" onClick={() => router.push('/create-application')}>Create Loan Application</Button>
            <Button variant="outline" onClick={() => router.push('/loan-products')}>Explore Loan Products</Button>
          </VStack>
        </VStack>
      </Box>
    </Layout>
  )
}
