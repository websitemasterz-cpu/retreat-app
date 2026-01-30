import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Greenwich SDA - Men\'s Ministry Retreat 2026',
  description: 'Greenwich SDA Men\'s Ministry Lake District Retreat - August 21-24, 2026',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛰️</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
