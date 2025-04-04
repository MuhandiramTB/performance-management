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
let client;
try {
  client = postgres(connectionString, {
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
    onnotice: (notice) => console.log('Database notice:', notice),
    onparameter: (parameter) => console.log('Database parameter:', parameter),
  })

  console.log('Database connection established successfully')
  
  // Test the connection
  client`SELECT 1`.then(() => {
    console.log('Database connection test successful')
  }).catch((error) => {
    console.error('Database connection test failed:', error)
  })
} catch (error) {
  console.error('Failed to establish database connection:', error)
  throw new Error('Failed to connect to database')
}

export const db = drizzle(client, { schema }) 