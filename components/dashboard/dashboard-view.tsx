'use client'

import React from 'react'
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Users,
  Building2,
  FileText,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { Ticket, Role, usersByRole, policySettings } from '@/app/ticket-data'

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

  // Section 14 consistent KPI metrics
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

  return (
    <div>
      {/* Header */}
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

        {/* Main Action: Gold Button for End User / Admin / Tech (Section 17: One gold accent) */}
        {(currentRole === 'End User' || currentRole === 'Admin Team' || currentRole === 'Technician') && (
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

      {/* SECTION 16: "NEEDS YOUR ACTION" STRIP (Role-specific) */}
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
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#EFF6FF',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={20} />
          </div>

          <div>
            <div style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--primary)', fontWeight: 700 }}>
              Action Required &bull; Your Attention
            </div>

            {/* Admin Needs Action */}
            {currentRole === 'Admin Team' && (
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                <span style={{ color: 'var(--rose)' }}>{exceptionsTotal} Exceptions Total</span> &bull;{' '}
                <span style={{ color: 'var(--rose)' }}>{reopenedTotal} Reopened</span> &bull;{' '}
                <span style={{ color: '#7C3AED' }}>{crAwaitingReview} Change Requests Awaiting Review</span>
              </div>
            )}

            {/* HOD Needs Action */}
            {currentRole === 'HOD' && (
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                <span style={{ color: 'var(--amber)' }}>{pendingApprovalsCount} Approvals Waiting</span> &bull;{' '}
                <span style={{ color: 'var(--rose)' }}>2 Approvals Overdue (&gt;24h)</span>
              </div>
            )}

            {/* Technician Needs Action */}
            {currentRole === 'Technician' && (
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                <span style={{ color: 'var(--amber)' }}>2 Tickets Nearing SLA Breach (&lt;30m)</span> &bull;{' '}
                <span style={{ color: 'var(--primary)' }}>5 In Progress In Your Queue</span>
              </div>
            )}

            {/* End User Needs Action */}
            {currentRole === 'End User' && (
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                <span style={{ color: 'var(--emerald)' }}>{unclosedResolvedCount} Resolved Tickets Awaiting Your Verification & Closure</span>
              </div>
            )}

            {/* Management Needs Action */}
            {currentRole === 'Management' && (
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                <span style={{ color: '#7C3AED' }}>1 Core Banking Change Request Awaiting Executive Approval</span>
              </div>
            )}

            {/* Testing Team Needs Action */}
            {currentRole === 'Testing Team' && (
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                <span style={{ color: '#E11D48' }}>1 Completed Deployment In QA Queue Awaiting Pass/Fail Sign-Off</span>
              </div>
            )}

            {/* External Vendor Needs Action */}
            {currentRole === 'External Vendor' && (
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                <span>3 Assigned Technical Partner Tickets Active</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{ height: '34px', fontSize: '12.5px' }}
          onClick={() => {
            if (currentRole === 'Admin Team') onNavigateTab('Exceptions')
            else if (currentRole === 'HOD' || currentRole === 'Management') onNavigateTab('Approvals')
            else if (currentRole === 'Technician') onNavigateTab('Work Queue')
            else if (currentRole === 'Testing Team') onNavigateTab('Testing Queue')
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
          <div>
            <strong>Ticket Submission Blocked: Threshold Reached ({unclosedResolvedCount} Unclosed Tickets)</strong>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>
              You have accumulated {unclosedResolvedCount} resolved tickets awaiting confirmation. Under UFC service desk governance, please verify and close your resolved tickets before creating new requests.
            </p>
          </div>
        </div>
      )}

      {/* Consistent KPI Grid (Section 14) */}
      <div className="kpi-stat-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-box-card">
          <div className="kpi-head-row">
            <span className="kpi-label-text">Total Open Tickets</span>
            <div className="kpi-icon-pill" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
              <TicketIcon size={18} />
            </div>
          </div>
          <div className="kpi-value-text">{totalOpen}</div>
          <div className="kpi-sub-text" style={{ color: 'var(--primary)' }}>Across Enterprise Services</div>
        </div>

        <div className="kpi-box-card">
          <div className="kpi-head-row">
            <span className="kpi-label-text">Pending Approvals</span>
            <div className="kpi-icon-pill" style={{ background: '#FFFBEB', color: '#B45309' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value-text" style={{ color: 'var(--amber)' }}>{pendingApprovalsCount}</div>
          <div className="kpi-sub-text" style={{ color: 'var(--amber)' }}>Active HOD Timers</div>
        </div>

        <div className="kpi-box-card">
          <div className="kpi-head-row">
            <span className="kpi-label-text">Resolved Awaiting Closure</span>
            <div className="kpi-icon-pill" style={{ background: '#ECFDF5', color: '#047857' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value-text" style={{ color: 'var(--emerald)' }}>{resolvedUnclosedTotal}</div>
          <div className="kpi-sub-text" style={{ color: 'var(--emerald)' }}>Awaiting Verification</div>
        </div>

        <div className="kpi-box-card">
          <div className="kpi-head-row">
            <span className="kpi-label-text">Closed Total</span>
            <div className="kpi-icon-pill" style={{ background: '#F1F5F9', color: '#475569' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value-text">{closedTotal}</div>
          <div className="kpi-sub-text" style={{ color: 'var(--text-muted)' }}>Verified & Archived</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h3 className="card-title-lg">Recent Service Desk Tickets</h3>
            <p className="card-subtitle-sm">Live stream of enterprise requests</p>
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

        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Application</th>
                <th>Severity</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td>
                    <code style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>
                      {t.id}
                    </code>
                  </td>
                  <td>
                    <strong style={{ fontSize: '13.5px' }}>{t.subject}</strong>
                  </td>
                  <td>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#475569' }}>
                      {t.type}
                    </span>
                  </td>
                  <td>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                      {t.app}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge-tag badge-tag-sm"
                      style={{
                        background: t.severity === 'Critical' ? '#FEF2F2' : t.severity === 'High' ? '#FEF3C7' : '#DBEAFE',
                        color: t.severity === 'Critical' ? '#B91C1C' : t.severity === 'High' ? '#B45309' : '#1D4ED8',
                        fontWeight: 700,
                      }}
                    >
                      {t.severity}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.assignee}</span>
                  </td>
                  <td>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                      onClick={() => onSelectTicket(t)}
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
