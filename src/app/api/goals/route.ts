import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock database for goals (replace with real database in production)
let goals = [
  {
    id: 1,
    title: 'Complete Project Documentation',
    description: 'Document all project requirements and specifications',
    dueDate: '2024-04-15',
    status: 'In Progress',
    progress: 60,
    userId: '1'
  },
  {
    id: 2,
    title: 'Code Review',
    description: 'Review pull requests and provide feedback',
    dueDate: '2024-04-10',
    status: 'Completed',
    progress: 100,
    userId: '1'
  }
]

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = JSON.parse(session.value)
    const userGoals = goals.filter(goal => goal.userId === userData.user.id)

    return NextResponse.json(userGoals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = JSON.parse(session.value)
    const body = await request.json()
    
    const newGoal = {
      id: goals.length + 1,
      ...body,
      userId: userData.user.id,
      status: 'Not Started',
      progress: 0
    }

    goals.push(newGoal)
    return NextResponse.json(newGoal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = JSON.parse(session.value)
    const body = await request.json()
    
    const goalIndex = goals.findIndex(goal => 
      goal.id === body.id && goal.userId === userData.user.id
    )

    if (goalIndex === -1) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    goals[goalIndex] = { ...goals[goalIndex], ...body }
    return NextResponse.json(goals[goalIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = JSON.parse(session.value)
    const { searchParams } = new URL(request.url)
    const goalId = searchParams.get('id')

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const goalIndex = goals.findIndex(goal => 
      goal.id === parseInt(goalId) && goal.userId === userData.user.id
    )

    if (goalIndex === -1) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    goals = goals.filter(goal => goal.id !== parseInt(goalId))
    return NextResponse.json({ message: 'Goal deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
} 