import { promises as fs } from 'fs'
import path from 'path'

// Define the path to store annotations
const annotationsFilePath = path.resolve('./data/annotations.json')

// Utility to ensure the annotations file exists
async function ensureAnnotationsFile() {
  try {
    await fs.access(annotationsFilePath)
  } catch {
    await fs.writeFile(annotationsFilePath, JSON.stringify({}))
  }
}

// Fetch and update annotations
export default defineEventHandler(async (event) => {
  await ensureAnnotationsFile()

  if (event.node.req.method === 'GET') {
    try {
      const annotations = JSON.parse(await fs.readFile(annotationsFilePath, 'utf-8'))
      return annotations
    } catch (err) {
      console.error('Error reading annotations file:', err)
      throw createError({ statusCode: 500, message: 'Failed to read annotations' })
    }
  }

  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event)
      const existingAnnotations = JSON.parse(await fs.readFile(annotationsFilePath, 'utf-8'))
      const updatedAnnotations = { ...existingAnnotations, ...body }
      await fs.writeFile(annotationsFilePath, JSON.stringify(updatedAnnotations, null, 2))
      return { success: true }
    } catch (err) {
      console.error('Error writing annotations file:', err)
      throw createError({ statusCode: 500, message: 'Failed to save annotations' })
    }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
