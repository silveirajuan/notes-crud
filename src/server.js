import crypto from 'node:crypto'
import fastify from 'fastify'

import { PostgresNotesRepository } from './repositories/postgres-notes-repository.js'

const app = fastify()
const notesRepository = new PostgresNotesRepository()

app.get('/notes', async (_, reply) => {
  try {
    const notes = await notesRepository.list()

    return {
      notes,
    }
  } catch (error) {
    console.log(error)

    return reply.status(500).send()
  }
})

app.get('/notes/:id', async (request, reply) => {
  const { id } = request.params

  try {
    const note = await notesRepository.getById(id)

    if (!note.length) {
      return reply.status(404).send()
    }

    return note
  } catch (error) {
    return reply.status(500).send()
  }
})

app.post('/notes', async (request, reply) => {
  const { title, description } = request.body

  if (!title || !description) {
    return reply.status(400).send({
      error: 'Invalid fields'
    })
  }

  try {
    const noteId = crypto.randomUUID()

    await notesRepository.create({
      id: noteId,
      title,
      description,
    })
  } catch (error) {
    return reply.status(500).send()
  }

  return reply.status(201).send()
})

app.put('/notes/:id', async (request, reply) => {
  const { id } = request.params
  const { title, description } = request.body

  if (!title || !description) {
    return reply.status(400).send({
      error: 'Invalid fields'
    })
  }

  try {
    const noteExists = await notesRepository.getById(id)

    if (!noteExists.length) {
      return reply.status(404).send()
    }
    
    await notesRepository.update({
      id,
      title,
      description,
    })
  } catch (error) {
    return reply.status(500).send()
  }
  
  return reply.status(204).send()
})

app.delete('/notes/:id', async (request, reply) => {
  const { id } = request.params

  try {
    const noteToDelete = await notesRepository.getById(id)

    if (!noteToDelete.length) {
      return reply.status(404).send()
    }

    await notesRepository.delete(id)
  } catch (error) {
    return reply.status(500).send()
  }

  return reply.status(204).send()
}) 

app.listen({
  host: '0.0.0.0',
  port: 4000,
}).then(() => {
  console.log('🎉 HTTP Server is running!')
})