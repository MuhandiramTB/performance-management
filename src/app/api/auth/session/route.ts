import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return NextResponse.json({ user: null })
    }

    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json({ user: null })
  }
} 