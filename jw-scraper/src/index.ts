import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import searchRouter from './routes/search'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
  })
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'jw-scraper', timestamp: new Date().toISOString() })
})

app.use('/search', searchRouter)

app.listen(PORT, () => {
  console.log(`JW Scraper running on port ${PORT}`)
})

export default app
