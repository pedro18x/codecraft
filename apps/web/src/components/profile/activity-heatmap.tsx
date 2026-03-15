'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ActivityHeatmap as HeatmapData } from '@/types/api'

interface ActivityHeatmapProps {
  data: HeatmapData
  year: number
}

const DAY_SIZE = 12
const GAP = 3
const DAYS_IN_WEEK = 7
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

export function ActivityHeatmap({ data, year }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null)

  const { grid, monthPositions } = useMemo(() => {
    const countMap = new Map(data.days.map((d) => [d.date, d.count]))

    // Build grid: find the first day of the year and its weekday
    const startDate = new Date(`${year}-01-01`)
    const startDay = startDate.getDay() // 0=Sun, 1=Mon, ...

    const endDate = new Date(`${year}-12-31`)
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const cells: Array<{ date: string; count: number; col: number; row: number }> = []
    const months: Array<{ label: string; col: number }> = []
    let lastMonth = -1

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const dayOfWeek = d.getDay()
      const col = Math.floor((i + startDay) / 7)
      const row = dayOfWeek

      const month = d.getMonth()
      if (month !== lastMonth) {
        months.push({ label: MONTH_LABELS[month], col })
        lastMonth = month
      }

      cells.push({
        date: dateStr,
        count: countMap.get(dateStr) ?? 0,
        col,
        row,
      })
    }

    return { grid: cells, monthPositions: months }
  }, [data, year])

  const totalCols = Math.max(...grid.map((c) => c.col)) + 1
  const LEFT_PADDING = 32
  const TOP_PADDING = 20
  const svgWidth = LEFT_PADDING + totalCols * (DAY_SIZE + GAP) + GAP
  const svgHeight = TOP_PADDING + DAYS_IN_WEEK * (DAY_SIZE + GAP) + GAP

  return (
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

        {/* Day labels */}
        {DAY_LABELS.map((label, i) =>
          label ? (
            <text
              key={label}
              x={LEFT_PADDING - 6}
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

        {/* Cells */}
        {grid.map((cell, i) => (
          <motion.rect
            key={cell.date}
            x={LEFT_PADDING + cell.col * (DAY_SIZE + GAP)}
            y={TOP_PADDING + cell.row * (DAY_SIZE + GAP)}
            width={DAY_SIZE}
            height={DAY_SIZE}
            rx={3}
            fill={INTENSITY_COLORS[getIntensity(cell.count)]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.0008, duration: 0.3 }}
            onMouseEnter={(e) => {
              const svg = (e.target as SVGElement).ownerSVGElement
              if (!svg) return
              const rect = svg.getBoundingClientRect()
              setTooltip({
                x: (e as unknown as React.MouseEvent).clientX - rect.left,
                y: (e as unknown as React.MouseEvent).clientY - rect.top - 40,
                date: cell.date,
                count: cell.count,
              })
            }}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            background: 'var(--zen-surface-3, #353230)',
            color: 'var(--zen-text-primary, #E8E4DF)',
            border: '1px solid var(--glass-border)',
            transform: 'translateX(-50%)',
          }}
        >
          <span className="font-semibold">{tooltip.count} submission{tooltip.count !== 1 ? 's' : ''}</span>
          <span className="ml-1.5 opacity-70">{tooltip.date}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 justify-end text-[10px] text-[var(--color-text-tertiary)]">
        <span>Less</span>
        {INTENSITY_COLORS.map((color, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-[2px]"
            style={{ background: color }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
