import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Get the connection string from environment variables
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/performance_management'

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set in environment variables. Using default connection string.')
}

// Create a connection with error handling
console.log('Attempting to connect to database...')
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
  onnotice: (notice) => console.log('Database notice:', notice),
  onparameter: (parameter) => console.log('Database parameter:', parameter),
})

console.log('Database connection established successfully')

export const db = drizzle(client, { schema }) 