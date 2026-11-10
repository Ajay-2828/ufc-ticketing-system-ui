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
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUpRight,
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

  // 7-Day Ticket Flow Analytics Data (Monday to Sunday)
  const ticketsWeeklyInflow = [
    { day: 'Mon', created: 14, resolved: 12 },
    { day: 'Tue', created: 18, resolved: 16 },
    { day: 'Wed', created: 22, resolved: 20 },
    { day: 'Thu', created: 16, resolved: 15 },
    { day: 'Fri', created: 25, resolved: 24 },
    { day: 'Sat', created: 8, resolved: 7 },
    { day: 'Sun', created: 12, resolved: 14 },
  ]

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

        {/* Create Ticket Button on Dashboard for Any User */}
        {currentRole !== 'External Vendor' && (
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

      {/* ENTERPRISE REAL-TIME ANALYTICS & VOLUME GRAPHS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Graph Card 1: 7-Day Ticket Velocity & Inflow vs Outflow Bar Chart */}
        <div className="modern-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                  7-Day Ticket Flow &amp; Resolution Velocity
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Daily Inflow (New Tickets) vs Outflow (Resolved Tickets)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Created ({ticketsWeeklyInflow.reduce((a, b) => a + b.created, 0)})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10B981' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Resolved ({ticketsWeeklyInflow.reduce((a, b) => a + b.resolved, 0)})</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div style={{ width: '100%', height: '190px', position: 'relative' }}>
            <svg viewBox="0 0 540 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Horizontal Gridlines */}
              <line x1="30" y1="20" x2="520" y2="20" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
              <text x="24" y="24" fill="#94A3B8" fontSize="10" textAnchor="end">25</text>

              <line x1="30" y1="65" x2="520" y2="65" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
              <text x="24" y="69" fill="#94A3B8" fontSize="10" textAnchor="end">15</text>

              <line x1="30" y1="110" x2="520" y2="110" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
              <text x="24" y="114" fill="#94A3B8" fontSize="10" textAnchor="end">5</text>

              <line x1="30" y1="145" x2="520" y2="145" stroke="#E2E8F0" strokeWidth="1.5" />
              <text x="24" y="149" fill="#94A3B8" fontSize="10" textAnchor="end">0</text>

              {/* Day Columns */}
              {ticketsWeeklyInflow.map((d, i) => {
                const colCenter = 68 + i * 68
                const createdH = (d.created / 28) * 125
                const resolvedH = (d.resolved / 28) * 125
                const createdY = 145 - createdH
                const resolvedY = 145 - resolvedH

                return (
                  <g key={d.day}>
                    {/* Created Bar */}
                    <rect
                      x={colCenter - 14}
                      y={createdY}
                      width="12"
                      height={createdH}
                      rx="3"
                      fill="var(--primary)"
                      opacity={0.9}
                    />
                    <text
                      x={colCenter - 8}
                      y={createdY - 5}
                      fill="var(--primary)"
                      fontSize="9.5"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {d.created}
                    </text>

                    {/* Resolved Bar */}
                    <rect
                      x={colCenter + 2}
                      y={resolvedY}
                      width="12"
                      height={resolvedH}
                      rx="3"
                      fill="#10B981"
                      opacity={0.9}
                    />
                    <text
                      x={colCenter + 8}
                      y={resolvedY - 5}
                      fill="#047857"
                      fontSize="9.5"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {d.resolved}
                    </text>

                    {/* Day Label */}
                    <text
                      x={colCenter}
                      y="164"
                      fill="#64748B"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {d.day}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Bottom Velocity KPI Summary */}
          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={15} color="#059669" />
              <span style={{ color: 'var(--text-muted)' }}>Resolution Velocity:</span>
              <strong style={{ color: '#047857' }}>93.9% Weekly Clearance Rate</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                ▲ Backlog Controlled
              </span>
              <span style={{ color: 'var(--text-muted)' }}>Peak Day: Friday (25/24)</span>
            </div>
          </div>
        </div>

        {/* Graph Card 2: Operations Performance & Distribution */}
        <div className="modern-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FAF5FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                    SLA Compliance &amp; Workload
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Enterprise Turnaround Benchmarks
                  </p>
                </div>
              </div>

              <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                Target: 95%
              </span>
            </div>

            {/* SLA Circular Gauge + Metrics Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '12px 14px',
                background: 'var(--surface-subtle)',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                marginBottom: '16px',
              }}
            >
              {/* Radial Arc Gauge */}
              <div style={{ width: '80px', height: '80px', position: 'relative', flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 * (1 - 0.984)}
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <strong style={{ fontSize: '15px', fontWeight: 900, color: '#047857', lineHeight: 1 }}>
                    98.4%
                  </strong>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginTop: '2px' }}>
                    SLA MET
                  </span>
                </div>
              </div>

              {/* Benchmarks Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Avg Response SLA:</span>
                  <strong style={{ color: 'var(--primary)' }}>18 mins</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Avg Resolution SLA:</span>
                  <strong style={{ color: 'var(--text-main)' }}>3.2 hours</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Active Breaches:</span>
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>1 / 128 tickets</span>
                </div>
              </div>
            </div>

            {/* Application Workload Distribution Bars */}
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Active Tickets by Core Application
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Flexcube Core Banking', count: 48, pct: 38, color: '#2563EB' },
                  { name: 'Atomverse Mobile App', count: 33, pct: 26, color: '#7C3AED' },
                  { name: 'Network Access & VPN', count: 23, pct: 18, color: '#D97706' },
                  { name: 'End User Computing (EUC)', count: 24, pct: 18, color: '#059669' },
                ].map((item) => (
                  <div key={item.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '2px' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        <strong>{item.count}</strong> ({item.pct}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.pct}%`,
                          height: '100%',
                          background: item.color,
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ height: '30px', fontSize: '11.5px', gap: '4px' }}
              onClick={() => onNavigateTab('Reports')}
            >
              Open Full SLA Analytics &rarr;
            </button>
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
            <div
              className="filter-chips-container"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--surface-subtle)',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                margin: 0,
              }}
            >
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'All' ? 'active' : ''}`}
                onClick={() => setTableFilter('All')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: tableFilter === 'All' ? 700 : 500,
                  color: tableFilter === 'All' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: tableFilter === 'All' ? '#FFFFFF' : 'transparent',
                  border: tableFilter === 'All' ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
                  boxShadow: tableFilter === 'All' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                All Recent
              </button>
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'CriticalHigh' ? 'active' : ''}`}
                onClick={() => setTableFilter('CriticalHigh')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: tableFilter === 'CriticalHigh' ? 700 : 500,
                  color: tableFilter === 'CriticalHigh' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: tableFilter === 'CriticalHigh' ? '#FFFFFF' : 'transparent',
                  border: tableFilter === 'CriticalHigh' ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
                  boxShadow: tableFilter === 'CriticalHigh' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Critical &amp; High
              </button>
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'Pending' ? 'active' : ''}`}
                onClick={() => setTableFilter('Pending')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: tableFilter === 'Pending' ? 700 : 500,
                  color: tableFilter === 'Pending' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: tableFilter === 'Pending' ? '#FFFFFF' : 'transparent',
                  border: tableFilter === 'Pending' ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
                  boxShadow: tableFilter === 'Pending' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Pending Action
              </button>
              <button
                type="button"
                className={`filter-chip ${tableFilter === 'ChangeRequest' ? 'active' : ''}`}
                onClick={() => setTableFilter('ChangeRequest')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: tableFilter === 'ChangeRequest' ? 700 : 500,
                  color: tableFilter === 'ChangeRequest' ? 'var(--primary)' : 'var(--text-secondary)',
                  background: tableFilter === 'ChangeRequest' ? '#FFFFFF' : 'transparent',
                  border: tableFilter === 'ChangeRequest' ? '1px solid rgba(37, 99, 235, 0.2)' : '1px solid transparent',
                  boxShadow: tableFilter === 'ChangeRequest' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
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
