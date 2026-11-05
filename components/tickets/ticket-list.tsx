'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Plus,
  Clock,
  MoreHorizontal,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react'
import { Ticket, TicketType, TicketStatus, TicketSeverity } from '@/app/ticket-data'

interface TicketListProps {
  tickets: Ticket[]
  title: string
  subtitle: string
  onSelectTicket: (ticket: Ticket) => void
  onOpenCreateModal?: () => void
  createDisabled?: boolean
  createDisabledReason?: string
}

export function TicketList({
  tickets,
  title,
  subtitle,
  onSelectTicket,
  onOpenCreateModal,
  createDisabled,
  createDisabledReason,
}: TicketListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All')
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        searchQuery === '' ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = selectedType === 'All' || t.type === selectedType
      const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus
      const matchesSeverity = selectedSeverity === 'All' || t.severity === selectedSeverity

      return matchesSearch && matchesType && matchesStatus && matchesSeverity
    })
  }, [tickets, searchQuery, selectedType, selectedStatus, selectedSeverity])

  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([])
    } else {
      setSelectedTickets(filteredTickets.map((t) => t.id))
    }
  }

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedTickets.includes(id)) {
      setSelectedTickets(selectedTickets.filter((item) => item !== id))
    } else {
      setSelectedTickets([...selectedTickets, id])
    }
  }

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Pending Approval':
        return 'badge-pending'
      case 'In Progress':
      case 'Assigned':
        return 'badge-in-progress'
      case 'Awaiting Clarification':
        return 'badge-clarification'
      case 'In Testing':
        return 'badge-testing'
      case 'Resolved':
        return 'badge-resolved'
      case 'Closed':
        return 'badge-closed'
      case 'Reopened':
        return 'badge-reopened'
      default:
        return 'badge-in-progress'
    }
  }

  const getSeverityBadge = (sev: TicketSeverity) => {
    switch (sev) {
      case 'Critical':
        return 'badge-critical'
      case 'High':
        return 'badge-high'
      case 'Medium':
        return 'badge-medium'
      case 'Low':
        return 'badge-low'
    }
  }

  return (
    <div>
      {/* Page Heading */}
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <span>UFC Desk Operations</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span>{filteredTickets.length} Requests</span>
          </div>
          <h1 className="page-title-main">{title}</h1>
          <p className="page-desc-sub">{subtitle}</p>
        </div>

        {onOpenCreateModal && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn-primary"
              disabled={createDisabled}
              onClick={onOpenCreateModal}
              title={createDisabled ? createDisabledReason : undefined}
            >
              <Plus size={16} /> New Request
            </button>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="modern-card">
        {/* Table Toolbar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Search */}
          <div className="search-input-box" style={{ width: '280px' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by ID, subject, engineer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Segmented Controls */}
          <div style={{ display: 'flex', background: 'var(--surface-muted)', padding: '3px', borderRadius: '8px' }}>
            {['All', 'Incident', 'Service Request', 'Change Request'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: selectedType === type ? 600 : 500,
                  background: selectedType === type ? 'var(--surface)' : 'transparent',
                  color: selectedType === type ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: selectedType === type ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Severity & Status Dropdowns */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="form-input-control"
              style={{ width: 'auto', height: '36px', fontSize: '12.5px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="In Progress">In Progress</option>
              <option value="In Testing">In Testing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Reopened">Reopened</option>
            </select>

            <select
              className="form-input-control"
              style={{ width: 'auto', height: '36px', fontSize: '12.5px' }}
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '20px' }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredTickets.length > 0 &&
                      selectedTickets.length === filteredTickets.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Ticket ID</th>
                <th>Subject & Department</th>
                <th>Type</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Application</th>
                <th>Assignee</th>
                <th>SLA Countdown</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No tickets match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const isChecked = selectedTickets.includes(t.id)
                  return (
                    <tr key={t.id} onClick={() => onSelectTicket(t)}>
                      <td style={{ paddingLeft: '20px' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => toggleSelectOne(t.id, e as never)}
                        />
                      </td>
                      <td>
                        <strong className="ticket-id-link">{t.id}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {t.created}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.subject}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {t.department} · By {t.creator}
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge-tag badge-tag-sm"
                          style={{
                            background:
                              t.type === 'Change Request'
                                ? '#F5F3FF'
                                : t.type === 'Service Request'
                                ? '#F0FDF4'
                                : '#EFF6FF',
                            color:
                              t.type === 'Change Request'
                                ? '#6D28D9'
                                : t.type === 'Service Request'
                                ? '#15803D'
                                : '#1D4ED8',
                          }}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-tag badge-tag-sm ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-tag badge-tag-sm ${getSeverityBadge(t.severity)}`}>
                          {t.severity}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{t.app}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className="user-avatar-circle avatar-indigo"
                            style={{ width: '24px', height: '24px', fontSize: '10px' }}
                          >
                            {t.assignee === 'Unassigned'
                              ? 'HD'
                              : t.assignee
                                  .split(' ')
                                  .map((x) => x[0])
                                  .join('')}
                          </span>
                          <span style={{ fontSize: '13px' }}>
                            {t.assignee === 'Unassigned' ? 'Awaiting HOD' : t.assignee}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`sla-badge-box ${
                            t.slaBreached ? 'sla-breached-box' : ''
                          }`}
                        >
                          <Clock size={13} />
                          {t.sla}
                        </span>
                      </td>
                      <td>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            background: 'var(--surface-subtle)',
          }}
        >
          <span>
            Showing {filteredTickets.length} of {tickets.length} total tickets
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn-secondary" style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}>
              Previous
            </button>
            <button className="btn-primary" style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}>
              1
            </button>
            <button className="btn-secondary" style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

