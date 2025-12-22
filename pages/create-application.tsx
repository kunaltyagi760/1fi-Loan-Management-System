import Layout from '../components/Layout'
import { Box, Heading, Button, VStack, Input, Select, useToast } from '@chakra-ui/react'
import { Formik, Field, Form } from 'formik'
import api from '../lib/api'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const fetcher = (url: string) => api.get(url).then((r: any) => r.data)

export default function CreateApplication() {
  const { data } = useSWR('/products', fetcher)
  const toast = useToast()
  const router = useRouter()

  // require auth on this page client-side
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      toast({ status: 'info', title: 'Please sign in to create an application' })
      router.replace('/login')
    }
  }, [router, toast])

  return (
    <Layout>
      <Heading mb={6}>Create New Loan Application</Heading>
      <Box bg="white" p={6} boxShadow="sm">
        <Formik
          initialValues={{ productId: data?.products?.[0]?.id || '', applicantName: '', applicantEmail: '', principal: 0, tenureMonths: 12 }}
          enableReinitialize
            onSubmit={async (values, actions) => {
            try {
              await api.post('/loans', values)
              toast({ status: 'success', title: 'Application created' })
              actions.resetForm()
            } catch (err) {
              toast({ status: 'error', title: 'Create failed' })
            } finally {
              actions.setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <VStack spacing={4} align="start">
                <Field name="productId">{({ field }: any) => (
                  <Select {...field} placeholder="Select product">
                    {data?.products?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                )}</Field>

                <Field name="applicantName">{({ field }: any) => <Input {...field} placeholder="Applicant name" />}</Field>
                <Field name="applicantEmail">{({ field }: any) => <Input {...field} placeholder="Applicant email" />}</Field>
                <Field name="principal">{({ field }: any) => <Input {...field} placeholder="Principal amount" type="number" />}</Field>
                <Field name="tenureMonths">{({ field }: any) => <Input {...field} placeholder="Tenure months" type="number" />}</Field>

                <Button type="submit" isLoading={isSubmitting} colorScheme="blue">Create</Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  )
}
