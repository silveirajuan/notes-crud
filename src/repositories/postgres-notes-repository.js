import { sql } from '../database.js'

export class PostgresNotesRepository {
  async list() {
    const notes = await sql`
      SELECT * FROM notes
    `

    return notes
  }

  async getById(id) {
    const note = await sql`
      SELECT * FROM notes 
      WHERE id = ${id}
    `

    return note
  }

  async create({ id, title, description }) {
    const createdNote = await sql`
      INSERT INTO notes (id, title, description, created_at)
      VALUES (
        ${id},
        ${title},
        ${description},
        ${new Date()}
      )
      RETURNING *
    `

    return createdNote
  }

  async update({ id, title, description }) {
    const updatedNote = await sql`
      UPDATE notes
      SET 
        title = ${title},
        description = ${description}
      WHERE
        id = ${id}
    `
  }

  async delete(id) {
    await sql`
      DELETE FROM notes
      WHERE id = ${id}
    `
  }
}