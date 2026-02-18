'use client'

import { motion } from 'framer-motion'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { INVITATION_EVENT } from '@/constant/invitation'

type IntroductionSectionProps = {
  language: AppLanguage
}

const revealTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function IntroductionSection({ language }: IntroductionSectionProps) {
  const copy = COPY[language]

  return (
    <section
      id='introduction'
      className='relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 md:flex md:min-h-[100svh] md:items-center'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_16%_15%,rgb(200_180_139/0.14),transparent_34%),radial-gradient(circle_at_85%_85%,rgb(223_230_227/0.11),transparent_36%),linear-gradient(180deg,#0f1011_0%,#09090a_100%)]' />
      <div className='absolute inset-0 opacity-70 [background-image:linear-gradient(120deg,rgb(223_230_227/0.05)_0%,transparent_28%),linear-gradient(300deg,rgb(223_230_227/0.04)_0%,transparent_36%)]' />

      <div className='relative mx-auto w-full max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={revealTransition}
        >
          <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(182_186_192/0.94)]'>
            {copy.introduction.sectionLabel}
          </p>
          <h2 className='mt-3 text-4xl font-semibold text-[var(--color-neutral-strong)] sm:text-5xl'>
            {copy.introduction.title}
          </h2>
        </motion.div>

        <div className='mt-9 grid gap-5 md:grid-cols-2 md:gap-6'>
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.26 }}
            transition={{ ...revealTransition, delay: 0.1 }}
            className='relative min-h-[60svh] overflow-hidden rounded-[1.4rem] shadow-[0_20px_55px_rgb(0_0_0/0.35)] md:min-h-[68svh]'
          >
            <div
              aria-hidden='true'
              className='absolute inset-0 bg-cover bg-center'
              style={{ backgroundImage: "url('/intro-dody.jpg')" }}
            />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(200_180_139/0.22),transparent_40%),linear-gradient(180deg,rgb(5_5_7/0.16)_0%,rgb(5_5_7/0.82)_100%)]' />
            <div className='relative flex h-full flex-col justify-end p-5 sm:p-6'>
              <p className='text-xs uppercase tracking-[0.2em] text-[rgb(223_230_227/0.86)]'>
                Groom
              </p>
              <h3
                className='mt-2 text-3xl text-[var(--color-neutral-strong)] sm:text-4xl'
                style={{ fontFamily: 'var(--font-wedding-heading), var(--font-heading), serif' }}
              >
                {INVITATION_EVENT.groomFullName}
              </h3>
              <p className='mt-4 text-xs uppercase tracking-[0.16em] text-[var(--color-accent-soft)]'>
                {copy.introduction.groomPrefix}
              </p>
              <p className='mt-2 text-sm leading-relaxed text-[rgb(223_230_227/0.9)]'>
                {INVITATION_EVENT.groomParents[0]}
                <br />
                &amp; {INVITATION_EVENT.groomParents[1]}
              </p>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.26 }}
            transition={{ ...revealTransition, delay: 0.2 }}
            className='relative min-h-[60svh] overflow-hidden rounded-[1.4rem] shadow-[0_20px_55px_rgb(0_0_0/0.35)] md:min-h-[68svh]'
          >
            <div
              aria-hidden='true'
              className='absolute inset-0 bg-cover bg-center'
              style={{ backgroundImage: "url('/intro-ritza.jpg')" }}
            />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(200_180_139/0.22),transparent_40%),linear-gradient(180deg,rgb(5_5_7/0.16)_0%,rgb(5_5_7/0.82)_100%)]' />
            <div className='relative flex h-full flex-col justify-end p-5 text-right sm:p-6'>
              <p className='text-xs uppercase tracking-[0.2em] text-[rgb(223_230_227/0.86)]'>
                Bride
              </p>
              <h3 className='mt-2 text-3xl font-semibold text-[var(--color-neutral-strong)] sm:text-4xl'>
                {INVITATION_EVENT.brideFullName}
              </h3>
              <p className='mt-4 text-xs uppercase tracking-[0.16em] text-[var(--color-accent-soft)]'>
                {copy.introduction.bridePrefix}
              </p>
              <p className='mt-2 text-sm leading-relaxed text-[rgb(223_230_227/0.9)]'>
                {INVITATION_EVENT.brideParents[0]}
                <br />
                &amp; {INVITATION_EVENT.brideParents[1]}
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}

