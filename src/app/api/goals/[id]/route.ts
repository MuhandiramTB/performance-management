import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { goals } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.error('[GOALS_PATCH] Unauthorized: No session or user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { progress, status, feedback } = await req.json()

    // Validate the goal exists and belongs to the user
    const existingGoal = await db.query.goals.findFirst({
      where: eq(goals.id, params.id)
    })

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (existingGoal.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update the goal
    const updatedGoal = await db
      .update(goals)
      .set({
        progress: progress ?? existingGoal.progress,
        status: status ?? existingGoal.status,
        feedback: feedback ?? existingGoal.feedback,
        updatedAt: new Date()
      })
      .where(eq(goals.id, params.id))
      .returning()

    return NextResponse.json(updatedGoal[0])
  } catch (error) {
    console.error('[GOALS_PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
} 