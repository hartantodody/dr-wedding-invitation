'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { EnvelopeSimple } from '@phosphor-icons/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  COPY,
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  type AppLanguage
} from '@/constant/i18n'
import BackgroundMusicPlayer, {
  type BackgroundMusicPlayerHandle
} from '@/components/common/BackgroundMusicPlayer'
import { DEFAULT_RECIPIENT, INVITATION_EVENT } from '@/constant/invitation'
import InvitationContent from './InvitationContent'

type SplashScreenProps = {
  recipientName?: string
  initialLanguage?: AppLanguage
}

const openTransition = {
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function SplashScreen({
  recipientName,
  initialLanguage = DEFAULT_LANGUAGE
}: SplashScreenProps) {
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage)
  const [showSplash, setShowSplash] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const openTimeoutRef = useRef<number | null>(null)
  const musicPlayerRef = useRef<BackgroundMusicPlayerHandle | null>(null)

  const copy = COPY[language]

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        window.clearTimeout(openTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (showSplash) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showSplash])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', language)
    window.history.replaceState({}, '', url.toString())
  }, [language])

  const finalRecipient = recipientName?.trim() || DEFAULT_RECIPIENT

  const resetScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  const handleOpenInvitation = () => {
    if (isOpening) return

    resetScrollToTop()
    setIsOpening(true)
    musicPlayerRef.current?.requestPlay()

    openTimeoutRef.current = window.setTimeout(() => {
      setShowSplash(false)
      window.requestAnimationFrame(() => {
        resetScrollToTop()
      })
    }, 1280)
  }

  return (
    <main className='relative min-h-[100svh] overflow-x-clip bg-[var(--color-primary)]'>
      <motion.div
        initial={false}
        animate={showSplash ? { opacity: 0, y: 28 } : { opacity: 1, y: 0 }}
        transition={openTransition}
        className='relative min-h-[100svh]'
      >
        <InvitationContent language={language} onLanguageChange={setLanguage} />
      </motion.div>

      <AnimatePresence>
        {showSplash ? (
          <motion.div
            key='splash'
            initial={{ opacity: 0, y: 34 }}
            animate={
              isOpening ? { opacity: 0, y: '-112%' } : { opacity: 1, y: 0 }
            }
            exit={{ opacity: 0, y: '-112%' }}
            transition={{ duration: 1.28, ease: [0.16, 1, 0.3, 1] }}
            className='fixed inset-0 z-30'
          >
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgb(200_180_139/0.2),transparent_34%),linear-gradient(165deg,#070709_0%,#0a0a0c_52%,#121315_100%)]' />
            <div className='absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.55px,transparent_0.55px)] [background-size:4px_4px]' />

            <div className='absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.42)] bg-[rgb(12_12_14/0.62)] px-2 py-1 sm:right-6 sm:top-6'>
              <span className='text-[0.6rem] uppercase tracking-[0.14em] text-[rgb(223_230_227/0.82)] sm:text-[0.66rem]'>
                {copy.splash.languageLabel}
              </span>
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = option === language

                return (
                  <button
                    key={option}
                    type='button'
                    onClick={() => setLanguage(option)}
                    className={`rounded-full px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] transition ${
                      isActive
                        ? 'bg-[var(--color-accent-soft)] text-[var(--color-primary-deep)]'
                        : 'text-[rgb(223_230_227/0.78)] hover:bg-[rgb(223_230_227/0.14)]'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            <section className='relative flex min-h-[100svh] items-center justify-center px-5 pb-20 pt-14 sm:px-8'>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1
                }}
                className='w-full max-w-[30rem] text-center'
              >
                <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(223_230_227/0.92)]'>
                  {copy.hero.title}
                </p>
                <h1 className='mt-3 text-5xl font-semibold text-[var(--color-neutral-strong)] sm:text-6xl'>
                  {INVITATION_EVENT.groomName} &amp;{' '}
                  {INVITATION_EVENT.brideName}
                </h1>

                <div className='mx-auto mt-5 w-[min(74vw,18.5rem)] sm:w-[min(60vw,22rem)]'>
                  <div className='relative aspect-[0.74] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-[rgb(223_230_227/0.5)] bg-[rgb(9_9_10)] shadow-[0_20px_55px_rgb(0_0_0/0.38)]'>
                    <Image
                      src='/splash-screen.jpeg'
                      alt='Dody and Ritza'
                      fill
                      priority
                      sizes='(min-width: 640px) 22rem, 74vw'
                      className='object-cover object-center scale-[1.03]'
                    />
                    <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgb(223_230_227/0.14),transparent_44%),linear-gradient(180deg,rgb(0_0_0/0.05)_0%,rgb(0_0_0/0.28)_82%)]' />
                  </div>
                </div>

                <div className='mt-7'>
                  <p className='text-sm tracking-[0.18em] text-[rgb(223_230_227/0.85)]'>
                    {copy.splash.to}
                  </p>
                  <p className='mt-2 text-3xl font-semibold text-[var(--color-neutral-strong)] sm:text-4xl'>
                    {finalRecipient}
                  </p>
                </div>

                <motion.button
                  type='button'
                  onClick={handleOpenInvitation}
                  whileTap={{ scale: 0.98 }}
                  className='mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.88)] bg-[rgb(12_12_14/0.62)] px-5 py-3 text-base font-semibold text-[var(--color-neutral-strong)] shadow-[0_14px_40px_rgb(0_0_0/0.36)] transition hover:bg-[rgb(28_28_30/0.8)]'
                >
                  <EnvelopeSimple size={17} weight='fill' aria-hidden='true' />
                  {copy.splash.openButton}
                </motion.button>
              </motion.div>
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <BackgroundMusicPlayer ref={musicPlayerRef} language={language} />
    </main>
  )
}
