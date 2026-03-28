'use client'

import {
  CheckCircle,
  PaperPlaneTilt,
  XCircle
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEventHandler } from 'react'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { containsProfanity } from '@/constant/profanity'

type RsvpWishesSectionProps = {
  language: AppLanguage
  initialGuestName?: string
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

const MAX_NAME_CHARS = 60
const MIN_NAME_CHARS = 2
const MAX_WISH_CHARS = 320
const MIN_WISH_CHARS = 5

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

export default function RsvpWishesSection({
  language,
  initialGuestName
}: RsvpWishesSectionProps) {
  const copy = COPY[language]
  const successTimerRef = useRef<number | null>(null)
  const normalizedInitialGuestName = useMemo(
    () => initialGuestName?.trim().slice(0, MAX_NAME_CHARS) ?? '',
    [initialGuestName]
  )

  const [form, setForm] = useState<FormState>(() => ({
    ...initialFormState,
    name: normalizedInitialGuestName
  }))
  const [entries, setEntries] = useState<WishEntry[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoadingEntries, setIsLoadingEntries] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadEntries = async () => {
      setIsLoadingEntries(true)
      setLoadError(null)

      try {
        const response = await fetch('/api/rsvp-wishes', {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`GET /api/rsvp-wishes failed with ${response.status}`)
        }

        const payload = (await response.json()) as {
          entries?: unknown[]
        }

        const validEntries = Array.isArray(payload.entries)
          ? payload.entries
              .map(normalizeWishEntry)
              .filter((entry): entry is WishEntry => entry !== null)
          : []

        setEntries(validEntries)
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Failed to fetch RSVP entries.', error)
        setLoadError(copy.rsvp.fetchError)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingEntries(false)
        }
      }
    }

    loadEntries()

    return () => {
      controller.abort()
    }
  }, [copy.rsvp.fetchError])

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
    const normalizedValue =
      typeof value === 'string'
        ? field === 'name'
          ? value.slice(0, MAX_NAME_CHARS)
          : field === 'message'
            ? value.slice(0, MAX_WISH_CHARS)
            : value
        : value

    setForm((previous) => ({
      ...previous,
      [field]: normalizedValue
    }))
  }

  const trimmedName = form.name.trim()
  const trimmedMessage = form.message.trim()
  const isNameValid =
    trimmedName.length >= MIN_NAME_CHARS && trimmedName.length <= MAX_NAME_CHARS
  const isMessageValid =
    trimmedMessage.length >= MIN_WISH_CHARS &&
    trimmedMessage.length <= MAX_WISH_CHARS
  const nameHasProfanity = containsProfanity(trimmedName)
  const messageHasProfanity = containsProfanity(trimmedMessage)
  const canSubmit =
    isNameValid &&
    isMessageValid &&
    !nameHasProfanity &&
    !messageHasProfanity &&
    !isSubmitting

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    const name = trimmedName.slice(0, MAX_NAME_CHARS)
    const message = trimmedMessage.slice(0, MAX_WISH_CHARS)

    if (!canSubmit) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/rsvp-wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          attendance: form.attendance,
          message
        })
      })

      const payload = (await response.json().catch(() => null)) as
        | {
            entry?: unknown
            error?: unknown
          }
        | null

      if (!response.ok) {
        const messageFromApi =
          payload && typeof payload.error === 'string' ? payload.error : null
        setSubmitError(messageFromApi ?? copy.rsvp.submitError)
        return
      }

      const entry = normalizeWishEntry(payload?.entry)
      if (!entry) {
        setSubmitError(copy.rsvp.submitError)
        return
      }

      setEntries((previous) => [entry, ...previous])
      setForm((previous) => ({
        ...previous,
        message: ''
      }))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit RSVP.', error)
      setSubmitError(copy.rsvp.submitError)
      return
    } finally {
      setIsSubmitting(false)
    }

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
                <div className='flex items-end justify-between gap-3'>
                  <label
                    htmlFor='rsvp-name'
                    className='text-xs uppercase tracking-[0.18em] text-[rgb(182_186_192/0.92)]'
                  >
                    {copy.rsvp.nameLabel}
                  </label>
                  <span className='text-[0.65rem] tracking-[0.08em] text-[rgb(182_186_192/0.84)]'>
                    {form.name.length}/{MAX_NAME_CHARS}
                  </span>
                </div>
                <input
                  id='rsvp-name'
                  value={form.name}
                  onChange={(event) =>
                    handleChangeFormValue('name', event.target.value)
                  }
                  required
                  minLength={MIN_NAME_CHARS}
                  maxLength={MAX_NAME_CHARS}
                  className='mt-2 w-full rounded-xl border border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] px-4 py-3 text-sm text-[var(--color-neutral-strong)] outline-none transition placeholder:text-[rgb(182_186_192/0.72)] focus:border-[var(--color-accent-soft)] focus:ring-2 focus:ring-[rgb(211_188_145/0.25)]'
                  placeholder={copy.rsvp.nameLabel}
                />
                <p
                  className={`mt-1 text-[0.65rem] ${
                    nameHasProfanity
                      ? 'text-[rgb(252_165_165/0.92)]'
                      : 'text-[rgb(182_186_192/0.78)]'
                  }`}
                >
                  {nameHasProfanity
                    ? copy.rsvp.profanityError
                    : copy.rsvp.nameMinHint}
                </p>
              </div>

              <div>
                <p className='text-xs uppercase tracking-[0.18em] text-[rgb(182_186_192/0.92)]'>
                  {copy.rsvp.attendanceLabel}
                </p>
                <div className='mt-2 flex flex-col gap-2 sm:flex-row'>
                  <label
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      form.attendance === 'attending'
                        ? 'border-[var(--color-accent-soft)] bg-[rgb(211_188_145/0.34)] text-[var(--color-neutral-strong)] shadow-[0_0_0_1px_rgb(211_188_145/0.32)]'
                        : 'border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] text-[rgb(223_230_227/0.9)]'
                    }`}
                  >
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
                  <label
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      form.attendance === 'not-attending'
                        ? 'border-[rgb(184_190_198/0.55)] bg-[rgb(148_163_184/0.26)] text-[rgb(241_245_249/0.96)] shadow-[0_0_0_1px_rgb(148_163_184/0.28)]'
                        : 'border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] text-[rgb(223_230_227/0.9)]'
                    }`}
                  >
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
                <div className='flex items-end justify-between gap-3'>
                  <label
                    htmlFor='rsvp-message'
                    className='text-xs uppercase tracking-[0.18em] text-[rgb(182_186_192/0.92)]'
                  >
                    {copy.rsvp.wishesLabel}
                  </label>
                  <span className='text-[0.65rem] tracking-[0.08em] text-[rgb(182_186_192/0.84)]'>
                    {form.message.length}/{MAX_WISH_CHARS}
                  </span>
                </div>
                <textarea
                  id='rsvp-message'
                  value={form.message}
                  onChange={(event) =>
                    handleChangeFormValue('message', event.target.value)
                  }
                  required
                  minLength={MIN_WISH_CHARS}
                  maxLength={MAX_WISH_CHARS}
                  rows={5}
                  className='mt-2 w-full resize-none rounded-xl border border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.08)] px-4 py-3 text-sm text-[var(--color-neutral-strong)] outline-none transition placeholder:text-[rgb(182_186_192/0.72)] focus:border-[var(--color-accent-soft)] focus:ring-2 focus:ring-[rgb(211_188_145/0.25)]'
                  placeholder={copy.rsvp.wishesPlaceholder}
                />
                <p
                  className={`mt-1 text-[0.65rem] ${
                    messageHasProfanity
                      ? 'text-[rgb(252_165_165/0.92)]'
                      : 'text-[rgb(182_186_192/0.78)]'
                  }`}
                >
                  {messageHasProfanity
                    ? copy.rsvp.profanityError
                    : copy.rsvp.wishesMinHint}
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <button
                  type='submit'
                  disabled={!canSubmit}
                  className='inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.22)] bg-[rgb(211_188_145/0.22)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--color-neutral-strong)] transition hover:bg-[rgb(211_188_145/0.32)] disabled:cursor-not-allowed disabled:border-[rgb(182_186_192/0.26)] disabled:bg-[rgb(182_186_192/0.16)] disabled:text-[rgb(182_186_192/0.78)] disabled:hover:bg-[rgb(182_186_192/0.16)]'
                >
                  <PaperPlaneTilt size={16} weight='bold' />
                  {isSubmitting
                    ? copy.rsvp.submitButtonLoading
                    : copy.rsvp.submitButton}
                </button>

                {isSubmitted ? (
                  <p className='inline-flex items-center gap-1.5 text-xs text-[rgb(211_188_145/0.95)]'>
                    <CheckCircle size={14} weight='fill' />
                    {copy.rsvp.submitSuccess}
                  </p>
                ) : null}
              </div>

              {submitError ? (
                <p className='text-[0.72rem] text-[rgb(252_165_165/0.92)]'>
                  {submitError}
                </p>
              ) : null}
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
              {isLoadingEntries ? (
                <p className='rounded-xl border border-dashed border-[rgb(223_230_227/0.22)] bg-[rgb(223_230_227/0.06)] px-4 py-4 text-sm leading-relaxed text-[rgb(223_230_227/0.82)]'>
                  {copy.rsvp.loadingLabel}
                </p>
              ) : loadError ? (
                <p className='rounded-xl border border-dashed border-[rgb(252_165_165/0.45)] bg-[rgb(252_165_165/0.08)] px-4 py-4 text-sm leading-relaxed text-[rgb(252_165_165/0.92)]'>
                  {loadError}
                </p>
              ) : entries.length === 0 ? (
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
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-semibold text-[var(--color-neutral-strong)]'>
                          {entry.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] ${
                            entry.attendance === 'attending'
                              ? 'border border-[rgb(211_188_145/0.45)] bg-[rgb(211_188_145/0.18)] text-[var(--color-accent-soft)]'
                              : 'border border-[rgb(148_163_184/0.38)] bg-[rgb(148_163_184/0.14)] text-[rgb(203_213_225/0.86)]'
                          }`}
                        >
                          {entry.attendance === 'attending' ? (
                            <CheckCircle size={11} weight='fill' />
                          ) : (
                            <XCircle size={11} weight='fill' />
                          )}
                          {entry.attendance === 'attending'
                            ? copy.rsvp.attendancePresent
                            : copy.rsvp.attendanceAbsent}
                        </span>
                      </div>
                      <p className='text-[0.62rem] uppercase tracking-[0.14em] text-[rgb(182_186_192/0.86)]'>
                        {dateFormatter.format(new Date(entry.createdAt))}
                      </p>
                    </div>

                    <p className='mt-2 text-sm leading-relaxed text-[rgb(223_230_227/0.88)]'>
                      {entry.message}
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
