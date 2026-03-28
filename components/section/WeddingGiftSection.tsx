'use client'

import { Check, CopySimple } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
const ACCOUNT_NUMBER_GROUP_SIZE = 4

function formatAccountNumber(rawAccountNumber: string) {
  return rawAccountNumber
    .replace(/\s+/g, '')
    .replace(new RegExp(`(.{${ACCOUNT_NUMBER_GROUP_SIZE}})`, 'g'), '$1 ')
    .trim()
}

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

  const handleCopyAccountNumber = async (
    accountId: string,
    account: string
  ) => {
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
            const isSvgLogo = account.bankLogoPath.toLowerCase().endsWith('.svg')
            const groupedAccountNumber = formatAccountNumber(
              account.accountNumber
            )
            const cardToneClass =
              account.owner === 'groom'
                ? 'bg-[linear-gradient(145deg,#171a1f_0%,#12151a_56%,#0d1014_100%)]'
                : 'bg-[linear-gradient(145deg,#1a1818_0%,#161313_54%,#110e0e_100%)]'

            return (
              <motion.article
                key={account.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ ...revealTransition, delay: index * 0.08 }}
                className='relative overflow-hidden rounded-[1.5rem] border border-[rgb(223_230_227/0.2)] shadow-[0_22px_62px_rgb(0_0_0/0.38)]'
              >
                <div className={`absolute inset-0 ${cardToneClass}`} />
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgb(223_230_227/0.13),transparent_34%),radial-gradient(circle_at_86%_84%,rgb(211_188_145/0.18),transparent_38%)]' />
                <div className='absolute inset-0 opacity-[0.1] [background-image:linear-gradient(120deg,rgb(223_230_227/0.3)_0.9px,transparent_0.9px)] [background-size:7px_7px]' />
                <div className='absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgb(211_188_145/0.2)_0%,transparent_72%)] blur-3xl' />

                <div className='relative aspect-[1.58/1] px-5 py-4 sm:px-6 sm:py-5'>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[rgb(223_230_227/0.84)]'>
                      {accountLabel}
                    </p>
                    <div className='relative flex h-9 w-16 items-center justify-center overflow-hidden rounded-lg border border-[rgb(223_230_227/0.26)] bg-[rgb(8_8_10/0.3)] px-2'>
                      <Image
                        src={account.bankLogoPath}
                        alt={`${account.bankName} logo`}
                        fill
                        sizes='64px'
                        className={`object-contain p-1.5 ${
                          isSvgLogo ? 'brightness-0 invert opacity-95' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div className='mt-6 h-8 w-12 rounded-md border border-[rgb(223_230_227/0.24)] bg-[linear-gradient(135deg,rgb(211_188_145/0.88),rgb(152_130_92/0.92))] shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]' />

                  <p className='mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-[rgb(182_186_192/0.9)]'>
                    {account.bankName}
                  </p>
                  <p className='mt-2 font-mono text-[1.5rem] font-semibold tracking-[0.16em] text-[var(--color-neutral-strong)] sm:text-[1.68rem]'>
                    {groupedAccountNumber}
                  </p>

                  <div className='mt-5 flex items-end justify-between gap-3'>
                    <div>
                      <p className='text-[0.58rem] uppercase tracking-[0.2em] text-[rgb(182_186_192/0.88)]'>
                        {copy.weddingGift.accountHolderLabel}
                      </p>
                      <p className='mt-1 text-[0.84rem] font-medium uppercase tracking-[0.08em] text-[rgb(223_230_227/0.92)]'>
                        {account.accountHolderName}
                      </p>
                    </div>

                    <button
                      type='button'
                      onClick={() =>
                        handleCopyAccountNumber(
                          account.id,
                          account.accountNumber
                        )
                      }
                      className='inline-flex items-center gap-2 rounded-full border border-[rgb(223_230_227/0.24)] bg-[rgb(8_8_10/0.48)] px-3.5 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-neutral-strong)] transition hover:bg-[rgb(223_230_227/0.18)]'
                    >
                      {isCopied ? (
                        <Check size={13} weight='bold' />
                      ) : (
                        <CopySimple size={13} weight='bold' />
                      )}
                      {isCopied
                        ? copy.weddingGift.copiedButton
                        : copy.weddingGift.copyButton}
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
