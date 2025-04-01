import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock database
let feedbackItems = [
  {
    id: 1,
    author: {
      name: 'John Smith',
      role: 'Manager',
      avatar: 'J'
    },
    message: 'Great work on the project! Your attention to detail is impressive.',
    timestamp: '2024-03-15T10:00:00Z',
    status: 'Responded' as const,
    response: "Thank you for the feedback! I'll continue to maintain high standards.",
    type: 'Praise' as const,
    rating: 5,
    tags: ['Project Management', 'Quality'],
    isPrivate: false
  },
  {
    id: 2,
    author: {
      name: 'Sarah Johnson',
      role: 'Team Lead',
      avatar: 'S'
    },
    message: 'Consider improving your time management skills to meet deadlines more consistently.',
    timestamp: '2024-03-14T15:30:00Z',
    status: 'Pending Response' as const,
    type: 'Improvement' as const,
    rating: 3,
    tags: ['Time Management', 'Deadlines'],
    isPrivate: false
  }
]

export async function GET() {
  try {
    // In a real application, you would fetch from a database
    return NextResponse.json(feedbackItems)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newFeedback = {
      id: feedbackItems.length + 1,
      author: {
        name: 'You',
        role: 'Employee',
        avatar: 'Y'
      },
      timestamp: new Date().toISOString(),
      status: 'Pending Response' as const,
      ...body
    }
    
    feedbackItems.push(newFeedback)
    return NextResponse.json(newFeedback, { status: 201 })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, response, status } = body
    
    const feedbackIndex = feedbackItems.findIndex(f => f.id === id)
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      )
    }
    
    feedbackItems[feedbackIndex] = {
      ...feedbackItems[feedbackIndex],
      response,
      status
    }
    
    return NextResponse.json(feedbackItems[feedbackIndex])
  } catch (error) {
    console.error('Error updating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '')
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid feedback ID' },
        { status: 400 }
      )
    }
    
    const feedbackIndex = feedbackItems.findIndex(f => f.id === id)
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      )
    }
    
    feedbackItems = feedbackItems.filter(f => f.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to delete feedback' },
      { status: 500 }
    )
  }
} 