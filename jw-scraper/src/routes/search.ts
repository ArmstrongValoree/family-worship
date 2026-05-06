import { Router, Request, Response } from 'express'
import { scrapeJW } from '../scrapers/jwScraper'
import { scrapeWOL } from '../scrapers/wolScraper'
import type { SearchQuery, ScraperResponse } from '../types'

const router = Router()

// GET /search?q=love&type=all&limit=10
router.get('/', async (req: Request, res: Response) => {
  const { q, type = 'all', limit = '10' } = req.query as unknown as SearchQuery & { limit: string }

  if (!q || typeof q !== 'string' || q.trim() === '') {
    return res.status(400).json({
      success: false,
      results: [],
      total: 0,
      query: '',
      error: 'Query parameter q is required',
    })
  }

  const parsedLimit = Math.min(parseInt(limit as string, 10) || 10, 30)

  try {
    const [jwResults, wolResults] = await Promise.all([
      scrapeJW(q, parsedLimit),
      scrapeWOL(q, parsedLimit),
    ])

    const combined = [...jwResults, ...wolResults]
    const filtered = type === 'all' ? combined : combined.filter((r) => r.type === type)
    const sliced = filtered.slice(0, parsedLimit)

    const response: ScraperResponse = {
      success: true,
      results: sliced,
      total: sliced.length,
      query: q,
    }

    res.json(response)
  } catch {
    res.status(500).json({
      success: false,
      results: [],
      total: 0,
      query: q,
      error: 'Scraping failed',
    })
  }
})

// GET /search/article?url=https://www.jw.org/...
router.get('/article', async (req: Request, res: Response) => {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  try {
    const axios = (await import('axios')).default
    const cheerio = await import('cheerio')

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    })

    const $ = cheerio.load(response.data)

    const title = $('h1').first().text().trim() || $('title').text().trim()
    const content = $('article').text().trim() || $('main').text().trim()
    const paragraphs = $('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)

    res.json({ success: true, title, content, paragraphs, url })
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch article', url })
  }
})

export default router
