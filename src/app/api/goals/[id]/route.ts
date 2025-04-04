import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { goals } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.error('[GOALS_PATCH] Unauthorized: No session or user ID')
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { progress, status, feedback } = await request.json()

    // Validate the goal exists and belongs to the user
    const existingGoal = await db.query.goals.findFirst({
      where: eq(goals.id, context.params.id)
    })

    if (!existingGoal) {
      return Response.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    if (existingGoal.userId !== session.user.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
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
      .where(eq(goals.id, context.params.id))
      .returning()

    return Response.json(updatedGoal[0])
  } catch (error) {
    console.error('[GOALS_PATCH] Error:', error)
    return Response.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
} 