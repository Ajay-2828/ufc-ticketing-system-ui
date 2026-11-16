'use client'

import React from 'react'
import { useTicketContext } from '@/context/ticket-context'

/** Severity chip. Name and colour come from the Severity master. */
export function SeverityBadge({ id, prefix = '' }: { id: string; prefix?: string }) {
  const { severities } = useTicketContext()
  const s = severities.find((x) => x.id === id)
  const c = s?.color || '#64748B'
  return (
    <span
      className="badge-tag badge-tag-sm"
      style={{ background: `${c}22`, color: c, border: `1px solid ${c}55`, fontWeight: 700 }}
    >
      {prefix}
      {s?.name || id}
    </span>
  )
}

/** Priority chip. Name and colour come from the Priority master. */
export function PriorityBadge({ id, prefix = '' }: { id: string; prefix?: string }) {
  const { priorities } = useTicketContext()
  const p = priorities.find((x) => x.id === id)
  const c = p?.color || '#64748B'
  return (
    <span
      className="badge-tag badge-tag-sm"
      title={p?.description}
      style={{ background: `${c}22`, color: c, border: `1px solid ${c}55`, fontFamily: 'var(--font-mono)', fontWeight: 800 }}
    >
      {prefix}
      {p?.name || id}
    </span>
  )
}
