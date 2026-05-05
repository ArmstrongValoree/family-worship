import { useState, useEffect } from 'react'
import { PARADISE_IMAGES } from '../../lib/constants'

export function ParadiseBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PARADISE_IMAGES.length)
        setNextIndex((prev) => (prev + 1) % PARADISE_IMAGES.length)
        setIsFading(false)
      }, 1500)
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Current image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms]"
        style={{
          backgroundImage: `url(${PARADISE_IMAGES[currentIndex]})`,
          opacity: isFading ? 0 : 1,
        }}
      />
      {/* Next image preloaded underneath */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${PARADISE_IMAGES[nextIndex]})`,
          opacity: isFading ? 1 : 0,
          transition: 'opacity 1500ms',
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(26,61,43,0.65) 0%, rgba(212,160,23,0.3) 100%)',
        }}
      />
    </div>
  )
}
