'use client'

import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { GALLERY_ITEMS, type GalleryItem } from '@/constant/gallery'

type GallerySectionProps = {
  language: AppLanguage
  items?: GalleryItem[]
}

type ImageMeta = {
  width: number
  height: number
  ratio: number
  orientation: 'landscape' | 'portrait' | 'square'
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const fitByRatio = (options: {
  ratio: number
  targetWidth: number
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
}) => {
  const { ratio, targetWidth, minWidth, maxWidth, minHeight, maxHeight } =
    options
  let width = clamp(targetWidth, minWidth, maxWidth)
  let height = width / ratio

  if (height > maxHeight) {
    height = maxHeight
    width = height * ratio
  }

  if (height < minHeight) {
    height = minHeight
    width = height * ratio
  }

  if (width > maxWidth) {
    width = maxWidth
    height = width / ratio
  }

  if (width < minWidth) {
    width = minWidth
    height = width / ratio
  }

  return { width, height }
}

const cardHeightFactors = [0.56, 0.37, 0.44, 0.33, 0.52] as const

const offsetVariants = [
  '-translate-y-[11svh]',
  'translate-y-[10svh]',
  '-translate-y-[4svh]',
  'translate-y-[13svh]',
  '-translate-y-[7svh]'
] as const

const revealTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function GallerySection({
  language,
  items = GALLERY_ITEMS
}: GallerySectionProps) {
  const galleryItems = items.length > 0 ? items : GALLERY_ITEMS
  const copy = COPY[language]

  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const lockedMobileHeightRef = useRef<number | null>(null)
  const lastMobileWidthRef = useRef<number | null>(null)

  const [activeSlide, setActiveSlide] = useState(1)
  const [maxTranslate, setMaxTranslate] = useState(0)
  const [sectionHeightPx, setSectionHeightPx] = useState(2800)
  const [viewportSize, setViewportSize] = useState({ width: 1440, height: 900 })
  const [imageMetaMap, setImageMetaMap] = useState<Record<string, ImageMeta>>(
    {}
  )
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isIosBrowser] = useState(() => {
    if (typeof window === 'undefined') return false

    const userAgent = window.navigator.userAgent
    const platform = window.navigator.platform
    const hasMacTouchPoints =
      platform === 'MacIntel' && window.navigator.maxTouchPoints > 1

    return /iPad|iPhone|iPod/.test(userAgent) || hasMacTouchPoints
  })
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  })

  const useStableIosMode = isIosBrowser || prefersReducedMotion

  const xLinear = useTransform(
    scrollYProgress,
    (value) => -maxTranslate * clamp(value, 0, 1)
  )
  const xSpring = useSpring(xLinear, {
    stiffness: 165,
    damping: 31,
    mass: 0.46
  })
  const x = useTransform(
    [xLinear, xSpring, scrollYProgress] as const,
    (latest) => {
      const [linear, spring, progress] = latest as [number, number, number]

      if (useStableIosMode) return linear

      const p = clamp(progress, 0, 1)

      if (p >= 0.9) {
        const t = (p - 0.9) / 0.1
        return spring + (linear - spring) * t
      }

      return spring
    }
  )
  const progressScaleX = useTransform(scrollYProgress, (value) =>
    clamp(value, 0, 1)
  )

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const nextSlide = Math.min(
      galleryItems.length,
      Math.floor(clamp(value, 0, 1) * galleryItems.length) + 1
    )

    setActiveSlide((previous) =>
      previous === nextSlide ? previous : nextSlide
    )
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    let isMounted = true

    galleryItems.forEach((item) => {
      if (imageMetaMap[item.id]) return

      const image = new window.Image()
      image.onload = () => {
        if (!isMounted) return

        const width = image.naturalWidth
        const height = image.naturalHeight

        if (!width || !height) return

        const ratio = width / height
        const orientation =
          ratio > 1.02 ? 'landscape' : ratio < 0.98 ? 'portrait' : 'square'

        setImageMetaMap((previous) => {
          if (previous[item.id]) return previous

          return {
            ...previous,
            [item.id]: {
              width,
              height,
              ratio,
              orientation
            }
          }
        })
      }
      image.src = item.image
    })

    return () => {
      isMounted = false
    }
  }, [galleryItems, imageMetaMap])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const updateMeasurements = () => {
      const viewportWidth = window.innerWidth || 1
      const rawViewportHeight = window.innerHeight || 1
      const isMobileViewport = viewportWidth < 768

      let viewportHeight = rawViewportHeight

      if (isMobileViewport) {
        const widthChanged =
          lastMobileWidthRef.current === null ||
          Math.abs(lastMobileWidthRef.current - viewportWidth) > 12

        if (widthChanged || lockedMobileHeightRef.current === null) {
          lastMobileWidthRef.current = viewportWidth
          lockedMobileHeightRef.current = rawViewportHeight
        }

        viewportHeight = lockedMobileHeightRef.current ?? rawViewportHeight
      } else {
        lockedMobileHeightRef.current = null
        lastMobileWidthRef.current = null
      }

      const nextTranslate = Math.max(0, track.scrollWidth - viewportWidth)
      const endPauseSpace = Math.max(220, Math.round(viewportHeight * 0.34))
      const nextHeight = Math.max(
        viewportHeight * 2,
        Math.round(viewportHeight + nextTranslate + endPauseSpace)
      )

      setViewportSize((previous) => {
        if (
          previous.width === viewportWidth &&
          previous.height === viewportHeight
        ) {
          return previous
        }

        return { width: viewportWidth, height: viewportHeight }
      })
      setMaxTranslate((previous) =>
        previous === nextTranslate ? previous : nextTranslate
      )
      setSectionHeightPx((previous) =>
        previous === nextHeight ? previous : nextHeight
      )
    }

    let rafId = 0
    const scheduleUpdateMeasurements = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        updateMeasurements()
      })
    }

    updateMeasurements()
    const settleTimerFast = window.setTimeout(updateMeasurements, 120)
    const settleTimerSlow = window.setTimeout(updateMeasurements, 520)

    const resizeObserver = new ResizeObserver(updateMeasurements)
    resizeObserver.observe(track)
    window.addEventListener('resize', scheduleUpdateMeasurements)
    window.addEventListener('load', scheduleUpdateMeasurements)

    return () => {
      window.removeEventListener('resize', scheduleUpdateMeasurements)
      window.removeEventListener('load', scheduleUpdateMeasurements)
      window.clearTimeout(settleTimerFast)
      window.clearTimeout(settleTimerSlow)
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      resizeObserver.disconnect()
    }
  }, [galleryItems.length, imageMetaMap])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedIndex])

  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null)
        return
      }

      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) => {
          if (current === null) return 0
          return (current + 1) % galleryItems.length
        })
        return
      }

      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) => {
          if (current === null) return 0
          return (current - 1 + galleryItems.length) % galleryItems.length
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [galleryItems.length, selectedIndex])

  const selectedItem =
    selectedIndex === null ? null : galleryItems[selectedIndex]
  const selectedPhotoNumber = selectedIndex === null ? 1 : selectedIndex + 1

  return (
    <section
      id='gallery'
      ref={sectionRef}
      className='relative overflow-x-clip border-t border-[rgb(182_186_192/0.22)]'
      style={{
        height: `${sectionHeightPx}px`,
        background:
          'radial-gradient(circle at 16% 10%, rgb(200 180 139 / 0.1), transparent 35%), linear-gradient(180deg, #17181a 0%, #111214 44%, #0b0b0c 100%)'
      }}
    >
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute inset-[-12%] opacity-75'
        style={{
          background:
            'radial-gradient(130% 88% at 8% 6%, transparent 58%, rgb(200 180 139 / 0.18) 58.5%, transparent 59.2%), radial-gradient(108% 84% at 35% 35%, transparent 57%, rgb(200 180 139 / 0.14) 57.5%, transparent 58.4%), radial-gradient(130% 90% at 60% 20%, transparent 56%, rgb(200 180 139 / 0.12) 56.5%, transparent 57.4%), radial-gradient(130% 90% at 90% 62%, transparent 55%, rgb(200 180 139 / 0.1) 55.5%, transparent 56.4%)'
        }}
        animate={
          useStableIosMode
            ? undefined
            : {
                rotate: [0, 1.8, -1.2, 0],
                x: [0, 16, -10, 0],
                y: [0, -14, 8, 0],
                scale: [1, 1.03, 0.99, 1],
                opacity: [0.72, 0.84, 0.76, 0.72]
              }
        }
        transition={
          useStableIosMode
            ? undefined
            : {
                duration: 32,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut'
              }
        }
      />
      <div className='pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.5px,transparent_0.5px)] [background-size:4px_4px]' />

      <div className='sticky top-0 h-[100lvh] overflow-hidden md:h-[100svh]'>
        <div className='relative h-full'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={revealTransition}
            className='pointer-events-none absolute left-5 top-5 z-20 text-[2.1rem] font-semibold uppercase leading-[0.88] text-[rgb(223_230_227/0.9)] sm:left-8 sm:top-7 sm:text-[3rem]'
          >
            Dody
            <br />
            Ritza
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ ...revealTransition, delay: 0.1 }}
            className='pointer-events-none absolute right-5 top-6 z-20 hidden sm:block'
          >
            <p className='text-right text-xs uppercase tracking-[0.22em] text-[rgb(182_186_192/0.88)]'>
              {copy.gallery.sectionLabel}
            </p>
            <p className='mt-2 text-right text-lg text-[var(--color-neutral-strong)]'>
              {activeSlide} / {galleryItems.length}
            </p>
          </motion.div>

          <motion.div
            ref={trackRef}
            style={{ x }}
            className={`relative flex h-full items-center gap-6 px-[12vw] sm:gap-7 sm:px-[15vw] lg:px-[18vw] ${
              useStableIosMode ? '' : 'will-change-transform'
            }`}
          >
            <motion.article
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ ...revealTransition, delay: 0.12 }}
              className='pointer-events-none shrink-0'
            >
              <p className='max-w-[32vw] min-w-[340px] whitespace-pre-line text-2xl font-semibold leading-tight text-[rgb(223_230_227/0.92)] sm:text-5xl'>
                {copy.gallery.quote}
              </p>
              <p className='mt-4 text-sm uppercase tracking-[0.24em] text-[var(--color-accent-soft)]'>
                {copy.gallery.quoteCaption}
              </p>
            </motion.article>

            {galleryItems.map((item, index) => {
              const meta = imageMetaMap[item.id]
              const orientation =
                item.orientation ?? meta?.orientation ?? 'landscape'
              const fallbackRatio =
                orientation === 'landscape'
                  ? 1.48
                  : orientation === 'portrait'
                    ? 0.68
                    : 1
              const imageRatio = clamp(meta?.ratio ?? fallbackRatio, 0.58, 1.82)
              const heightFactor =
                cardHeightFactors[index % cardHeightFactors.length]
              const isMobileViewport = viewportSize.width < 768

              let cardWidthPx: number
              let cardHeightPx: number

              if (isMobileViewport) {
                if (orientation === 'landscape') {
                  const landscapeFit = fitByRatio({
                    ratio: imageRatio,
                    targetWidth: viewportSize.width * 1.24,
                    minWidth: viewportSize.width * 0.94,
                    maxWidth: viewportSize.width * 1.72,
                    minHeight: 240,
                    maxHeight: clamp(viewportSize.height * 0.58, 280, 500)
                  })
                  cardWidthPx = landscapeFit.width
                  cardHeightPx = landscapeFit.height
                } else {
                  const portraitFit = fitByRatio({
                    ratio: imageRatio,
                    targetWidth:
                      orientation === 'portrait'
                        ? viewportSize.width * 0.72
                        : viewportSize.width * 0.78,
                    minWidth: 220,
                    maxWidth: 430,
                    minHeight: 260,
                    maxHeight: Math.round(viewportSize.height * 0.78)
                  })
                  cardWidthPx = portraitFit.width
                  cardHeightPx = portraitFit.height
                }
              } else {
                const desktopFit = fitByRatio({
                  ratio: imageRatio,
                  targetWidth: viewportSize.height * heightFactor * imageRatio,
                  minWidth:
                    orientation === 'portrait'
                      ? 190
                      : orientation === 'square'
                        ? 230
                        : 260,
                  maxWidth: Math.round(viewportSize.width * 0.68),
                  minHeight: 220,
                  maxHeight: 780
                })

                cardWidthPx = desktopFit.width
                cardHeightPx = desktopFit.height
              }

              if (
                !Number.isFinite(cardWidthPx) ||
                !Number.isFinite(cardHeightPx) ||
                cardWidthPx <= 0 ||
                cardHeightPx <= 0
              ) {
                cardWidthPx = clamp(viewportSize.width * 0.7, 220, 540)
                cardHeightPx = clamp(
                  cardWidthPx / (imageRatio || 1),
                  240,
                  viewportSize.height * 0.78
                )
              }

              const offsetClass = isMobileViewport
                ? ''
                : offsetVariants[index % offsetVariants.length]

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30, scale: 0.982 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    ...revealTransition,
                    delay: 0.14 + index * 0.04
                  }}
                  className={`relative shrink-0 overflow-hidden rounded-[1.65rem] ${offsetClass}`}
                  style={{
                    width: `${cardWidthPx}px`,
                    height: `${cardHeightPx}px`
                  }}
                >
                  <button
                    type='button'
                    onClick={() => setSelectedIndex(index)}
                    className='group relative block h-full w-full overflow-hidden rounded-[1.65rem] border border-[rgb(223_230_227/0.3)] shadow-[0_24px_70px_rgb(0_0_0/0.32),inset_0_1px_0_rgb(223_230_227/0.08)] transition hover:border-[rgb(223_230_227/0.56)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(12_12_14)]'
                    aria-label={`Open photo ${index + 1}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt ?? `Pre-wedding photo ${index + 1}`}
                      fill
                      sizes='(max-width: 768px) 130vw, 48vw'
                      className='object-cover object-center transition duration-700 group-hover:scale-[1.03]'
                    />
                    <div className='absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgb(200_180_139/0.14),transparent_44%)]' />
                  </button>
                </motion.article>
              )
            })}

            <div
              aria-hidden='true'
              className='h-px w-[26vw] min-w-[260px] shrink-0'
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...revealTransition, delay: 0.18 }}
            className='absolute bottom-6 left-5 right-5 z-20 sm:left-8 sm:right-8'
          >
            <div className='h-[2px] w-full overflow-hidden rounded-full bg-[rgb(223_230_227/0.24)]'>
              <motion.div
                className='h-full rounded-full bg-[var(--color-accent-soft)]'
                style={{ scaleX: progressScaleX, transformOrigin: '0% 50%' }}
              />
            </div>
            <p className='mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-[rgb(223_230_227/0.78)]'>
              {copy.gallery.scrollHint}
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem ? (
          <motion.div
            key='gallery-preview'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className='fixed inset-0 z-[80] flex items-center justify-center bg-[rgb(4_4_6/0.86)] px-3 py-4 backdrop-blur-md sm:px-8 sm:py-6'
            role='dialog'
            aria-modal='true'
            aria-label='Gallery image preview'
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.985 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className='relative w-full max-w-[88rem]'
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <div className='relative mx-auto rounded-[1.1rem] border border-[rgb(223_230_227/0.24)] bg-[rgb(8_8_10/0.94)] p-2.5 shadow-[0_28px_95px_rgb(0_0_0/0.46)] sm:rounded-[1.5rem] sm:p-4'>
                <div className='relative h-[74svh] w-full overflow-hidden rounded-[0.85rem] bg-[rgb(6_6_8)] sm:h-[80svh] sm:rounded-[1.1rem]'>
                  <Image
                    src={selectedItem.image}
                    alt={
                      selectedItem.alt ??
                      `Pre-wedding photo ${selectedPhotoNumber}`
                    }
                    fill
                    sizes='95vw'
                    className='object-contain object-center'
                    priority
                  />
                </div>
              </div>

              <button
                type='button'
                onClick={() => setSelectedIndex(null)}
                className='absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-full border border-[rgb(223_230_227/0.32)] bg-[rgb(12_12_14/0.88)] text-[rgb(223_230_227/0.95)] shadow-[0_12px_30px_rgb(0_0_0/0.35)] transition hover:bg-[rgb(24_24_28/0.94)] sm:right-3 sm:top-3'
                aria-label='Close preview'
              >
                <X size={18} weight='bold' />
              </button>

              <button
                type='button'
                onClick={() => {
                  setSelectedIndex((current) => {
                    if (current === null) return 0
                    return (
                      (current - 1 + galleryItems.length) % galleryItems.length
                    )
                  })
                }}
                className='absolute left-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[rgb(223_230_227/0.32)] bg-[rgb(12_12_14/0.88)] text-[rgb(223_230_227/0.95)] shadow-[0_12px_30px_rgb(0_0_0/0.35)] transition hover:bg-[rgb(24_24_28/0.94)] sm:left-3'
                aria-label='Previous photo'
              >
                <CaretLeft size={20} weight='bold' />
              </button>

              <button
                type='button'
                onClick={() => {
                  setSelectedIndex((current) => {
                    if (current === null) return 0
                    return (current + 1) % galleryItems.length
                  })
                }}
                className='absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[rgb(223_230_227/0.32)] bg-[rgb(12_12_14/0.88)] text-[rgb(223_230_227/0.95)] shadow-[0_12px_30px_rgb(0_0_0/0.35)] transition hover:bg-[rgb(24_24_28/0.94)] sm:right-3'
                aria-label='Next photo'
              >
                <CaretRight size={20} weight='bold' />
              </button>

              <div className='pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[rgb(223_230_227/0.2)] bg-[rgb(8_8_10/0.82)] px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[rgb(223_230_227/0.86)] sm:bottom-4 sm:text-xs'>
                {selectedPhotoNumber} / {galleryItems.length}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
