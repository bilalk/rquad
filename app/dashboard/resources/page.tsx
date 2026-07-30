'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, ExternalLink, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { getAllResources } from '@/app/actions/resources'

interface Resource {
  id: string
  title: string
  description: string | null
  resourceType: string
  subject: string | null
  url: string | null
  createdAt: Date
}

export default function ResourcesPage() {
  const { data: session, isPending } = useSession()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  useEffect(() => {
    if (!isPending && !session?.user) {
      redirect('/sign-in')
    }
  }, [session, isPending])

  useEffect(() => {
    async function fetchResources() {
      try {
        const data = await getAllResources()
        setResources(data as Resource[])
      } catch (error) {
        console.error('Failed to load resources:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchResources()
    }
  }, [session?.user])

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const subjects = Array.from(new Set(resources.map((r) => r.subject).filter(Boolean)))
  const filteredResources = selectedSubject ? resources.filter((r) => r.subject === selectedSubject) : resources

  const resourceTypeColors: Record<string, string> = {
    guide: 'bg-blue-100 text-blue-800',
    video: 'bg-purple-100 text-purple-800',
    article: 'bg-green-100 text-green-800',
    practice: 'bg-orange-100 text-orange-800',
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">
            Learning Resources
          </h1>
          <p className="text-lg text-foreground/70">
            Explore our curated collection of study materials and guides
          </p>
        </div>

        {/* Subject Filter */}
        {subjects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-3">Filter by Subject</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubject(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedSubject === null
                    ? 'bg-primary text-white'
                    : 'border border-border/40 text-foreground hover:border-accent'
                }`}
              >
                All Resources
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedSubject === subject
                      ? 'bg-primary text-white'
                      : 'border border-border/40 text-foreground hover:border-accent'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resources Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground/60 mt-2">Loading resources...</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="border border-border/40 hover:border-accent/50 transition overflow-hidden flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    {resource.resourceType && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          resourceTypeColors[resource.resourceType] ||
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {resource.resourceType}
                      </span>
                    )}
                  </div>
                  <CardTitle className="font-serif text-lg text-primary">
                    {resource.title}
                  </CardTitle>
                  {resource.subject && (
                    <CardDescription className="text-xs uppercase tracking-wide">
                      {resource.subject}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  {resource.description && (
                    <p className="text-sm text-foreground/70 mb-4">{resource.description}</p>
                  )}
                </CardContent>
                {resource.url && (
                  <div className="px-6 py-4 border-t border-border/40">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition font-medium"
                    >
                      Access Resource
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary/30 rounded-lg">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Resources Yet</h3>
            <p className="text-foreground/70">
              Resources will be added as we build out the learning library. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
