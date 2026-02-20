'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Signature from '../animation/signature/Signature'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { INVITATION_EVENT } from '@/constant/invitation'

type HeroProps = {
  language: AppLanguage
}

type HeroSlide = {
  src: string
  contentAlign: 'left' | 'right'
  mobileBackgroundPosition: string
  desktopBackgroundPosition: string
}

const sectionTransition = {
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1] as const
}

const fallbackSlide: HeroSlide = {
  src: '/images/hero.jpeg',
  contentAlign: 'left',
  mobileBackgroundPosition: '72% 72%',
  desktopBackgroundPosition: '78% 58%'
}

export default function Hero({ language }: HeroProps) {
  const copy = COPY[language]
  const slides = useMemo<HeroSlide[]>(
    () =>
      INVITATION_EVENT.heroBackgroundSlides.length > 0
        ? INVITATION_EVENT.heroBackgroundSlides.map((slide) => ({ ...slide }))
        : [fallbackSlide],
    []
  )
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [contentSlideIndex, setContentSlideIndex] = useState(0)
  const [isContentVisible, setIsContentVisible] = useState(true)
  const contentSwapTimerRef = useRef<number | null>(null)
  const activeSlide = slides[activeSlideIndex] ?? slides[0]
  const contentSlide = slides[contentSlideIndex] ?? slides[0]
  const isRightAligned = contentSlide.contentAlign === 'right'

  useEffect(() => {
    if (slides.length < 2) return

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % slides.length)
    }, 6200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [slides.length])

  useEffect(() => {
    return () => {
      if (contentSwapTimerRef.current) {
        window.clearTimeout(contentSwapTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (activeSlideIndex === contentSlideIndex) return

    if (contentSwapTimerRef.current) {
      window.clearTimeout(contentSwapTimerRef.current)
    }

    const hideFrameId = window.requestAnimationFrame(() => {
      setIsContentVisible(false)
    })

    contentSwapTimerRef.current = window.setTimeout(() => {
      setContentSlideIndex(activeSlideIndex)

      window.requestAnimationFrame(() => {
        setIsContentVisible(true)
      })
    }, 320)

    return () => {
      window.cancelAnimationFrame(hideFrameId)
    }
  }, [activeSlideIndex, contentSlideIndex])

  return (
    <section id='hero' className='relative isolate h-[100svh] overflow-hidden'>
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.div
          key={activeSlide.src}
          className='absolute inset-0 bg-cover bg-[position:var(--hero-mobile-position)] md:bg-[position:var(--hero-desktop-position)]'
          style={{
            backgroundImage: `url('${activeSlide.src}')`,
            backgroundColor: '#080809',
            '--hero-mobile-position': activeSlide.mobileBackgroundPosition,
            '--hero-desktop-position': activeSlide.desktopBackgroundPosition
          } as CSSProperties & {
            '--hero-mobile-position': string
            '--hero-desktop-position': string
          }}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.15, ease: 'easeInOut' },
            scale: { duration: 6.2, ease: 'easeOut' }
          }}
        />
      </AnimatePresence>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgb(200_180_139/0.2),transparent_34%),linear-gradient(180deg,rgb(0_0_0/0.62)_0%,rgb(0_0_0/0.28)_36%,rgb(0_0_0/0.12)_66%,rgb(0_0_0/0.08)_100%)]' />
      <div className='absolute inset-0 opacity-[0.09] [background-image:radial-gradient(rgb(223_230_227/0.17)_0.45px,transparent_0.45px)] [background-size:3px_3px]' />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={sectionTransition}
        className='relative h-full px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 md:px-8 md:pb-12 md:pt-20'
      >
        <div className='mx-auto h-full w-full max-w-[112rem]'>
          <motion.div
            animate={
              isContentVisible
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 10, filter: 'blur(4px)' }
            }
            transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
            className={`flex h-full max-w-[33rem] flex-col justify-start sm:max-w-[46rem] md:max-w-[92rem] ${
              isRightAligned
                ? 'ml-auto items-end text-right'
                : 'mr-auto items-start text-left'
            }`}
          >
            <p className='text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-[rgb(182_186_192/0.94)] sm:text-[0.82rem] md:text-[1.06rem] md:tracking-[0.3em]'>
              {copy.hero.title}
            </p>

            <div
              className={`mt-4 max-w-[44rem] text-[var(--color-neutral-strong)] sm:mt-5 sm:max-w-[64rem] md:mt-7 md:max-w-[110rem] ${
                isRightAligned ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <Signature
                className='w-full'
                strokeDuration={3.8}
                fillStartAt={0.64}
                fillFadeDuration={1.1}
                strokeWidth={0.28}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
