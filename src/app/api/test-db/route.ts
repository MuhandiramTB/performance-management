import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Try to query the users table
    const userCount = await db.select({ count: users.id }).from(users)
    
    console.log('Database connection successful. User count:', userCount)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount: userCount.length > 0 ? userCount[0].count : 0
    })
  } catch (error) {
    console.error('Database connection test failed:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
} 