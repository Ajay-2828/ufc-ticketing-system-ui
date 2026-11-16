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
  CheckCircle2,
  AlertCircle,
  X,
  User,
  SlidersHorizontal,
} from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'
import { SeverityBadge, PriorityBadge } from '@/components/tickets/master-badges'
import { Ticket, TicketType, TicketStatus, TicketSeverity, departmentsData } from '@/app/ticket-data'

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
  const { severities } = useTicketContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All')
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        t.id.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.app.toLowerCase().includes(query) ||
        t.assignee.toLowerCase().includes(query) ||
        t.department.toLowerCase().includes(query) ||
        t.creator.toLowerCase().includes(query)

      const matchesType =
        selectedType === 'All' ||
        (selectedType === 'Incidents' && t.type === 'Incident') ||
        (selectedType === 'Service Requests' && t.type === 'Service Request') ||
        (selectedType === 'Change Requests' && t.type === 'Change Request') ||
        t.type === selectedType

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

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedType('All')
    setSelectedStatus('All')
    setSelectedSeverity('All')
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'All' ||
    selectedStatus !== 'All' ||
    selectedSeverity !== 'All'

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
      case 'Rejected':
        return 'badge-reopened'
      case 'Admin Review':
      case 'Management Approval':
        return 'badge-pending'
      case 'Draft':
        return 'badge-closed'
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
            <span>Support &amp; Service Desk</span>
            <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
            <span>{filteredTickets.length} {filteredTickets.length === 1 ? 'Ticket' : 'Tickets'}</span>
          </div>
          <h1 className="page-title-main">{title}</h1>
          <p className="page-desc-sub">{subtitle}</p>
        </div>

        {onOpenCreateModal && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn-gold"
              disabled={createDisabled}
              onClick={onOpenCreateModal}
              title={createDisabled ? createDisabledReason : undefined}
            >
              <Plus size={16} /> Create Ticket
            </button>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <div className="modern-card">
        {/* Table Toolbar */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Search Box */}
          <div className="search-input-box" style={{ width: '300px' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by ID, keyword, requester..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: 'var(--text-muted)',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type Segmented Controls */}
          <div
            style={{
              display: 'flex',
              background: 'var(--surface-muted)',
              padding: '3px',
              borderRadius: '8px',
            }}
          >
            {[
              { id: 'All', label: 'All' },
              { id: 'Incidents', label: 'Incidents' },
              { id: 'Service Requests', label: 'Service Requests' },
              { id: 'Change Requests', label: 'Change Requests' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: selectedType === tab.id ? 600 : 500,
                  background: selectedType === tab.id ? 'var(--surface)' : 'transparent',
                  color: selectedType === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: selectedType === tab.id ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status & Priority Dropdowns */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              className="form-input-control"
              style={{ width: 'auto', height: '36px', fontSize: '12.5px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Admin Review">Admin Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Clarification">Awaiting Clarification</option>
              <option value="In Testing">In Testing</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Reopened">Reopened</option>
              <option value="Draft">Draft</option>
              <option value="Management Approval">Management Approval</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              className="form-input-control"
              style={{ width: 'auto', height: '36px', fontSize: '12.5px' }}
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="All">All Severities</option>
              {[...severities]
                .sort((x, y) => x.rank - y.rank)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.active ? '' : ' (inactive)'}
                  </option>
                ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn-secondary"
                style={{ height: '36px', padding: '0 10px', fontSize: '12px' }}
                onClick={resetFilters}
                title="Reset all filters"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Bulk Selection Notification Bar */}
        {selectedTickets.length > 0 && (
          <div
            style={{
              padding: '10px 20px',
              background: '#EFF6FF',
              borderBottom: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
              color: '#1D4ED8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong>{selectedTickets.length} {selectedTickets.length === 1 ? 'ticket' : 'tickets'} selected</strong>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ height: '28px', padding: '0 10px', fontSize: '11.5px', background: '#FFFFFF' }}
                onClick={() => setSelectedTickets([])}
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Responsive Table */}
        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th style={{ width: '38px', paddingLeft: '20px' }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredTickets.length > 0 &&
                      selectedTickets.length === filteredTickets.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Ticket</th>
                <th>Subject &amp; Requester</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority &amp; Severity</th>
                <th>Application</th>
                <th>Assignee</th>
                <th>SLA Remaining</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ maxWidth: '340px', margin: '0 auto' }}>
                      <AlertCircle size={32} style={{ margin: '0 auto 10px', color: 'var(--text-muted)' }} />
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>
                        No tickets found
                      </div>
                      <p style={{ margin: 0, fontSize: '12.5px' }}>
                        {hasActiveFilters
                          ? 'Try adjusting your search query or clearing active filters.'
                          : 'There are currently no tickets matching this view.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ marginTop: '12px', height: '30px', fontSize: '12px' }}
                          onClick={resetFilters}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const isChecked = selectedTickets.includes(t.id)
                  const initials = t.assignee === 'Unassigned'
                    ? '—'
                    : t.assignee
                        .split(' ')
                        .map((x) => x[0])
                        .join('')

                  return (
                    <tr
                      key={t.id}
                      onClick={() => onSelectTicket(t)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ paddingLeft: '20px' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => toggleSelectOne(t.id, e as never)}
                        />
                      </td>

                      {/* Ticket Code & Created Date */}
                      <td>
                        <strong className="ticket-id-link">{t.id}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {t.created}
                        </div>
                      </td>

                      {/* Subject & Requester Attribution */}
                      <td>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            maxWidth: '320px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t.subject}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {t.department} &bull; {t.creator}
                        </div>
                      </td>

                      {/* Type */}
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
                            fontWeight: 600,
                          }}
                        >
                          {t.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`badge-tag badge-tag-sm ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>

                      {/* Priority & Severity */}
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <PriorityBadge id={t.priority} />
                          <SeverityBadge id={t.severity} />
                        </div>
                      </td>

                      {/* Application */}
                      <td>
                        <span style={{ fontWeight: 500, fontSize: '13px', color: 'var(--text-main)' }}>
                          {t.app}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td>
                        {t.status === 'Pending Approval' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                className="user-avatar-circle"
                                style={{
                                  width: '22px',
                                  height: '22px',
                                  fontSize: '10px',
                                  background: '#FEF3C7',
                                  color: '#B45309',
                                  fontWeight: 700,
                                }}
                              >
                                {(departmentsData.find((d) => d.name === t.department)?.hodName || 'GN')
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </span>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#B45309' }}>
                                {departmentsData.find((d) => d.name === t.department)?.hodName || 'Grace Nsubuga'}
                              </span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', paddingLeft: '28px' }}>
                              Awaiting HOD Sign-Off
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              className="user-avatar-circle avatar-indigo"
                              style={{
                                width: '24px',
                                height: '24px',
                                fontSize: '10px',
                                background: t.assignee === 'Unassigned' ? '#F1F5F9' : undefined,
                                color: t.assignee === 'Unassigned' ? '#64748B' : undefined,
                              }}
                            >
                              {initials}
                            </span>
                            <span
                              style={{
                                fontSize: '12.5px',
                                color: t.assignee === 'Unassigned' ? 'var(--text-muted)' : 'var(--text-main)',
                                fontStyle: t.assignee === 'Unassigned' ? 'italic' : 'normal',
                              }}
                            >
                              {t.assignee}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* SLA Remaining Timer */}
                      <td>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: t.slaBreached
                              ? '#FEF2F2'
                              : t.slaTimeRemaining.startsWith('00:') || t.slaTimeRemaining.startsWith('01:')
                              ? '#FFFBEB'
                              : '#F0FDF4',
                            color: t.slaBreached
                              ? '#B91C1C'
                              : t.slaTimeRemaining.startsWith('00:') || t.slaTimeRemaining.startsWith('01:')
                              ? '#B45309'
                              : '#15803D',
                          }}
                        >
                          <Clock size={12} />
                          {t.slaBreached ? 'Breached' : t.slaTimeRemaining}
                        </div>
                      </td>

                      {/* Chevron Arrow */}
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

        {/* Footer Pagination */}
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
            <button
              className="btn-secondary"
              style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}
              disabled
            >
              Previous
            </button>
            <button
              className="btn-primary"
              style={{ height: '30px', padding: '0 12px', fontSize: '12px' }}
            >
              1
            </button>
            <button
              className="btn-secondary"
              style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
