'use client'

import React from 'react'
import {
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ChangeManagementProps {
  tickets: Ticket[]
  onSelectTicket: (t: Ticket) => void
  onApproveCR: (t: Ticket) => void
  onRejectCR: (t: Ticket) => void
}

export function ChangeManagement({
  tickets,
  onSelectTicket,
  onApproveCR,
  onRejectCR,
}: ChangeManagementProps) {
  const changeRequests = tickets.filter((t) => t.type === 'Change Request')

  const stages = [
    { title: '1. Admin Review', count: 1, active: false },
    { title: '2. HOD Approval', count: 1, active: false },
    { title: '3. Management Approval', count: 2, active: true },
    { title: '4. Implementation', count: 1, active: false },
    { title: '5. QA Testing', count: 1, active: false },
    { title: '6. Verification & Closure', count: 0, active: false },
  ]

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow" style={{ color: 'var(--purple)' }}>
            <GitBranch size={14} /> Section 3.6 Change Governance
          </div>
          <h1 className="page-title-main">Change Request Management</h1>
          <p className="page-desc-sub">
            Review architectural modifications, core system upgrades, and partner firewall rules
            through the formal 6-stage UFC Change Governance lifecycle.
          </p>
        </div>
      </div>

      {/* Change Request Pipeline Visualizer */}
      <div className="modern-card" style={{ padding: '20px 24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>
          Change Request Workflow Lifecycle (Section 3.6)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
          {stages.map((st, i) => (
            <div
              key={st.title}
              style={{
                background: st.active ? 'var(--primary-soft)' : 'var(--surface-subtle)',
                border: st.active ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '10px',
                padding: '12px 14px',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '11px', color: st.active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                STAGE {i + 1}
              </span>
              <strong style={{ fontSize: '12.5px', color: 'var(--text-main)', display: 'block', lineHeight: 1.3 }}>
                {st.title.replace(/^\d+\.\s*/, '')}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Management Decision Queue */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h3 className="card-title-lg">Change Packages Requiring Management Decision</h3>
            <p className="card-subtitle-sm">
              Review impact analysis, security compliance, and rollback plan before authorizing
              production execution.
            </p>
          </div>
        </div>

        <div>
          {changeRequests.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTicket(t)}
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="ticket-id-link" style={{ fontSize: '14px' }}>
                    {t.id}
                  </span>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#F5F3FF', color: '#6D28D9' }}>
                    Change Request
                  </span>
                  <span className="badge-tag badge-tag-sm badge-high">
                    {t.severity} Impact
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    System: <b>{t.app}</b> · Dept: <b>{t.department}</b>
                  </span>
                </div>

                <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {t.subject}
                </h4>

                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {t.description}
                </p>

                {t.dynamicFields?.changeWindow && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#4338CA', background: '#EEF2FF', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                    <b>Maintenance Window:</b> {t.dynamicFields.changeWindow}
                  </div>
                )}
              </div>

              {/* Management Decision Actions */}
              <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn-danger"
                  style={{ height: '36px', fontSize: '13px' }}
                  onClick={() => onRejectCR(t)}
                >
                  <XCircle size={15} /> Reject Change
                </button>
                <button
                  type="button"
                  className="btn-success"
                  style={{ height: '36px', fontSize: '13px' }}
                  onClick={() => onApproveCR(t)}
                >
                  <CheckCircle2 size={15} /> Authorize Implementation
                </button>
              </div>

              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

