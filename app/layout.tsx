import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/components/ModalProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JARVIS',
  description: 'Generative AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
