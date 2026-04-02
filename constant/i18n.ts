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
    invalidLinkHint: string
  }
  hero: {
    title: string
    dateLabel: string
    timeLabel: string
    countdownTitle: string
    scrollHint: string
  }
  saveTheDate: {
    sectionLabel: string
    title: string
    subtitle: string
    dateLabel: string
    timeLabel: string
    ceremonyLabel: string
    receptionLabel: string
    familyOnlyLabel: string
    shiftLabel: string
    breakLabel: string
    venueLabel: string
    addressLabel: string
    countdownTitle: string
    saveDateButton: string
    mapsButton: string
  }
  introduction: {
    sectionLabel: string
    title: string
    greetingArab: string
    greetingTranslation: string
    bismillahArab: string
    bismillahTranslation: string
    ayahArab: string
    ayahTranslation: string
    ayahSource: string
    openingInviteLine1: string
    openingInviteLine2: string
    skipLabel: string
    groomLabel: string
    brideLabel: string
    groomPrefix: string
    bridePrefix: string
  }
  gallery: {
    sectionLabel: string
    quote: string
    quoteCaption: string
    scrollHint: string
  }
  weddingGift: {
    sectionLabel: string
    title: string
    subtitle: string
    groomAccountLabel: string
    brideAccountLabel: string
    accountHolderLabel: string
    copyButton: string
    copiedButton: string
  }
  rsvp: {
    sectionLabel: string
    title: string
    subtitle: string
    nameLabel: string
    nameMinHint: string
    attendanceLabel: string
    attendancePresent: string
    attendanceAbsent: string
    wishesLabel: string
    wishesMinHint: string
    wishesPlaceholder: string
    profanityError: string
    fetchError: string
    loadingLabel: string
    submitButton: string
    submitButtonLoading: string
    submitError: string
    submitSuccess: string
    messagesTitle: string
    messagesEmpty: string
  }
  sidebar: {
    title: string
    sections: {
      hero: string
      introduction: string
      saveTheDate: string
      gallery: string
      weddingGift: string
      rsvp: string
    }
    open: string
    close: string
    show: string
    hide: string
  }
  footer: {
    title: string
    subtitle: string
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
      languageLabel: 'Bahasa',
      invalidLinkHint:
        'Link undangan tidak valid. Gunakan link resmi dengan parameter nama tamu dan shift.'
    },
    hero: {
      title: 'The Wedding Of',
      dateLabel: '11 April 2026',
      timeLabel: '12.00 WITA',
      countdownTitle: 'Hitung Mundur Hari Bahagia',
      scrollHint: 'Scroll Untuk Gallery'
    },
    saveTheDate: {
      sectionLabel: 'Save The Date',
      title: 'Lokasi & Waktu Acara',
      subtitle: 'Catat jadwalnya dan jumpa di hari bahagia kami.',
      dateLabel: 'Tanggal',
      timeLabel: 'Waktu',
      ceremonyLabel: 'Akad',
      receptionLabel: 'Resepsi',
      familyOnlyLabel: '(hanya dihadiri oleh keluarga)',
      shiftLabel: 'Shift',
      breakLabel: 'Istirahat',
      venueLabel: 'Lokasi',
      addressLabel: 'Alamat',
      countdownTitle: 'Hitung Mundur Hari Bahagia',
      saveDateButton: 'Save The Date',
      mapsButton: 'Lihat Lokasi'
    },
    introduction: {
      sectionLabel: 'Introduction',
      title: 'Perkenalkan Kami',
      greetingArab: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ',
      greetingTranslation: 'Semoga keselamatan, rahmat, dan berkah Allah tercurah untukmu.',
      bismillahArab: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
      bismillahTranslation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
      ayahArab:
        'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً',
      ayahTranslation:
        'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu kasih dan sayang.',
      ayahSource: 'QS. Ar-Rum: 21',
      openingInviteLine1:
        'Dengan rahmat dan berkah Allah SWT, kami mengundang Anda untuk hadir dan merayakan hari bahagia pernikahan kami',
      openingInviteLine2: '',
      skipLabel: 'Lewati',
      groomLabel: 'The Groom',
      brideLabel: 'The Bride',
      groomPrefix: 'Putra dari',
      bridePrefix: 'Putri dari'
    },
    gallery: {
      sectionLabel: 'Galeri',
      quote: 'Until the winds forget to roam,\nTill nothing calls them home.',
      quoteCaption: 'Signature Dody & Ritza',
      scrollHint: 'Scroll ke bawah untuk geser gallery'
    },
    weddingGift: {
      sectionLabel: 'Wedding Gift',
      title: 'Wedding Gift',
      subtitle:
        'Doa restu Anda adalah hadiah terindah, namun jika ingin berbagi kasih dapat melalui rekening berikut.',
      groomAccountLabel: 'Rekening Dody',
      brideAccountLabel: 'Rekening Ritza',
      accountHolderLabel: 'Atas nama',
      copyButton: 'Salin Nomor',
      copiedButton: 'Tersalin'
    },
    rsvp: {
      sectionLabel: 'RSVP & Wishes',
      title: 'RSVP & Ucapan',
      subtitle:
        'Konfirmasi kehadiran dan tinggalkan pesan manis untuk kami di hari bahagia ini.',
      nameLabel: 'Nama',
      nameMinHint: 'Minimal 2 karakter.',
      attendanceLabel: 'Kehadiran',
      attendancePresent: 'Hadir',
      attendanceAbsent: 'Berhalangan',
      wishesLabel: 'Ucapan',
      wishesMinHint: 'Minimal 5 karakter.',
      wishesPlaceholder: 'Tulis ucapan dan doa terbaik untuk kami...',
      profanityError: 'Mohon gunakan bahasa yang sopan tanpa kata kasar.',
      fetchError: 'Gagal memuat pesan tamu. Coba refresh halaman.',
      loadingLabel: 'Memuat pesan tamu...',
      submitButton: 'Kirim RSVP',
      submitButtonLoading: 'Mengirim...',
      submitError: 'Gagal mengirim RSVP. Coba lagi sebentar.',
      submitSuccess: 'Terima kasih, pesanmu sudah masuk.',
      messagesTitle: 'Pesan Tamu',
      messagesEmpty:
        'Belum ada pesan. Jadi yang pertama kasih doa terbaik untuk kami.'
    },
    sidebar: {
      title: 'Navigasi',
      sections: {
        hero: 'Pembuka',
        introduction: 'Perkenalan',
        saveTheDate: 'Save The Date',
        gallery: 'Galeri',
        weddingGift: 'Wedding Gift',
        rsvp: 'RSVP & Ucapan'
      },
      open: 'Menu',
      close: 'Tutup',
      show: 'Tampil',
      hide: 'Sembunyi'
    },
    footer: {
      title:
        'Designed and coded by the groom, Copywriting and quality assurance by the bride.',
      subtitle: ''
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
      languageLabel: 'Language',
      invalidLinkHint:
        'Invalid invitation link. Please use the official link with guest name and shift parameters.'
    },
    hero: {
      title: 'The Wedding Of',
      dateLabel: 'April 11, 2026',
      timeLabel: '12:00 PM WITA',
      countdownTitle: 'Countdown To The Day',
      scrollHint: 'Scroll For Gallery'
    },
    saveTheDate: {
      sectionLabel: 'Save The Date',
      title: 'Date & Venue',
      subtitle: 'Mark your calendar and celebrate this day with us.',
      dateLabel: 'Date',
      timeLabel: 'Time',
      ceremonyLabel: 'Ceremony',
      receptionLabel: 'Reception',
      familyOnlyLabel: 'Family only',
      shiftLabel: 'Shift',
      breakLabel: 'Break',
      venueLabel: 'Venue',
      addressLabel: 'Address',
      countdownTitle: 'Countdown To The Day',
      saveDateButton: 'Save The Date',
      mapsButton: 'Open Maps'
    },
    introduction: {
      sectionLabel: 'Introduction',
      title: 'A Short Introduction',
      greetingArab: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ',
      greetingTranslation:
        'May the peace, mercy, and blessings of Allah be upon you.',
      bismillahArab: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
      bismillahTranslation:
        'In the name of Allah, the Most Gracious, the Most Merciful.',
      ayahArab:
        'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً',
      ayahTranslation:
        'And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them, and He placed between you affection and mercy.',
      ayahSource: 'Quran 30:21',
      openingInviteLine1: 'BY THE GRACE AND BLESSING OF ALLAH SWT,',
      openingInviteLine2:
        'WE INVITE YOU TO JOIN US IN CELEBRATING OUR MARRIAGE',
      skipLabel: 'Skip',
      groomLabel: 'The Groom',
      brideLabel: 'The Bride',
      groomPrefix: 'Son of',
      bridePrefix: 'Daughter of'
    },
    gallery: {
      sectionLabel: 'Gallery',
      quote: 'Until the winds forget to roam,\nTill nothing calls them home.',
      quoteCaption: 'Dody & Ritza Signature',
      scrollHint: 'Scroll down to glide sideways'
    },
    weddingGift: {
      sectionLabel: 'Wedding Gift',
      title: 'Wedding Gift',
      subtitle:
        'Your prayers are the greatest gift, but if you would like to share your blessing, here are our accounts.',
      groomAccountLabel: "Dody's Account",
      brideAccountLabel: "Ritza's Account",
      accountHolderLabel: 'Account holder',
      copyButton: 'Copy Number',
      copiedButton: 'Copied'
    },
    rsvp: {
      sectionLabel: 'RSVP & Wishes',
      title: 'RSVP & Wishes',
      subtitle:
        'Please confirm your attendance and leave your warm wishes for our day.',
      nameLabel: 'Name',
      nameMinHint: 'Minimum 2 characters.',
      attendanceLabel: 'Attendance',
      attendancePresent: 'Attending',
      attendanceAbsent: 'Unable to Attend',
      wishesLabel: 'Wishes',
      wishesMinHint: 'Minimum 5 characters.',
      wishesPlaceholder: 'Write your wishes for us...',
      profanityError: 'Please use respectful language without profanity.',
      fetchError: 'Failed to load guest messages. Please refresh the page.',
      loadingLabel: 'Loading guest messages...',
      submitButton: 'Send RSVP',
      submitButtonLoading: 'Sending...',
      submitError: 'Failed to send RSVP. Please try again shortly.',
      submitSuccess: 'Thank you, your message has been sent.',
      messagesTitle: 'Guest Messages',
      messagesEmpty: 'No messages yet. Be the first to send your wishes.'
    },
    sidebar: {
      title: 'Navigation',
      sections: {
        hero: 'Opening',
        introduction: 'Introduction',
        saveTheDate: 'Save The Date',
        gallery: 'Gallery',
        weddingGift: 'Wedding Gift',
        rsvp: 'RSVP & Wishes'
      },
      open: 'Menu',
      close: 'Close',
      show: 'Show',
      hide: 'Hide'
    },
    footer: {
      title:
        'Designed and coded by the groom, Copywriting and quality assurance by the bride.',
      subtitle: ''
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
