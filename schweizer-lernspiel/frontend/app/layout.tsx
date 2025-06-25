import type { Metadata } from 'next'
import './globals.css'
import AppProvider from '@/components/providers/AppProvider'

export const metadata: Metadata = {
  title: 'Schweizer Abenteuerland - Lernspiel für Erstklässler',
  description: 'Ein spannendes Lernspiel für Kinder mit Schweizer Themen. Spielend lernen mit Buchstaben, Zahlen, Natur und Musik!',
  keywords: ['Lernspiel', 'Kinder', 'Schweiz', 'Erstklässler', 'Bildung'],
  authors: [{ name: 'Schweizer Abenteuerland Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0066cc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de-CH">
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
