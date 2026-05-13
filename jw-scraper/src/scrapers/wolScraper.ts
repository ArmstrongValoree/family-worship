import axios from 'axios'
import * as cheerio from 'cheerio'
import type { SearchResult } from '../types'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Matches patterns like "Eph. 6:17", "1 Cor. 13:4-7", "John 3:16"
function extractScriptureRef(text: string): string | undefined {
  const match = text.match(/\b(?:\d\s)?[A-Z][a-z]+\.?\s+\d+:\d+(?:[–\-]\d+)?/)
  return match ? match[0].trim() : undefined
}

export async function scrapeWOL(query: string, limit: number): Promise<SearchResult[]> {
  try {
    const encoded = encodeURIComponent(query)
    const url = `https://wol.jw.org/en/wol/s/r1/lp-e?q=${encoded}&p=par`

    await delay(1000)

    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    })

    const $ = cheerio.load(response.data)
    const results: SearchResult[] = []

    $('.searchResult, .result, [class*="search-result"]').each((_, el) => {
      if (results.length >= limit) return false

      const $el = $(el)
      const titleEl = $el.find('h2, h3, .title, [class*="title"], a').first()
      const title = titleEl.text().trim()
      if (!title) return

      const linkEl = $el.find('a').first()
      let href = linkEl.attr('href') || ''
      if (!href) return
      if (href.startsWith('/')) href = `https://wol.jw.org${href}`

      const snippetEl = $el.find('p, .snippet, [class*="snippet"], [class*="excerpt"]').first()
      const snippet = snippetEl.text().trim() || $el.text().replace(title, '').trim().slice(0, 200)

      const rawPub = $el.find('.pub, .pubName, [class*="publication"], [class*="pub-"]').first().text().trim()
      // Take only the first line, trim to 60 chars to avoid index-style "... (See also X)" noise
      const publication = rawPub ? rawPub.split('\n')[0].trim().slice(0, 60) || undefined : undefined

      const date =
        $el.find('.date, [class*="date"], time').first().text().trim() || undefined

      // Check title and snippet for scripture references
      const scriptureRef = extractScriptureRef(title) || extractScriptureRef(snippet)

      results.push({
        title,
        url: href,
        snippet,
        type: 'article',
        source: 'wol.jw.org',
        publication: publication || undefined,
        date: date || undefined,
        category: scriptureRef ? `Scripture: ${scriptureRef}` : (publication || undefined),
      })
    })

    return results.slice(0, limit)
  } catch {
    return []
  }
}
