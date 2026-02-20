'use client'

interface ShinyTextProps {
  text: string
  className?: string
  speed?: number
}

export function ShinyText({ text, className = '', speed = 3 }: ShinyTextProps) {
  return (
    <span
      className={className}
      style={{
        backgroundImage:
          'linear-gradient(120deg, currentColor 40%, rgba(255,255,255,0.85) 50%, currentColor 60%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: `shiny-sweep ${speed}s linear infinite`,
        display: 'inline',
      }}
    >
      {text}
      <style>{`
        @keyframes shiny-sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </span>
  )
}
