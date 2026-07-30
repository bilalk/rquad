'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Get all bookings for a user
export async function getUserBookings() {
  const userId = await getUserId()
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(bookings.sessionDate)
}

// Get available time slots for a given date
export async function getAvailableSlots(date: Date) {
  const dateStart = new Date(date)
  dateStart.setHours(0, 0, 0, 0)
  const dateEnd = new Date(date)
  dateEnd.setHours(23, 59, 59, 999)

  const bookedSessions = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.status, 'scheduled'),
        gte(bookings.sessionDate, dateStart),
        lte(bookings.sessionDate, dateEnd)
      )
    )

  // Define available time slots (9 AM to 6 PM, 1-hour sessions)
  const allSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0)
  })

  // Filter out booked slots
  const bookedTimes = new Set(bookedSessions.map(s => s.sessionDate.getTime()))
  const available = allSlots.filter(slot => !bookedTimes.has(slot.getTime()))

  return available
}

// Create a new booking
export async function createBooking(
  sessionDate: Date,
  sessionType: string,
  duration: number,
  topic?: string,
  notes?: string
) {
  const userId = await getUserId()

  // Check if slot is already booked
  const existingBooking = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.userId, userId),
        eq(bookings.sessionDate, sessionDate),
        eq(bookings.status, 'scheduled')
      )
    )

  if (existingBooking.length > 0) {
    throw new Error('This time slot is already booked')
  }

  const id = nanoid()
  const newBooking = await db.insert(bookings).values({
    id,
    userId,
    sessionDate,
    sessionType,
    duration,
    topic,
    notes,
    status: 'scheduled',
  })

  // Send confirmation email
  const session = await auth.api.getSession({ headers: await headers() })
  const userEmail = session?.user?.email

  if (userEmail) {
    try {
      await sendBookingConfirmationEmail(userEmail, {
        date: sessionDate,
        type: sessionType,
        topic: topic || 'General Session',
        duration,
      })
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
    }
  }

  revalidatePath('/dashboard')
  return id
}

// Cancel a booking
export async function cancelBooking(bookingId: string) {
  const userId = await getUserId()

  const booking = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)))

  if (booking.length === 0) {
    throw new Error('Booking not found')
  }

  await db
    .update(bookings)
    .set({ status: 'cancelled' })
    .where(eq(bookings.id, bookingId))

  revalidatePath('/dashboard')
}

// Update booking notes
export async function updateBookingNotes(bookingId: string, notes: string) {
  const userId = await getUserId()

  const booking = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)))

  if (booking.length === 0) {
    throw new Error('Booking not found')
  }

  await db
    .update(bookings)
    .set({ notes, updatedAt: new Date() })
    .where(eq(bookings.id, bookingId))

  revalidatePath('/dashboard')
}

// Helper function to send email confirmation
async function sendBookingConfirmationEmail(
  email: string,
  details: {
    date: Date
    type: string
    topic: string
    duration: number
  }
) {
  // This is a placeholder - in production, integrate with email service like Resend
  // For now, log to console
  console.log(`Booking confirmation email would be sent to: ${email}`)
  console.log(`Session booked: ${details.date.toLocaleString()}`)
  console.log(`Type: ${details.type}, Topic: ${details.topic}, Duration: ${details.duration} min`)

  // TODO: Integrate with email service (Resend, SendGrid, etc.)
  // and send to company11@gmail.com as well
}
