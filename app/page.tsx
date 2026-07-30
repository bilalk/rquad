import { Header } from '@/components/header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Zap, Users, Calendar } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-secondary text-primary text-sm font-medium rounded-full">
                Elite STEM Coaching
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              Master STEM with <span className="text-accent">Guided Independence</span>
            </h1>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Premium coaching for ambitious students pursuing SAT excellence, GRE mastery, and engineering success. 
              Learn from Hafsa Bilal, a LUMS student with A* grades and 1560 SAT score. We empower your mind, not your dependency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/#about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Services
            </h2>
            <p className="text-lg text-foreground/70">
              Comprehensive STEM education tailored to your goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* SAT Preparation */}
            <div className="bg-white p-8 rounded-lg border border-border/40 hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                SAT Mastery
              </h3>
              <p className="text-foreground/70">
                Structured preparation with proven strategies. Target 1500+.
              </p>
            </div>

            {/* GRE Preparation */}
            <div className="bg-white p-8 rounded-lg border border-border/40 hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                GRE Excellence
              </h3>
              <p className="text-foreground/70">
                Graduate-level preparation with data-driven insights.
              </p>
            </div>

            {/* Engineering Support */}
            <div className="bg-white p-8 rounded-lg border border-border/40 hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                Engineering Prep
              </h3>
              <p className="text-foreground/70">
                Math, physics, and chemistry foundations for competitive exams.
              </p>
            </div>

            {/* Career Guidance */}
            <div className="bg-white p-8 rounded-lg border border-border/40 hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-3">
                Career Guidance
              </h3>
              <p className="text-foreground/70">
                Strategic planning for your academic and professional future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent text-sm font-semibold">ABOUT THE COACH</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
                Meet Hafsa Bilal
              </h2>
              <p className="text-foreground/70 mb-4 leading-relaxed">
                With A* grades and a 1560 SAT score, Hafsa brings proven expertise to every session. 
                Currently a LUMS student, she&apos;s passionate about enabling students to become independent learners.
              </p>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Rather than hand-holding, we use AI-enabled tools and structured guidance to help you develop 
                critical thinking skills and problem-solving strategies that transcend individual tests.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Our philosophy: great coaching accelerates your growth without creating dependency. 
                You leave each session stronger and more capable.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-lg border border-border/40">
              <div className="space-y-6">
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-serif font-bold text-primary mb-1">Education</h3>
                  <p className="text-sm text-foreground/70">LUMS • A* Grades • Excellence in STEM</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-serif font-bold text-primary mb-1">SAT Achievement</h3>
                  <p className="text-sm text-foreground/70">1560 Score • 99th Percentile</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-serif font-bold text-primary mb-1">Specialization</h3>
                  <p className="text-sm text-foreground/70">Math • Physics • Chemistry • Test Strategy</p>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-serif font-bold text-primary mb-1">Teaching Style</h3>
                  <p className="text-sm text-foreground/70">AI-Enabled • Student-Centric • Independence-Focused</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 md:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Learning Resources
            </h2>
            <p className="text-lg text-foreground/70">
              Access curated materials and guides for self-directed learning
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-lg border border-border/40 text-center">
            <p className="text-foreground/70 mb-8">
              Sign in to access our growing library of resources, including study guides, 
              practice problems, and curated learning paths.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join Now to Access Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your STEM Journey?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Book your first session today and experience coaching that empowers your independence.
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="text-white font-serif font-bold">R</span>
                </div>
                <span className="font-serif font-bold text-primary">rquad.pro</span>
              </div>
              <p className="text-sm text-foreground/60">
                Premium STEM coaching for ambitious learners.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#services" className="text-foreground/60 hover:text-primary">Services</Link></li>
                <li><Link href="/#about" className="text-foreground/60 hover:text-primary">About</Link></li>
                <li><Link href="/#resources" className="text-foreground/60 hover:text-primary">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sign-in" className="text-foreground/60 hover:text-primary">Sign In</Link></li>
                <li><Link href="/sign-up" className="text-foreground/60 hover:text-primary">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Contact</h4>
              <p className="text-sm text-foreground/60">
                <a href="mailto:company11@gmail.com" className="hover:text-primary">company11@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2024 rquad.pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
