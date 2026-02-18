'use client'

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { GALLERY_ITEMS, type GalleryItem } from '@/constant/gallery'

type GallerySectionProps = {
  language: AppLanguage
  items?: GalleryItem[]
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const sizeVariants = [
  'h-[56svh] w-[34vw] min-w-[420px]',
  'h-[37svh] w-[22vw] min-w-[250px]',
  'h-[44svh] w-[27vw] min-w-[320px]',
  'h-[33svh] w-[18vw] min-w-[210px]',
  'h-[52svh] w-[30vw] min-w-[380px]'
] as const

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

  const [progress, setProgress] = useState(0)
  const [maxTranslate, setMaxTranslate] = useState(0)

  const sectionHeightVh = useMemo(
    () => Math.max(280, Math.round(galleryItems.length * 36)),
    [galleryItems.length]
  )

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 86,
    damping: 24,
    mass: 0.42
  })

  const x = useTransform(smoothProgress, (value) => -maxTranslate * clamp(value, 0, 1))

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    setProgress((previous) => {
      const next = clamp(value, 0, 1)
      return Math.abs(previous - next) > 0.001 ? next : previous
    })
  })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const updateMeasurements = () => {
      const viewportWidth = window.innerWidth || 1
      setMaxTranslate(Math.max(0, track.scrollWidth - viewportWidth))
    }

    updateMeasurements()

    const resizeObserver = new ResizeObserver(updateMeasurements)
    resizeObserver.observe(track)
    window.addEventListener('resize', updateMeasurements)

    return () => {
      window.removeEventListener('resize', updateMeasurements)
      resizeObserver.disconnect()
    }
  }, [galleryItems.length])

  const activeSlide = Math.min(
    galleryItems.length,
    Math.floor(progress * galleryItems.length) + 1
  )

  return (
    <section
      id='gallery'
      ref={sectionRef}
      className='relative overflow-x-clip border-t border-[rgb(182_186_192/0.22)] md:min-h-[100svh]'
      style={{
        height: `${sectionHeightVh}svh`,
        background:
          'radial-gradient(circle at 16% 10%, rgb(200 180 139 / 0.1), transparent 35%), linear-gradient(180deg, #17181a 0%, #111214 44%, #0b0b0c 100%)'
      }}
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-[-12%] opacity-75'
        style={{
          background:
            'radial-gradient(130% 88% at 8% 6%, transparent 58%, rgb(200 180 139 / 0.18) 58.5%, transparent 59.2%), radial-gradient(108% 84% at 35% 35%, transparent 57%, rgb(200 180 139 / 0.14) 57.5%, transparent 58.4%), radial-gradient(130% 90% at 60% 20%, transparent 56%, rgb(200 180 139 / 0.12) 56.5%, transparent 57.4%), radial-gradient(130% 90% at 90% 62%, transparent 55%, rgb(200 180 139 / 0.1) 55.5%, transparent 56.4%)'
        }}
      />
      <div className='pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.5px,transparent_0.5px)] [background-size:4px_4px]' />

      <div className='sticky top-0 h-[100svh] overflow-hidden'>
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
            className='relative flex h-full items-center gap-5 px-[6vw] will-change-transform sm:gap-6'
          >
            <motion.article
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ ...revealTransition, delay: 0.12 }}
              className='pointer-events-none shrink-0'
            >
              <p className='max-w-[32vw] min-w-[340px] text-4xl font-semibold leading-tight text-[rgb(223_230_227/0.92)] sm:text-6xl'>
                {copy.gallery.quote}
              </p>
              <p className='mt-4 text-sm uppercase tracking-[0.24em] text-[var(--color-accent-soft)]'>
                {copy.gallery.quoteCaption}
              </p>
            </motion.article>

            {galleryItems.map((item, index) => {
              const sizeClass = sizeVariants[index % sizeVariants.length]
              const offsetClass = offsetVariants[index % offsetVariants.length]

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30, scale: 0.982 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ ...revealTransition, delay: 0.14 + index * 0.04 }}
                  className={`relative shrink-0 overflow-hidden rounded-[1.65rem] ${sizeClass} ${offsetClass}`}
                >
                  <div className='relative h-full w-full overflow-hidden rounded-[1.65rem] border border-[rgb(223_230_227/0.3)] shadow-[0_24px_70px_rgb(0_0_0/0.32),inset_0_1px_0_rgb(223_230_227/0.08)]'>
                    <div
                      aria-hidden='true'
                      className='absolute inset-0 bg-cover bg-center'
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className='absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgb(200_180_139/0.16),transparent_38%)]' />
                    <div className='absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgb(0_0_0/0.6)_100%)] px-4 pb-3 pt-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[rgb(223_230_227/0.92)]'>
                      {item.label}
                    </div>
                    <p className='pointer-events-none absolute left-4 top-4 text-[0.62rem] uppercase tracking-[0.14em] text-[rgb(223_230_227/0.86)]'>
                      {item.title}
                    </p>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...revealTransition, delay: 0.18 }}
            className='absolute bottom-6 left-5 right-5 z-20 sm:left-8 sm:right-8'
          >
            <div className='h-[2px] w-full overflow-hidden rounded-full bg-[rgb(223_230_227/0.24)]'>
              <div
                className='h-full rounded-full bg-[var(--color-accent-soft)]'
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className='mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-[rgb(223_230_227/0.78)]'>
              {copy.gallery.scrollHint}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

