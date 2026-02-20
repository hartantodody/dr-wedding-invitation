'use client'

import { CalendarDots, MapPinLine } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { INVITATION_EVENT, type ReceptionShiftId } from '@/constant/invitation'
import CountdownTimer from './CountdownTimer'

type SaveTheDateSectionProps = {
  language: AppLanguage
  receptionShiftIds?: ReceptionShiftId[]
}

const revealTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function SaveTheDateSection({
  language,
  receptionShiftIds
}: SaveTheDateSectionProps) {
  const copy = COPY[language]
  const activeShiftIds =
    receptionShiftIds && receptionShiftIds.length > 0
      ? receptionShiftIds
      : INVITATION_EVENT.receptionShifts.map((shift) => shift.id)
  const visibleReceptionShifts = INVITATION_EVENT.receptionShifts.filter((shift) =>
    activeShiftIds.includes(shift.id)
  )
  const showBreakBetweenShiftOneAndTwo =
    activeShiftIds.includes(1) && activeShiftIds.includes(2)

  return (
    <section
      id='save-the-date'
      className='relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 md:min-h-[100svh] md:py-24'
    >
      <motion.div
        className='absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgb(200_180_139/0.16),transparent_34%),radial-gradient(circle_at_18%_88%,rgb(223_230_227/0.1),transparent_36%),linear-gradient(180deg,#131416_0%,#0a0a0c_100%)]'
        animate={{
          scale: [1, 1.02, 1],
          opacity: [1, 0.92, 1]
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute -left-[14%] top-[12%] h-[36svh] w-[36svh] rounded-full bg-[radial-gradient(circle,rgb(211_188_145/0.28)_0%,transparent_68%)] blur-3xl'
        animate={{
          x: [0, 26, -8, 0],
          y: [0, -16, 10, 0],
          opacity: [0.26, 0.42, 0.3, 0.26]
        }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute -right-[12%] bottom-[10%] h-[34svh] w-[34svh] rounded-full bg-[radial-gradient(circle,rgb(223_230_227/0.18)_0%,transparent_70%)] blur-3xl'
        animate={{
          x: [0, -24, 12, 0],
          y: [0, -12, 8, 0],
          opacity: [0.18, 0.32, 0.22, 0.18]
        }}
        transition={{
          duration: 26,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut'
        }}
      />
      <div className='absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.5px,transparent_0.5px)] [background-size:4px_4px]' />

      <div className='relative mx-auto w-full max-w-5xl'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={revealTransition}
          className='mx-auto max-w-3xl text-center'
        >
          <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(182_186_192/0.94)]'>
            {copy.saveTheDate.sectionLabel}
          </p>
          <h2 className='mt-3 text-4xl font-semibold text-[var(--color-neutral-strong)] sm:text-5xl'>
            {copy.saveTheDate.title}
          </h2>
          <p className='mt-4 text-sm text-[rgb(223_230_227/0.84)] sm:text-base'>
            {copy.saveTheDate.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...revealTransition, delay: 0.08 }}
          className='mx-auto mt-10 max-w-4xl text-center'
        >
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-soft)]'>
            {INVITATION_EVENT.eventDayLabel}
          </p>
          <p className='mt-3 text-5xl font-semibold text-[var(--color-neutral-strong)] sm:text-6xl'>
            {INVITATION_EVENT.eventDateLabel}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...revealTransition, delay: 0.12 }}
          className='mx-auto mt-6 max-w-3xl text-center text-[rgb(223_230_227/0.88)]'
        >
          <p className='text-sm uppercase tracking-[0.16em] text-[rgb(182_186_192/0.9)]'>
            {copy.saveTheDate.venueLabel}
          </p>
          <p className='mt-2 text-lg font-medium text-[var(--color-neutral-strong)]'>
            {INVITATION_EVENT.venueName}
          </p>

          <p className='mt-4 text-sm uppercase tracking-[0.16em] text-[rgb(182_186_192/0.9)]'>
            {copy.saveTheDate.addressLabel}
          </p>
          <p className='mt-2 leading-relaxed'>{INVITATION_EVENT.venueAddress}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...revealTransition, delay: 0.16 }}
          className='mx-auto mt-10 max-w-4xl'
        >
          <div className='grid gap-8 sm:grid-cols-2 sm:gap-12'>
            <article className='text-left'>
              <p className='text-3xl font-semibold uppercase tracking-[0.06em] text-[var(--color-accent-soft)] sm:text-4xl'>
                {copy.saveTheDate.ceremonyLabel}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.85 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className='mt-2 h-[2px] w-full origin-left bg-[rgb(211_188_145/0.68)]'
              />
              <p className='mt-4 text-xl font-semibold text-[var(--color-neutral-strong)] sm:text-2xl'>
                {INVITATION_EVENT.ceremonyTimeLabel}
              </p>
              <p className='mt-1 text-sm tracking-[0.01em] text-[rgb(223_230_227/0.84)]'>
                {copy.saveTheDate.familyOnlyLabel}
              </p>
            </article>

            <article className='text-left md:text-right'>
              <p className='text-3xl font-semibold uppercase tracking-[0.06em] text-[var(--color-accent-soft)] sm:text-4xl'>
                {copy.saveTheDate.receptionLabel}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.85 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className='mt-2 h-[2px] w-full origin-left bg-[rgb(211_188_145/0.68)] sm:hidden'
              />
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.85 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className='mt-2 hidden h-[2px] w-full origin-right bg-[rgb(211_188_145/0.68)] sm:block'
              />
              <div className='mt-4 space-y-2'>
                {visibleReceptionShifts.map((shift) => (
                  <div key={shift.id}>
                    <div className='text-xl font-semibold text-[var(--color-neutral-strong)] sm:text-2xl'>
                      {shift.timeLabel}
                    </div>
                    {shift.id === 1 && showBreakBetweenShiftOneAndTwo ? (
                      <p className='mt-1 text-sm tracking-[0.01em] text-[rgb(223_230_227/0.84)] md:text-right'>
                        {INVITATION_EVENT.receptionBreakTimeLabel} {copy.saveTheDate.breakLabel}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...revealTransition, delay: 0.2 }}
          className='mx-auto mt-10 max-w-[30rem]'
        >
          <p className='text-center text-[0.72rem] uppercase tracking-[0.2em] text-[rgb(182_186_192/0.92)]'>
            {copy.saveTheDate.countdownTitle}
          </p>
          <div className='mt-4'>
            <CountdownTimer
              targetIsoDate={INVITATION_EVENT.eventDateIso}
              labels={copy.countdown}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ ...revealTransition, delay: 0.24 }}
          className='mx-auto mt-8 flex max-w-4xl flex-col justify-center gap-3 sm:flex-row'
        >
          <a
            href={INVITATION_EVENT.saveTheDateUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(223_230_227/0.14)] px-5 py-3 text-sm font-semibold text-[var(--color-neutral-strong)] transition hover:bg-[rgb(223_230_227/0.24)]'
          >
            <CalendarDots size={18} weight='bold' />
            {copy.saveTheDate.saveDateButton}
          </a>

          <a
            href={INVITATION_EVENT.venueMapsUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(211_188_145/0.26)] px-5 py-3 text-sm font-semibold text-[var(--color-neutral-strong)] transition hover:bg-[rgb(211_188_145/0.36)]'
          >
            <MapPinLine size={18} weight='bold' />
            {copy.saveTheDate.mapsButton}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
