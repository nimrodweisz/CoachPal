import path from 'node:path'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, 'uploads/exercises')
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname)
    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .toLowerCase()
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`

    callback(null, `${baseName}-${uniqueSuffix}${extension}`)
  },
})

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true)
    return
  }

  callback(new Error('Only image uploads are allowed'))
}

export const uploadExercisePreview = multer({
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage,
}).single('preview')
