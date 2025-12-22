import { useRouter } from 'next/router'
import { Box, Button, Heading, Input, VStack, useToast, Text } from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import api from '../lib/api'

export default function Login() {
  const router = useRouter()
  const toast = useToast()

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} bg="white" boxShadow="md">
      <Heading mb={6}>Sign in</Heading>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, actions) => {
          try {
            const res = await api.post('/auth/login', values)
            localStorage.setItem('token', res.data.token)
            toast({ status: 'success', title: 'Signed in' })
            router.push('/dashboard')
          } catch (err) {
            toast({ status: 'error', title: 'Login failed' })
            actions.setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={4}>
              <Field name="email">
                {({ field }: any) => <Input {...field} placeholder="Email" />}
              </Field>
              <Field name="password">
                {({ field }: any) => <Input {...field} placeholder="Password" type="password" />}
              </Field>
              <Button type="submit" isLoading={isSubmitting} colorScheme="blue">Sign in</Button>
              <Text>
                Don't have an account? <Button variant="link" colorScheme="teal" onClick={() => router.push('/signup')}>Sign up</Button>
              </Text>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
