'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { INVITATION_EVENT } from '@/constant/invitation'

type IntroductionSectionProps = {
  language: AppLanguage
}

export default function IntroductionSection({
  language
}: IntroductionSectionProps) {
  const copy = COPY[language]
  const sectionRef = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  })

  const greetingOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.2, 0.28],
    [1, 1, 0, 0]
  )
  const greetingY = useTransform(scrollYProgress, [0, 0.28], [0, -48])

  const ayahOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.42, 0.52],
    [0, 1, 1, 0]
  )
  const ayahY = useTransform(scrollYProgress, [0.2, 0.52], [42, -34])

  const openingOpacity = useTransform(
    scrollYProgress,
    [0.44, 0.56, 0.68, 0.78],
    [0, 1, 1, 0]
  )
  const openingY = useTransform(scrollYProgress, [0.44, 0.78], [44, -30])

  const groomOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.82, 0.9, 0.96],
    [0, 1, 1, 0]
  )
  const groomY = useTransform(scrollYProgress, [0.72, 0.96], [44, -24])

  const brideOpacity = useTransform(scrollYProgress, [0.9, 0.97, 1], [0, 1, 1])
  const brideY = useTransform(scrollYProgress, [0.9, 1], [40, 0])

  const skipOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.52, 0.6],
    [0, 1, 1, 0]
  )

  const handleSkipToOpening = () => {
    const section = sectionRef.current
    if (!section) return

    const targetTop = section.offsetTop + section.offsetHeight * 0.52
    window.scrollTo({ top: targetTop, behavior: 'smooth' })
  }

  return (
    <section
      id='introduction'
      ref={sectionRef}
      className='relative h-[620vh] md:h-[620svh]'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_16%_15%,rgb(200_180_139/0.14),transparent_34%),radial-gradient(circle_at_85%_85%,rgb(223_230_227/0.11),transparent_36%),linear-gradient(180deg,#0f1011_0%,#09090a_100%)]' />
      <div className='absolute inset-0 opacity-70 [background-image:linear-gradient(120deg,rgb(223_230_227/0.05)_0%,transparent_28%),linear-gradient(300deg,rgb(223_230_227/0.04)_0%,transparent_36%)]' />

      <div className='sticky top-0 h-screen overflow-hidden px-5 py-10 sm:px-8 sm:py-12 md:h-[100svh]'>
        <motion.button
          type='button'
          onClick={handleSkipToOpening}
          style={{ opacity: skipOpacity }}
          className='absolute bottom-10 right-1/2 translate-x-1/2 z-30 rounded-full border border-[rgb(223_230_227/0.28)] bg-[rgb(12_12_14/0.6)] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[rgb(223_230_227/0.88)] transition hover:bg-[rgb(24_24_28/0.82)] sm:bottom-8'
        >
          {copy.introduction.skipLabel}
        </motion.button>

        <motion.div
          style={{ opacity: greetingOpacity, y: greetingY }}
          className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 text-center sm:px-8'
        >
          <div className='mx-auto max-w-5xl'>
            <p className='text-[1.7rem] leading-relaxed text-[var(--color-accent-soft)] sm:text-[2.1rem]'>
              {copy.introduction.greetingArab}
            </p>
            <p className='mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-[rgb(223_230_227/0.85)] sm:text-base'>
              {copy.introduction.greetingTranslation}
            </p>
            <p className='mt-6 text-[1.55rem] leading-relaxed text-[var(--color-neutral-strong)] sm:text-[2rem]'>
              {copy.introduction.bismillahArab}
            </p>
            <p className='mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-[rgb(223_230_227/0.85)] sm:text-base'>
              {copy.introduction.bismillahTranslation}
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: ayahOpacity, y: ayahY }}
          className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 text-center sm:px-8'
        >
          <div className='mx-auto max-w-5xl'>
            <p className='mx-auto max-w-4xl text-[1.6rem] leading-relaxed text-[var(--color-accent-soft)] sm:text-[2rem]'>
              {copy.introduction.ayahArab}
            </p>
            <p className='mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-[rgb(223_230_227/0.9)] sm:text-base'>
              {copy.introduction.ayahTranslation}
            </p>
            <p className='mt-3 text-xs uppercase tracking-[0.2em] text-[rgb(182_186_192/0.88)]'>
              {copy.introduction.ayahSource}
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: openingOpacity, y: openingY }}
          className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 text-center sm:px-8'
        >
          <div className='mx-auto w-full max-w-4xl'>
            <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(182_186_192/0.94)]'>
              {copy.introduction.sectionLabel}
            </p>
            <p className='mt-3 text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-[rgb(223_230_227/0.9)] sm:text-base'>
              {copy.introduction.openingInviteLine1}
            </p>
            <p className='mt-2 text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-[rgb(223_230_227/0.9)] sm:text-base'>
              {copy.introduction.openingInviteLine2}
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: groomOpacity, y: groomY }}
          className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8'
        >
          <article className='relative h-[56svh] w-full max-w-xl min-h-[20rem] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_rgb(0_0_0/0.35)] md:h-[64svh] md:min-h-[24rem]'>
            <div
              aria-hidden='true'
              className='absolute inset-0 bg-cover bg-center'
              style={{ backgroundImage: "url('/intro-dody.jpg')" }}
            />
            <div className='absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_7/0.06)_0%,rgb(5_5_7/0.2)_44%,rgb(5_5_7/0.58)_78%,rgb(5_5_7/0.92)_100%)]' />
            <div className='absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,transparent_0%,rgb(5_5_7/0.74)_52%,rgb(5_5_7/0.96)_100%)]' />
            <div className='relative flex h-full flex-col justify-end p-5 sm:p-6'>
              <p className='absolute right-5 top-5 text-[0.66rem] uppercase tracking-[0.2em] text-[rgb(223_230_227/0.88)] sm:right-6 sm:top-6'>
                {copy.introduction.groomLabel}
              </p>
              <h3
                className='mt-1 text-3xl font-semibold text-[var(--color-neutral-strong)] sm:text-4xl'
              >
                {INVITATION_EVENT.groomFullName}
              </h3>
              <p className='mt-4 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--color-accent-soft)]'>
                {copy.introduction.groomPrefix}
              </p>
              <p className='mt-2 text-sm leading-relaxed text-[rgb(223_230_227/0.9)]'>
                {INVITATION_EVENT.groomParents[0]}
                <br />
                &amp; {INVITATION_EVENT.groomParents[1]}
              </p>
            </div>
          </article>
        </motion.div>

        <motion.div
          style={{ opacity: brideOpacity, y: brideY }}
          className='pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8'
        >
          <article className='relative h-[56svh] w-full max-w-xl min-h-[20rem] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_rgb(0_0_0/0.35)] md:h-[64svh] md:min-h-[24rem]'>
            <div
              aria-hidden='true'
              className='absolute inset-0 bg-cover bg-center'
              style={{ backgroundImage: "url('/intro-ritza.jpg')" }}
            />
            <div className='absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_7/0.06)_0%,rgb(5_5_7/0.2)_44%,rgb(5_5_7/0.58)_78%,rgb(5_5_7/0.92)_100%)]' />
            <div className='absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,transparent_0%,rgb(5_5_7/0.74)_52%,rgb(5_5_7/0.96)_100%)]' />
            <div className='relative flex h-full flex-col justify-end p-5 text-right sm:p-6'>
              <p className='absolute left-5 top-5 text-[0.66rem] uppercase tracking-[0.2em] text-[rgb(223_230_227/0.88)] sm:left-6 sm:top-6'>
                {copy.introduction.brideLabel}
              </p>
              <h3 className='mt-1 text-3xl font-semibold text-[var(--color-neutral-strong)] sm:text-4xl'>
                {INVITATION_EVENT.brideFullName}
              </h3>
              <p className='mt-4 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--color-accent-soft)]'>
                {copy.introduction.bridePrefix}
              </p>
              <p className='mt-2 text-sm leading-relaxed text-[rgb(223_230_227/0.9)]'>
                {INVITATION_EVENT.brideParents[0]}
                <br />
                &amp; {INVITATION_EVENT.brideParents[1]}
              </p>
            </div>
          </article>
        </motion.div>
      </div>
    </section>
  )
}
