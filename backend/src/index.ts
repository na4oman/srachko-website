import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { errorHandler } from './middleware/error'
import requestRouter from './routes/requests'
import uploadRouter from './routes/uploads'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// Build allowed origins list - strip trailing slashes and support multiple
const rawOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'
const allowedOrigins = rawOrigin
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''))

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true)
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  }),
)
app.use(express.json())

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/requests', requestRouter)
app.use('/api/uploads', uploadRouter)

// Error Handling
app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

export default app
