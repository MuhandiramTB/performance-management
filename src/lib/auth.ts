import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export type UserRole = 'admin' | 'manager' | 'employee'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  managerId?: string
}

export const isAuthenticated = (request: NextRequest) => {
  const token = request.cookies.get('auth-token')
  return !!token
}

export const getUserRole = (request: NextRequest): UserRole | null => {
  const userData = request.cookies.get('user-data')
  if (!userData) return null
  try {
    const user = JSON.parse(userData.value) as User
    return user.role
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