'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createBooking, getAvailableSlots } from '@/app/actions/bookings'
import { Calendar, Clock, BookOpen } from 'lucide-react'

export function BookingDialog() {
  const [step, setStep] = useState<'type' | 'date' | 'time' | 'details' | 'success'>('type')
  const [sessionType, setSessionType] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<Date[]>([])
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectType = (type: string) => {
    setSessionType(type)
    setStep('date')
  }

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date)
    setIsLoading(true)
    setError(null)
    try {
      const slots = await getAvailableSlots(date)
      setAvailableSlots(slots)
      setStep('time')
    } catch (err) {
      setError('Failed to load available times')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTime = (time: Date) => {
    setSelectedTime(time)
    setStep('details')
  }

  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedTime || !sessionType) {
      setError('Please complete all steps')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await createBooking(selectedTime, sessionType, duration, topic)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book session')
    } finally {
      setIsLoading(false)
    }
  }

  const sessionTypes = [
    { id: 'sat', label: 'SAT Preparation', icon: '📝' },
    { id: 'gre', label: 'GRE Preparation', icon: '📚' },
    { id: 'engineering', label: 'Engineering Support', icon: '⚙️' },
    { id: 'career', label: 'Career Guidance', icon: '🎯' },
  ]

  const getNextSevenDays = () => {
    const days = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <Card className="w-full max-w-2xl border border-border/40">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary">Book a Session</CardTitle>
        <CardDescription>
          {step === 'type' && 'Choose your session type'}
          {step === 'date' && 'Select your preferred date'}
          {step === 'time' && 'Choose a time slot'}
          {step === 'details' && 'Add session details'}
          {step === 'success' && 'Session booked successfully!'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Session Type */}
        {step === 'type' && (
          <div className="grid gap-3">
            {sessionTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className="p-4 border border-border/40 rounded-lg hover:border-accent hover:bg-secondary/30 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <h3 className="font-semibold text-primary">{type.label}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 'date' && (
          <div className="grid gap-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Select a date</h3>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {getNextSevenDays().map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 rounded-lg text-sm font-medium transition ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'bg-primary text-white'
                      : 'border border-border/40 hover:border-accent text-foreground'
                  }`}
                >
                  <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div>{date.getDate()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 'time' && selectedDate && (
          <div className="grid gap-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">
                Select a time on {formatDate(selectedDate)}
              </h3>
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-foreground/60 mt-2">Loading available times...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.getTime()}
                    onClick={() => handleSelectTime(slot)}
                    className={`p-3 rounded-lg text-sm font-medium transition ${
                      selectedTime?.getTime() === slot.getTime()
                        ? 'bg-primary text-white'
                        : 'border border-border/40 hover:border-accent text-foreground'
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-secondary/30 rounded-lg">
                <p className="text-foreground/60">No available time slots for this date.</p>
                <p className="text-sm text-foreground/40 mt-2">Please choose another date.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Details */}
        {step === 'details' && selectedTime && (
          <div className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <p className="text-sm text-foreground/70 mb-2">Session Details</p>
              <p className="font-semibold text-foreground">
                {formatDate(selectedTime)} at {formatTime(selectedTime)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Topic (optional)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., SAT Math - Algebra"
                className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                <Clock className="w-4 h-4 inline mr-2" />
                Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Session Booked!</h3>
            <p className="text-foreground/70 mb-4">
              A confirmation has been sent to your email. Check your calendar for session details.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => {
              if (step === 'type') return
              if (step === 'date') setStep('type')
              if (step === 'time') {
                setSelectedDate(null)
                setStep('date')
              }
              if (step === 'details') {
                setSelectedTime(null)
                setStep('time')
              }
              if (step === 'success') {
                setStep('type')
                setSessionType('')
                setTopic('')
                setDuration(60)
              }
            }}
          >
            {step === 'success' ? 'Book Another' : 'Back'}
          </Button>

          {step !== 'success' && (
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                if (step === 'type') return
                if (step === 'date' && selectedDate) handleDateSelect(selectedDate)
                if (step === 'time' && selectedTime) handleSelectTime(selectedTime)
                if (step === 'details') handleSubmitBooking()
              }}
              disabled={
                isLoading ||
                (step === 'date' && !selectedDate) ||
                (step === 'time' && !selectedTime) ||
                (step === 'details' && isLoading)
              }
            >
              {isLoading ? 'Loading...' : step === 'details' ? 'Confirm Booking' : 'Next'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
