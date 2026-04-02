'use client'

import { DeviceMobile, HandPointing } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { type AppLanguage } from '@/constant/i18n'

type MobileIdleScrollHintProps = {
  language: AppLanguage
}

const MOBILE_QUERY = '(max-width: 767px)'
const IDLE_DELAY_MS = 2000
const BOTTOM_THRESHOLD_PX = 72

export default function MobileIdleScrollHint({
  language
}: MobileIdleScrollHintProps) {
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const handleChange = () => {
      setIsMobileViewport(mediaQuery.matches)
      if (!mediaQuery.matches) setIsVisible(false)
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!isMobileViewport) return

    let idleTimer: ReturnType<typeof setTimeout> | undefined

    const isScrollableBelow = () =>
      window.scrollY + window.innerHeight <
      document.documentElement.scrollHeight - BOTTOM_THRESHOLD_PX

    const scheduleShow = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        setIsVisible(isScrollableBelow())
      }, IDLE_DELAY_MS)
    }

    const handleActivity = () => {
      setIsVisible(false)
      scheduleShow()
    }

    scheduleShow()

    const passiveListener: AddEventListenerOptions = { passive: true }
    window.addEventListener('scroll', handleActivity, passiveListener)
    window.addEventListener('touchstart', handleActivity, passiveListener)
    window.addEventListener('touchmove', handleActivity, passiveListener)
    window.addEventListener('pointerdown', handleActivity, passiveListener)
    window.addEventListener('resize', handleActivity)
    window.addEventListener('orientationchange', handleActivity)
    window.addEventListener('keydown', handleActivity)

    return () => {
      if (idleTimer) clearTimeout(idleTimer)

      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      window.removeEventListener('touchmove', handleActivity)
      window.removeEventListener('pointerdown', handleActivity)
      window.removeEventListener('resize', handleActivity)
      window.removeEventListener('orientationchange', handleActivity)
      window.removeEventListener('keydown', handleActivity)
    }
  }, [isMobileViewport])

  const hintText =
    language === 'id'
      ? 'Scroll ke bawah untuk lanjut'
      : 'Scroll down to continue'

  return (
    <motion.div
      aria-hidden='true'
      className='pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 z-40 w-full max-w-xs -translate-x-1/2 px-4 md:hidden'
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 16
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className='mx-auto flex w-fit items-center gap-2 rounded-full border border-[rgb(223_230_227/0.3)] bg-[rgb(8_8_10/0.7)] px-3 py-2 shadow-[0_16px_36px_rgb(0_0_0/0.4)] backdrop-blur-md'>
        <div className='relative h-10 w-10'>
          <div className='absolute inset-0 grid place-items-center text-[var(--color-accent-soft)]'>
            <DeviceMobile size={24} weight='regular' />
            <span className='absolute bottom-[4px] left-1/2 h-[2px] w-[10px] -translate-x-1/2 rounded-full bg-[var(--color-accent-soft)] opacity-85' />
          </div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className='absolute top-3 left-6 z-10 -translate-x-1/2'
          >
            <div className='-rotate-45 text-[var(--color-neutral-strong)]'>
              <HandPointing size={18} weight='fill' />
            </div>
          </motion.div>
        </div>

        <p className='text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[rgb(223_230_227/0.92)]'>
          {hintText}
        </p>
      </div>
    </motion.div>
  )
}
