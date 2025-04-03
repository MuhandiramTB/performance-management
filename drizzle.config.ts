import type { Config } from 'drizzle-kit';
import { env } from '@/lib/env';

// Parse the DATABASE_URL to extract credentials
const url = new URL(env.DATABASE_URL);

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: url.hostname,
    port: parseInt(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  },
} satisfies Config; 