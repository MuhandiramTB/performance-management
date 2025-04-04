import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { goals, notifications, users } from '@/lib/db/schema'
import { eq, and, SQL } from 'drizzle-orm'
import type { Goal } from '@/lib/db/schema'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.error('[GOALS_GET] Unauthorized: No session or user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[GOALS_GET] User authenticated:', session.user.id)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as Goal['status'] | null
    const userId = searchParams.get('userId')

    let finalQuery = eq(goals.userId, session.user.id)
    if (userId && session.user.role === 'admin') {
      finalQuery = eq(goals.userId, userId)
    }
    if (status) {
      finalQuery = and(finalQuery, eq(goals.status, status)) as SQL<unknown>
    }

    console.log('[GOALS_GET] Querying database with filter:', { userId: session.user.id, status })

    const userGoals = await db
      .select({
        id: goals.id,
        title: goals.title,
        description: goals.description,
        deadline: goals.deadline,
        userId: goals.userId,
        templateId: goals.templateId,
        priority: goals.priority,
        status: goals.status,
        feedback: goals.feedback,
        category: goals.category,
        tags: goals.tags,
        progress: goals.progress,
        createdAt: goals.createdAt,
        updatedAt: goals.updatedAt,
        userName: users.name,
      })
      .from(goals)
      .leftJoin(users, eq(goals.userId, users.id))
      .where(finalQuery)

    console.log(`[GOALS_GET] Found ${userGoals.length} goals for user ${session.user.id}`)
    return NextResponse.json(userGoals)
  } catch (error) {
    console.error('[GOALS_GET] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, deadline, priority, category, tags, progress } = body

    // Validate required fields
    if (!title || !description || !deadline) {
      return NextResponse.json({ error: 'Title, description and deadline are required' }, { status: 400 })
    }

    // Validate deadline is a future date
    const deadlineDate = new Date(deadline)
    if (deadlineDate < new Date()) {
      return NextResponse.json({ error: 'Deadline must be a future date' }, { status: 400 })
    }

    // Create the goal
    const goal = await db.insert(goals).values({
      title,
      description,
      deadline: deadlineDate,
      userId: session.user.id,
      priority: priority || 0,
      status: 'pending',
      category,
      tags: tags || [],
      progress: progress || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    // Create notification for manager if user has one
    if (session.user.managerId) {
      await db.insert(notifications).values({
        userId: session.user.managerId,
        type: 'new_goal',
        message: `New goal "${title}" created by ${session.user.name}`,
        data: { goalId: goal[0].id },
        read: false,
        createdAt: new Date(),
      })
    }

    return NextResponse.json(goal[0])
  } catch (error) {
    console.error('[GOALS_POST]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Error' }, 
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, description, deadline, priority, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const goal = await db.select().from(goals).where(eq(goals.id, id))
    if (!goal.length) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (goal[0].userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedGoal = await db
      .update(goals)
      .set({
        title,
        description,
        deadline: deadline ? new Date(deadline) : undefined,
        priority,
        status,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, id))
      .returning()

    return NextResponse.json(updatedGoal[0])
  } catch (error) {
    console.error('[GOALS_PATCH]', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const goal = await db.select().from(goals).where(eq(goals.id, id))
    if (!goal.length) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (goal[0].userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.delete(goals).where(eq(goals.id, id))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[GOALS_DELETE]', error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
} 