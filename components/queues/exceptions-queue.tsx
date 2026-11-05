'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  Clock,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ExceptionsQueueProps {
  tickets: Ticket[]
  onSelectTicket: (t: Ticket) => void
  onAssignTicket: (t: Ticket) => void
  onReferTicket?: (t: Ticket) => void
}

export function ExceptionsQueue({
  tickets,
  onSelectTicket,
  onAssignTicket,
  onReferTicket,
}: ExceptionsQueueProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Reopened' | 'Change Request'>('All')
  const [openMenuTicketId, setOpenMenuTicketId] = useState<string | null>(null)

  // Section 9: Only tickets that left the standard flow appear here:
  // 1. Reopened: an end user reopened a resolved ticket.
  // 2. Change Request: a technician flagged or referred a ticket to Admin, or HOD approval was not required.
  // Normal tickets NEVER appear here.
  const exceptionTickets = tickets.filter((t) => {
    const isReopened = t.status === 'Reopened'
    const isChangeRequest = t.type === 'Change Request' || t.status === 'Admin Review'

    if (!isReopened && !isChangeRequest) return false

    if (activeFilter === 'Reopened') return isReopened
    if (activeFilter === 'Change Request') return isChangeRequest
    return true
  })

  const reopenedCount = tickets.filter((t) => t.status === 'Reopened').length
  const crCount = tickets.filter((t) => t.type === 'Change Request' || t.status === 'Admin Review').length
  const totalExceptions = reopenedCount + crCount

  return (
    <div>
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow" style={{ color: 'var(--rose)' }}>
            <ShieldAlert size={14} /> Section 9 · Exception Governance Queue
          </div>
          <h1 className="page-title-main">Admin Queue (Exceptions)</h1>
          <p className="page-desc-sub">
            Contains only non-standard tickets: Reopened items rejected by users, and architectural Change Requests awaiting review. Normal tickets never appear here.
          </p>
        </div>
      </div>

      {/* Filter Chips (Section 9: All, Reopened, Change Request with counts) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setActiveFilter('All')}
          style={{
            height: '36px',
            padding: '0 16px',
            fontSize: '13px',
            borderRadius: '20px',
            border: activeFilter === 'All' ? '1px solid var(--primary)' : '1px solid var(--border)',
            background: activeFilter === 'All' ? 'var(--primary-soft)' : 'var(--surface)',
            color: activeFilter === 'All' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeFilter === 'All' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          All Exceptions ({totalExceptions})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('Reopened')}
          style={{
            height: '36px',
            padding: '0 16px',
            fontSize: '13px',
            borderRadius: '20px',
            border: activeFilter === 'Reopened' ? '1px solid var(--rose)' : '1px solid var(--border)',
            background: activeFilter === 'Reopened' ? '#FEF2F2' : 'var(--surface)',
            color: activeFilter === 'Reopened' ? '#B91C1C' : 'var(--text-secondary)',
            fontWeight: activeFilter === 'Reopened' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Reopened ({reopenedCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('Change Request')}
          style={{
            height: '36px',
            padding: '0 16px',
            fontSize: '13px',
            borderRadius: '20px',
            border: activeFilter === 'Change Request' ? '1px solid var(--purple)' : '1px solid var(--border)',
            background: activeFilter === 'Change Request' ? '#F5F3FF' : 'var(--surface)',
            color: activeFilter === 'Change Request' ? '#6D28D9' : 'var(--text-secondary)',
            fontWeight: activeFilter === 'Change Request' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Change Requests ({crCount})
        </button>
      </div>

      {/* Exceptions Table (Section 9) */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h3 className="card-title-lg">Active Exception Items</h3>
            <p className="card-subtitle-sm">
              Rows near SLA breach display an urgent red left border.
            </p>
          </div>
        </div>

        <div>
          {exceptionTickets.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 12px', color: 'var(--emerald)' }} />
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--text-main)', fontWeight: 700 }}>
                No active exceptions!
              </h3>
              <p style={{ margin: 0, fontSize: '13px' }}>
                All standard tickets are progressing smoothly along their automated routing paths.
              </p>
            </div>
          ) : (
            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Status Badge</th>
                    <th>Raised by / Sent by</th>
                    <th>Waiting For</th>
                    <th>SLA Timer Bar</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exceptionTickets.map((ticket, idx) => {
                    const isReopened = ticket.status === 'Reopened'
                    const isNearBreach = ticket.slaBreached || idx === 0 // Simulate urgent alert for near breach
                    // Waiting for hours calculation mock
                    const waitingHours = isReopened ? 5.2 : 2.5
                    const waitingColor =
                      waitingHours > 8 ? 'var(--rose)' : waitingHours > 4 ? 'var(--amber)' : 'var(--text-secondary)'

                    return (
                      <tr
                        key={ticket.id}
                        style={{
                          borderLeft: isNearBreach ? '4px solid var(--rose)' : '4px solid transparent',
                          background: isNearBreach ? '#FEF2F208' : 'transparent',
                        }}
                      >
                        {/* Ticket Column */}
                        <td>
                          <div
                            onClick={() => onSelectTicket(ticket)}
                            style={{ cursor: 'pointer' }}
                          >
                            <code style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>
                              {ticket.id}
                            </code>
                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)', marginTop: '2px' }}>
                              {ticket.subject}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              {ticket.app} &bull; {ticket.department}
                            </div>
                          </div>
                        </td>

                        {/* Status Badge (Reopened red, Change Request purple) */}
                        <td>
                          {isReopened ? (
                            <span
                              className="badge-tag badge-tag-sm"
                              style={{ background: '#FEF2F2', color: '#B91C1C', fontWeight: 700 }}
                            >
                              Reopened
                            </span>
                          ) : (
                            <span
                              className="badge-tag badge-tag-sm"
                              style={{ background: '#F5F3FF', color: '#6D28D9', fontWeight: 700 }}
                            >
                              Change Request
                            </span>
                          )}
                        </td>

                        {/* Raised by or Sent by */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              className="user-avatar-circle avatar-indigo"
                              style={{ width: '26px', height: '26px', fontSize: '11px' }}
                            >
                              {ticket.creatorAvatar || ticket.creator.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-main)' }}>
                                {ticket.creator}
                              </strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {ticket.creatorRole || 'User'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Waiting For (amber after 4h, red after 8h) */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} color={waitingColor} />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: waitingColor }}>
                              {waitingHours}h
                            </span>
                          </div>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {waitingHours > 4 ? 'Awaiting Admin Action' : 'In Triage'}
                          </span>
                        </td>

                        {/* SLA Bar */}
                        <td>
                          <div style={{ width: '130px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                              <span style={{ color: isNearBreach ? 'var(--rose)' : 'var(--text-muted)', fontWeight: 600 }}>
                                {isNearBreach ? '15m Left' : ticket.sla}
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: isNearBreach ? '90%' : '55%',
                                  height: '100%',
                                  background: isNearBreach ? 'var(--rose)' : 'var(--amber)',
                                  borderRadius: '3px',
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Action: Reopened -> Reassign, Change Request -> Review */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', position: 'relative' }}>
                            {isReopened ? (
                              <button
                                type="button"
                                className="btn-primary"
                                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
                                onClick={() => onAssignTicket(ticket)}
                              >
                                <UserCheck size={13} /> Reassign
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn-primary"
                                style={{ height: '32px', fontSize: '12px', padding: '0 12px', background: '#7C3AED' }}
                                onClick={() => onSelectTicket(ticket)}
                              >
                                Review CR
                              </button>
                            )}

                            {/* Dropdown Menu (Section 9: Refer to department, Forward to vendor, Request clarification) */}
                            <button
                              type="button"
                              className="icon-action-btn"
                              style={{ width: '32px', height: '32px' }}
                              onClick={() =>
                                setOpenMenuTicketId(openMenuTicketId === ticket.id ? null : ticket.id)
                              }
                            >
                              <MoreHorizontal size={15} />
                            </button>

                            {openMenuTicketId === ticket.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  zIndex: 50,
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border)',
                                  borderRadius: '10px',
                                  boxShadow: 'var(--shadow-xl)',
                                  padding: '6px',
                                  width: '190px',
                                  textAlign: 'left',
                                }}
                              >
                                <button
                                  type="button"
                                  style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    textAlign: 'left',
                                    fontSize: '12.5px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    setOpenMenuTicketId(null)
                                    onReferTicket?.(ticket)
                                  }}
                                >
                                  Refer to Department
                                </button>
                                <button
                                  type="button"
                                  style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    textAlign: 'left',
                                    fontSize: '12.5px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    setOpenMenuTicketId(null)
                                    onSelectTicket(ticket)
                                  }}
                                >
                                  Forward to Vendor
                                </button>
                                <button
                                  type="button"
                                  style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    textAlign: 'left',
                                    fontSize: '12.5px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => {
                                    setOpenMenuTicketId(null)
                                    onSelectTicket(ticket)
                                  }}
                                >
                                  Request Clarification
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
