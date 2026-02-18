'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LANGUAGE_OPTIONS, type AppLanguage } from '@/constant/i18n'

type SidebarSection = {
  id: string
  label: string
}

type SectionSidebarProps = {
  language: AppLanguage
  onLanguageChange: (language: AppLanguage) => void
  sections: SidebarSection[]
  title: string
  languageLabel: string
  openMenuLabel: string
  closeMenuLabel: string
  showNavLabel: string
  hideNavLabel: string
}

const panelTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as const
}

export default function SectionSidebar({
  language,
  onLanguageChange,
  sections,
  title,
  languageLabel,
  openMenuLabel,
  closeMenuLabel,
  showNavLabel,
  hideNavLabel
}: SectionSidebarProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopNavVisible, setIsDesktopNavVisible] = useState(true)

  useEffect(() => {
    if (!sections.length) return

    const observers: IntersectionObserver[] = []

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSectionId(section.id)
            }
          })
        },
        {
          rootMargin: '-45% 0px -45% 0px',
          threshold: 0.01
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sections])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMobileMenuOpen])

  const sectionMap = useMemo(() => {
    const map = new Map<string, SidebarSection>()
    sections.forEach((section) => map.set(section.id, section))
    return map
  }, [sections])

  const jumpToSection = (sectionId: string, closeMenu = false) => {
    if (!sectionId) return

    const element = document.getElementById(sectionId)
    if (!element) {
      if (closeMenu) {
        setIsMobileMenuOpen(false)
      }
      return
    }

    if (closeMenu) {
      setIsMobileMenuOpen(false)
      window.setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 70)
      return
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeLabel = sectionMap.get(activeSectionId)?.label ?? sections[0]?.label ?? 'Section'

  return (
    <>
      <button
        type='button'
        onClick={() => setIsDesktopNavVisible((value) => !value)}
        className='fixed right-4 top-4 z-40 hidden items-center rounded-full border border-[rgb(223_230_227/0.28)] bg-[rgb(12_12_14/0.82)] px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.13em] text-[rgb(223_230_227/0.94)] shadow-[0_14px_40px_rgb(0_0_0/0.44)] transition hover:bg-[rgb(24_24_27/0.9)] md:inline-flex'
      >
        {isDesktopNavVisible ? hideNavLabel : showNavLabel}
      </button>

      <AnimatePresence>
        {isDesktopNavVisible ? (
          <motion.aside
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={panelTransition}
            className='fixed right-4 top-[4.1rem] z-[39] hidden w-48 max-h-[calc(100svh-5.1rem)] overflow-y-auto rounded-[1.2rem] border border-[rgb(223_230_227/0.24)] bg-[rgb(12_12_14/0.72)] p-3 shadow-[0_18px_50px_rgb(0_0_0/0.35)] backdrop-blur-md md:block'
          >
            <p className='text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[rgb(223_230_227/0.82)]'>
              {title}
            </p>

            <div className='mt-3 space-y-2'>
              {sections.map((section) => {
                const isActive = section.id === activeSectionId

                return (
                  <button
                    key={section.id}
                    type='button'
                    onClick={() => jumpToSection(section.id)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-[0.78rem] tracking-[0.05em] transition ${
                      isActive
                        ? 'border-[rgb(211_188_145/0.7)] bg-[rgb(211_188_145/0.22)] text-[var(--color-neutral-strong)]'
                        : 'border-[rgb(223_230_227/0.18)] text-[rgb(223_230_227/0.82)] hover:bg-[rgb(223_230_227/0.1)]'
                    }`}
                  >
                    {section.label}
                  </button>
                )
              })}
            </div>

            <p className='mt-5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[rgb(223_230_227/0.82)]'>
              {languageLabel}
            </p>
            <div className='mt-2 flex gap-2'>
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = option === language

                return (
                  <button
                    key={option}
                    type='button'
                    onClick={() => onLanguageChange(option)}
                    className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] transition ${
                      isActive
                        ? 'border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] text-[var(--color-primary-deep)]'
                        : 'border-[rgb(223_230_227/0.22)] text-[rgb(223_230_227/0.82)] hover:bg-[rgb(223_230_227/0.1)]'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <div className='fixed right-3.5 top-3.5 z-30 md:hidden'>
        <button
          type='button'
          onClick={() => setIsMobileMenuOpen(true)}
          aria-expanded={isMobileMenuOpen}
          aria-controls='section-mobile-panel'
          className='min-w-[4.4rem] rounded-full border border-[rgb(223_230_227/0.3)] bg-[rgb(12_12_14/0.82)] px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--color-neutral-strong)] shadow-[0_14px_38px_rgb(0_0_0/0.35)] backdrop-blur-md'
        >
          {openMenuLabel}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            <motion.button
              type='button'
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className='fixed inset-0 z-[35] bg-[rgb(0_0_0/0.36)] md:hidden'
              aria-hidden='true'
              tabIndex={-1}
            />

            <motion.aside
              id='section-mobile-panel'
              initial={{ x: '108%' }}
              animate={{ x: 0 }}
              exit={{ x: '108%' }}
              transition={panelTransition}
              className='fixed right-0 top-0 z-[36] h-[100svh] w-[min(86vw,20rem)] overflow-y-auto border-l border-[rgb(223_230_227/0.2)] bg-[linear-gradient(165deg,rgb(16_16_19/0.96),rgb(8_8_10/0.98))] p-4 shadow-[-20px_0_60px_rgb(0_0_0/0.4)] md:hidden'
            >
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-[0.66rem] font-bold uppercase tracking-[0.17em] text-[rgb(223_230_227/0.92)]'>
                    {title}
                  </p>
                  <p className='mt-1 text-[0.95rem] tracking-[0.05em] text-[var(--color-accent-soft)]'>
                    {activeLabel}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='rounded-full border border-[rgb(223_230_227/0.2)] bg-[rgb(223_230_227/0.08)] px-3 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.13em] text-[rgb(223_230_227/0.88)]'
                >
                  {closeMenuLabel}
                </button>
              </div>

              <div className='mt-4 space-y-2'>
                {sections.map((section) => {
                  const isActive = section.id === activeSectionId

                  return (
                    <button
                      key={section.id}
                      type='button'
                      onClick={() => jumpToSection(section.id, true)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-[0.78rem] tracking-[0.05em] transition ${
                        isActive
                          ? 'border-[rgb(211_188_145/0.7)] bg-[rgb(211_188_145/0.22)] text-[var(--color-neutral-strong)]'
                          : 'border-[rgb(223_230_227/0.18)] text-[rgb(223_230_227/0.82)] hover:bg-[rgb(223_230_227/0.1)]'
                      }`}
                    >
                      {section.label}
                    </button>
                  )
                })}
              </div>

              <p className='mt-5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[rgb(223_230_227/0.82)]'>
                {languageLabel}
              </p>
              <div className='mt-2 flex gap-2'>
                {LANGUAGE_OPTIONS.map((option) => {
                  const isActive = option === language

                  return (
                    <button
                      key={option}
                      type='button'
                      onClick={() => onLanguageChange(option)}
                      className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] transition ${
                        isActive
                          ? 'border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] text-[var(--color-primary-deep)]'
                          : 'border-[rgb(223_230_227/0.22)] text-[rgb(223_230_227/0.82)] hover:bg-[rgb(223_230_227/0.1)]'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}

