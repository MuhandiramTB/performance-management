import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { goals, notifications, users } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import type { Goal } from '@/lib/db/schema'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as Goal['status'] | null
    const userId = searchParams.get('userId')

    // Ensure userId is always a string
    const targetUserId = userId || session.user.id
    const baseQuery = eq(goals.userId, targetUserId)
    const finalQuery = status ? and(baseQuery, eq(goals.status, status)) : baseQuery

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
    const session = await getServerSession(authOptions)
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
        type: 'goal_submission',
        message: `New goal submitted by ${session.user.name || 'an employee'}`,
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { goalId, status, feedback } = body

    if (!goalId || !status) {
      return new NextResponse('Goal ID and status are required', { status: 400 })
    }

    if (!['approved', 'rejected'].includes(status)) {
      return new NextResponse('Invalid status value', { status: 400 })
    }

    const goal = await db.update(goals)
      .set({
        status,
        feedback,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, goalId))
      .returning()

    if (!goal.length) {
      return new NextResponse('Goal not found', { status: 404 })
    }

    // Create notification for employee
    await db.insert(notifications).values({
      userId: goal[0].userId,
      type: 'goal_status_update',
      message: `Your goal "${goal[0].title}" has been ${status}`,
      data: { goalId: goal[0].id },
      read: false,
    })

    return NextResponse.json(goal[0])
  } catch (error) {
    console.error('[GOALS_PATCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('id')

    if (!goalId) {
      return new NextResponse('Goal ID is required', { status: 400 })
    }

    const goal = await db.delete(goals)
      .where(eq(goals.id, goalId))
      .returning()

    if (!goal.length) {
      return new NextResponse('Goal not found', { status: 404 })
    }

    return NextResponse.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('[GOALS_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 