import './globals.css'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NextJS Table by Franco Lloveras',
  description: 'A example of a NextJS Table with Prisma ORM.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
