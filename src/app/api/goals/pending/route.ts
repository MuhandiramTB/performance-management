import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { goals } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { goalStatusEnum } from '@/lib/db/schema'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (session.user.role !== 'manager') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (!session.user.id) {
      return new NextResponse('User ID not found', { status: 400 })
    }

    const pendingGoals = await db
      .select()
      .from(goals)
      .where(
        and(
          eq(goals.status, 'pending'),
          eq(goals.managerId, session.user.id)
        )
      )

    return NextResponse.json(pendingGoals)
  } catch (error) {
    console.error('Error fetching pending goals:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 