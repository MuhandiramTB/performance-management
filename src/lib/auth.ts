import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { NextAuthConfig, Session, User } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db/connection'
import { users, verificationTokens } from './db/schema'
import { eq } from 'drizzle-orm'
import Google from 'next-auth/providers/google'
import NextAuth from 'next-auth'

export const runtime = 'nodejs'

export type UserRole = 'admin' | 'manager' | 'employee'

declare module 'next-auth' {
  interface User {
    id?: string
    role?: UserRole
    department?: string
    managerId?: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      role: UserRole
      department?: string
      managerId?: string
    }
  }
}

export const isAuthenticated = (request: NextRequest) => {
  const session = request.cookies.get('session')
  return !!session
}

export const getUserRole = (request: NextRequest): UserRole | null => {
  const session = request.cookies.get('session')
  if (!session) return null
  try {
    const sessionData = JSON.parse(session.value)
    return sessionData.user.role
  } catch {
    return null
  }
}

export const requireAuth = (request: NextRequest) => {
  if (!isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return null
}

export const requireRole = (request: NextRequest, allowedRoles: UserRole[]) => {
  const role = getUserRole(request)
  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  return null
}

export const requireAdmin = (request: NextRequest) => {
  return requireRole(request, ['admin'])
}

export const requireManager = (request: NextRequest) => {
  return requireRole(request, ['admin', 'manager'])
}

export const requireEmployee = (request: NextRequest) => {
  return requireRole(request, ['admin', 'manager', 'employee'])
}

export const config = {
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role || 'employee'
        session.user.department = user.department
        session.user.managerId = user.managerId
      }
      return session
    },
    async signIn({ user }: { user: User }) {
      // Set default role for new users
      if (!user.role) {
        user.role = 'employee'
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig

export const { auth, handlers } = NextAuth(config) 