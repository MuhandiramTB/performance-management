import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { UserRole } from '@/lib/auth'

// This is a mock database. In a real application, you would use a proper database
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager' as UserRole,
  },
  {
    id: '3',
    name: 'Employee User',
    email: 'employee@example.com',
    password: 'employee123',
    role: 'employee' as UserRole,
  },
]

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email (in a real app, you would query your database)
    const user = users.find(u => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate token (in a real app, use proper JWT)
    const token = 'mock-token-' + Date.now()

    // Create user data object (excluding sensitive information)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    // Set cookies
    const cookieStore = await cookies()
    
    // Set auth token cookie
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // Set user data cookie
    cookieStore.set('user-data', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // Return success response with cookies in headers
    const response = NextResponse.json({
      message: 'Login successful',
      user: userData,
      token,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 