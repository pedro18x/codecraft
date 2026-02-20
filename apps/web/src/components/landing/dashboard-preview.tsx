'use client'

import { motion } from 'framer-motion'

// ── Token shorthands ──────────────────────────────────────────────────────────
const kw  = 'var(--zen-accent-slate)'   // keywords: function, const, for, of, if, return
const ty  = 'var(--zen-accent-amber)'   // type annotations
const fn  = 'var(--zen-accent-jade)'    // function / built-in names
const id  = 'var(--zen-text-primary)'   // identifiers
const num = 'var(--zen-accent-rust)'    // numeric literals
const cm  = 'var(--zen-text-tertiary)'  // comments

// ── TypeScript code for "Merge Intervals" ─────────────────────────────────────
// Each tuple: [text, colour | null (inherit)]
type Seg = [string, string | null]
type Line = Seg[]

const CODE_LINES: Line[] = [
  // 1  function merge(intervals: number[][]): number[][] {
  [[' function ', kw], [' merge', fn], ['(', null], ['intervals', id], [': ', null], ['number[][]', ty], ['): ', null], ['number[][]', ty], [' {', null]],
  // 2    intervals.sort((a, b) => a[0] - b[0]);
  [['  ', null], ['  intervals', id], ['.', null], ['sort', fn], ['((', null], ['a', id], [', ', null], ['b', id], [') => ', null], ['a', id], ['[', null], ['0', num], ['] - ', null], ['b', id], ['[', null], ['0', num], [']);', null]],
  // 3    const merged: number[][] = [intervals[0]];
  [['  ', null], ['  ', null], ['const', kw], [' merged', id], [': ', null], ['number[][]', ty], [' = [', null], ['intervals', id], ['[', null], ['0', num], [']];', null]],
  // 4  (blank)
  [['', null]],
  // 5    for (const [start, end] of intervals.slice(1)) {
  [['  ', null], ['  ', null], ['for', kw], [' (', null], ['const', kw], [' [start, end] ', null], ['of', kw], [' intervals.', null], ['slice', fn], ['(', null], ['1', num], [')) {', null]],
  // 6      const last = merged[merged.length - 1];
  [['  ', null], ['    ', null], ['const', kw], [' last', id], [' = ', null], ['merged', id], ['[merged.length - ', null], ['1', num], ['];', null]],
  // 7      if (start <= last[1]) {
  [['  ', null], ['    ', null], ['if', kw], [' (', null], ['start', id], [' <= ', null], ['last', id], ['[', null], ['1', num], [']) {', null]],
  // 8        last[1] = Math.max(last[1], end);
  [['  ', null], ['      ', null], ['last', id], ['[', null], ['1', num], ['] = ', null], ['Math', id], ['.', null], ['max', fn], ['(', null], ['last', id], ['[', null], ['1', num], ['], ', null], ['end', id], [');', null]],
  // 9      } else {
  [['  ', null], ['    ', null], ['} ', null], ['else', kw], [' {', null]],
  // 10       merged.push([start, end]);
  [['  ', null], ['      ', null], ['merged', id], ['.', null], ['push', fn], ['([', null], ['start', id], [', ', null], ['end', id], [']);', null]],
  // 11     }
  [['  ', null], ['    }', null]],
  // 12   }
  [['  ', null], ['  }', null]],
  // 13 (blank)
  [['', null]],
  // 14   return merged;
  [['  ', null], ['  ', null], ['return', kw], [' merged', id], [';', null]],
]

export function DashboardPreview() {
  return (
    <section className="py-20 px-[var(--app-shell-gutter)]">
      <div className="max-w-[var(--max-width-content)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-center text-sm font-medium text-[var(--color-text-tertiary)] uppercase tracking-widest mb-6">
            The practice interface
          </p>

          {/* Browser chrome wrapper */}
          <div
            className="max-w-4xl mx-auto rounded-[var(--radius-xl)] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-brutal-lg)', border: '1px solid var(--color-border)' }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: 'var(--color-surface-raised)', borderBottom: '1px solid var(--color-border)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[var(--color-danger)] opacity-80" />
                <div className="w-3 h-3 rounded-full bg-[var(--color-warning)] opacity-80" />
                <div className="w-3 h-3 rounded-full bg-[var(--color-success)] opacity-80" />
              </div>
              <div
                className="flex-1 flex items-center px-3 py-1 rounded-full text-xs text-[var(--color-text-tertiary)]"
                style={{ background: 'var(--color-surface)', maxWidth: '220px', margin: '0 auto' }}
              >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" className="mr-1.5 opacity-50" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9A4 4 0 1 1 13 9a4 4 0 0 1-8 0zm4-6a6 6 0 1 0 3.9 10.607l3.547 3.546a1 1 0 0 0 1.414-1.414l-3.546-3.547A6 6 0 0 0 9 3z" clipRule="evenodd" />
                </svg>
                codecraft.app/practice
              </div>
            </div>

            {/* Practice top bar */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 text-xs"
              style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}
            >
              <span className="font-semibold text-[var(--color-text-primary)]">Merge Intervals</span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}
              >
                Medium
              </span>
              <div className="flex-1" />
              <span className="text-[var(--color-text-secondary)] cursor-default select-none">← Prev</span>
              <span className="text-[var(--color-text-secondary)] cursor-default select-none">Next →</span>
              <span className="text-[var(--color-text-secondary)] cursor-default select-none">Focus</span>
            </div>

            {/* Split-pane body */}
            <div className="flex" style={{ background: 'var(--color-background)', minHeight: '380px' }}>

              {/* ── Left panel: problem description ───────────────────── */}
              <div
                className="overflow-hidden flex flex-col p-4 gap-3 text-xs"
                style={{ flexBasis: '45%', borderRight: '1.5px solid var(--color-border)', background: 'var(--color-background)' }}
              >
                <p className="text-[var(--color-text-primary)] leading-relaxed">
                  Given an array of <span className="font-mono text-[10px] px-1 rounded" style={{ background: 'var(--color-surface-raised)' }}>intervals</span> where{' '}
                  <span className="font-mono text-[10px] px-1 rounded" style={{ background: 'var(--color-surface-raised)' }}>intervals[i] = [start, end]</span>,
                  merge all overlapping intervals and return an array of the non-overlapping intervals.
                </p>

                {/* Example */}
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)] mb-1.5">Example</p>
                  <div
                    className="rounded p-2.5 font-[family-name:var(--font-mono)] text-[10px] leading-[1.7] space-y-0.5"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    <div>
                      <span style={{ color: cm }}>Input: </span>
                      <span style={{ color: id }}>intervals = [[1,3],[2,6],[8,10]]</span>
                    </div>
                    <div>
                      <span style={{ color: cm }}>Output: </span>
                      <span style={{ color: id }}>[[1,6],[8,10]]</span>
                    </div>
                    <div style={{ color: cm }}>
                      {'// [1,3] and [2,6] overlap → merge to [1,6]'}
                    </div>
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)] mb-1.5">Constraints</p>
                  <ul className="space-y-1 text-[var(--color-text-secondary)]">
                    <li className="font-[family-name:var(--font-mono)] text-[10px]">1 &lt;= intervals.length &lt;= 10⁴</li>
                    <li className="font-[family-name:var(--font-mono)] text-[10px]">intervals[i].length == 2</li>
                  </ul>
                </div>
              </div>

              {/* ── Divider ───────────────────────────────────────────── */}
              <div className="w-1.5 shrink-0" style={{ background: 'var(--color-border)' }} />

              {/* ── Right panel: editor ───────────────────────────────── */}
              <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#1e1e1e' }}>

                {/* Language tabs */}
                <div
                  className="flex items-center gap-0.5 px-2 py-1.5 shrink-0"
                  style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
                >
                  {/* Active tab */}
                  <button
                    className="px-2.5 py-1 rounded text-[10px] font-medium pointer-events-none"
                    style={{ background: 'var(--color-surface-raised)', color: 'var(--color-text-primary)' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    typescript
                  </button>
                  <button
                    className="px-2.5 py-1 rounded text-[10px] pointer-events-none"
                    style={{ color: 'var(--color-text-secondary)' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    javascript
                  </button>
                  <button
                    className="px-2.5 py-1 rounded text-[10px] pointer-events-none"
                    style={{ color: 'var(--color-text-secondary)' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    python
                  </button>
                  <div className="flex-1" />
                  <button
                    className="px-2 py-1 rounded text-[10px] pointer-events-none"
                    style={{ color: 'var(--color-text-secondary)' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    Reset
                  </button>
                </div>

                {/* Editor body: line numbers + code */}
                <div
                  className="flex-1 overflow-hidden flex font-[family-name:var(--font-mono)] text-xs"
                  style={{ background: '#1e1e1e', lineHeight: '1.7' }}
                >
                  {/* Line numbers */}
                  <div
                    className="shrink-0 pt-3 pb-3 pl-3 pr-2 text-right select-none text-[10px]"
                    style={{ color: 'var(--zen-text-tertiary)', minWidth: '28px', background: '#1e1e1e' }}
                    aria-hidden="true"
                  >
                    {CODE_LINES.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Code */}
                  <div className="pt-3 pb-3 pr-4 overflow-hidden text-[10px]" style={{ color: id }}>
                    {CODE_LINES.map((segs, i) => (
                      <div key={i}>
                        {segs.map(([text, colour], j) => (
                          colour
                            ? <span key={j} style={{ color: colour }}>{text}</span>
                            : <span key={j}>{text}</span>
                        ))}
                        {/* keep line height even for blank lines */}
                        {segs.length === 1 && segs[0][0] === '' && <span>&nbsp;</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom bar: Run Tests + results */}
                <div
                  className="shrink-0 px-3 py-2 flex flex-col gap-1.5"
                  style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}
                >
                  {/* Button row */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold pointer-events-none"
                      style={{ background: 'var(--color-primary)', color: 'var(--button-primary-text)' }}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <svg width="8" height="8" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84z" />
                      </svg>
                      Run Tests
                    </button>
                    <span className="text-[10px] text-[var(--color-text-tertiary)]">⌘+Enter</span>
                  </div>

                  {/* Test results */}
                  <div className="flex flex-col gap-1">
                    {/* Test 1 — passed */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px]"
                      style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}
                    >
                      <span className="font-bold">✓</span>
                      <span>Test 1 — passed</span>
                    </div>
                    {/* Test 2 — passed */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px]"
                      style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}
                    >
                      <span className="font-bold">✓</span>
                      <span>Test 2 — passed</span>
                    </div>
                    {/* Test 3 — failed */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px]"
                      style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)' }}
                    >
                      <span className="font-bold">✗</span>
                      <span>Test 3 — <span className="opacity-80">&quot;Expected [[1,6],[8,10]], got [[1,6],[8,10],[15,18]]&quot;</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
