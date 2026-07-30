import { pool } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return Response.json({ error: 'No session' }, { status: 401 })
    }

    // Get session from database
    const sessionResult = await pool.query(
      'SELECT "userId" FROM "session" WHERE id = $1 AND "expiresAt" > NOW()',
      [sessionId]
    )

    if (sessionResult.rows.length === 0) {
      return Response.json({ error: 'Invalid session' }, { status: 401 })
    }

    const userId = sessionResult.rows[0].userId

    // Get user data
    const userResult = await pool.query(
      'SELECT id, email, name FROM "user" WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 401 })
    }

    const user = userResult.rows[0]

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('[v0] Session check error:', error)
    return Response.json({ error: 'Session check failed' }, { status: 500 })
  }
}
