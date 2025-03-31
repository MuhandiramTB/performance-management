import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Get session from cookie
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)
    const userId = session.user.id

    // Mock data - replace with actual database queries in production
    const stats = {
      goals: 5,
      teamMembers: 8,
      ratings: 3,
      feedback: 12
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching employee stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 