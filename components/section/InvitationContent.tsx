'use client'

import { COPY, type AppLanguage } from '@/constant/i18n'
import { type ReceptionShiftId } from '@/constant/invitation'
import GallerySection from './GallerySection'
import Hero from './Hero'
import IntroductionSection from './IntroductionSection'
import InvitationFooter from './InvitationFooter'
import RsvpWishesSection from './RsvpWishesSection'
import SaveTheDateSection from './SaveTheDateSection'
import SectionSidebar from './SectionSidebar'
import WeddingGiftSection from './WeddingGiftSection'

type InvitationContentProps = {
  language: AppLanguage
  onLanguageChange: (language: AppLanguage) => void
  receptionShiftIds?: ReceptionShiftId[]
}

export default function InvitationContent({
  language,
  onLanguageChange,
  receptionShiftIds
}: InvitationContentProps) {
  const copy = COPY[language]

  const sections = [
    { id: 'hero', label: copy.sidebar.sections.hero },
    { id: 'introduction', label: copy.sidebar.sections.introduction },
    { id: 'save-the-date', label: copy.sidebar.sections.saveTheDate },
    { id: 'gallery', label: copy.sidebar.sections.gallery },
    { id: 'wedding-gift', label: copy.sidebar.sections.weddingGift },
    { id: 'rsvp', label: copy.sidebar.sections.rsvp }
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
      <SaveTheDateSection
        language={language}
        receptionShiftIds={receptionShiftIds}
      />
      <GallerySection language={language} />
      <WeddingGiftSection language={language} />
      <RsvpWishesSection language={language} />
      <InvitationFooter language={language} />
    </>
  )
}
