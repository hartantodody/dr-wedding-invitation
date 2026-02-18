'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { CountdownCopy } from '@/constant/i18n'

type CountdownTimerProps = {
  targetIsoDate: string
  labels: CountdownCopy
}

type CountdownState = {
  days: number
  hours: number
  minutes: number
  seconds: number
  isEnded: boolean
}

function getCountdown(targetDate: Date): CountdownState {
  const distance = targetDate.getTime() - Date.now()

  if (distance <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEnded: true
    }
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((distance / (1000 * 60)) % 60)
  const seconds = Math.floor((distance / 1000) % 60)

  return {
    days,
    hours,
    minutes,
    seconds,
    isEnded: false
  }
}

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

const containerTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function CountdownTimer({
  targetIsoDate,
  labels
}: CountdownTimerProps) {
  const targetDate = useMemo(() => new Date(targetIsoDate), [targetIsoDate])
  const [countdown, setCountdown] = useState<CountdownState | null>(null)

  useEffect(() => {
    const update = () => {
      setCountdown(getCountdown(targetDate))
    }

    update()

    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [targetDate])

  if (!countdown) {
    const items = [labels.days, labels.hours, labels.minutes, labels.seconds]

    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={containerTransition}
        className='mt-6 grid grid-cols-4 gap-2 sm:gap-3'
      >
        {items.map((label, index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...containerTransition, delay: index * 0.04 }}
            className='rounded-xl border border-[rgb(180_184_190/0.36)] bg-[rgb(13_13_15/0.74)] px-2 py-2.5 text-center sm:px-2.5 sm:py-3 md:px-2 md:py-2.5'
          >
            <p className='text-lg font-semibold text-[var(--color-neutral-strong)] sm:text-[1.35rem] md:text-[1.25rem] lg:text-[1.4rem]'>
              --
            </p>
            <p className='mt-1 text-[0.56rem] uppercase tracking-[0.13em] text-[rgb(180_184_190/0.82)] sm:text-[0.62rem] md:text-[0.58rem] md:tracking-[0.12em]'>
              {label}
            </p>
          </motion.article>
        ))}
      </motion.div>
    )
  }

  if (countdown.isEnded) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={containerTransition}
        className='mt-4 text-center text-sm uppercase tracking-[0.18em] text-[rgb(223_230_227/0.88)]'
      >
        {labels.live}
      </motion.p>
    )
  }

  const items = [
    { label: labels.days, value: countdown.days.toString() },
    { label: labels.hours, value: pad(countdown.hours) },
    { label: labels.minutes, value: pad(countdown.minutes) },
    { label: labels.seconds, value: pad(countdown.seconds) }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={containerTransition}
      className='mt-6 grid grid-cols-4 gap-2 sm:gap-3'
    >
      {items.map((item, index) => (
        <motion.article
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...containerTransition, delay: index * 0.04 }}
          className='rounded-xl border border-[rgb(180_184_190/0.36)] bg-[rgb(13_13_15/0.74)] px-2 py-2.5 text-center sm:px-2.5 sm:py-3 md:px-2 md:py-2.5'
        >
          <p className='text-lg font-semibold text-[var(--color-neutral-strong)] sm:text-[1.35rem] md:text-[1.25rem] lg:text-[1.4rem]'>
            {item.value}
          </p>
          <p className='mt-1 text-[0.56rem] uppercase tracking-[0.13em] text-[rgb(180_184_190/0.82)] sm:text-[0.62rem] md:text-[0.58rem] md:tracking-[0.12em]'>
            {item.label}
          </p>
        </motion.article>
      ))}
    </motion.div>
  )
}

