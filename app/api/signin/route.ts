import { pool } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Get user
    const userResult = await pool.query('SELECT id FROM "user" WHERE email = $1', [email])
    if (userResult.rows.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const userId = userResult.rows[0].id

    // Get credential
    const credentialResult = await pool.query(
      'SELECT password FROM "credential" WHERE "userId" = $1',
      [userId]
    )

    if (credentialResult.rows.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password
    const storedHash = credentialResult.rows[0].password
    const isValid = await bcrypt.compare(password, storedHash)

    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const sessionId = nanoid()
    await pool.query(
      `INSERT INTO "session" (id, "userId", "expiresAt", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [sessionId, userId, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    )

    // Set session cookie
    const response = Response.json({ success: true })
    response.headers.set(
      'Set-Cookie',
      `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    )
    return response
  } catch (error) {
    console.error('[v0] Signin error:', error)
    return Response.json({ error: 'An error occurred' }, { status: 500 })
  }
}
