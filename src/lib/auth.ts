import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { NextAuthOptions, Session, User } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import { db } from './db/connection'
import { users, verificationTokens } from './db/schema'
import { eq } from 'drizzle-orm'
import GoogleProvider from 'next-auth/providers/google'

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

// Create a simple adapter that implements the required interface
const createAdapter = (db: any): Adapter => {
  return {
    async createUser(data) {
      const [user] = await db.insert(users).values({
        ...data,
        role: 'employee',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning()
      return user
    },
    async getUser(id) {
      const [user] = await db.select().from(users).where(eq(users.id, id))
      return user || null
    },
    async getUserByEmail(email) {
      const [user] = await db.select().from(users).where(eq(users.email, email))
      return user || null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.providerAccountId, providerAccountId))
        .where(eq(users.provider, provider))
      return user || null
    },
    async updateUser(data) {
      const [user] = await db.update(users)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(users.id, data.id))
        .returning()
      return user
    },
    async deleteUser(userId) {
      await db.delete(users).where(eq(users.id, userId))
    },
    async linkAccount(data) {
      await db.insert(users).values({
        ...data,
        updatedAt: new Date(),
      })
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db.delete(users)
        .where(eq(users.providerAccountId, providerAccountId))
        .where(eq(users.provider, provider))
    },
    async createSession(data) {
      const [session] = await db.insert(users).values(data).returning()
      return session
    },
    async getSessionAndUser(sessionToken) {
      const [session] = await db.select()
        .from(users)
        .where(eq(users.sessionToken, sessionToken))
      if (!session) return null
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, session.userId))
      return { session, user: user || null }
    },
    async updateSession(data) {
      const [session] = await db.update(users)
        .set(data)
        .where(eq(users.sessionToken, data.sessionToken))
        .returning()
      return session
    },
    async deleteSession(sessionToken) {
      await db.delete(users).where(eq(users.sessionToken, sessionToken))
    },
    async createVerificationToken(data) {
      const [verificationToken] = await db.insert(verificationTokens).values(data).returning()
      return verificationToken
    },
    async useVerificationToken({ identifier, token }) {
      const [verificationToken] = await db.select()
        .from(verificationTokens)
        .where(eq(verificationTokens.identifier, identifier))
        .where(eq(verificationTokens.token, token))
      if (!verificationToken) return null
      await db.delete(verificationTokens)
        .where(eq(verificationTokens.identifier, identifier))
        .where(eq(verificationTokens.token, token))
      return verificationToken
    },
  }
}

export const isAuthenticated = (request: NextRequest) => {
  const session = request.cookies.get('session')
  if (!session) return false
  try {
    const sessionData = JSON.parse(session.value)
    return !!sessionData.user
  } catch {
    return false
  }
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

export const authOptions: NextAuthOptions = {
  adapter: createAdapter(db),
  providers: [
    GoogleProvider({
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
    async signIn({ user }) {
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
} 