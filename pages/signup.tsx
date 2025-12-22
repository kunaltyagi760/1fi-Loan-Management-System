import { useRouter } from 'next/router'
import { Box, Button, Heading, Input, VStack, useToast, Text } from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import api from '../lib/api'

export default function Signup() {
  const router = useRouter()
  const toast = useToast()

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} bg="white" boxShadow="md">
      <Heading mb={6}>Create account</Heading>
      <Formik
        initialValues={{ email: '', password: '', name: '' }}
        onSubmit={async (values, actions) => {
          try {
            await api.post('/auth/register', values)
            toast({ status: 'success', title: 'Account created' })
            router.push('/login')
          } catch (err: any) {
            toast({ status: 'error', title: err?.response?.data?.error || 'Sign up failed' })
            actions.setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={4}>
              <Field name="name">{({ field }: any) => <Input {...field} placeholder="Full name" />}</Field>
              <Field name="email">{({ field }: any) => <Input {...field} placeholder="Email" />}</Field>
              <Field name="password">{({ field }: any) => <Input {...field} placeholder="Password" type="password" />}</Field>
              <Button type="submit" isLoading={isSubmitting} colorScheme="blue">Create account</Button>
              <Text>
                Already have an account? <Button variant="link" colorScheme="teal" onClick={() => router.push('/login')}>Sign in</Button>
              </Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
