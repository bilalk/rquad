'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2 } from 'lucide-react'
import { createResource, getAllResources, deleteResource } from '@/app/actions/resources'

interface Resource {
  id: string
  title: string
  description: string | null
  resourceType: string
  subject: string | null
  url: string | null
  createdAt: Date
}

export default function AdminPage() {
  const { data: session, isPending } = useSession()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'guide',
    subject: 'SAT',
    url: '',
  })

  useEffect(() => {
    if (!isPending && !session?.user) {
      redirect('/sign-in')
    }
  }, [session, isPending])

  useEffect(() => {
    async function loadResources() {
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
      loadResources()
    }
  }, [session?.user])

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      await createResource(
        formData.title,
        formData.description,
        formData.resourceType,
        formData.subject,
        formData.url
      )

      // Reload resources
      const data = await getAllResources()
      setResources(data as Resource[])

      // Reset form
      setFormData({
        title: '',
        description: '',
        resourceType: 'guide',
        subject: 'SAT',
        url: '',
      })
      setShowForm(false)
    } catch (error) {
      alert('Failed to create resource: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      await deleteResource(id)
      setResources(resources.filter((r) => r.id !== id))
    } catch (error) {
      alert('Failed to delete resource')
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">
            Admin Panel
          </h1>
          <p className="text-lg text-foreground/70">
            Manage resources and learning materials
          </p>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="bg-secondary/30 border border-border/40">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-primary">
                Manage Resources
              </h2>
              <Button
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </Button>
            </div>

            {/* Add Resource Form */}
            {showForm && (
              <Card className="border border-border/40">
                <CardHeader>
                  <CardTitle>Create New Resource</CardTitle>
                  <CardDescription>Add a new learning resource to the library</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddResource} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., SAT Math Fundamentals"
                        className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the resource"
                        rows={3}
                        className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Type
                        </label>
                        <select
                          value={formData.resourceType}
                          onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                          className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="guide">Study Guide</option>
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="practice">Practice Problems</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Subject
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="SAT">SAT</option>
                          <option value="GRE">GRE</option>
                          <option value="Math">Math</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="English">English</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        URL (optional)
                      </label>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://example.com/resource"
                        className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Create Resource
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Resources List */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              </div>
            ) : resources.length > 0 ? (
              <div className="grid gap-4">
                {resources.map((resource) => (
                  <Card key={resource.id} className="border border-border/40">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <CardTitle className="font-serif text-primary">
                            {resource.title}
                          </CardTitle>
                          <CardDescription>
                            {resource.subject} • {resource.resourceType}
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                          title="Delete resource"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </CardHeader>
                    {resource.description && (
                      <CardContent>
                        <p className="text-sm text-foreground/70">{resource.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/30 rounded-lg">
                <p className="text-foreground/70">No resources created yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">Settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
