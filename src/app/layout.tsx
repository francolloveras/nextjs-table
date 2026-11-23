import './globals.css'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

const geist = Geist({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NextJS Table by Franco Lloveras',
  description: 'A example of a NextJS Table with Prisma ORM.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geist.className}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
