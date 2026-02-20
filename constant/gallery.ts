export type GalleryItem = {
  id: string
  image: string
  alt?: string
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-1',
    image: '/images/gallery/gallery-1.jpeg',
    alt: 'Pre-wedding photo 1'
  },
  {
    id: 'gallery-2',
    image: '/images/gallery/gallery-2.jpeg',
    alt: 'Pre-wedding photo 2'
  },
  {
    id: 'gallery-3',
    image: '/images/gallery/gallery-3.jpeg',
    alt: 'Pre-wedding photo 3'
  },
  {
    id: 'gallery-4',
    image: '/images/gallery/gallery-4.jpeg',
    alt: 'Pre-wedding photo 4'
  },
  {
    id: 'gallery-5',
    image: '/images/gallery/gallery-5.jpeg',
    alt: 'Pre-wedding photo 5'
  }
]
