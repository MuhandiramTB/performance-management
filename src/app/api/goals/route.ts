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
      return new NextResponse('Unauthorized', { status: 401 })
    }

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
        createdAt: goals.createdAt,
        updatedAt: goals.updatedAt,
        userName: users.name,
      })
      .from(goals)
      .leftJoin(users, eq(goals.userId, users.id))
      .where(finalQuery)

    return NextResponse.json(userGoals)
  } catch (error) {
    console.error('[GOALS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { title, description, deadline, templateId, priority } = body

    if (!title || !deadline) {
      return new NextResponse('Title and deadline are required', { status: 400 })
    }

    const goal = await db.insert(goals).values({
      title,
      description,
      deadline: new Date(deadline),
      userId: session.user.id,
      templateId,
      priority: priority || 0,
      status: 'pending',
    }).returning()

    // Create notification for manager
    if (session.user.managerId) {
      await db.insert(notifications).values({
        userId: session.user.managerId,
        type: 'new_goal',
        message: `New goal created by ${session.user.name}`,
        data: { goalId: goal[0].id },
        read: false,
      })
    }

    return NextResponse.json(goal[0])
  } catch (error) {
    console.error('[GOALS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { id, title, description, deadline, priority, status } = body

    if (!id) {
      return new NextResponse('Goal ID is required', { status: 400 })
    }

    const goal = await db.select().from(goals).where(eq(goals.id, id))
    if (!goal.length) {
      return new NextResponse('Goal not found', { status: 404 })
    }

    if (goal[0].userId !== session.user.id && session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
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
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new NextResponse('Goal ID is required', { status: 400 })
    }

    const goal = await db.select().from(goals).where(eq(goals.id, id))
    if (!goal.length) {
      return new NextResponse('Goal not found', { status: 404 })
    }

    if (goal[0].userId !== session.user.id && session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await db.delete(goals).where(eq(goals.id, id))

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[GOALS_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 