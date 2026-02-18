import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import './globals.css'

const headingFont = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
})

const scriptFont = Great_Vibes({
  variable: '--font-script',
  subsets: ['latin'],
  weight: '400'
})

const weddingHeadingFont = localFont({
  src: '../public/fonts/wedding-heading.ttf',
  variable: '--font-wedding-heading',
  display: 'swap',
  fallback: ['serif']
})

export const metadata: Metadata = {
  title: 'Dody & Ritza Wedding Invitation',
  description:
    'Scroll-driven wedding invitation inspired by Dody and Ritza invitation design.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='id'>
      <body
        className={`${headingFont.variable} ${scriptFont.variable} ${weddingHeadingFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
