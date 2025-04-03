import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/env';

// Database client for queries
const queryClient = postgres(env.DATABASE_URL);

// Database client with Drizzle ORM
export const db = drizzle(queryClient);

// Export the query client for raw SQL queries if needed
export { queryClient }; 