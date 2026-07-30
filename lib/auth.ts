import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

const isProd = process.env.NODE_ENV === 'production'

const defaultBaseUrl =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.V0_RUNTIME_URL
    ? process.env.V0_RUNTIME_URL
    : process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : 'http://localhost:3000')

const defaultTrustedOrigins = [
  ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
    : []),
]

// In development (without a preview iframe) we prefer lax cookies and secure=false so
// local http://localhost:3000 works. For preview/deployed environments that require
// cross-site cookies (v0 preview iframe, production), use sameSite:none and secure:true.
const defaultCookieAttributes =
  process.env.V0_RUNTIME_URL || isProd
    ? { sameSite: 'none' as const, secure: true }
    : { sameSite: 'lax' as const, secure: false }

export const auth = betterAuth({
  database: pool,
  baseURL: defaultBaseUrl,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: defaultTrustedOrigins,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    defaultCookieAttributes,
  },
})

export default auth
