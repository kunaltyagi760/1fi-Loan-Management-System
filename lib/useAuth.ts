import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export function useAuthRedirect(requireAuth = false) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const ok = !!token
    setIsAuthenticated(ok)
    setLoading(false)
    if (requireAuth && !ok) {
      router.replace('/login')
    }
  }, [router, requireAuth])

  return { loading, isAuthenticated }
}
