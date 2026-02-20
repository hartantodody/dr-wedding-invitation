import SplashScreen from '@/components/section/SplashScreen'
import { DEFAULT_LANGUAGE, isAppLanguage, type AppLanguage } from '@/constant/i18n'
import { parseReceptionShiftQueryParam } from '@/constant/invitation'

type SearchParams = {
  [key: string]: string | string[] | undefined
}

function getRecipientFromParams(searchParams: SearchParams): string | undefined {
  const rawValue =
    searchParams.to ??
    searchParams.untuk ??
    searchParams.kepada ??
    searchParams.guest

  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue

  if (!value) return undefined

  return value
    .replace(/\+/g, ' ')
    .trim()
    .slice(0, 80)
}

function getLanguageFromParams(searchParams: SearchParams): AppLanguage {
  const rawValue = searchParams.lang
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue

  if (!value) return DEFAULT_LANGUAGE
  if (!isAppLanguage(value)) return DEFAULT_LANGUAGE

  return value
}

function getReceptionShiftsFromParams(searchParams: SearchParams) {
  return parseReceptionShiftQueryParam(searchParams.shift)
}

export default async function Page({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const recipientName = getRecipientFromParams(params)
  const initialLanguage = getLanguageFromParams(params)
  const receptionShiftIds = getReceptionShiftsFromParams(params)

  return (
    <SplashScreen
      recipientName={recipientName}
      initialLanguage={initialLanguage}
      receptionShiftIds={receptionShiftIds}
    />
  )
}
