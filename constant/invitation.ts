import type { AppLanguage } from './i18n'

export const RECEPTION_SHIFT_IDS = [1, 2, 3] as const

export type ReceptionShiftId = (typeof RECEPTION_SHIFT_IDS)[number]

type LocalizedText = Record<AppLanguage, string>

const EVENT_DATE = '2026-04-11'
const EVENT_UTC_OFFSET_MINUTES = 8 * 60

function toGoogleCalendarUtcStamp(
  localDate: string,
  localTime: string,
  utcOffsetMinutes: number
): string {
  const [year, month, day] = localDate.split('-').map((part) => Number(part))
  const [hour, minute] = localTime.split(':').map((part) => Number(part))

  const utcTimestamp =
    Date.UTC(year, month - 1, day, hour, minute, 0, 0) -
    utcOffsetMinutes * 60 * 1000

  const utcDate = new Date(utcTimestamp)
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${utcDate.getUTCFullYear()}${pad(utcDate.getUTCMonth() + 1)}${pad(
    utcDate.getUTCDate()
  )}T${pad(utcDate.getUTCHours())}${pad(utcDate.getUTCMinutes())}00Z`
}

export const INVITATION_EVENT = {
  brideName: 'Ritza',
  groomName: 'Dody',
  brideFullName: 'Ritzalina Nur Azizah, S.S.',
  groomFullName: 'Dody Hartanto, S.Kom.',
  brideParents: [
    {
      id: 'Bapak Ir. Pudji Hadi Santoso',
      en: 'Mr. Ir. Pudji Hadi Santoso'
    },
    {
      id: 'Almh. Ibu Ir. Aries Suminarsih',
      en: 'The Late Mrs. Ir. Aries Suminarsih'
    }
  ] as const,
  groomParents: [
    {
      id: 'Bapak Hariyanto, S.H.',
      en: 'Mr. Hariyanto, S.H.'
    },
    {
      id: 'Ibu Ni Made Wiryani',
      en: 'Mrs. Ni Made Wiryani'
    }
  ] as const,
  heroTitle: 'The Wedding Of',
  heroBackgroundSlides: [
    {
      src: '/images/hero/hero-1.webp',
      contentAlign: 'left',
      mobileBackgroundPosition: '56% 68%',
      desktopBackgroundPosition: '64% 54%'
    },
    {
      src: '/images/hero/hero-2.webp',
      contentAlign: 'right',
      mobileBackgroundPosition: '35% 86%',
      desktopBackgroundPosition: '78% 68%'
    },
    {
      src: '/images/hero/hero-3.webp',
      contentAlign: 'left',
      mobileBackgroundPosition: '62% 70%',
      desktopBackgroundPosition: '72% 56%'
    }
  ] as const,
  eventDateIso: `${EVENT_DATE}T12:00:00+08:00`,
  eventDate: EVENT_DATE,
  eventUtcOffsetMinutes: EVENT_UTC_OFFSET_MINUTES,
  eventDateLabel: {
    id: '11 April 2026',
    en: 'April 11, 2026'
  } as const,
  eventDayLabel: {
    id: 'Sabtu',
    en: 'Saturday'
  } as const,
  ceremonyTimeLabel: '09.00 - 10.00 WITA',
  ceremonyTime: {
    start: '09:00',
    end: '10:00'
  } as const,
  receptionBreakTimeLabel: '12.00 - 13.00 WITA',
  receptionShifts: [
    {
      id: 1,
      timeLabel: '10.00 - 12.00 WITA',
      startTime: '10:00',
      endTime: '12:00'
    },
    {
      id: 2,
      timeLabel: '13.00 - 15.00 WITA',
      startTime: '13:00',
      endTime: '15:00'
    },
    {
      id: 3,
      timeLabel: '15.00 - 17.00 WITA',
      startTime: '15:00',
      endTime: '17:00'
    }
  ] as const,
  venueName: 'Suly Resort Ubud',
  venueAddress:
    'Jl. Cok Rai Pudak, Br. Teges Yangloni, Desa Mas, Kecamatan Ubud, Kabupaten Gianyar, Bali, Indonesia',
  saveTheDateUrlTemplate:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dody%20%26%20Ritza%20Wedding&dates=20260411T040000Z/20260411T080000Z&details=Wedding%20Invitation&location=Nama%20Venue%20Acara',
  venueMapsUrl: 'https://maps.app.goo.gl/zv4kpS2jQdNntYYf7',
  weddingGiftAccounts: [
    {
      id: 'gift-groom',
      bankName: 'BCA',
      bankLogoPath: '/images/bank/bca-logo.svg',
      accountNumber: '7680505335',
      accountHolderName: 'Dody Hartanto',
      owner: 'groom'
    },
    {
      id: 'gift-bride',
      bankName: 'Permata Bank',
      bankLogoPath: '/images/bank/permata-logo.png',
      accountNumber: '9952874346',
      accountHolderName: 'Ritzalina Nur Azizah',
      owner: 'bride'
    }
  ] as const
} as const

export const DEFAULT_RECIPIENT = 'Bapak/Ibu/Saudara/i'

function getSelectedReceptionShifts(receptionShiftIds?: ReceptionShiftId[]) {
  const shiftIds =
    receptionShiftIds && receptionShiftIds.length > 0
      ? receptionShiftIds
      : INVITATION_EVENT.receptionShifts.map((shift) => shift.id)

  return INVITATION_EVENT.receptionShifts.filter((shift) =>
    shiftIds.includes(shift.id)
  )
}

export function buildSaveTheDateUrl(options: {
  language: AppLanguage
  receptionShiftIds?: ReceptionShiftId[]
}) {
  const { language, receptionShiftIds } = options

  const selectedShifts = getSelectedReceptionShifts(receptionShiftIds)
  const firstShift = selectedShifts[0] ?? INVITATION_EVENT.receptionShifts[0]
  const lastShift =
    selectedShifts[selectedShifts.length - 1] ??
    INVITATION_EVENT.receptionShifts[
      INVITATION_EVENT.receptionShifts.length - 1
    ]

  const startDateTime = toGoogleCalendarUtcStamp(
    INVITATION_EVENT.eventDate,
    firstShift.startTime,
    INVITATION_EVENT.eventUtcOffsetMinutes
  )
  const endDateTime = toGoogleCalendarUtcStamp(
    INVITATION_EVENT.eventDate,
    lastShift.endTime,
    INVITATION_EVENT.eventUtcOffsetMinutes
  )

  const localizedTitle: LocalizedText = {
    id: `Resepsi ${INVITATION_EVENT.groomName} & ${INVITATION_EVENT.brideName}`,
    en: `${INVITATION_EVENT.groomName} & ${INVITATION_EVENT.brideName} Reception`
  }

  const localizedCeremonyLabel: LocalizedText = {
    id: 'Akad',
    en: 'Ceremony'
  }

  const localizedFamilyOnlyLabel: LocalizedText = {
    id: '(hanya dihadiri oleh keluarga)',
    en: '(family only)'
  }

  const localizedReceptionLabel: LocalizedText = {
    id: 'Resepsi',
    en: 'Reception'
  }

  const localizedMapsLabel: LocalizedText = {
    id: 'Google Maps',
    en: 'Google Maps'
  }

  const details = [
    `${localizedCeremonyLabel[language]}: ${INVITATION_EVENT.ceremonyTimeLabel} ${localizedFamilyOnlyLabel[language]}`,
    `${localizedReceptionLabel[language]}: ${selectedShifts
      .map((shift) => shift.timeLabel)
      .join(' | ')}`,
    `${localizedMapsLabel[language]}: ${INVITATION_EVENT.venueMapsUrl}`
  ].join('\n')

  const location = `${INVITATION_EVENT.venueName}, ${INVITATION_EVENT.venueAddress}`

  const query = new URLSearchParams({
    action: 'TEMPLATE',
    text: localizedTitle[language],
    dates: `${startDateTime}/${endDateTime}`,
    details,
    location
  })

  return `https://calendar.google.com/calendar/render?${query.toString()}`
}

export function parseReceptionShiftQueryParam(
  rawValue: string | string[] | undefined
): ReceptionShiftId[] | undefined {
  if (!rawValue) return undefined

  const values = Array.isArray(rawValue) ? rawValue : [rawValue]
  const selected = new Set<ReceptionShiftId>()

  values.forEach((value) => {
    value
      .split(',')
      .map((item) => item.trim())
      .forEach((item) => {
        const parsed = Number.parseInt(item, 10)

        if (parsed === 1 || parsed === 2 || parsed === 3) {
          selected.add(parsed as ReceptionShiftId)
        }
      })
  })

  if (selected.size === 0) return undefined

  return RECEPTION_SHIFT_IDS.filter((shiftId) => selected.has(shiftId))
}
