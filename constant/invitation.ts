export const RECEPTION_SHIFT_IDS = [1, 2, 3] as const

export type ReceptionShiftId = (typeof RECEPTION_SHIFT_IDS)[number]

export const INVITATION_EVENT = {
  brideName: 'Ritza',
  groomName: 'Dody',
  brideFullName: 'Ritzalina Nur Azizah',
  groomFullName: 'Dody Hartanto',
  brideParents: ['Mr. Pudji Hadi Santoso', 'The Late Mrs. Aries Suminarsih'],
  groomParents: ['Mr. Hariyanto', 'Mrs. Ni Made Wiryani'],
  heroTitle: 'The Wedding Of',
  heroBackgroundSlides: [
    {
      src: '/images/hero-1.jpeg',
      contentAlign: 'left',
      mobileBackgroundPosition: '74% 74%',
      desktopBackgroundPosition: '78% 58%'
    },
    {
      src: '/images/hero-2.jpeg',
      contentAlign: 'right',
      mobileBackgroundPosition: '56% 68%',
      desktopBackgroundPosition: '64% 54%'
    },
    {
      src: '/images/hero-3.JPG',
      contentAlign: 'left',
      mobileBackgroundPosition: '62% 70%',
      desktopBackgroundPosition: '72% 56%'
    }
  ] as const,
  eventDateIso: '2026-04-11T12:00:00+08:00',
  eventDateLabel: '11 April 2026',
  eventDayLabel: 'Saturday',
  ceremonyTimeLabel: '09.00 - 10.00',
  receptionBreakTimeLabel: '12.00 - 13.00',
  receptionShifts: [
    { id: 1, timeLabel: '10.00 - 12.00' },
    { id: 2, timeLabel: '13.00 - 15.00' },
    { id: 3, timeLabel: '15.00 - 17.00' }
  ] as const,
  venueName: 'Nama Venue Acara',
  venueAddress: 'Alamat lengkap venue acara, kota, provinsi',
  saveTheDateUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dody%20%26%20Ritza%20Wedding&dates=20260411T040000Z/20260411T080000Z&details=Wedding%20Invitation&location=Nama%20Venue%20Acara',
  venueMapsUrl: 'https://maps.google.com/?q=Nama+Venue+Acara',
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
      bankName: 'BNI',
      bankLogoPath: '/images/bank/bni-logo.svg',
      accountNumber: '1208237018',
      accountHolderName: 'Ritzalina Nur Azizah',
      owner: 'bride'
    }
    // {
    //   id: 'gift-bride',
    //   bankName: 'Permata',
    //   bankLogoPath: '/images/bank/mandiri-logo.png',
    //   accountNumber: '9952874346',
    //   accountHolderName: 'Ritzalina Nur Azizah',
    //   owner: 'bride'
    // }
  ] as const
} as const

export const DEFAULT_RECIPIENT = 'Bapak/Ibu/Saudara/i'

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
