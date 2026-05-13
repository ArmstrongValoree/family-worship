import chromium from '@sparticuz/chromium'
import puppeteerCore from 'puppeteer-core'
import type { Browser } from 'puppeteer-core'
import fs from 'fs'

// Common Chrome locations for local Windows development
const LOCAL_CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Users\\' + (process.env.USERNAME || '') + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
]

async function getExecutablePath(): Promise<string> {
  if (process.env.CHROME_EXECUTABLE_PATH) {
    return process.env.CHROME_EXECUTABLE_PATH
  }
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    return await chromium.executablePath()
  }
  for (const p of LOCAL_CHROME_PATHS) {
    if (fs.existsSync(p)) return p
  }
  return await chromium.executablePath()
}

// Cached browser instance — avoids re-launching on every request
let cachedBrowser: Browser | null = null

export async function getBrowser(): Promise<Browser> {
  // Return cached browser if still connected
  if (cachedBrowser) {
    try {
      // Check it's still alive
      await cachedBrowser.version()
      return cachedBrowser
    } catch {
      cachedBrowser = null
    }
  }

  const executablePath = await getExecutablePath()
  cachedBrowser = await puppeteerCore.launch({
    args: [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
    defaultViewport: { width: 1280, height: 720 },
    executablePath,
    headless: true,
  })

  // Clear cache if browser closes unexpectedly
  cachedBrowser.on('disconnected', () => { cachedBrowser = null })

  return cachedBrowser
}
