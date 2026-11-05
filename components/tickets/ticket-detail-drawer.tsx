'use client'

import React, { useState } from 'react'
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  History,
  Send,
  UserCheck,
  Share2,
  ShieldAlert,
  ArrowRight,
  GitBranch,
  Paperclip,
  Upload,
  FlaskConical,
  FileCheck,
  Calendar,
  Check,
  Download,
} from 'lucide-react'
import { Ticket, Role, usersByRole } from '@/app/ticket-data'

interface TicketDetailDrawerProps {
  ticket: Ticket
  currentRole: Role
  onClose: () => void
  onUpdateTicket: (updated: Ticket) => void
  onOpenCloseModal: (ticket: Ticket) => void
  onOpenReopenModal: (ticket: Ticket) => void
  onOpenAssignModal: (ticket: Ticket) => void
  onOpenResolveModal: (ticket: Ticket) => void
  onOpenReferModal: (ticket: Ticket) => void
}

export function TicketDetailDrawer({
  ticket,
  currentRole,
  onClose,
  onUpdateTicket,
  onOpenCloseModal,
  onOpenReopenModal,
  onOpenAssignModal,
  onOpenResolveModal,
  onOpenReferModal,
}: TicketDetailDrawerProps) {
  // Section 13: Tabs: Overview, Timeline, Clarifications, Attachments, Testing.
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'clarifications' | 'attachments' | 'testing'>('overview')
  const [newClarificationMessage, setNewClarificationMessage] = useState('')
  const [clarificationTargetRole, setClarificationTargetRole] = useState('End User')

  const currentUser = usersByRole[currentRole]

  // Data-driven Stepper based on ticket type (Section 8 & 13)
  const isCR = ticket.type === 'Change Request' || ticket.status === 'Admin Review'

  // Stepper stages for Standard Ticket vs Change Request
  const stepperStages = isCR
    ? [
        { label: 'Submitted', key: 'Submitted', isSkipped: false },
        { label: 'HOD Approval', key: 'Pending Approval', isSkipped: false },
        { label: 'Admin Review', key: 'Admin Review', isSkipped: false },
        { label: 'Management', key: 'Management', isSkipped: false },
        { label: 'Implementation', key: 'In Progress', isSkipped: false },
        { label: 'Testing QA', key: 'In Testing', isSkipped: false },
        { label: 'Resolved & Closed', key: 'Resolved', isSkipped: false },
      ]
    : [
        { label: 'Submitted', key: 'Submitted', isSkipped: false },
        { label: 'HOD Approval', key: 'Pending Approval', isSkipped: false },
        { label: 'Assignment', key: 'Assigned', isSkipped: false },
        { label: 'In Progress', key: 'In Progress', isSkipped: false },
        { label: 'Testing', key: 'In Testing', isSkipped: true }, // Skipped for standard tickets
        { label: 'Resolved', key: 'Resolved', isSkipped: false },
        { label: 'Closed', key: 'Closed', isSkipped: false },
      ]

  const getStepIndex = (status: Ticket['status']) => {
    switch (status) {
      case 'Pending Approval':
        return 1
      case 'Admin Review':
        return 2
      case 'Assigned':
      case 'In Progress':
      case 'Awaiting Clarification':
        return isCR ? 4 : 3
      case 'In Testing':
        return isCR ? 5 : 4
      case 'Resolved':
        return isCR ? 6 : 5
      case 'Closed':
        return isCR ? 6 : 6
      case 'Reopened':
        return 2
      default:
        return 0
    }
  }

  const currentStepIndex = getStepIndex(ticket.status)

  // Status Badge Class
  const getStatusBadge = (status: Ticket['status']) => {
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

  // Lifecycle actions
  const handleHODApprove = () => {
    const updated: Ticket = {
      ...ticket,
      status: 'Assigned',
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: 'HOD',
          action: 'Department Head Approval Granted',
          note: `Approved within SLA limit. Automatically routed to designated technicians: ${ticket.assignee}.`,
          tone: 'green',
        },
      ],
    }
    onUpdateTicket(updated)
  }

  const handleHODReject = () => {
    const reason = prompt('Mandatory: Please provide rejection justification:')
    if (!reason || !reason.trim()) return

    const updated: Ticket = {
      ...ticket,
      status: 'Closed',
      closureRemarks: `HOD Rejection: ${reason}`,
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: 'HOD',
          action: 'Ticket Rejected by Department Head',
          note: `Mandatory reason: ${reason}`,
          tone: 'red',
        },
      ],
    }
    onUpdateTicket(updated)
  }

  const handleTechnicianStart = () => {
    const updated: Ticket = {
      ...ticket,
      status: 'In Progress',
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: 'Technician',
          action: 'Work Started by Technician',
          note: 'Accepted ticket into active queue with established ETA.',
          tone: 'blue',
        },
      ],
    }
    onUpdateTicket(updated)
  }

  const handleTechnicianMarkCR = () => {
    const updated: Ticket = {
      ...ticket,
      type: 'Change Request',
      status: 'Admin Review',
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: 'Technician',
          action: 'Flagged as Change Request (CR)',
          note: 'Requires architectural review and maintenance window authorization.',
          tone: 'purple',
        },
      ],
    }
    onUpdateTicket(updated)
  }

  const handleTestingPass = () => {
    const updated: Ticket = {
      ...ticket,
      status: 'Resolved',
      resolutionSummary: 'QA verification passed all functional and regression test criteria.',
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: 'Testing Team',
          action: 'QA Testing Passed',
          note: 'Verified in UAT staging. Ready for customer sign-off.',
          tone: 'green',
        },
      ],
    }
    onUpdateTicket(updated)
  }

  const handleTestingFail = () => {
    const reason = prompt('Please enter the defect description found during test:')
    if (!reason) return
    const updated: Ticket = {
      ...ticket,
      status: 'In Progress',
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: 'Testing Team',
          action: 'QA Testing Failed',
          note: `Defect logged: ${reason}. Escalated back to engineer.`,
          tone: 'red',
        },
      ],
    }
    onUpdateTicket(updated)
  }

  const handleAddClarification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClarificationMessage.trim()) return

    const newClarification = {
      id: `c-${Date.now()}`,
      from: currentUser.name,
      to: `${clarificationTargetRole} Team`,
      targetRole: clarificationTargetRole,
      message: newClarificationMessage.trim(),
      time: 'Just now',
    }

    const updated: Ticket = {
      ...ticket,
      status: 'Awaiting Clarification',
      clarifications: [...ticket.clarifications, newClarification],
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: currentRole,
          action: 'Clarification Requested',
          note: `Target: ${clarificationTargetRole}. Question: "${newClarificationMessage.trim()}". Under Section 11, reply emails are ingested automatically.`,
          tone: 'amber',
        },
      ],
    }

    onUpdateTicket(updated)
    setNewClarificationMessage('')
  }

  return (
    <div className="drawer-overlay-backdrop" onClick={onClose}>
      <div className="ticket-detail-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header (Section 13) */}
        <div className="drawer-header-pane">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <code style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 800 }}>
                {ticket.id}
              </code>
              <span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
                {ticket.type}
              </span>
              <span className={`badge-tag badge-tag-sm ${getStatusBadge(ticket.status)}`}>
                {ticket.status}
              </span>
              <span
                className="badge-tag badge-tag-sm"
                style={{
                  background:
                    ticket.severity === 'Critical'
                      ? '#FEF2F2'
                      : ticket.severity === 'High'
                      ? '#FEF3C7'
                      : '#DBEAFE',
                  color:
                    ticket.severity === 'Critical'
                      ? '#B91C1C'
                      : ticket.severity === 'High'
                      ? '#B45309'
                      : '#1D4ED8',
                  fontWeight: 700,
                }}
              >
                {ticket.severity}
              </span>
              <span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#475569' }}>
                {ticket.priority}
              </span>
            </div>

            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
              {ticket.subject}
            </h2>
          </div>

          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Current Status Banner (Section 13) */}
        <div
          style={{
            padding: '12px 26px',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 100%)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Current Stage
              </span>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                {ticket.status}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Currently With
              </span>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--primary)' }}>
                {ticket.status === 'Pending Approval'
                  ? 'Grace Nsubuga (Department Head)'
                  : ticket.status === 'In Testing'
                  ? 'Fatima Al-Zadjali (Testing Lead)'
                  : ticket.status === 'Resolved'
                  ? `${ticket.creator} (End User Verification)`
                  : `${ticket.assignee} (Primary Lead)`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Time Left Against SLA
              </span>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: ticket.slaBreached ? 'var(--rose)' : 'var(--emerald)' }}>
                {ticket.slaBreached ? 'SLA Breached' : ticket.sla}
              </div>
            </div>
          </div>
        </div>

        {/* Data-Driven Workflow Stepper (Section 13) */}
        <div style={{ padding: '16px 26px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div className="stepper-horizontal-track">
            {stepperStages.map((stage, idx) => {
              const isPast = idx < currentStepIndex
              const isCurrent = idx === currentStepIndex
              return (
                <div key={stage.label} className="stepper-node-item">
                  <div
                    className={`stepper-node-circle ${
                      isCurrent ? 'node-active' : isPast ? 'node-completed' : 'node-pending'
                    }`}
                  >
                    {isPast ? <Check size={12} strokeWidth={3} /> : idx + 1}
                  </div>
                  <span className={`stepper-node-label ${isCurrent ? 'label-active' : ''}`}>
                    {stage.label}
                    {stage.isSkipped && ' (Skipped)'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Drawer Tabs (Section 13: Tabs: Overview, Timeline, Clarifications, Attachments, Testing) */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 26px 0',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-subtle)',
          }}
        >
          <button
            className={`nav-link-btn ${activeTab === 'overview' ? 'active' : ''}`}
            style={{ width: 'auto', padding: '8px 14px' }}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Fields
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            style={{ width: 'auto', padding: '8px 14px' }}
            onClick={() => setActiveTab('timeline')}
          >
            <History size={14} /> Timeline ({ticket.timeline.length})
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'clarifications' ? 'active' : ''}`}
            style={{ width: 'auto', padding: '8px 14px' }}
            onClick={() => setActiveTab('clarifications')}
          >
            Clarifications ({ticket.clarifications.length})
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'attachments' ? 'active' : ''}`}
            style={{ width: 'auto', padding: '8px 14px' }}
            onClick={() => setActiveTab('attachments')}
          >
            <Paperclip size={14} /> Attachments (2)
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'testing' ? 'active' : ''}`}
            style={{ width: 'auto', padding: '8px 14px' }}
            onClick={() => setActiveTab('testing')}
          >
            <FlaskConical size={14} /> Testing Gate
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="drawer-scroll-body">
          {/* Resolved Action Banner for End User */}
          {ticket.status === 'Resolved' && (
            <div className="alert-card-banner alert-success" style={{ justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} style={{ color: 'var(--emerald)' }} />
                <div>
                  <strong>Resolution Verification Pending</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '13px' }}>
                    The technical team resolved this request. Please verify the fix and close the ticket, or reopen it if the issue persists.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ height: '34px', fontSize: '12.5px' }}
                  onClick={() => onOpenReopenModal(ticket)}
                >
                  Reopen Issue
                </button>
                <button
                  type="button"
                  className="btn-gold"
                  style={{ height: '34px', fontSize: '12.5px' }}
                  onClick={() => onOpenCloseModal(ticket)}
                >
                  Confirm & Close
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Description */}
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  REQUEST DESCRIPTION
                </h4>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-main)', background: 'var(--surface-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  {ticket.description}
                </p>
              </div>

              {/* Dynamic Application Fields */}
              {ticket.dynamicFields && Object.keys(ticket.dynamicFields).length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    APPLICATION QUESTIONNAIRE DATA ({ticket.app})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {Object.entries(ticket.dynamicFields).map(([key, value]) => (
                      <div key={key} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Closure Fields (Section 13: resolution summary, root cause, resolution time, remarks, closure date) */}
              {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '16px 20px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 700, color: '#047857' }}>
                    Resolution Summary & Root Cause (Section 13)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Resolution Summary:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                        {ticket.resolutionSummary || 'Executed script patch in database and recycled application pool.'}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Root Cause:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                        {ticket.rootCause || 'Session deadlock on Oracle RAC instance.'}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Resolution Turnaround Time:</span>
                      <div style={{ fontWeight: 700, color: 'var(--emerald)', marginTop: '2px' }}>
                        {ticket.resolutionTime || '1h 45m'}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Closure Remarks & Verification:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                        {ticket.closureRemarks || 'End user verified operational status.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUDIT TIMELINE (Section 13) */}
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Immutable audit log written automatically per Section 2, Principle 5.
              </div>

              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                <div style={{ position: 'absolute', left: '8px', top: '4px', bottom: '4px', width: '2px', background: 'var(--border)' }} />

                {ticket.timeline.map((item, idx) => (
                  <div key={item.id} style={{ position: 'relative', marginBottom: '20px' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-20px',
                        top: '4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background:
                          item.tone === 'green'
                            ? 'var(--emerald)'
                            : item.tone === 'red'
                            ? 'var(--rose)'
                            : item.tone === 'amber'
                            ? 'var(--amber)'
                            : 'var(--primary)',
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{item.action}</strong>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      By: <b>{item.user}</b> {item.role && `(${item.role})`}
                    </div>
                    {item.note && (
                      <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-main)', background: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLARIFICATIONS (Section 11) */}
          {activeTab === 'clarifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Direct stakeholder clarifications. Under Section 11, email replies automatically sync into this thread.
              </div>

              {ticket.clarifications.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No clarification requests have been raised on this ticket.
                </div>
              ) : (
                ticket.clarifications.map((c) => (
                  <div key={c.id} style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>From: <b>{c.from}</b> &rarr; Target: <b>{c.to}</b></span>
                      <span>{c.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-main)', fontWeight: 500 }}>
                      {c.message}
                    </p>
                  </div>
                ))
              )}

              {/* Add Clarification Form */}
              <form onSubmit={handleAddClarification} style={{ marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Request clarification from:</span>
                  <select
                    className="form-input-control"
                    style={{ width: '180px', height: '32px', fontSize: '12px' }}
                    value={clarificationTargetRole}
                    onChange={(e) => setClarificationTargetRole(e.target.value)}
                  >
                    <option value="End User">End User (Requester)</option>
                    <option value="HOD">Department Head (HOD)</option>
                    <option value="External Vendor">External Vendor</option>
                    <option value="Admin Team">Admin Team</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Type your question or request for technical evidence..."
                    className="form-input-control"
                    value={newClarificationMessage}
                    onChange={(e) => setNewClarificationMessage(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ height: '40px', padding: '0 16px' }}>
                    <Send size={14} /> Send
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: ATTACHMENTS (Section 5 & 13) */}
          {activeTab === 'attachments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Encrypted attachments vault (PNG, JPG, PDF up to 10 MB each).
                </span>
                <label className="btn-secondary" style={{ height: '32px', fontSize: '12px', cursor: 'pointer' }}>
                  <Upload size={13} /> Upload File
                  <input type="file" accept=".png,.jpg,.pdf" style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Paperclip size={18} color="var(--primary)" />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>Flexcube_ORA9021_Error_Stack.png</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2.4 MB &bull; Uploaded with ticket intake</span>
                    </div>
                  </div>
                  <button type="button" className="icon-action-btn" style={{ width: '30px', height: '30px' }}>
                    <Download size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Paperclip size={18} color="var(--primary)" />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>Gateway_Trace_Log.pdf</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>4.1 MB &bull; AES-256 Encrypted</span>
                    </div>
                  </div>
                  <button type="button" className="icon-action-btn" style={{ width: '30px', height: '30px' }}>
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TESTING (Section 6 & 13) */}
          {activeTab === 'testing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="modern-card" style={{ padding: '20px', border: '1.5px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FlaskConical size={20} color="#E11D48" />
                    <strong style={{ fontSize: '15px' }}>Quality Assurance & UAT Verification Gate</strong>
                  </div>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                    QA Passed
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12.5px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Lead QA Tester:</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Fatima Al-Zadjali</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Test Environment:</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>UAT Staging Cluster (v14.7.2)</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Automated Suite:</span>
                    <div style={{ fontWeight: 700, color: 'var(--emerald)' }}>4 of 4 Test Cases Passed</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Regression Risk:</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Zero Defect Verified</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ROLE-BASED ACTION BAR (Section 13) */}
        <div
          style={{
            padding: '14px 26px',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Actions permitted for role: <b>{currentRole}</b>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* HOD Actions: Approve, Reject, Refer to department (Section 3 & 13) */}
            {currentRole === 'HOD' && ticket.status === 'Pending Approval' && (
              <>
                <button type="button" className="btn-secondary" onClick={() => onOpenReferModal(ticket)}>
                  <Share2 size={14} /> Refer to Department
                </button>
                <button type="button" className="btn-secondary" style={{ color: 'var(--rose)' }} onClick={handleHODReject}>
                  Reject
                </button>
                <button type="button" className="btn-primary" onClick={handleHODApprove}>
                  <CheckCircle2 size={14} /> Approve Request
                </button>
              </>
            )}

            {/* Admin Actions: Assign, Reassign, Refer (Section 13) */}
            {currentRole === 'Admin Team' && (
              <>
                <button type="button" className="btn-secondary" onClick={() => onOpenReferModal(ticket)}>
                  <Share2 size={14} /> Refer
                </button>
                <button type="button" className="btn-primary" onClick={() => onOpenAssignModal(ticket)}>
                  <UserCheck size={14} /> Reassign Technician
                </button>
              </>
            )}

            {/* Technician Actions: Resolve, Mark as Change Request, Refer to Admin (Section 13) */}
            {currentRole === 'Technician' && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
              <>
                {ticket.status === 'Assigned' && (
                  <button type="button" className="btn-secondary" onClick={handleTechnicianStart}>
                    Start Work
                  </button>
                )}
                {ticket.type !== 'Change Request' && (
                  <button type="button" className="btn-secondary" onClick={handleTechnicianMarkCR}>
                    <GitBranch size={14} /> Mark as Change Request
                  </button>
                )}
                <button type="button" className="btn-primary" onClick={() => onOpenResolveModal(ticket)}>
                  <CheckCircle2 size={14} /> Mark Resolved
                </button>
              </>
            )}

            {/* End User Actions: Close or Reopen when resolved (Section 13) */}
            {currentRole === 'End User' && ticket.status === 'Resolved' && (
              <>
                <button type="button" className="btn-secondary" onClick={() => onOpenReopenModal(ticket)}>
                  Reopen Issue
                </button>
                <button type="button" className="btn-gold" onClick={() => onOpenCloseModal(ticket)}>
                  <CheckCircle2 size={14} /> Verify & Close
                </button>
              </>
            )}

            {/* Testing Team Actions: Pass or Fail (Section 13) */}
            {currentRole === 'Testing Team' && (
              <>
                <button type="button" className="btn-secondary" style={{ color: 'var(--rose)' }} onClick={handleTestingFail}>
                  Fail QA Test
                </button>
                <button type="button" className="btn-primary" onClick={handleTestingPass}>
                  <CheckCircle2 size={14} /> Pass QA Test
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
