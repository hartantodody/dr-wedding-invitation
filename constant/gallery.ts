export type GalleryItem = {
  id: string
  label: string
  title: string
  image: string
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'ubud-2024', label: 'Ubud, 2024', title: 'Morning Walk', image: '/gallery-1.jpg' },
  {
    id: 'bali-2024',
    label: 'Bali, 2024',
    title: 'After Dinner Talk',
    image: '/gallery-2.jpg'
  },
  {
    id: 'gianyar-2025',
    label: 'Gianyar, 2025',
    title: 'Family Blessing',
    image: '/gallery-3.jpg'
  },
  {
    id: 'countdown-2026',
    label: 'Save The Date',
    title: 'Towards 11 April 2026',
    image: '/gallery-4.jpg'
  },
  {
    id: 'the-day',
    label: 'The Day',
    title: 'Dody & Ritza',
    image: '/gallery-5.jpg'
  }
]
