'use client'

import React from 'react'
import {
  CheckCircle2,
  XCircle,
  FlaskConical,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface TestingQueueProps {
  tickets: Ticket[]
  onSelectTicket: (t: Ticket) => void
  onPassTest: (t: Ticket) => void
  onFailTest: (t: Ticket) => void
}

export function TestingQueue({
  tickets,
  onSelectTicket,
  onPassTest,
  onFailTest,
}: TestingQueueProps) {
  const testingTickets = tickets.filter(
    (t) => t.status === 'In Testing' || t.tester === 'Fatima Al-Zadjali'
  )

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow" style={{ color: '#BE185D' }}>
            <FlaskConical size={14} /> Quality Assurance & Verification (Section 3.11)
          </div>
          <h1 className="page-title-main">Testing & QA Queue</h1>
          <p className="page-desc-sub">
            Validate technical implementations and hotfixes in staging/UAT environments before
            allowing requests to proceed to resolution and customer sign-off.
          </p>
        </div>
      </div>

      {/* KPI Banner */}
      <div className="alert-card-banner alert-success" style={{ marginBottom: '24px' }}>
        <ShieldCheck size={24} style={{ color: 'var(--emerald)' }} />
        <div>
          <strong style={{ fontSize: '14px' }}>Testing SLA & Quality Gate Active</strong>
          <p style={{ margin: '3px 0 0', fontSize: '13px' }}>
            94.8% of verification tasks are completed within target SLA. Passing a test marks the
            ticket Resolved for End User closure. Failing escalates back to the engineer with test logs.
          </p>
        </div>
      </div>

      {/* Testing Table / Card */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h3 className="card-title-lg">Solutions Awaiting Verification</h3>
            <p className="card-subtitle-sm">
              Submitted by internal engineers and vendor consultants.
            </p>
          </div>
        </div>

        <div>
          {testingTickets.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 12px', color: 'var(--emerald)' }} />
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>
                QA Queue is Clear!
              </h3>
              <p style={{ margin: 0, fontSize: '13px' }}>
                No solutions are currently awaiting verification.
              </p>
            </div>
          ) : (
            testingTickets.map((t) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="ticket-id-link" style={{ fontSize: '13.5px' }}>
                      {t.id}
                    </span>
                    <span className="badge-tag badge-tag-sm badge-testing">
                      In QA Testing
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
                  </div>

                  <h4 style={{ margin: '0 0 4px', fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {t.subject}
                  </h4>

                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Application: <b>{t.app}</b> · Implementation by: <b>{t.assignee}</b> · Target Environment: <b>{t.dynamicFields?.environment || 'UAT Staging'}</b>
                  </div>
                </div>

                {/* Tester Actions */}
                <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn-danger"
                    style={{ height: '34px', fontSize: '12.5px', padding: '0 12px' }}
                    onClick={() => onFailTest(t)}
                  >
                    <XCircle size={14} /> Fail & Escalate
                  </button>
                  <button
                    type="button"
                    className="btn-success"
                    style={{ height: '34px', fontSize: '12.5px', padding: '0 14px' }}
                    onClick={() => onPassTest(t)}
                  >
                    <CheckCircle2 size={14} /> Pass Verification
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

