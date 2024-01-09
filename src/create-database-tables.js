import { sql } from './src/database.js'

async function bootstrapTables() {
  await sql`
    DROP TABLE IF EXISTS notes
  `

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      created_at TIMESTAMP
    )
  `
}

bootstrapTables().then(() => {
  process.exit(1)
})