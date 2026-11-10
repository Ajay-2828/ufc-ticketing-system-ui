'use client'

import React, { useState, useMemo } from 'react'
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Server,
  Zap,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { Ticket, Role, usersByRole, policySettings, TicketStatus, TicketSeverity } from '@/app/ticket-data'

interface DashboardViewProps {
  currentRole: Role
  tickets: Ticket[]
  onSelectTicket: (t: Ticket) => void
  onOpenCreateModal: () => void
  onNavigateTab: (tab: string) => void
  unclosedResolvedCount: number
}

export function DashboardView({
  currentRole,
  tickets,
  onSelectTicket,
  onOpenCreateModal,
  onNavigateTab,
  unclosedResolvedCount,
}: DashboardViewProps) {
  const currentUser = usersByRole[currentRole]
  const isBlockedByThreshold =
    currentRole === 'End User' &&
    unclosedResolvedCount >= policySettings.unresolvedClosureThreshold

  // Filter state for the recent tickets table
  const [tableFilter, setTableFilter] = useState<'All' | 'CriticalHigh' | 'Pending' | 'ChangeRequest'>('All')

  // Section 14 consistent enterprise KPI figures across screens
  const totalOpen = 128
  const pendingApprovalsCount = 24
  const resolvedUnclosedTotal = 18
  const closedTotal = 38

  // Section 16: "Home per role starts with a Needs your action strip"
  const exceptionsTotal = tickets.filter(
    (t) => t.status === 'Reopened' || t.type === 'Change Request' || t.status === 'Admin Review'
  ).length
  const reopenedTotal = tickets.filter((t) => t.status === 'Reopened').length
  const crAwaitingReview = tickets.filter(
    (t) => t.type === 'Change Request' || t.status === 'Admin Review'
  ).length

  // Filtered recent tickets for table
  const filteredRecentTickets = useMemo(() => {
    let list = tickets
    if (tableFilter === 'CriticalHigh') {
      list = list.filter((t) => t.severity === 'Critical' || t.severity === 'High')
    } else if (tableFilter === 'Pending') {
      list = list.filter((t) => t.status === 'Pending Approval' || t.status === 'Admin Review')
    } else if (tableFilter === 'ChangeRequest') {
      list = list.filter((t) => t.type === 'Change Request')
    }
    return list.slice(0, 6)
  }, [tickets, tableFilter])

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
      default:
        return 'badge-low'
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <span>{currentRole} Workspace</span>
            <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
            <span>UFC Desk Enterprise Portal</span>
          </div>
          <h1 className="page-title-main">
            Welcome back, {currentUser.name}
          </h1>
          <p className="page-desc-sub">
            {currentRole === 'End User'
              ? 'Track your IT requests, verify resolved solutions, and submit new service requests.'
              : currentRole === 'HOD'
              ? 'Review pending employee requests, verify compliance, and monitor department turnaround.'
              : currentRole === 'Technician'
              ? 'Work assigned technical tickets, maintain SLA commitments, and resolve incidents.'
              : currentRole === 'Admin Team'
              ? 'Triage operational exceptions, assign unmapped tickets, and manage service desk rules.'
              : currentRole === 'Management'
              ? 'Review architectural Change Requests and authorize high-impact production releases.'
              : currentRole === 'Testing Team'
              ? 'Execute quality assurance test cases and pass or fail pre-production implementations.'
              : 'Secure external vendor workspace for United Finance Company technical partners.'}
          </p>
        </div>

        {/* Section 17 & User Rule: Gold Create Ticket Button on Dashboard for End User ONLY */}
        {currentRole === 'End User' && (
          <button
            type="button"
            className="btn-gold"
            disabled={isBlockedByThreshold}
            onClick={onOpenCreateModal}
          >
            <Plus size={16} /> Create Ticket
          </button>
        )}
      </div>

      {/* SECTION 16: "NEEDS YOUR ACTION" PRIORITY STRIP (Role-specific) */}
      <div
        className="modern-card"
        style={{
          padding: '16px 20px',
          marginBottom: '22px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderLeft: '4.5px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Clock size={20} />
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: 700 }}>
              Action Required &bull; Your Attention
            </div>

            {/* Admin Needs Action */}
            {currentRole === 'Admin Team' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#B91C1C',
                    background: '#FEF2F2',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Exceptions')}
                >
                  {exceptionsTotal} Exceptions Total
                </span>
                <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#B91C1C',
                    background: '#FEF2F2',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Exceptions')}
                >
                  {reopenedTotal} Reopened
                </span>
                <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#6D28D9',
                    background: '#F5F3FF',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Exceptions')}
                >
                  {crAwaitingReview} Change Requests Awaiting Review
                </span>
                <span style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>
                  (Amber alert &gt;4h &bull; Red alert &gt;8h)
                </span>
              </div>
            )}

            {/* HOD Needs Action */}
            {currentRole === 'HOD' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#B45309',
                    background: '#FFFBEB',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Approvals')}
                >
                  {pendingApprovalsCount} Approvals Waiting
                </span>
                <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#B91C1C',
                    background: '#FEF2F2',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Approvals')}
                >
                  2 Approvals Overdue (&gt;24h Limit)
                </span>
              </div>
            )}

            {/* Technician Needs Action */}
            {currentRole === 'Technician' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#B45309',
                    background: '#FFFBEB',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Work Queue')}
                >
                  2 Tickets Nearing SLA Breach (&lt;30m)
                </span>
                <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1D4ED8',
                    background: '#EFF6FF',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Work Queue')}
                >
                  5 In Progress In Your Queue
                </span>
              </div>
            )}

            {/* End User Needs Action */}
            {currentRole === 'End User' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#047857',
                    background: '#ECFDF5',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('My Tickets')}
                >
                  {unclosedResolvedCount} Resolved Tickets Awaiting Your Verification & Closure
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  (Threshold: {policySettings.unresolvedClosureThreshold} max unclosed)
                </span>
              </div>
            )}

            {/* Management Needs Action */}
            {currentRole === 'Management' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#6D28D9',
                    background: '#F5F3FF',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Approvals')}
                >
                  1 Core Banking Change Request Awaiting Executive Authorization
                </span>
              </div>
            )}

            {/* Testing Team Needs Action */}
            {currentRole === 'Testing Team' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#E11D48',
                    background: '#FFF1F2',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Testing Queue')}
                >
                  1 Completed Deployment In QA Queue Awaiting Pass/Fail Sign-Off
                </span>
              </div>
            )}

            {/* External Vendor Needs Action */}
            {currentRole === 'External Vendor' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F766E',
                    background: '#F0FDFA',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateTab('Vendor Portal')}
                >
                  3 Assigned Technical Partner Tickets Active
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{ height: '34px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
          onClick={() => {
            if (currentRole === 'Admin Team') onNavigateTab('Exceptions')
            else if (currentRole === 'HOD' || currentRole === 'Management') onNavigateTab('Approvals')
            else if (currentRole === 'Technician') onNavigateTab('Work Queue')
            else if (currentRole === 'Testing Team') onNavigateTab('Testing Queue')
            else if (currentRole === 'External Vendor') onNavigateTab('Vendor Portal')
            else onNavigateTab('My Tickets')
          }}
        >
          View Action Items &rarr;
        </button>
      </div>

      {/* Blocked State Warning Banner (Section 5) */}
      {isBlockedByThreshold && (
        <div className="alert-card-banner alert-danger" style={{ marginBottom: '22px' }}>
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>Ticket Submission Blocked: Threshold Reached ({unclosedResolvedCount} Unclosed Tickets)</strong>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>
              You have accumulated {unclosedResolvedCount} resolved tickets awaiting confirmation. Under UFC service desk governance, please verify and close your resolved tickets before creating new requests.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ height: '32px', fontSize: '12px' }}
            onClick={() => onNavigateTab('My Tickets')}
          >
            Verify & Close Tickets &rarr;
          </button>
        </div>
      )}

      {/* KPI METRIC CARDS GRID (Section 14 Consistent Metrics + Role Personalization) */}
      <div className="kpi-stat-grid" style={{ marginBottom: '24px' }}>
        {/* Card 1 */}
        <div
          className="kpi-box-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab(currentRole === 'Technician' ? 'Work Queue' : 'All Tickets')}
        >
          <div className="kpi-head-row">
            <span className="kpi-label-text">
              {currentRole === 'Technician'
                ? 'Assigned to Me'
                : currentRole === 'End User'
                ? 'My Active Tickets'
                : currentRole === 'Testing Team'
                ? 'In QA Queue'
                : currentRole === 'External Vendor'
                ? 'Active Vendor Tickets'
                : 'Total Open Tickets'}
            </span>
            <div className="kpi-icon-pill" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
              <TicketIcon size={18} />
            </div>
          </div>
          <div className="kpi-value-text">
            {currentRole === 'Technician'
              ? '7'
              : currentRole === 'End User'
              ? '2'
              : currentRole === 'Testing Team'
              ? '3'
              : currentRole === 'External Vendor'
              ? '3'
              : totalOpen}
          </div>
          <div className="kpi-sub-text" style={{ color: 'var(--primary)' }}>
            {currentRole === 'Technician'
              ? 'Active Work Items'
              : currentRole === 'End User'
              ? 'In Progress / Assigned'
              : currentRole === 'Testing Team'
              ? 'Awaiting Test Run'
              : currentRole === 'External Vendor'
              ? 'Assigned to TechServe'
              : 'Across Enterprise Services'}
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="kpi-box-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab(currentRole === 'Technician' ? 'Work Queue' : 'Approvals')}
        >
          <div className="kpi-head-row">
            <span className="kpi-label-text">
              {currentRole === 'Technician'
                ? 'Nearing SLA (<1h)'
                : currentRole === 'End User'
                ? 'Awaiting Verification'
                : currentRole === 'Testing Team'
                ? 'Passed Verification'
                : currentRole === 'External Vendor'
                ? 'Pending Clarifications'
                : 'Pending Approvals'}
            </span>
            <div className="kpi-icon-pill" style={{ background: '#FFFBEB', color: '#B45309' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value-text" style={{ color: 'var(--amber)' }}>
            {currentRole === 'Technician'
              ? '2'
              : currentRole === 'End User'
              ? String(unclosedResolvedCount)
              : currentRole === 'Testing Team'
              ? '18'
              : currentRole === 'External Vendor'
              ? '1'
              : pendingApprovalsCount}
          </div>
          <div className="kpi-sub-text" style={{ color: 'var(--amber)' }}>
            {currentRole === 'Technician'
              ? 'Priority Attention'
              : currentRole === 'End User'
              ? 'Please Confirm Solution'
              : currentRole === 'Testing Team'
              ? 'UAT Tested Successfully'
              : currentRole === 'External Vendor'
              ? 'Awaiting UFC Input'
              : 'Active HOD Timers'}
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="kpi-box-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab('All Tickets')}
        >
          <div className="kpi-head-row">
            <span className="kpi-label-text">
              {currentRole === 'Technician'
                ? 'Resolved This Week'
                : currentRole === 'End User'
                ? 'My Closed Tickets'
                : currentRole === 'Testing Team'
                ? 'Failed / Returned'
                : currentRole === 'External Vendor'
                ? 'Resolved This Month'
                : 'Resolved Awaiting Closure'}
            </span>
            <div className="kpi-icon-pill" style={{ background: '#ECFDF5', color: '#047857' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value-text" style={{ color: 'var(--emerald)' }}>
            {currentRole === 'Technician'
              ? '14'
              : currentRole === 'End User'
              ? '12'
              : currentRole === 'Testing Team'
              ? '2'
              : currentRole === 'External Vendor'
              ? '9'
              : resolvedUnclosedTotal}
          </div>
          <div className="kpi-sub-text" style={{ color: 'var(--emerald)' }}>
            {currentRole === 'Technician'
              ? 'SLA Maintained'
              : currentRole === 'End User'
              ? 'Verified & Closed'
              : currentRole === 'Testing Team'
              ? 'Returned for Rework'
              : currentRole === 'External Vendor'
              ? 'Milestone Completed'
              : 'Awaiting User Verification'}
          </div>
        </div>

        {/* Card 4 */}
        <div
          className="kpi-box-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigateTab(currentRole === 'Admin Team' ? 'Reports' : 'All Tickets')}
        >
          <div className="kpi-head-row">
            <span className="kpi-label-text">
              {currentRole === 'Technician'
                ? 'SLA Compliance'
                : currentRole === 'End User'
                ? 'Avg Resolution Time'
                : currentRole === 'Testing Team'
                ? 'Avg Test Cycle'
                : currentRole === 'External Vendor'
                ? 'Vendor SLA Rating'
                : 'Closed Total'}
            </span>
            <div className="kpi-icon-pill" style={{ background: '#F1F5F9', color: '#475569' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value-text">
            {currentRole === 'Technician'
              ? '98.4%'
              : currentRole === 'End User'
              ? '3.2 hrs'
              : currentRole === 'Testing Team'
              ? '1.5 hrs'
              : currentRole === 'External Vendor'
              ? '99.2%'
              : closedTotal}
          </div>
          <div className="kpi-sub-text" style={{ color: 'var(--text-muted)' }}>
            {currentRole === 'Technician'
              ? 'Exceeds Target (95%)'
              : currentRole === 'End User'
              ? 'Turnaround Speed'
              : currentRole === 'Testing Team'
              ? 'Target < 2.0 hrs'
              : currentRole === 'External Vendor'
              ? 'Service Target Met'
              : 'Verified & Archived'}
          </div>
        </div>
      </div>

      {/* RECENT SERVICE DESK TICKETS STREAM (Dense Table with Filters & SLA Countdown) */}
      <div className="modern-card" style={{ marginBottom: '24px' }}>
        <div className="modern-card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="card-title-lg">Recent Service Desk Tickets</h3>
            <p className="card-subtitle-sm">
              Live stream of enterprise requests &bull; Showing {filteredRecentTickets.length} of {tickets.length} tickets
            </p>
          </div>

          {/* Quick Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="filter-chips-container" style={{ margin: 0 }}>
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'All' ? 'active' : ''}`}
                onClick={() => setTableFilter('All')}
              >
                All Recent
              </button>
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'CriticalHigh' ? 'active' : ''}`}
                onClick={() => setTableFilter('CriticalHigh')}
              >
                Critical & High
              </button>
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'Pending' ? 'active' : ''}`}
                onClick={() => setTableFilter('Pending')}
              >
                Pending Action
              </button>
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'ChangeRequest' ? 'active' : ''}`}
                onClick={() => setTableFilter('ChangeRequest')}
              >
                Change Requests
              </button>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ height: '32px', fontSize: '12px' }}
              onClick={() => onNavigateTab('All Tickets')}
            >
              View All &rarr;
            </button>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject & Department</th>
                <th>Type</th>
                <th>Application</th>
                <th>Severity</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>SLA Countdown</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecentTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No tickets match the selected filter chip.
                  </td>
                </tr>
              ) : (
                filteredRecentTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTicket(t)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong className="ticket-id-link">
                        {t.id}
                      </strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {t.created}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t.subject}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {t.department} &bull; Raised by {t.creator}
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
                          fontWeight: 600,
                        }}
                      >
                        {t.type}
                      </span>
                    </td>

                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                        {t.app}
                      </span>
                    </td>

                    <td>
                      <span className={`badge-tag badge-tag-sm ${getSeverityBadge(t.severity)}`}>
                        {t.severity}
                      </span>
                    </td>

                    <td>
                      {t.assignee === 'Unassigned' ? (
                        <span style={{ fontSize: '12.5px', color: '#B91C1C', fontWeight: 600 }}>
                          Unassigned
                        </span>
                      ) : (
                        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          {t.assignee}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={`badge-tag badge-tag-sm ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>

                    {/* Section 10: SLA Countdown color coded: green, amber, red */}
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
                        {t.slaBreached ? 'BREACHED' : t.slaTimeRemaining}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: '28px', padding: '0 10px', fontSize: '11.5px' }}
                        onClick={() => onSelectTicket(t)}
                      >
                        View Detail &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UFC CORE APPLICATION HEALTH STRIP */}
      <div
        className="modern-card"
        style={{
          padding: '16px 20px',
          background: '#FFFFFF',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                UFC Banking Infrastructure & Perimeter Status
              </h4>
              <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                Active Directory Synced &bull; Database Encrypted at Rest &bull; Real-time Health Monitors
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Flexcube Core:</span>
              <span style={{ color: 'var(--text-secondary)' }}>99.98% SLA</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Atomverse App:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Operational</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)' }}></span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>CBO Switch Gateway:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Active</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7C3AED' }}></span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>AD Sync:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Synced (2m ago)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
