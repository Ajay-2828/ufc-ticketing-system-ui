'use client'

import React from 'react'
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Share2,
  XCircle,
  ChevronRight,
} from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ApprovalQueueProps {
  tickets: Ticket[]
  onSelectTicket: (t: Ticket) => void
  onApproveTicket: (t: Ticket) => void
  onRejectTicket: (t: Ticket) => void
  onReferTicket: (t: Ticket) => void
}

export function ApprovalQueue({
  tickets,
  onSelectTicket,
  onApproveTicket,
  onRejectTicket,
  onReferTicket,
}: ApprovalQueueProps) {
  const pendingTickets = tickets.filter((t) => t.status === 'Pending Approval')

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <ShieldCheck size={14} /> Department Head Governance
          </div>
          <h1 className="page-title-main">HOD Approval Queue</h1>
          <p className="page-desc-sub">
            Review and authorize IT requests from your department before they are routed to the
            administration team.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-box-card">
          <div className="kpi-head-row">
            <span className="kpi-label-text">Awaiting Your Approval</span>
            <div className="kpi-icon-pill" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value-number">{pendingTickets.length}</div>
          <div className="kpi-sub-trend">Action required within SLA limit</div>
        </div>

        <div className="kpi-box-card">
          <div className="kpi-head-row">
            <span className="kpi-label-text">Average Approval Turnaround</span>
            <div className="kpi-icon-pill" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value-number">1h 42m</div>
          <div className="kpi-sub-trend trend-up">Under the 4h policy threshold</div>
        </div>

        <div className="kpi-box-card">
          <div className="kpi-head-row">
            <span className="kpi-label-text">Department Compliance Rate</span>
            <div className="kpi-icon-pill" style={{ background: '#ECFDF5', color: '#047857' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value-number">98.4%</div>
          <div className="kpi-sub-trend trend-up">+1.2% this quarter</div>
        </div>
      </div>

      {/* Queue Card */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h3 className="card-title-lg">Pending Department Authorizations</h3>
            <p className="card-subtitle-sm">
              If not approved within the configured SLA time limit, the end user is automatically
              alerted and the ticket escalates to Admin.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {pendingTickets.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 12px', color: 'var(--emerald)' }} />
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>
                All Clear! No Pending Approvals
              </h3>
              <p style={{ margin: 0, fontSize: '13px' }}>
                All department requests have been processed.
              </p>
            </div>
          ) : (
            pendingTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTicket(t)}
                style={{
                  padding: '18px 22px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="ticket-id-link" style={{ fontSize: '13.5px' }}>
                      {t.id}
                    </span>
                    <span
                      className="badge-tag badge-tag-sm"
                      style={{
                        background: t.severity === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                        color: t.severity === 'Critical' ? '#B91C1C' : '#B45309',
                      }}
                    >
                      {t.severity} Severity
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Application: <b>{t.app}</b>
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {t.subject}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Submitted by <b>{t.creator}</b> ({t.department}) · {t.created}
                  </p>
                </div>

                {/* HOD Timer */}
                <div style={{ textAlign: 'right', minWidth: '140px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--amber)', textTransform: 'uppercase', fontWeight: 700 }}>
                    HOD Time Limit
                  </span>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <Clock size={14} />
                    {t.hodTimeRemaining || '02:00:00'}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ height: '34px', fontSize: '12.5px', padding: '0 12px' }}
                    onClick={() => onReferTicket(t)}
                  >
                    <Share2 size={13} /> Refer
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    style={{ height: '34px', fontSize: '12.5px', padding: '0 12px' }}
                    onClick={() => onRejectTicket(t)}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="btn-success"
                    style={{ height: '34px', fontSize: '12.5px', padding: '0 14px' }}
                    onClick={() => onApproveTicket(t)}
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                </div>

                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

