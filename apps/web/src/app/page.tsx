import { NavBar } from '@/components/layout/nav-bar'
import { Hero } from '@/components/landing/hero'
import { StatsBar } from '@/components/landing/stats-bar'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { FinalCta } from '@/components/landing/final-cta'
import { LandingPageBackground } from '@/components/backgrounds/landing-page-background'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--color-background)]">
      <LandingPageBackground />

      <div className="relative z-10">
        <NavBar />
        <Hero />
        <StatsBar />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <FinalCta />
        <footer className="border-t border-[var(--color-border)] py-8 px-[var(--app-shell-gutter)] text-center text-sm text-[var(--color-text-tertiary)]">
          <p>© {new Date().getFullYear()} CodeCraft. Built for focused practice.</p>
        </footer>
      </div>
    </div>
  )
}
