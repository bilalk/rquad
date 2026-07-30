'use client'

import { Header } from '@/components/header'
import { BookingDialog } from '@/components/booking-dialog'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function BookSessionPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">
            Book Your Session
          </h1>
          <p className="text-lg text-foreground/70">
            Choose your preferred date and time for a personalized STEM coaching session with Hafsa.
          </p>
        </div>

        <div className="flex justify-center">
          <BookingDialog />
        </div>
      </div>
    </main>
  )
}
