'use client'

import React, { useState } from 'react'
import {
  Building2,
  Clock,
  CheckCircle2,
  Upload,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Send,
} from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface VendorPortalProps {
  tickets: Ticket[]
  onSelectTicket: (t: Ticket) => void
  onResolveTicket: (t: Ticket) => void
}

export function VendorPortal({
  tickets,
  onSelectTicket,
  onResolveTicket,
}: VendorPortalProps) {
  // Vendor Isolation: Only tickets where vendor is TechServe or assigned
  const vendorTickets = tickets.filter(
    (t) =>
      t.vendor === 'TechServe Ltd' ||
      t.assignee.includes('TechServe') ||
      t.id === 'INC-2024-0832' ||
      t.id === 'INC-2024-0841'
  )

  const [activeTicketId, setActiveTicketId] = useState<string>(vendorTickets[0]?.id || '')
  const [progressUpdate, setProgressUpdate] = useState('')
  const [updatePosted, setUpdatePosted] = useState(false)

  const activeTicket =
    vendorTickets.find((t) => t.id === activeTicketId) || vendorTickets[0]

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!progressUpdate.trim()) return
    setUpdatePosted(true)
    setTimeout(() => {
      setUpdatePosted(false)
      setProgressUpdate('')
    }, 2000)
  }

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow" style={{ color: 'var(--teal)' }}>
            <Building2 size={14} /> Section 3.10 External Partner Gateway
          </div>
          <h1 className="page-title-main">TechServe Vendor Workspace</h1>
          <p className="page-desc-sub">
            Secure partner workspace. Access is strictly isolated to tickets contracted and assigned
            to TechServe Solutions Ltd.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left: Assigned Tickets List */}
        <div className="modern-card">
          <div className="modern-card-header">
            <h3 className="card-title-lg">Assigned Tickets ({vendorTickets.length})</h3>
          </div>
          <div>
            {vendorTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: activeTicketId === t.id ? 'var(--primary-soft)' : 'transparent',
                  borderLeft: activeTicketId === t.id ? '3px solid var(--primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span className="ticket-id-link" style={{ fontSize: '13px' }}>
                    {t.id}
                  </span>
                  <span
                    className="badge-tag badge-tag-sm"
                    style={{
                      background: t.severity === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                      color: t.severity === 'Critical' ? '#B91C1C' : '#B45309',
                    }}
                  >
                    {t.severity}
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {t.subject}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  <span>{t.app}</span>
                  <span className="sla-badge-box" style={{ fontSize: '11.5px' }}>
                    <Clock size={12} /> {t.sla}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Ticket Working Pane */}
        {activeTicket ? (
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="ticket-id-link" style={{ fontSize: '16px' }}>
                    {activeTicket.id}
                  </span>
                  <span className="badge-tag badge-in-progress">{activeTicket.status}</span>
                  <span className="badge-tag badge-high">{activeTicket.severity} Severity</span>
                </div>
                <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800 }}>
                  {activeTicket.subject}
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Assigned by Admin Team · SLA Remaining: <b>{activeTicket.sla}</b>
                </div>
              </div>

              <button
                type="button"
                className="btn-success"
                onClick={() => onResolveTicket(activeTicket)}
              >
                <CheckCircle2 size={16} /> Mark Work Resolved
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                STATEMENT OF WORK / SCOPE
              </h4>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, background: 'var(--surface-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                {activeTicket.description}
              </p>
            </div>

            {/* Vendor Work Progress Update Form */}
            <form onSubmit={handlePostUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#F8FAFC', border: '1px solid var(--border)', padding: '18px', borderRadius: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                Post Work Progress & Evidence (Section 3.10)
              </h4>

              {updatePosted && (
                <div className="alert-card-banner alert-success" style={{ margin: 0, padding: '10px 14px' }}>
                  <CheckCircle2 size={18} />
                  <span>Work update and implementation logs published to ticket timeline!</span>
                </div>
              )}

              <div className="form-field-group">
                <label className="form-field-label">Progress Log / Technical Actions Taken *</label>
                <textarea
                  rows={4}
                  required
                  className="form-textarea-control"
                  placeholder="Describe configuration adjustments, patches applied, or vendor testing completed..."
                  value={progressUpdate}
                  onChange={(e) => setProgressUpdate(e.target.value)}
                />
              </div>

              {/* Upload evidence */}
              <label
                style={{
                  border: '1.5px dashed var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--surface)',
                  cursor: 'pointer',
                }}
              >
                <Upload size={18} color="var(--primary)" />
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--primary)' }}>Upload vendor test evidence</strong> (packet captures, logs, configuration diffs)
                </div>
                <input type="file" style={{ display: 'none' }} />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onSelectTicket(activeTicket)}
                >
                  <MessageSquare size={14} /> Request Clarification
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!progressUpdate.trim()}
                >
                  <Send size={14} /> Post Progress Update
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}

