import { Router, Request, Response } from 'express'
import { isApprovedSource } from '../types'

const router = Router()

// GET /topics?url=https://wol.jw.org/...
router.get('/', async (req: Request, res: Response) => {
  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'URL parameter is required' })
  }

  if (!isApprovedSource(url)) {
    return res.status(403).json({ success: false, error: 'Only JW.org sources are permitted' })
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
    const topics: { title: string; url: string; snippet: string }[] = []

    // Extract linked topic titles from WOL directory pages
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') ?? ''
      const title = $(el).text().trim()
      if (title.length < 4) return
      const fullUrl = href.startsWith('http') ? href : `https://wol.jw.org${href}`
      if (!isApprovedSource(fullUrl)) return
      if (href.includes('/wol/d/') || href.includes('/wol/l/')) {
        const snippet = $(el).closest('li, p').text().trim().replace(title, '').trim().slice(0, 120)
        topics.push({ title, url: fullUrl, snippet })
      }
    })

    // Fallback: extract headings if no links found
    if (topics.length === 0) {
      $('h1, h2, h3, .title, .cardTitleBlock').each((_, el) => {
        const title = $(el).text().trim()
        if (title.length < 4) return
        const snippet = $(el).next('p').text().trim().slice(0, 120)
        topics.push({ title, url, snippet })
      })
    }

    // Deduplicate by title
    const seen = new Set<string>()
    const unique = topics.filter(t => {
      if (seen.has(t.title)) return false
      seen.add(t.title)
      return true
    })

    res.json({ success: true, topics: unique.slice(0, 30), url })
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch topics', url })
  }
})

export default router
