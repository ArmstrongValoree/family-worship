import axios from 'axios'
import * as cheerio from 'cheerio'
import type { SearchResult } from '../types'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function detectType(url: string): SearchResult['type'] {
  if (url.includes('videos')) return 'video'
  if (url.includes('music') || url.includes('song')) return 'song'
  return 'article'
}

export async function scrapeJW(query: string, limit: number): Promise<SearchResult[]> {
  try {
    const encoded = encodeURIComponent(query)
    const url = `https://www.jw.org/en/search/?q=${encoded}&contentType=ARTICLE`

    await delay(1000)

    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    })

    const $ = cheerio.load(response.data)
    const results: SearchResult[] = []

    $('.searchResult, .result-item, [class*="search-result"], article').each((_, el) => {
      if (results.length >= limit) return false

      const $el = $(el)
      const titleEl = $el.find('h2, h3, .title, [class*="title"]').first()
      const title = titleEl.text().trim()
      if (!title) return

      const linkEl = $el.find('a').first()
      let href = linkEl.attr('href') || titleEl.closest('a').attr('href') || ''
      if (!href) return
      if (href.startsWith('/')) href = `https://www.jw.org${href}`

      const snippet =
        $el.find('p, .snippet, [class*="snippet"], [class*="description"]').first().text().trim() ||
        $el.text().replace(title, '').trim().slice(0, 200)

      const thumbSrc =
        $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src')
      const thumbnail = thumbSrc
        ? thumbSrc.startsWith('/')
          ? `https://www.jw.org${thumbSrc}`
          : thumbSrc
        : undefined

      results.push({
        title,
        url: href,
        snippet,
        type: detectType(href),
        source: 'jw.org',
        thumbnail,
      })
    })

    // Fallback: try og:image for thumbnail if no results had one
    if (results.length === 0) {
      // Page-level og:image as last resort — skip, already have results loop
    }

    return results.slice(0, limit)
  } catch {
    return []
  }
}
