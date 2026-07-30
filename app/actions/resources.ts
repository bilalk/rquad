'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { resources } from '@/lib/db/schema'
import { nanoid } from 'nanoid'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Get all resources
export async function getAllResources() {
  return db.select().from(resources).orderBy(resources.createdAt)
}

// Get resources by subject
export async function getResourcesBySubject(subject: string) {
  return db
    .select()
    .from(resources)
    .where(resources.subject === subject)
    .orderBy(resources.createdAt)
}

// Create a new resource (admin only)
export async function createResource(
  title: string,
  description: string,
  resourceType: string,
  subject: string,
  url?: string
) {
  const userId = await getUserId()
  
  // In a real app, check if user is admin
  // For now, allow any authenticated user to create resources
  
  const id = nanoid()
  await db.insert(resources).values({
    id,
    title,
    description,
    resourceType,
    subject,
    url,
  })

  revalidatePath('/dashboard/resources')
  revalidatePath('/dashboard')
  return id
}

// Delete a resource (admin only)
export async function deleteResource(resourceId: string) {
  const userId = await getUserId()
  
  // Check if user is admin (placeholder - implement proper admin check)
  
  await db.delete(resources).where(resources.id === resourceId)
  
  revalidatePath('/dashboard/resources')
  revalidatePath('/dashboard')
}
