'use client'

import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, BookOpen, FileText, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    // Check if user has a session cookie
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setSession(data)
        } else {
          setSession(null)
        }
      } catch (err) {
        setSession(null)
      } finally {
        setIsPending(false)
      }
    }

    checkSession()
  }, [])

  useEffect(() => {
    if (!isPending && !session?.user) {
      redirect('/sign-in')
    }
  }, [session, isPending])

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">
            Welcome, {session.user.name || session.user.email}
          </h1>
          <p className="text-lg text-foreground/70">
            Your personalized STEM learning dashboard
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="bg-secondary/30 border border-border/40">
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Notes
            </TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-primary">
                Your Sessions
              </h2>
              <Link href="/dashboard/book-session">
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus className="w-4 h-4" />
                  Book Session
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {/* Placeholder for sessions */}
              <Card className="border border-border/40 hover:border-accent/50 transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-primary font-serif">No Sessions Booked Yet</CardTitle>
                      <CardDescription>
                        Book your first session to get started
                      </CardDescription>
                    </div>
                    <span className="px-3 py-1 bg-secondary text-primary text-xs font-medium rounded-full">
                      Getting Started
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 mb-4">
                    Ready to begin your STEM coaching journey? Book a session with Hafsa to discuss your goals and create a personalized learning plan.
                  </p>
                  <Link href="/dashboard/book-session">
                    <Button className="bg-primary hover:bg-primary/90">
                      Book Your First Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-primary">
                Learning Resources
              </h2>
              <Link href="/dashboard/resources">
                <Button variant="outline">
                  View All Resources
                </Button>
              </Link>
            </div>

            <Card className="border border-border/40 text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground/70 mb-4">
                  Access our growing library of study guides, practice problems, and learning materials.
                </p>
                <Link href="/dashboard/resources">
                  <Button className="bg-primary hover:bg-primary/90">
                    Explore Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-primary">
                My Study Notes
              </h2>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Note
              </Button>
            </div>

            <Card className="border border-border/40 text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground/70 mb-4">
                  No notes yet. Start capturing your learning insights!
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  Create Your First Note
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
