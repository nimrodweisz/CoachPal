import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import bodyMeasurementRoutes from './routes/bodyMeasurementRoutes.js'
import coachProfileRoutes from './routes/coachProfileRoutes.js'
import exerciseRoutes from './routes/exerciseRoutes.js'
import traineeProfileRoutes from './routes/traineeProfileRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 5000)
const frontendOrigins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  throw new Error('MONGO_URI is missing from the environment')
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || frontendOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/coach-profiles', coachProfileRoutes)
app.use('/api/trainees', traineeProfileRoutes)
app.use('/api/body-measurements', bodyMeasurementRoutes)
app.use('/api/exercises', exerciseRoutes)

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  })
})

app.get('/', (_req, res) => {
  res.json({ message: 'CoachPal backend is running' })
})

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`)
      console.log('MongoDB connected')
    })
  })
  .catch((error: unknown) => {
    console.error('MongoDB connection failed', error)
    process.exit(1)
  })
