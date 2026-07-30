import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM "user" WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return Response.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = nanoid()
    const result = await pool.query(
      `INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [userId, name, email, false]
    )

    const user = result.rows[0]

    // Store hashed password in credential table
    const credentialId = nanoid()
    await pool.query(
      `INSERT INTO "credential" (id, "userId", password, "createdAt")
       VALUES ($1, $2, $3, NOW())`,
      [credentialId, userId, hashedPassword]
    )

    // Create session
    const sessionId = nanoid()
    await pool.query(
      `INSERT INTO "session" (id, "userId", "expiresAt", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [sessionId, userId, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    )

    // Set session cookie
    const response = Response.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name }
    })
    response.headers.set(
      'Set-Cookie',
      `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    )
    return response
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
