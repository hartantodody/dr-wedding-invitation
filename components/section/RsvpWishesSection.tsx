'use client'

import { CheckCircle, HeartStraight, PaperPlaneTilt } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEventHandler } from 'react'
import { COPY, type AppLanguage } from '@/constant/i18n'

type RsvpWishesSectionProps = {
  language: AppLanguage
}

type AttendanceStatus = 'attending' | 'not-attending'

type WishEntry = {
  id: string
  name: string
  attendance: AttendanceStatus
  message: string
  createdAt: string
}

type FormState = {
  name: string
  attendance: AttendanceStatus
  message: string
}

const LOCAL_STORAGE_KEY = 'dr-wedding-rsvp-wishes-v1'

const revealTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const
}

const initialFormState: FormState = {
  name: '',
  attendance: 'attending',
  message: ''
}

function normalizeWishEntry(raw: unknown): WishEntry | null {
  if (!raw || typeof raw !== 'object') return null

  const candidate = raw as Record<string, unknown>
  const id = typeof candidate.id === 'string' ? candidate.id : ''
  const name = typeof candidate.name === 'string' ? candidate.name : ''
  const attendance =
    candidate.attendance === 'not-attending' ? 'not-attending' : 'attending'
  const message = typeof candidate.message === 'string' ? candidate.message : ''
  const createdAt =
    typeof candidate.createdAt === 'string' ? candidate.createdAt : ''

  if (!id || !name || !message || !createdAt) return null

  return { id, name, attendance, message, createdAt }
}

export default function RsvpWishesSection({ language }: RsvpWishesSectionProps) {
  const copy = COPY[language]
  const successTimerRef = useRef<number | null>(null)

  const [form, setForm] = useState<FormState>(initialFormState)
  const [entries, setEntries] = useState<WishEntry[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      try {
        const rawEntries = window.localStorage.getItem(LOCAL_STORAGE_KEY)
        if (!rawEntries) return

        const parsed = JSON.parse(rawEntries) as unknown
        if (!Array.isArray(parsed)) return

        const validEntries = parsed
          .map(normalizeWishEntry)
          .filter((entry): entry is WishEntry => entry !== null)

        setEntries(validEntries)
      } catch {
        // no-op
      }
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }, [language])

  const handleChangeFormValue = (
    field: keyof FormState,
    value: FormState[keyof FormState]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }))
  }

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const name = form.name.trim().slice(0, 60)
    const message = form.message.trim().slice(0, 320)

    if (!name || !message) return

    const nextEntry: WishEntry = {
      id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
      name,
      attendance: form.attendance,
      message,
      createdAt: new Date().toISOString()
    }

    const nextEntries = [nextEntry, ...entries]
    setEntries(nextEntries)

    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextEntries))
    } catch {
      // no-op
    }

    setForm((previous) => ({
      ...previous,
      message: ''
    }))

    setIsSubmitted(true)

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current)
    }

    successTimerRef.current = window.setTimeout(() => {
      setIsSubmitted(false)
    }, 2300)
  }

  return (
    <section
      id='rsvp'
      className='relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 md:min-h-[100svh] md:py-24'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_84%_12%,rgb(200_180_139/0.14),transparent_36%),radial-gradient(circle_at_16%_88%,rgb(223_230_227/0.08),transparent_38%),linear-gradient(180deg,#0d0d10_0%,#070709_100%)]' />
      <div className='pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.5px,transparent_0.5px)] [background-size:4px_4px]' />

      <div className='relative mx-auto w-full max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={revealTransition}
          className='mx-auto max-w-3xl text-center'
        >
          <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(182_186_192/0.92)]'>
            {copy.rsvp.sectionLabel}
          </p>
          <h2 className='mt-3 text-4xl font-semibold text-[var(--color-neutral-strong)] sm:text-5xl'>
            {copy.rsvp.title}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[rgb(223_230_227/0.84)] sm:text-base'>
            {copy.rsvp.subtitle}
          </p>
        </motion.div>

        <div className='mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[1.02fr_0.98fr]'>
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...revealTransition, delay: 0.08 }}
            className='rounded-[1.35rem] border border-[rgb(223_230_227/0.2)] bg-[linear-gradient(165deg,rgb(16_16_20/0.84),rgb(9_9_11/0.9))] p-5 shadow-[0_20px_55px_rgb(0_0_0/0.35)] sm:p-6'
          >
            <form className='space-y-5' onSubmit={handleSubmitForm}>
              <div>
                <label
                  htmlFor='rsvp-name'
                  className='text-xs uppercase tracking-[0.18em] text-[rgb(182_186_192/0.92)]'
                >
                  {copy.rsvp.nameLabel}
                </label>
                <input
                  id='rsvp-name'
                  value={form.name}
                  onChange={(event) =>
                    handleChangeFormValue('name', event.target.value)
                  }
                  required
                  maxLength={60}
                  className='mt-2 w-full rounded-xl border border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] px-4 py-3 text-sm text-[var(--color-neutral-strong)] outline-none transition placeholder:text-[rgb(182_186_192/0.72)] focus:border-[var(--color-accent-soft)] focus:ring-2 focus:ring-[rgb(211_188_145/0.25)]'
                  placeholder={copy.rsvp.nameLabel}
                />
              </div>

              <div>
                <p className='text-xs uppercase tracking-[0.18em] text-[rgb(182_186_192/0.92)]'>
                  {copy.rsvp.attendanceLabel}
                </p>
                <div className='mt-2 flex flex-col gap-2 sm:flex-row'>
                  <label className='inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] px-4 py-2 text-sm text-[rgb(223_230_227/0.9)]'>
                    <input
                      type='radio'
                      name='attendance'
                      value='attending'
                      checked={form.attendance === 'attending'}
                      onChange={() =>
                        handleChangeFormValue('attendance', 'attending')
                      }
                      className='accent-[var(--color-accent-soft)]'
                    />
                    {copy.rsvp.attendancePresent}
                  </label>
                  <label className='inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] px-4 py-2 text-sm text-[rgb(223_230_227/0.9)]'>
                    <input
                      type='radio'
                      name='attendance'
                      value='not-attending'
                      checked={form.attendance === 'not-attending'}
                      onChange={() =>
                        handleChangeFormValue('attendance', 'not-attending')
                      }
                      className='accent-[var(--color-accent-soft)]'
                    />
                    {copy.rsvp.attendanceAbsent}
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor='rsvp-message'
                  className='text-xs uppercase tracking-[0.18em] text-[rgb(182_186_192/0.92)]'
                >
                  {copy.rsvp.wishesLabel}
                </label>
                <textarea
                  id='rsvp-message'
                  value={form.message}
                  onChange={(event) =>
                    handleChangeFormValue('message', event.target.value)
                  }
                  required
                  maxLength={320}
                  rows={5}
                  className='mt-2 w-full resize-none rounded-xl border border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] px-4 py-3 text-sm text-[var(--color-neutral-strong)] outline-none transition placeholder:text-[rgb(182_186_192/0.72)] focus:border-[var(--color-accent-soft)] focus:ring-2 focus:ring-[rgb(211_188_145/0.25)]'
                  placeholder={copy.rsvp.wishesPlaceholder}
                />
              </div>

              <div className='flex items-center gap-3'>
                <button
                  type='submit'
                  className='inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.22)] bg-[rgb(211_188_145/0.22)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--color-neutral-strong)] transition hover:bg-[rgb(211_188_145/0.32)]'
                >
                  <PaperPlaneTilt size={16} weight='bold' />
                  {copy.rsvp.submitButton}
                </button>

                {isSubmitted ? (
                  <p className='inline-flex items-center gap-1.5 text-xs text-[rgb(211_188_145/0.95)]'>
                    <CheckCircle size={14} weight='fill' />
                    {copy.rsvp.submitSuccess}
                  </p>
                ) : null}
              </div>
            </form>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...revealTransition, delay: 0.14 }}
            className='rounded-[1.35rem] border border-[rgb(223_230_227/0.2)] bg-[linear-gradient(165deg,rgb(15_15_18/0.86),rgb(8_8_10/0.92))] p-5 shadow-[0_20px_55px_rgb(0_0_0/0.35)] sm:p-6'
          >
            <div className='flex items-center justify-between gap-3'>
              <h3 className='text-lg font-semibold text-[var(--color-neutral-strong)] sm:text-xl'>
                {copy.rsvp.messagesTitle}
              </h3>
              <span className='rounded-full border border-[rgb(223_230_227/0.24)] px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[rgb(182_186_192/0.9)]'>
                {entries.length}
              </span>
            </div>

            <div className='mt-4 max-h-[27rem] space-y-3 overflow-y-auto pr-1'>
              {entries.length === 0 ? (
                <p className='rounded-xl border border-dashed border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.06)] px-4 py-4 text-sm leading-relaxed text-[rgb(223_230_227/0.82)]'>
                  {copy.rsvp.messagesEmpty}
                </p>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className='rounded-xl border border-[rgb(223_230_227/0.16)] bg-[rgb(223_230_227/0.06)] px-4 py-3'
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <p className='text-sm font-semibold text-[var(--color-neutral-strong)]'>
                        {entry.name}
                      </p>
                      <p className='text-[0.62rem] uppercase tracking-[0.14em] text-[rgb(182_186_192/0.86)]'>
                        {dateFormatter.format(new Date(entry.createdAt))}
                      </p>
                    </div>

                    <p className='mt-2 text-sm leading-relaxed text-[rgb(223_230_227/0.88)]'>
                      {entry.message}
                    </p>

                    <p className='mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-accent-soft)]'>
                      <HeartStraight size={12} weight='fill' />
                      {entry.attendance === 'attending'
                        ? copy.rsvp.attendancePresent
                        : copy.rsvp.attendanceAbsent}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
