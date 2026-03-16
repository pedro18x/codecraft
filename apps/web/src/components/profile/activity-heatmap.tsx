'use client'

import { useMemo, useState } from 'react'
import type { ActivityHeatmap as HeatmapData } from '@/types/api'

interface ActivityHeatmapProps {
  data: HeatmapData
}

const DAY_SIZE = 11
const GAP = 3
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function getIntensity(count: number): number {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  return 3
}

const INTENSITY_COLORS = [
  'var(--zen-surface-2, #2A2724)',
  'rgba(62, 122, 85, 0.35)',
  'rgba(62, 122, 85, 0.6)',
  'var(--zen-accent-jade, #3E7A55)',
]

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatTooltipDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    date: Date
    count: number
  } | null>(null)

  const { grid, monthPositions, totalCount } = useMemo(() => {
    const countMap = new Map(data.days.map((d) => [d.date, d.count]))

    // Rolling 52-week window ending today, weeks start on Sunday (GitHub convention)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Go back to the Sunday of the current week, then 51 more weeks
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - today.getDay() - 51 * 7)

    const cells: Array<{
      date: Date
      dateStr: string
      count: number
      col: number
      row: number
    }> = []
    const months: Array<{ label: string; col: number }> = []
    let lastMonth = -1
    let total = 0

    for (let col = 0; col < 52; col++) {
      for (let row = 0; row < 7; row++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + col * 7 + row)
        if (d > today) break

        const dateStr = toDateStr(d)
        const count = countMap.get(dateStr) ?? 0
        total += count

        // Place month label at the first cell of a new month in this column
        const month = d.getMonth()
        if (month !== lastMonth && row === 0) {
          months.push({ label: MONTH_LABELS[month], col })
          lastMonth = month
        }

        cells.push({ date: d, dateStr, count, col, row })
      }
    }

    return { grid: cells, monthPositions: months, totalCount: total }
  }, [data])

  const LEFT_PADDING = 28
  const TOP_PADDING = 22
  const svgWidth = LEFT_PADDING + 52 * (DAY_SIZE + GAP)
  const svgHeight = TOP_PADDING + 7 * (DAY_SIZE + GAP)

  return (
    <div>
      <p className="text-xs text-[var(--color-text-tertiary)] mb-3">
        <span className="font-semibold text-[var(--color-text-primary)]">{totalCount}</span>
        {' '}submission{totalCount !== 1 ? 's' : ''} in the last year
      </p>

      <div className="relative overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Month labels */}
          {monthPositions.map((m) => (
            <text
              key={`${m.label}-${m.col}`}
              x={LEFT_PADDING + m.col * (DAY_SIZE + GAP)}
              y={TOP_PADDING - 6}
              fill="var(--zen-text-secondary, #9E9890)"
              fontSize={10}
              fontFamily="var(--font-display)"
            >
              {m.label}
            </text>
          ))}

          {/* Day-of-week labels */}
          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={label}
                x={LEFT_PADDING - 4}
                y={TOP_PADDING + i * (DAY_SIZE + GAP) + DAY_SIZE - 2}
                fill="var(--zen-text-tertiary, #6B665F)"
                fontSize={9}
                fontFamily="var(--font-display)"
                textAnchor="end"
              >
                {label}
              </text>
            ) : null
          )}

          {/* Day cells */}
          {grid.map((cell) => (
            <rect
              key={cell.dateStr}
              x={LEFT_PADDING + cell.col * (DAY_SIZE + GAP)}
              y={TOP_PADDING + cell.row * (DAY_SIZE + GAP)}
              width={DAY_SIZE}
              height={DAY_SIZE}
              rx={2}
              fill={INTENSITY_COLORS[getIntensity(cell.count)]}
              style={{ cursor: 'default' }}
              onMouseEnter={(e) => {
                const svg = (e.target as SVGElement).ownerSVGElement
                if (!svg) return
                const svgRect = svg.getBoundingClientRect()
                setTooltip({
                  x: (e as unknown as React.MouseEvent).clientX - svgRect.left,
                  y: (e as unknown as React.MouseEvent).clientY - svgRect.top - 44,
                  date: cell.date,
                  count: cell.count,
                })
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 px-2.5 py-1.5 rounded text-xs whitespace-nowrap"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              background: 'var(--zen-surface-3, #353230)',
              color: 'var(--zen-text-primary, #E8E4DF)',
              border: '1px solid var(--glass-border)',
              transform: 'translateX(-50%)',
            }}
          >
            <span className="font-semibold">
              {tooltip.count} submission{tooltip.count !== 1 ? 's' : ''}
            </span>
            <span className="ml-1.5 opacity-60">on {formatTooltipDate(tooltip.date)}</span>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 justify-end text-[10px] text-[var(--color-text-tertiary)]">
          <span>Less</span>
          {INTENSITY_COLORS.map((color, i) => (
            <div key={i} className="w-3 h-3 rounded-[2px]" style={{ background: color }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
