import { getBrowser } from '../utils/browser'
import type { SearchResult } from '../types'

function detectType(category: string, url: string): SearchResult['type'] {
  const cat = category.toUpperCase()
  if (cat.includes('VIDEO') || url.includes('/videos/') || url.includes('tv.jw.org')) return 'video'
  if (cat.includes('SONG') || url.includes('/music/') || url.includes('/song')) return 'song'
  return 'article'
}

interface RawResult {
  title: string
  url: string
  snippet: string
  category: string
  thumbnail: string
}

const TIMEOUT_MS = 45000

export async function scrapeJW(query: string, limit: number): Promise<SearchResult[]> {
  const scrape = async (): Promise<SearchResult[]> => {
    const browser = await getBrowser()
    const page = await browser.newPage()
    try {

    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    })

    await page.goto('https://www.jw.org/en/search/', {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT_MS,
    })

    await page.waitForSelector('input.cc-input, input[type="text"]', { timeout: 20000 })
    await page.click('input.cc-input, input[type="text"]')
    await page.keyboard.type(query)
    await page.keyboard.press('Enter')

    await page
      .waitForSelector('.cc-mediaObject', { timeout: 20000 })
      .catch(() => null)

    const raw: RawResult[] = await page.evaluate((lim: number): RawResult[] => {
      const items: RawResult[] = []

      // Target only article/publication result cards; video cards use a different component
      const cards = Array.from(
        document.querySelectorAll(
          '.cc-articleOmniSearchResultItem, .cc-publicationOmniSearchResultItem, .cc-mediaObject'
        )
      ) as Element[]

      for (const card of cards) {
        if (items.length >= lim) break

        const bodyEl = card.querySelector('.cc-mediaObject-body') as HTMLElement | null
        if (!bodyEl) continue

        const catEl = bodyEl.querySelector('p.cc-deemphasizedText') as HTMLElement | null
        const category = catEl?.textContent?.trim() ?? ''

        const h4 = bodyEl.querySelector('h4') as HTMLElement | null
        if (!h4) continue
        const linkEl = h4.querySelector('a') as HTMLAnchorElement | null
        if (!linkEl) continue
        const title = (h4.querySelector('span')?.textContent || linkEl.textContent || '').trim()
        // Video cards show duration (e.g. "4:43") in h4 — skip those
        if (!title || title.length < 4 || /^\d+:\d+$/.test(title)) continue

        let href = linkEl.getAttribute('href') || linkEl.href || ''
        if (!href) continue
        if (href.startsWith('/')) href = 'https://www.jw.org' + href

        const paras = Array.from(bodyEl.querySelectorAll('p')) as HTMLElement[]
        const snippetEl = paras.find(
          (p) => p !== catEl && (p.textContent || '').trim().length > 10
        ) || null
        const snippet = snippetEl?.textContent?.trim() ?? ''

        const imgEl = card.querySelector('img.cc-mediaObjectImage') as HTMLImageElement | null
        let thumbnail = imgEl?.getAttribute('src') || imgEl?.src || ''
        if (thumbnail.startsWith('/')) thumbnail = 'https://www.jw.org' + thumbnail

        items.push({ title, url: href, snippet, category, thumbnail })
      }

      return items
    }, limit)

    return raw.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet.slice(0, 300),
      type: detectType(r.category, r.url),
      source: 'jw.org' as const,
      thumbnail: r.thumbnail || undefined,
      category: r.category || undefined,
    }))
    } finally {
      await page.close().catch(() => null)
    }
  }

  try {
    const result = await Promise.race([
      scrape(),
      new Promise<SearchResult[]>((_, reject) =>
        setTimeout(() => reject(new Error('Puppeteer timeout')), TIMEOUT_MS + 20000)
      ),
    ])
    return result.slice(0, limit)
  } catch (err) {
    console.error('[jwScraper] error:', err instanceof Error ? err.message : err)
    return []
  }
}
