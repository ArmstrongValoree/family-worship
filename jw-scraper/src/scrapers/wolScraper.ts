import axios from 'axios'
import * as cheerio from 'cheerio'
import type { SearchResult } from '../types'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

      const snippet =
        $el.find('p, .snippet, [class*="snippet"], [class*="excerpt"]').first().text().trim() ||
        $el.text().replace(title, '').trim().slice(0, 200)

      const publication =
        $el.find('.pub, [class*="publication"], [class*="pub-"]').first().text().trim() ||
        undefined

      const date =
        $el.find('.date, [class*="date"], time').first().text().trim() || undefined

      results.push({
        title,
        url: href,
        snippet,
        type: 'article',
        source: 'wol.jw.org',
        publication: publication || undefined,
        date: date || undefined,
      })
    })

    return results.slice(0, limit)
  } catch {
    return []
  }
}
