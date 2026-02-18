'use client'

import { motion } from 'framer-motion'

const locationLines = [
  'Suly Resort Ubud (Restaurant Area)',
  'Jl. Cok Rai Pudak, Br. Teges Yangloni,',
  'Desa Mas, Kecamatan Ubud,',
  'Kabupaten Gianyar'
]

const revealTransition = {
  duration: 0.86,
  ease: [0.22, 1, 0.36, 1] as const
}

export default function EventDetails() {
  return (
    <section
      id='event-details'
      className='relative min-h-[120svh] px-5 pb-24 pt-16 sm:px-8 sm:pt-20'
    >
      <div className='mx-auto w-full max-w-5xl'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={revealTransition}
          className='rounded-[2.1rem] border border-[rgb(182_186_192/0.38)] bg-[linear-gradient(175deg,rgb(16_16_19/0.9),rgb(8_8_10/0.96))] px-5 py-8 shadow-[inset_0_0_0_1px_rgb(200_180_139/0.12),0_20px_60px_rgb(0_0_0/0.42)] sm:px-9 sm:py-11'
        >
          <div className='text-center'>
            <p className='text-[0.68rem] font-semibold uppercase tracking-[0.27em] text-[rgb(223_230_227/0.9)]'>
              Saturday
            </p>
            <h2 className='mt-2 text-5xl font-semibold text-[var(--color-neutral-strong)] sm:text-7xl'>
              11/04/2026
            </h2>
            <p className='mt-4 text-sm uppercase tracking-[0.22em] text-[var(--color-accent-soft)]'>
              Save The Date
            </p>
          </div>

          <div className='mt-10 grid gap-4 md:grid-cols-2'>
            <article className='rounded-2xl border border-[rgb(182_186_192/0.28)] bg-[linear-gradient(165deg,rgb(20_20_24/0.9),rgb(10_10_12/0.94))] p-5 shadow-[inset_0_1px_0_rgb(223_230_227/0.1)] sm:p-6'>
              <h3 className='text-2xl font-semibold tracking-[0.06em] text-[var(--color-accent-soft)] sm:text-3xl'>
                The Ceremony
              </h3>
              <div className='mt-2 h-[2px] w-full bg-[linear-gradient(90deg,transparent_0%,var(--color-accent)_16%,var(--color-accent-soft)_84%,transparent_100%)]' />
              <p className='mt-4 text-sm uppercase tracking-[0.17em] text-[rgb(180_184_190/0.92)]'>
                Time
              </p>
              <p className='mt-1 text-2xl text-[var(--color-neutral-strong)]'>08.00 - 11.00 WITA</p>
              <p className='mt-2 text-sm leading-relaxed text-[rgb(180_184_190/0.88)]'>
                Attended only by family members.
              </p>
            </article>

            <article className='rounded-2xl border border-[rgb(182_186_192/0.28)] bg-[linear-gradient(165deg,rgb(20_20_24/0.9),rgb(10_10_12/0.94))] p-5 shadow-[inset_0_1px_0_rgb(223_230_227/0.1)] sm:p-6'>
              <h3 className='text-2xl font-semibold tracking-[0.06em] text-[var(--color-accent-soft)] sm:text-3xl'>
                The Reception
              </h3>
              <div className='mt-2 h-[2px] w-full bg-[linear-gradient(90deg,transparent_0%,var(--color-accent)_16%,var(--color-accent-soft)_84%,transparent_100%)]' />
              <p className='mt-4 text-sm uppercase tracking-[0.17em] text-[rgb(180_184_190/0.92)]'>
                Time
              </p>
              <p className='mt-1 text-2xl text-[var(--color-neutral-strong)]'>11.00 - 17.00 WITA</p>
              <p className='mt-2 text-sm leading-relaxed text-[rgb(180_184_190/0.88)]'>
                Your presence and prayers will be our joy and honor.
              </p>
            </article>
          </div>

          <div className='mt-6 grid gap-4 lg:grid-cols-[1.06fr_0.94fr]'>
            <article className='rounded-2xl border border-[rgb(182_186_192/0.28)] bg-[linear-gradient(165deg,rgb(20_20_24/0.9),rgb(10_10_12/0.94))] p-5 shadow-[inset_0_1px_0_rgb(223_230_227/0.1)] sm:p-6'>
              <p className='text-sm uppercase tracking-[0.18em] text-[var(--color-accent-soft)]'>
                Location
              </p>
              <div className='mt-3 space-y-1.5'>
                {locationLines.map((line) => (
                  <p
                    key={line}
                    className='text-sm leading-relaxed text-[rgb(223_230_227/0.92)] sm:text-base'
                  >
                    {line}
                  </p>
                ))}
              </div>
            </article>

            <article className='rounded-2xl border border-[rgb(182_186_192/0.28)] bg-[linear-gradient(165deg,rgb(20_20_24/0.9),rgb(10_10_12/0.94))] p-5 shadow-[inset_0_1px_0_rgb(223_230_227/0.1)] sm:p-6'>
              <p className='text-sm uppercase tracking-[0.18em] text-[var(--color-accent-soft)]'>
                The Couple
              </p>
              <p className='mt-3 text-xl text-[var(--color-neutral-strong)] sm:text-2xl'>
                Dody Hartanto
              </p>
              <p className='mt-1 text-sm leading-relaxed text-[rgb(180_184_190/0.9)]'>
                Son of Mr. Hariyanto and Mrs. Ni Made Wiryani
              </p>
              <p className='mt-4 text-xl text-[var(--color-neutral-strong)] sm:text-2xl'>
                Ritzalina Nur Azizah
              </p>
              <p className='mt-1 text-sm leading-relaxed text-[rgb(180_184_190/0.9)]'>
                Daughter of Mr. Pudji Hadi Santoso and The Late Mrs. Aries
                Suminarsih
              </p>
            </article>
          </div>

          <p className='mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-[rgb(150_155_162/0.95)] sm:text-xl'>
            It would be a great honor and joy for us if you could attend and
            offer your prayers and blessings.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

