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
import {
  DEFAULT_RECIPIENT,
  INVITATION_EVENT,
  type ReceptionShiftId
} from '@/constant/invitation'
import InvitationContent from './InvitationContent'

type SplashScreenProps = {
  recipientName?: string
  initialLanguage?: AppLanguage
  receptionShiftIds?: ReceptionShiftId[]
}

const openTransition = {
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function SplashScreen({
  recipientName,
  initialLanguage = DEFAULT_LANGUAGE,
  receptionShiftIds
}: SplashScreenProps) {
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage)
  const [showSplash, setShowSplash] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const openTimeoutRef = useRef<number | null>(null)
  const musicPlayerRef = useRef<BackgroundMusicPlayerHandle | null>(null)

  const copy = COPY[language]
  const hasRecipientParam = Boolean(recipientName?.trim())
  const hasShiftParam = Boolean(receptionShiftIds?.length)
  const canOpenInvitation = hasRecipientParam && hasShiftParam

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
    if (isOpening || !canOpenInvitation) return

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
    <main className='relative min-h-[100svh] min-h-[100dvh] overflow-x-clip bg-[var(--color-primary)]'>
      <motion.div
        initial={false}
        animate={showSplash ? { opacity: 0, y: 28 } : { opacity: 1, y: 0 }}
        transition={openTransition}
        className='relative min-h-[100svh] min-h-[100dvh]'
      >
        <InvitationContent
          language={language}
          onLanguageChange={setLanguage}
          receptionShiftIds={receptionShiftIds}
          recipientName={recipientName}
        />
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
            <motion.div
              className='absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgb(200_180_139/0.2),transparent_34%),linear-gradient(165deg,#070709_0%,#0a0a0c_52%,#121315_100%)]'
              animate={{
                scale: [1, 1.04, 1],
                opacity: [1, 0.9, 1]
              }}
              transition={{
                duration: 9,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY
              }}
            />
            <motion.div
              aria-hidden='true'
              className='pointer-events-none absolute -left-[14%] top-[8%] h-[34svh] w-[34svh] rounded-full bg-[radial-gradient(circle,rgb(211_188_145/0.28)_0%,transparent_70%)] blur-3xl'
              animate={{
                x: [0, 36, -14, 0],
                y: [0, -26, 14, 0],
                opacity: [0.34, 0.58, 0.4, 0.34]
              }}
              transition={{
                duration: 12,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY
              }}
            />
            <motion.div
              aria-hidden='true'
              className='pointer-events-none absolute -right-[12%] bottom-[6%] h-[36svh] w-[36svh] rounded-full bg-[radial-gradient(circle,rgb(223_230_227/0.22)_0%,transparent_72%)] blur-3xl'
              animate={{
                x: [0, -32, 16, 0],
                y: [0, -20, 12, 0],
                opacity: [0.26, 0.44, 0.3, 0.26]
              }}
              transition={{
                duration: 14,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY
              }}
            />
            <motion.div
              className='absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.55px,transparent_0.55px)] [background-size:4px_4px]'
              animate={{ opacity: [0.07, 0.11, 0.07] }}
              transition={{
                duration: 5,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY
              }}
            />

            <div className='absolute right-4 top-[max(env(safe-area-inset-top),1rem)] z-30 flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.42)] bg-[rgb(12_12_14/0.62)] px-2 py-1 sm:right-6 sm:top-[max(env(safe-area-inset-top),1.5rem)]'>
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

            <section className='relative h-[100dvh] min-h-[100svh] overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[max(env(safe-area-inset-top),3.75rem)] sm:px-8 sm:pb-[calc(env(safe-area-inset-bottom)+2.4rem)] sm:pt-20'>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.05,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1
                }}
                className='mx-auto flex min-h-full w-full max-w-[30rem] flex-col justify-between gap-6 text-center'
              >
                <header className='pt-4 sm:pt-5'>
                  <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(223_230_227/0.92)]'>
                    {copy.hero.title}
                  </p>
                  <h1 className='mt-3 text-3xl font-semibold text-[var(--color-neutral-strong)] sm:text-6xl'>
                    {INVITATION_EVENT.groomName} &amp;{' '}
                    {INVITATION_EVENT.brideName}
                  </h1>
                </header>

                <div className='mx-auto w-[min(62vw,16rem)] sm:w-[min(52vw,21rem)]'>
                  <div className='relative aspect-[0.74] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-[rgb(223_230_227/0.5)] bg-[rgb(9_9_10)] shadow-[0_20px_55px_rgb(0_0_0/0.38)]'>
                    <Image
                      src='/images/splash-screen.jpeg'
                      alt='Dody and Ritza'
                      fill
                      priority
                      sizes='(min-width: 640px) 22rem, 74vw'
                      className='object-cover object-center scale-[1.03]'
                    />
                    <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgb(223_230_227/0.14),transparent_44%),linear-gradient(180deg,rgb(0_0_0/0.05)_0%,rgb(0_0_0/0.28)_82%)]' />
                  </div>
                </div>

                <footer className='pb-1 sm:pb-2'>
                  <div>
                    <p className='text-sm tracking-[0.18em] text-[rgb(223_230_227/0.85)]'>
                      {copy.splash.to}
                    </p>
                    <p className='mt-2 text-[1.58rem] font-semibold text-[var(--color-neutral-strong)] sm:text-[2.15rem]'>
                      {finalRecipient}
                    </p>
                  </div>

                  <div className='mt-5 flex flex-col items-center gap-2'>
                    {!canOpenInvitation ? (
                      <p className='max-w-xs text-center text-[0.66rem] leading-relaxed text-[rgb(252_165_165/0.9)]'>
                        {copy.splash.invalidLinkHint}
                      </p>
                    ) : null}

                    <motion.button
                      type='button'
                      onClick={handleOpenInvitation}
                      whileTap={canOpenInvitation ? { scale: 0.98 } : undefined}
                      disabled={!canOpenInvitation}
                      className='inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.88)] bg-[rgb(12_12_14/0.62)] px-5 py-3 text-base font-semibold text-[var(--color-neutral-strong)] shadow-[0_14px_40px_rgb(0_0_0/0.36)] transition hover:bg-[rgb(28_28_30/0.8)] disabled:cursor-not-allowed disabled:border-[rgb(182_186_192/0.35)] disabled:bg-[rgb(12_12_14/0.36)] disabled:text-[rgb(182_186_192/0.78)] disabled:shadow-none disabled:hover:bg-[rgb(12_12_14/0.36)]'
                    >
                      <EnvelopeSimple
                        size={17}
                        weight='fill'
                        aria-hidden='true'
                      />
                      {copy.splash.openButton}
                    </motion.button>
                  </div>
                </footer>
              </motion.div>
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <BackgroundMusicPlayer ref={musicPlayerRef} language={language} />
    </main>
  )
}
