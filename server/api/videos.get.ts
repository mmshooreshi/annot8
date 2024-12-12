import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const videoDir = config.public.videoPath

  try {
    // Read files from the directory
    const files = await fs.readdir(videoDir)
    // console.log(files)
    const videoFiles = files.filter(file =>
      /\.(mp4|avi|mov|mkv)$/i.test(file) // Only include video files
    )

    // Generate full paths for the frontend
    const videoPaths = videoFiles.map(file => ({
      name: file,
      path: path.join(videoDir, file)
    }))

    return videoPaths
  } catch (error) {
    console.error('Error reading video directory:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load video files.'
    })
  }
})
