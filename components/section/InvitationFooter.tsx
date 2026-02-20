'use client'

import { motion } from 'framer-motion'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { INVITATION_EVENT } from '@/constant/invitation'

type InvitationFooterProps = {
  language: AppLanguage
}

const revealTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function InvitationFooter({ language }: InvitationFooterProps) {
  const copy = COPY[language]

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
        <p className='text-[0.66rem] uppercase tracking-[0.2em] text-[rgb(182_186_192/0.84)]'>
          {copy.footer.title}
        </p>
        <p className='mt-2 text-base text-[var(--color-neutral-strong)] sm:text-lg'>
          {INVITATION_EVENT.groomName} &amp; {INVITATION_EVENT.brideName}
        </p>
        <p className='mt-2 text-sm text-[rgb(223_230_227/0.82)]'>
          {copy.footer.subtitle}
        </p>
      </motion.div>
    </footer>
  )
}
