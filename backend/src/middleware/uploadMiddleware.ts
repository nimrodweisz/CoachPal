import multer from 'multer'

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
  storage: multer.memoryStorage(),
}).single('preview')
