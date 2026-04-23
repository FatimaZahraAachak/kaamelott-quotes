import type { Config } from 'drizzle-kit'

export default {
  schema: './src/data/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data.db',
  },
} satisfies Config
