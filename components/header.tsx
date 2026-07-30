'use client'

import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-primary">rquad.pro</h1>
            <p className="text-xs text-muted-foreground">STEM Coaching</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#services" className="text-sm font-medium text-foreground hover:text-primary transition">
            Services
          </Link>
          <Link href="/#about" className="text-sm font-medium text-foreground hover:text-primary transition">
            About
          </Link>
          <Link href="/#resources" className="text-sm font-medium text-foreground hover:text-primary transition">
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-secondary rounded-lg transition"
                title="Sign out"
              >
                <LogOut className="w-5 h-5 text-foreground" />
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Start Learning
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
