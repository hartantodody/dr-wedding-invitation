export type AppLanguage = 'id' | 'en'

export const DEFAULT_LANGUAGE: AppLanguage = 'id'

export const LANGUAGE_OPTIONS: AppLanguage[] = ['id', 'en']

export type CountdownCopy = {
  days: string
  hours: string
  minutes: string
  seconds: string
  live: string
}

type AppCopy = {
  splash: {
    to: string
    openButton: string
    languageLabel: string
  }
  hero: {
    title: string
    dateLabel: string
    timeLabel: string
    countdownTitle: string
    scrollHint: string
  }
  introduction: {
    sectionLabel: string
    title: string
    groomPrefix: string
    bridePrefix: string
  }
  gallery: {
    sectionLabel: string
    quote: string
    quoteCaption: string
    scrollHint: string
  }
  sidebar: {
    title: string
    sections: {
      hero: string
      introduction: string
      gallery: string
    }
    open: string
    close: string
    show: string
    hide: string
  }
  music: {
    play: string
    pause: string
    loading: string
  }
  countdown: CountdownCopy
}

export const COPY: Record<AppLanguage, AppCopy> = {
  id: {
    splash: {
      to: 'Kepada Yth.',
      openButton: 'Buka Undangan',
      languageLabel: 'Bahasa'
    },
    hero: {
      title: 'The Wedding Of',
      dateLabel: '11 April 2026',
      timeLabel: '12.00 WITA',
      countdownTitle: 'Hitung Mundur Hari Bahagia',
      scrollHint: 'Scroll Untuk Gallery'
    },
    introduction: {
      sectionLabel: 'Introduction',
      title: 'Perkenalkan Kami',
      groomPrefix: 'Putra dari',
      bridePrefix: 'Putri dari'
    },
    gallery: {
      sectionLabel: 'Galeri',
      quote: 'Cinta yang tumbuh pelan, tapi pasti.',
      quoteCaption: 'Signature Dody & Ritza',
      scrollHint: 'Scroll ke bawah untuk geser gallery'
    },
    sidebar: {
      title: 'Navigasi',
      sections: {
        hero: 'Pembuka',
        introduction: 'Perkenalan',
        gallery: 'Galeri'
      },
      open: 'Menu',
      close: 'Tutup',
      show: 'Tampil',
      hide: 'Sembunyi'
    },
    music: {
      play: 'Putar Musik',
      pause: 'Jeda Musik',
      loading: 'Memuat Lagu...'
    },
    countdown: {
      days: 'Hari',
      hours: 'Jam',
      minutes: 'Menit',
      seconds: 'Detik',
      live: 'Acara Sedang Berlangsung'
    }
  },
  en: {
    splash: {
      to: 'Dear',
      openButton: 'Open Invitation',
      languageLabel: 'Language'
    },
    hero: {
      title: 'The Wedding Of',
      dateLabel: 'April 11, 2026',
      timeLabel: '12:00 PM WITA',
      countdownTitle: 'Countdown To The Day',
      scrollHint: 'Scroll For Gallery'
    },
    introduction: {
      sectionLabel: 'Introduction',
      title: 'A Short Introduction',
      groomPrefix: 'Son of',
      bridePrefix: 'Daughter of'
    },
    gallery: {
      sectionLabel: 'Gallery',
      quote: 'Love that grows slowly, yet surely.',
      quoteCaption: 'Dody & Ritza Signature',
      scrollHint: 'Scroll down to glide sideways'
    },
    sidebar: {
      title: 'Navigation',
      sections: {
        hero: 'Opening',
        introduction: 'Introduction',
        gallery: 'Gallery'
      },
      open: 'Menu',
      close: 'Close',
      show: 'Show',
      hide: 'Hide'
    },
    music: {
      play: 'Play Music',
      pause: 'Pause Music',
      loading: 'Loading Track...'
    },
    countdown: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      live: 'The Event Is Happening'
    }
  }
}

export function isAppLanguage(value: string | undefined): value is AppLanguage {
  return value === 'id' || value === 'en'
}
