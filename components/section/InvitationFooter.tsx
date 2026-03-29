'use client'

import { motion } from 'framer-motion'
import { COPY, type AppLanguage } from '@/constant/i18n'
import Signature from '../animation/signature/Signature'

type InvitationFooterProps = {
  language: AppLanguage
}

const revealTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function InvitationFooter({ language }: InvitationFooterProps) {
  const copy = COPY[language]
  const hasSubtitle = copy.footer.subtitle.trim().length > 0

  return (
    <footer className='relative overflow-hidden px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-10 sm:px-8 sm:pt-12'>
      <div className='absolute inset-0 bg-[linear-gradient(180deg,#070708_0%,#050506_100%)]' />
      <div className='pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.5px,transparent_0.5px)] [background-size:4px_4px]' />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={revealTransition}
        className='relative mx-auto w-full max-w-5xl border-t border-[rgb(223_230_227/0.18)] py-6 text-center sm:py-8'
      >
        <p className='mx-auto max-w-2xl text-xs leading-relaxed text-[rgb(182_186_192/0.84)] sm:text-sm'>
          {copy.footer.title}
        </p>
        {hasSubtitle ? (
          <p className='mt-2 text-sm text-[rgb(223_230_227/0.82)]'>
            {copy.footer.subtitle}
          </p>
        ) : null}
        <div className='mx-auto mt-4 w-[9.5rem] text-[var(--color-neutral-strong)] sm:w-[12rem]'>
          <Signature
            className='w-full'
            strokeDuration={2.6}
            fillStartAt={0.58}
            fillFadeDuration={0.9}
            strokeWidth={0.34}
          />
        </div>
      </motion.div>
    </footer>
  )
}
