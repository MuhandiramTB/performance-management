import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { db } from '@/lib/db/connection'
import { goals, notifications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    const userId = sessionData.user.id

    const userGoals = await db.query.goals.findMany({
      where: eq(goals.userId, userId),
      orderBy: (goals, { desc }) => [desc(goals.createdAt)],
    })

    return NextResponse.json(userGoals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/goals - Starting request processing')
    
    if (!isAuthenticated(request)) {
      console.log('POST /api/goals - User not authenticated')
      return NextResponse.json({ error: 'Unauthorized - Please log in again' }, { status: 401 })
    }

    const session = request.cookies.get('session')
    if (!session) {
      console.log('POST /api/goals - No session cookie found')
      return NextResponse.json({ error: 'No session found - Please log in again' }, { status: 401 })
    }

    let sessionData
    try {
      sessionData = JSON.parse(session.value)
      console.log('POST /api/goals - Session data:', { 
        userId: sessionData.user?.id,
        role: sessionData.user?.role
      })
      
      if (!sessionData.user || !sessionData.user.id) {
        console.log('POST /api/goals - Invalid session data structure')
        return NextResponse.json({ error: 'Invalid session - Please log in again' }, { status: 401 })
      }
    } catch (error) {
      console.error('POST /api/goals - Error parsing session data:', error)
      return NextResponse.json({ error: 'Invalid session format - Please log in again' }, { status: 401 })
    }

    const userId = sessionData.user.id

    const body = await request.json()
    console.log('POST /api/goals - Request body:', body)
    
    const { title, description, deadline, category, priority, tags, progress } = body

    if (!title || !description || !deadline || !category) {
      console.log('POST /api/goals - Missing required fields:', { 
        title: !!title, 
        description: !!description, 
        deadline: !!deadline, 
        category: !!category 
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate deadline is a future date
    const deadlineDate = new Date(deadline)
    if (deadlineDate <= new Date()) {
      console.log('POST /api/goals - Invalid deadline:', deadlineDate)
      return NextResponse.json(
        { error: 'Deadline must be a future date' },
        { status: 400 }
      )
    }

    console.log('POST /api/goals - Creating goal in database')
    
    // Create the goal with all fields
    const [newGoal] = await db.insert(goals).values({
      userId,
      title,
      description,
      deadline: deadlineDate,
      category,
      priority: priority || 0,
      tags: tags || [],
      progress: progress || 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    console.log('POST /api/goals - Goal created successfully:', newGoal)

    // Create notification for manager if user has one
    if (sessionData.user.managerId) {
      console.log('POST /api/goals - Creating notification for manager:', sessionData.user.managerId)
      await db.insert(notifications).values({
        userId: sessionData.user.managerId,
        type: 'goal_created',
        message: `New goal created: ${title}`,
        read: false,
        createdAt: new Date(),
      })
    }

    return NextResponse.json(newGoal)
  } catch (error) {
    console.error('POST /api/goals - Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    const userId = sessionData.user.id

    const body = await request.json()
    const { id, title, description, deadline, priority, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const goal = await db.select().from(goals).where(eq(goals.id, id))
    if (!goal.length) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (goal[0].userId !== userId && sessionData.user.role !== 'admin') {
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
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    const userId = sessionData.user.id

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const goal = await db.select().from(goals).where(eq(goals.id, id))
    if (!goal.length) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    if (goal[0].userId !== userId && sessionData.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.delete(goals).where(eq(goals.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
} 