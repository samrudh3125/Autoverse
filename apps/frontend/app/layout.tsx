import { Button } from '@/components/ui/button'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Zap } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Autoverse',
  description: 'Automate your workflow with Autoverse',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        {children}</body>
    </html>
  )
}