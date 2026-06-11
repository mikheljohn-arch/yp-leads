import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YP Leads — Yellow Pages Lead Generator',
  description: 'Capture and manage business leads from Yellow Pages Australia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
