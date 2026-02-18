'use client'

import { motion } from 'framer-motion'
import Signature from '../animation/signature/Signature'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { INVITATION_EVENT } from '@/constant/invitation'
import CountdownTimer from './CountdownTimer'

type HeroProps = {
  language: AppLanguage
}

const sectionTransition = {
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function Hero({ language }: HeroProps) {
  const copy = COPY[language]

  return (
    <section id='hero' className='relative isolate h-[100svh] overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-[position:72%_74%] md:bg-[position:78%_58%]'
        style={{
          backgroundImage: "url('/hero.jpeg')",
          backgroundColor: '#080809'
        }}
      />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgb(200_180_139/0.2),transparent_34%),linear-gradient(180deg,rgb(0_0_0/0.62)_0%,rgb(0_0_0/0.28)_36%,rgb(0_0_0/0.12)_66%,rgb(0_0_0/0.08)_100%)]' />
      <div className='absolute inset-0 opacity-[0.09] [background-image:radial-gradient(rgb(223_230_227/0.17)_0.45px,transparent_0.45px)] [background-size:3px_3px]' />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={sectionTransition}
        className='relative h-full px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 md:px-8 md:pb-12 md:pt-20'
      >
        <div className='mx-auto h-full w-full max-w-6xl'>
          <div className='mr-auto flex h-full max-w-[15.5rem] flex-col justify-between sm:max-w-[20.5rem] md:max-w-[31rem]'>
            <div>
              <p className='text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-[rgb(182_186_192/0.94)] sm:text-[0.8rem] md:text-[0.96rem] md:tracking-[0.3em]'>
                {copy.hero.title}
              </p>

              <div className='mr-auto mt-4 max-w-[13.8rem] text-[var(--color-neutral-strong)] sm:mt-5 sm:max-w-[18rem] md:mt-7 md:max-w-[28.8rem]'>
                <Signature
                  className='mx-auto w-full'
                  strokeDuration={3.8}
                  fillStartAt={0.64}
                  fillFadeDuration={1.1}
                  strokeWidth={0.28}
                />
              </div>
            </div>

            <div className='pb-1 sm:pb-2 md:pb-3'>
              <p className='text-[0.6rem] uppercase tracking-[0.2em] text-[rgb(182_186_192/0.9)] sm:text-[0.66rem] md:text-[0.72rem] md:tracking-[0.24em]'>
                {copy.hero.countdownTitle}
              </p>
              <div className='mr-auto mt-2 max-w-[17.2rem] sm:max-w-[20rem] md:max-w-[23rem]'>
                <CountdownTimer
                  targetIsoDate={INVITATION_EVENT.eventDateIso}
                  labels={copy.countdown}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

