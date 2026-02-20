import { NavBar } from '@/components/layout/nav-bar'
import { Hero } from '@/components/landing/hero'
import { StatsBar } from '@/components/landing/stats-bar'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Features } from '@/components/landing/features'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { FinalCta } from '@/components/landing/final-cta'
import { LiquidEther } from '@/components/landing/liquid-ether'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Fixed full-page Liquid Ether fluid background */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh',
        }}
      >
        <LiquidEther
          colors={['#1B4332', '#40916C', '#74C69D']}
          autoDemo={true}
          autoSpeed={0.25}
          autoIntensity={1.8}
          mouseForce={25}
          cursorSize={120}
          resolution={0.4}
          BFECC={true}
        />
      </div>

      {/* Content layers — all above the fixed background */}
      <div className="relative" style={{ zIndex: 1 }}>
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
