export class InMemoryNotesRepository {
  #notes = new Map()

  async list() {
    const notes = Array
      .from(this.#notes.entries())
      .map(note => {
        const [id, content] = note

        return {
          id, ...content,
        }
      })

    return notes
  }

  async getById(id) {
    const note = this.#notes.get(id)

    if (note) {
      return {
        id,
        ...note
      }
    }

    return note
  }

  async create({ id, title, description }) {
    const createdNote = this.#notes.set(id, {
      title,
      description,
      created_at: new Date()
    })

    return createdNote
  }

  async update({ id, title, description }) {
    const noteToEdit = this.#notes.get(id)

    const updatedNote = this.#notes.set(id, {
      ...noteToEdit,
      title,
      description,
    })

    return updatedNote
  }

  async delete(id) {
    this.#notes.delete(id)
  }
}