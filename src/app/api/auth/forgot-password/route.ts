import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email exists (in a real app, this would check the database)
    if (email !== 'admin@example.com' && email !== 'manager@example.com' && email !== 'employee@example.com') {
      return NextResponse.json(
        { message: 'Email not found' },
        { status: 404 }
      )
    }

    // Generate reset token (in a real app, use proper JWT)
    const resetToken = Math.random().toString(36).substr(2, 9)

    // In a real app, you would:
    // 1. Save the reset token to the database with an expiration time
    // 2. Send an email with the reset link
    // 3. Handle the token verification and password reset

    // For demo purposes, we'll just return success
    return NextResponse.json({
      message: 'Password reset instructions sent to your email',
      resetToken, // In a real app, don't send this in the response
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 