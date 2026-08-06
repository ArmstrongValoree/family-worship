const sharp = require('sharp')

async function generate() {
  const input = 'C:/Users/armst/Downloads/familyworship icon.jpg'

  await sharp(input).resize(192, 192).png().toFile('public/pwa-192x192.png')
  console.log('192x192 done')

  await sharp(input).resize(512, 512).png().toFile('public/pwa-512x512.png')
  console.log('512x512 done')

  await sharp(input).resize(180, 180).png().toFile('public/apple-touch-icon.png')
  console.log('180x180 apple done')

  await sharp(input).resize(32, 32).png().toFile('public/favicon.ico')
  console.log('favicon done')
}

generate()
