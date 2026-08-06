import chromium from '@sparticuz/chromium'
import puppeteerCore from 'puppeteer-core'
import type { Browser } from 'puppeteer-core'
import fs from 'fs'

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

let cachedBrowser: Browser | null = null

export async function getBrowser(): Promise<Browser> {
  if (cachedBrowser) return cachedBrowser

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

  cachedBrowser.on('disconnected', () => { cachedBrowser = null })

  return cachedBrowser
}

// Close gracefully on shutdown so Chromium doesn't become a zombie process
async function closeBrowser() {
  if (cachedBrowser) {
    await cachedBrowser.close().catch(() => null)
    cachedBrowser = null
  }
}

process.on('SIGTERM', closeBrowser)
process.on('SIGINT', closeBrowser)
