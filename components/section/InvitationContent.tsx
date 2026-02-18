'use client'

import { COPY, type AppLanguage } from '@/constant/i18n'
import GallerySection from './GallerySection'
import Hero from './Hero'
import IntroductionSection from './IntroductionSection'
import SectionSidebar from './SectionSidebar'

type InvitationContentProps = {
  language: AppLanguage
  onLanguageChange: (language: AppLanguage) => void
}

export default function InvitationContent({
  language,
  onLanguageChange
}: InvitationContentProps) {
  const copy = COPY[language]

  const sections = [
    { id: 'hero', label: copy.sidebar.sections.hero },
    { id: 'introduction', label: copy.sidebar.sections.introduction },
    { id: 'gallery', label: copy.sidebar.sections.gallery }
  ]

  return (
    <>
      <SectionSidebar
        language={language}
        onLanguageChange={onLanguageChange}
        sections={sections}
        title={copy.sidebar.title}
        languageLabel={copy.splash.languageLabel}
        openMenuLabel={copy.sidebar.open}
        closeMenuLabel={copy.sidebar.close}
        showNavLabel={copy.sidebar.show}
        hideNavLabel={copy.sidebar.hide}
      />
      <Hero language={language} />
      <IntroductionSection language={language} />
      <GallerySection language={language} />
    </>
  )
}
