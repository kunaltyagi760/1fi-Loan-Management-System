import Layout from '../components/Layout'
import useSWR from 'swr'
import api from '../lib/api'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export default function LoanApplications() {
  const router = useRouter()
  const { data } = useSWR('/loans/my', fetcher)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) router.replace('/login')
  }, [router])

  return (
    <Layout>
      <Heading mb={6}>Loan Applications</Heading>
      <Box bg="white" p={4} boxShadow="sm">
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Applicant</Th>
              <Th>Product</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.applications?.map((a: any) => (
              <Tr key={a.id}>
                <Td>{a.id}</Td>
                <Td>{a.applicantName}</Td>
                <Td>{a.product?.name}</Td>
                <Td>{a.principal}</Td>
                <Td>{a.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Layout>
  )
}
