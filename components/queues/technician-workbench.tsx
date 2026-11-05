'use client'

import React, { useState } from 'react'
import {
  Briefcase,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Send,
  MoreHorizontal,
} from 'lucide-react'
import { Ticket, TicketStatus } from '@/app/ticket-data'

interface TechnicianWorkbenchProps {
  tickets: Ticket[]
  onSelectTicket: (t: Ticket) => void
  onResolveTicket: (t: Ticket) => void
  onSendTesting: (t: Ticket) => void
}

export function TechnicianWorkbench({
  tickets,
  onSelectTicket,
  onResolveTicket,
  onSendTesting,
}: TechnicianWorkbenchProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')

  const columns: { label: string; status: TicketStatus; color: string }[] = [
    { label: 'Assigned / To Do', status: 'Assigned', color: 'var(--primary)' },
    { label: 'In Progress', status: 'In Progress', color: '#B45309' },
    { label: 'In Testing', status: 'In Testing', color: '#BE185D' },
    { label: 'Resolved (Pending Closure)', status: 'Resolved', color: 'var(--emerald)' },
  ]

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <Briefcase size={14} /> Technical Operations
          </div>
          <h1 className="page-title-main">Technician Workbench</h1>
          <p className="page-desc-sub">
            Manage your assigned workload, track technical progress, request clarifications, and
            submit solutions for QA testing or customer closure.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '3px' }}>
          <button
            type="button"
            className="icon-action-btn"
            style={{
              width: '34px',
              height: '32px',
              border: 'none',
              background: viewMode === 'kanban' ? 'var(--primary-soft)' : 'transparent',
              color: viewMode === 'kanban' ? 'var(--primary)' : 'var(--text-secondary)',
            }}
            onClick={() => setViewMode('kanban')}
            title="Kanban View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            className="icon-action-btn"
            style={{
              width: '34px',
              height: '32px',
              border: 'none',
              background: viewMode === 'list' ? 'var(--primary-soft)' : 'transparent',
              color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-secondary)',
            }}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="kanban-board-container">
          {columns.map((col) => {
            const colTickets = tickets.filter(
              (t) =>
                t.status === col.status ||
                (col.status === 'In Progress' && t.status === 'Awaiting Clarification')
            )

            return (
              <div key={col.status} className="kanban-column-box">
                <div className="kanban-column-header">
                  <div className="kanban-title-label">
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: col.color,
                      }}
                    />
                    {col.label}
                  </div>
                  <span
                    className="nav-badge-count"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    {colTickets.length}
                  </span>
                </div>

                {colTickets.map((t) => (
                  <div
                    key={t.id}
                    className="kanban-ticket-card"
                    onClick={() => onSelectTicket(t)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="ticket-id-link" style={{ fontSize: '12.5px' }}>
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

                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.35 }}>
                      {t.subject}
                    </h4>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {t.app} · {t.department}
                    </div>

                    {t.coAssignee && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#6D28D9' }}>
                        <Users size={12} /> Co-assigned with {t.coAssignee}
                      </div>
                    )}

                    <div
                      style={{
                        paddingTop: '8px',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        className={`sla-badge-box ${
                          t.slaBreached ? 'sla-breached-box' : ''
                        }`}
                        style={{ fontSize: '11px' }}
                      >
                        <Clock size={12} />
                        {t.sla}
                      </span>

                      {/* Quick Action */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {t.status === 'In Progress' && (
                          <button
                            type="button"
                            className="btn-success"
                            style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                            onClick={() => onResolveTicket(t)}
                          >
                            Resolve
                          </button>
                        )}
                        {t.status === 'Assigned' && (
                          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                            Ready to start
                          </span>
                        )}
                        {t.status === 'In Testing' && (
                          <span style={{ fontSize: '11px', color: '#BE185D', fontWeight: 600 }}>
                            QA Testing
                          </span>
                        )}
                        {t.status === 'Resolved' && (
                          <span style={{ fontSize: '11px', color: 'var(--emerald)', fontWeight: 600 }}>
                            Awaiting User
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="modern-card">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Application</th>
                <th>SLA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} onClick={() => onSelectTicket(t)}>
                  <td>
                    <strong className="ticket-id-link">{t.id}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.subject}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {t.department}
                    </div>
                  </td>
                  <td>
                    <span className="badge-tag badge-tag-sm badge-in-progress">
                      {t.status}
                    </span>
                  </td>
                  <td>{t.severity}</td>
                  <td>{t.app}</td>
                  <td>{t.sla}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {t.status === 'In Progress' && (
                      <button
                        className="btn-success"
                        style={{ height: '28px', fontSize: '11.5px', padding: '0 10px' }}
                        onClick={() => onResolveTicket(t)}
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

