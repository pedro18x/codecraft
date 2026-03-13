import { PixelBlast } from '@/components/backgrounds/pixel-blast'

const PIXEL_BLAST_ACCENT = '#3E7A55'
const PIXEL_BLAST_ACCENT_WASH = 'rgba(62, 122, 85, 0.16)'

export function LandingPageBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <PixelBlast
        variant="square"
        pixelSize={3}
        color={PIXEL_BLAST_ACCENT}
        patternScale={2}
        patternDensity={1}
        enableRipples
        rippleSpeed={0.3}
        rippleThickness={0.1}
        rippleIntensityScale={1}
        speed={0.5}
        transparent
        edgeFade={0.5}
        className="size-full opacity-50 sm:opacity-60"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 50% 16%, ${PIXEL_BLAST_ACCENT_WASH}, transparent 36%), linear-gradient(180deg, rgba(23, 22, 20, 0.05) 0%, rgba(23, 22, 20, 0.16) 34%, rgba(23, 22, 20, 0.34) 100%)`,
        }}
      />
    </div>
  )
}
