'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee'
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkSession = async () => {
      try {
        setError(null)
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
          throw new Error('Session check failed')
        }
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setError(error instanceof Error ? error.message : 'Failed to check session')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [mounted])

  if (!mounted) {
    return null
  }

  const clearError = () => setError(null)

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Invalid credentials')
      }

      const data = await response.json()
      setUser(data.user)
      router.push(`/${data.user.role}/dashboard`)
    } catch (error) {
      console.error('Error signing in:', error)
      setError(error instanceof Error ? error.message : 'Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      
      if (!response.ok) {
        throw new Error('Failed to sign out')
      }

      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setError(error instanceof Error ? error.message : 'Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'employee' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const data = await response.json()
      setUser(data.user)
      router.push('/employee/dashboard')
    } catch (error) {
      console.error('Error signing up:', error)
      setError(error instanceof Error ? error.message : 'Failed to sign up')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut, signUp, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 