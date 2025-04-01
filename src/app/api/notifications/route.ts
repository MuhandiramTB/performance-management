import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock database for notifications (replace with real database in production)
let notifications = [
  {
    id: 1,
    type: 'goal',
    message: 'Your goal "Complete Project Documentation" is due in 3 days',
    timestamp: '2024-03-30T10:00:00Z',
    read: false,
    userId: '1'
  },
  {
    id: 2,
    type: 'feedback',
    message: 'New feedback received from your manager',
    timestamp: '2024-03-29T15:30:00Z',
    read: true,
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
    const userNotifications = notifications.filter(n => n.userId === userData.user.id)

    return NextResponse.json(userNotifications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
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
    
    const notificationIndex = notifications.findIndex(n => 
      n.id === body.id && n.userId === userData.user.id
    )

    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    notifications[notificationIndex] = { ...notifications[notificationIndex], ...body }
    return NextResponse.json(notifications[notificationIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
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
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    const notificationIndex = notifications.findIndex(n => 
      n.id === parseInt(notificationId) && n.userId === userData.user.id
    )

    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    notifications = notifications.filter(n => n.id !== parseInt(notificationId))
    return NextResponse.json({ message: 'Notification deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }
} 