'use client'

import { Check, CopySimple, CreditCard } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { COPY, type AppLanguage } from '@/constant/i18n'
import { INVITATION_EVENT } from '@/constant/invitation'

type WeddingGiftSectionProps = {
  language: AppLanguage
}

const revealTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const
}

const COPIED_RESET_MS = 1800

export default function WeddingGiftSection({
  language
}: WeddingGiftSectionProps) {
  const copy = COPY[language]
  const copiedResetTimerRef = useRef<number | null>(null)
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (copiedResetTimerRef.current) {
        window.clearTimeout(copiedResetTimerRef.current)
      }
    }
  }, [])

  const handleCopyAccountNumber = async (accountId: string, account: string) => {
    if (!navigator?.clipboard?.writeText) return

    try {
      await navigator.clipboard.writeText(account)
      setCopiedAccountId(accountId)

      if (copiedResetTimerRef.current) {
        window.clearTimeout(copiedResetTimerRef.current)
      }

      copiedResetTimerRef.current = window.setTimeout(() => {
        setCopiedAccountId(null)
      }, COPIED_RESET_MS)
    } catch {
      setCopiedAccountId(null)
    }
  }

  return (
    <section
      id='wedding-gift'
      className='relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20 md:min-h-[100svh] md:py-24'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_14%,rgb(200_180_139/0.14),transparent_34%),radial-gradient(circle_at_82%_82%,rgb(223_230_227/0.1),transparent_34%),linear-gradient(180deg,#0f1012_0%,#08090a_100%)]' />
      <div className='pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(rgb(223_230_227/0.18)_0.5px,transparent_0.5px)] [background-size:4px_4px]' />

      <div className='relative mx-auto w-full max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={revealTransition}
          className='mx-auto max-w-3xl text-center'
        >
          <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(182_186_192/0.92)]'>
            {copy.weddingGift.sectionLabel}
          </p>
          <h2 className='mt-3 text-4xl font-semibold text-[var(--color-neutral-strong)] sm:text-5xl'>
            {copy.weddingGift.title}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[rgb(223_230_227/0.85)] sm:text-base'>
            {copy.weddingGift.subtitle}
          </p>
        </motion.div>

        <div className='mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5'>
          {INVITATION_EVENT.weddingGiftAccounts.map((account, index) => {
            const isCopied = copiedAccountId === account.id
            const accountLabel =
              account.owner === 'groom'
                ? copy.weddingGift.groomAccountLabel
                : copy.weddingGift.brideAccountLabel

            return (
              <motion.article
                key={account.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ ...revealTransition, delay: index * 0.08 }}
                className='relative overflow-hidden rounded-[1.35rem] border border-[rgb(223_230_227/0.2)] bg-[linear-gradient(155deg,rgb(18_18_22/0.82),rgb(10_10_12/0.88))] p-5 shadow-[0_20px_55px_rgb(0_0_0/0.35)]'
              >
                <div className='absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgb(211_188_145/0.24)_0%,transparent_72%)] blur-2xl' />

                <div className='relative'>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-xs uppercase tracking-[0.2em] text-[rgb(182_186_192/0.9)]'>
                      {accountLabel}
                    </p>
                    <CreditCard
                      size={18}
                      weight='duotone'
                      className='text-[var(--color-accent-soft)]'
                    />
                  </div>

                  <p className='mt-3 text-lg font-semibold tracking-[0.03em] text-[var(--color-neutral-strong)]'>
                    {account.bankName}
                  </p>
                  <p className='mt-2 break-all text-[1.72rem] font-semibold tracking-[0.12em] text-[var(--color-neutral-strong)]'>
                    {account.accountNumber}
                  </p>

                  <p className='mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-[rgb(182_186_192/0.9)]'>
                    {copy.weddingGift.accountHolderLabel}
                  </p>
                  <p className='mt-1 text-sm text-[rgb(223_230_227/0.9)]'>
                    {account.accountHolderName}
                  </p>

                  <button
                    type='button'
                    onClick={() =>
                      handleCopyAccountNumber(account.id, account.accountNumber)
                    }
                    className='mt-5 inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.24)] bg-[rgb(223_230_227/0.1)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-neutral-strong)] transition hover:bg-[rgb(223_230_227/0.2)]'
                  >
                    {isCopied ? (
                      <Check size={14} weight='bold' />
                    ) : (
                      <CopySimple size={14} weight='bold' />
                    )}
                    {isCopied
                      ? copy.weddingGift.copiedButton
                      : copy.weddingGift.copyButton}
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
