import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireAuth, requireAdmin, requireManager, requireEmployee } from './lib/auth'

export function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/unauthorized']
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Check authentication first
  const authCheck = requireAuth(request)
  if (authCheck) return authCheck

  // Admin routes
  if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
    return requireAdmin(request) || NextResponse.next()
  }

  // Manager routes
  if (request.nextUrl.pathname.startsWith('/dashboard/manager')) {
    return requireManager(request) || NextResponse.next()
  }

  // Employee routes
  if (request.nextUrl.pathname.startsWith('/dashboard/employee')) {
    return requireEmployee(request) || NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/unauthorized'
  ]
}