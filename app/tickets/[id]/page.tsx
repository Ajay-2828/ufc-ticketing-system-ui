'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
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
  ShieldCheck,
  Building2,
  FileText,
  User,
  Star,
  CornerDownRight,
  Sparkles,
  MapPin,
  Bell,
  Workflow,
  AlertTriangle,
  Info,
  PauseCircle,
  PlayCircle,
  Tag,
  CheckCheck,
} from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket, Role, usersByRole, classificationTree, departmentsData, usersDirectory } from '@/app/ticket-data'
import { ClassifyChangeRequestModal } from '@/components/tickets/classify-change-request-modal'
import { ForwardToTestingModal } from '@/components/tickets/forward-to-testing-modal'
import { RejectTicketModal } from '@/components/tickets/reject-ticket-modal'
import { EscalateToVendorModal } from '@/components/tickets/escalate-to-vendor-modal'
import { ReasonModal } from '@/components/tickets/reason-modal'
import { SeverityBadge, PriorityBadge } from '@/components/tickets/master-badges'
import { hodRemaining } from '@/lib/workflow'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string

  const {
    tickets,
    currentRole,
    currentUser,
    handleUpdateTicket,
    now,
    hodApprove,
    hodNotApprove,
    markAsChangeRequest,
    adminApproveCR,
    adminRejectCR,
    testingResult,
    submitDraft,
    setTicketToClose,
    setTicketToReopen,
    setTicketToAssign,
    setTicketToResolve,
    setTicketToRefer,
    triggerToast,
  } = useTicketContext()

  const [activeTab, setActiveTab] = useState<
    'details' | 'timeline' | 'clarifications' | 'attachments' | 'testing'
  >('details')
  const [newClarificationMessage, setNewClarificationMessage] = useState('')
  const [clarificationTargetRole, setClarificationTargetRole] = useState('End User')
  const [showClassifyCRModal, setShowClassifyCRModal] = useState(false)
  const [showTestingModal, setShowTestingModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [showCRRejectModal, setShowCRRejectModal] = useState(false)
  const [showTestFailModal, setShowTestFailModal] = useState(false)

  const ticket = useMemo(() => {
    return tickets.find((t) => t.id === ticketId)
  }, [tickets, ticketId])

  if (!ticket) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div
          className="modern-card"
          style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px' }}
        >
          <AlertCircle size={40} color="#DC2626" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>
            Ticket Not Found
          </h2>
          <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Ticket reference &quot;{ticketId}&quot; does not exist or has been archived.
          </p>
          <Link href="/tickets" className="btn-primary">
            Return to Tickets Registry
          </Link>
        </div>
      </div>
    )
  }

  // Detect whether ticket is on Standard Flow vs Change Request Flow
  const isCR = ticket.type === 'Change Request'
  
  // Show QA Testing Tab ONLY when relevant (Change Request or actively in testing)
  const isTestingRelevant = isCR || ticket.status === 'In Testing' || Boolean(ticket.testResults)

  // Find designated technician for sub-classification if ticket is unassigned
  const designatedTechnicianName = useMemo(() => {
    for (const mainCat of classificationTree) {
      const sub = mainCat.subClassifications.find(
        (s) => s.name.toLowerCase() === ticket.app.toLowerCase() || s.name.toLowerCase() === ticket.subClassification?.toLowerCase()
      )
      if (sub && sub.technicians.length > 0) {
        return sub.technicians.join(' & ')
      }
    }
    return 'Daniel Mensah'
  }, [ticket])

  // Look up designated HOD for requester's department from Active Directory / Department matrix
  const departmentHOD = useMemo(() => {
    if (!ticket) return 'Grace Nsubuga'
    const foundDept = departmentsData.find((d) => d.name === ticket.department)
    if (foundDept?.hodName) return foundDept.hodName
    const foundUser = usersDirectory.find((u) => u.name === ticket.creator)
    if (foundUser?.manager) return foundUser.manager
    return 'Grace Nsubuga'
  }, [ticket])

  // Stepper stages matching Scope of Work 3.6 (User ➔ Admin Review ➔ HOD Approval ➔ Management ➔ Implementation ➔ Testing ➔ Closure)
  const stepperStages = isCR
    ? [
        { label: 'User / Intake', actor: 'User / Tech' },
        { label: 'Admin Review', actor: 'Admin Team' },
        { label: 'HOD Approval', actor: 'Dept Head' },
        { label: 'Management', actor: 'Management' },
        { label: 'Implementation', actor: 'Technician' },
        { label: 'Testing', actor: 'Testing Team' },
        { label: 'Closure', actor: 'Requester' },
      ]
    : [
        { label: 'Submitted', actor: 'User' },
        { label: 'HOD Approval', actor: 'HOD (Admin Notified)' },
        { label: 'Auto-Assignment', actor: 'System' },
        { label: 'In Progress', actor: 'Technician' },
        { label: 'Resolved', actor: 'Technician' },
        { label: 'Closed', actor: 'User' },
      ]

  const getStepIndex = (status: Ticket['status'], isChangeRequest: boolean) => {
    if (isChangeRequest) {
      // Admin review, HOD approval (if on), Management, implementation, testing, closure
      switch (status) {
        case 'Draft':
          return 0
        case 'Admin Review':
          return ticket.crStage === 'Implementation' ? 4 : 1
        case 'Pending Approval':
          return 2
        case 'Management Approval':
          return 3
        case 'Assigned':
        case 'In Progress':
        case 'Awaiting Clarification':
          return 4
        case 'In Testing':
          return 5
        case 'Resolved':
        case 'Closed':
          return 6
        default:
          return 1
      }
    } else {
      switch (status) {
        case 'Pending Approval':
          return 1
        case 'Assigned':
          return 2
        case 'In Progress':
        case 'Awaiting Clarification':
          return 3
        case 'Resolved':
          return 4
        case 'Closed':
          return 5
        case 'Reopened':
        case 'Admin Review':
          return 1
        default:
          return 0
      }
    }
  }

  const currentStepIndex = getStepIndex(ticket.status, isCR)

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

  // Where the ticket is currently at description
  const currentStateInfo = useMemo(() => {
    if (ticket.status === 'Draft') {
      return {
        actor: `${ticket.creator} (Requester)`,
        queue: 'Drafts',
        statusSummary: 'Saved by the requester. Not yet submitted.',
        adminNotified: 'Nobody notified yet',
        nextStep: 'The requester submits it for approval.',
      }
    }
    if (ticket.status === 'Rejected') {
      return {
        actor: 'Closed as rejected',
        queue: 'Historical Registry',
        statusSummary: ticket.closureRemarks || 'Rejected.',
        adminNotified: 'Requester and Admin notified',
        nextStep: 'No further steps.',
      }
    }
    if (ticket.status === 'Management Approval') {
      return {
        actor: 'Management',
        queue: 'Management decisions',
        statusSummary: 'Admin and the Department Head have approved the change. Waiting for the Management decision.',
        adminNotified: 'Admin informed',
        nextStep: 'Approved: Admin assigns the implementation. Rejected: the change is closed as rejected.',
      }
    }
    if (ticket.status === 'Admin Review' && !isCR) {
      return {
        actor: 'Admin team',
        queue: 'Admin Queue',
        statusSummary: ticket.hodRejection
          ? `The Department Head did not approve (${ticket.hodRejection.category}). Admin decides what happens next.`
          : 'No technician was available. Admin assigns the ticket.',
        adminNotified: 'Admin alert received',
        nextStep: 'Admin assigns, asks for clarification, forwards to a department or vendor, or rejects.',
      }
    }
    if (ticket.status === 'Admin Review' && isCR && ticket.crStage === 'Implementation') {
      return {
        actor: 'Admin team',
        queue: 'Admin Queue',
        statusSummary: 'Management approved the change. Admin assigns who implements it.',
        adminNotified: 'Admin alert received',
        nextStep: 'Admin assigns a technician, developer, infrastructure engineer or vendor.',
      }
    }
    if (isCR) {
      switch (ticket.status) {
        case 'Admin Review':
          return {
            actor: 'Amara Okafor (Service Desk Administrator)',
            queue: 'Admin Queue (Exceptions)',
            statusSummary: 'Technician flagged this as a Change Request. Awaiting Admin Team review for risk assessment and change window approval.',
            adminNotified: 'Admin Alert Received & Logged',
            nextStep: `Admin approves ➔ Routes to the Department Head (${departmentHOD}) if HOD approval is on, then Management.`,
          }
        case 'Pending Approval':
          return {
            actor: `${departmentHOD} (Head of ${ticket.department})`,
            queue: 'Department Approvals Queue',
            statusSummary: 'Admin Team authorized change scope. Currently awaiting formal Change Approval from Department Head.',
            adminNotified: 'Admin Informed of Progression',
            nextStep: 'HOD approval ➔ Routes to Executive Management sign-off.',
          }
        case 'In Progress':
          return {
            actor: `${ticket.assignee === 'Unassigned' ? designatedTechnicianName : ticket.assignee} (Implementation Lead)`,
            queue: 'Technician Work Queue',
            statusSummary: 'Change Request fully authorized. Technician is executing deployment during the maintenance window.',
            adminNotified: 'Admin Monitoring Implementation',
            nextStep: 'Deployment complete ➔ Dispatched to QA Testing Team.',
          }
        case 'In Testing':
          return {
            actor: 'Fatima Al-Zadjali (Lead QA Engineer)',
            queue: 'Testing QA Queue',
            statusSummary: 'Deployment completed on staging. QA Testing Team is validating functional and regression test criteria.',
            adminNotified: 'Admin Monitored QA Release',
            nextStep: 'QA Pass ➔ Marks Resolved and alerts requester for sign-off.',
          }
        case 'Resolved':
          return {
            actor: `${ticket.creator} (Ticket Requester)`,
            queue: 'User Verification Queue',
            statusSummary: 'Change Request verified and marked Resolved. Awaiting end user sign-off to close.',
            adminNotified: 'Admin Notified of Resolution',
            nextStep: 'Requester verifies and confirms closure (or reopens to Admin).',
          }
        case 'Closed':
          return {
            actor: 'Closed & Archived',
            queue: 'Historical Registry',
            statusSummary: 'Change Request successfully deployed, tested, and closed by requester.',
            adminNotified: 'Admin Closure Audit Logged',
            nextStep: 'Lifecycle complete.',
          }
        default:
          return {
            actor: 'Admin Team Oversight',
            queue: 'Admin Queue',
            statusSummary: 'Change Request under Admin Team supervision.',
            adminNotified: 'Admin Notified',
            nextStep: 'Change workflow progression.',
          }
      }
    } else {
      switch (ticket.status) {
        case 'Pending Approval':
          return {
            actor: `${departmentHOD} (Head of ${ticket.department})`,
            queue: 'Department Approvals Queue',
            statusSummary: 'Awaiting initial approval from Department Head. Admin Team has received an intake notification.',
            adminNotified: 'Admin Intake Notification Dispatched',
            nextStep: `Once approved ➔ Auto-assigned to designated technician (${designatedTechnicianName}).`,
          }
        case 'Assigned':
          return {
            actor: `${ticket.assignee === 'Unassigned' ? designatedTechnicianName : ticket.assignee} (Assigned Engineer)`,
            queue: 'Technician Work Queue',
            statusSummary: 'Approved by Department Head. Automatically assigned to technician via classification matrix. Admin notified.',
            adminNotified: 'Admin Notified of Auto-Assignment',
            nextStep: 'Technician accepts ticket into active queue and starts diagnosis.',
          }
        case 'In Progress':
          return {
            actor: `${ticket.assignee === 'Unassigned' ? designatedTechnicianName : ticket.assignee} (Assigned Engineer)`,
            queue: 'Technician Work Queue',
            statusSummary: 'Technician is actively working on the resolution against established SLA timers.',
            adminNotified: 'Admin SLA Timer Active',
            nextStep: 'Technician applies fix and marks ticket as Resolved.',
          }
        case 'Awaiting Clarification':
          return {
            actor: `${ticket.creator} (Ticket Requester)`,
            queue: 'User Clarification Queue',
            statusSummary: 'Technician requested specific details from the user. SLA clock is PAUSED until user replies.',
            adminNotified: 'SLA Clock Paused (Pending Customer)',
            nextStep: 'User response resumes SLA clock and alerts technician.',
          }
        case 'Resolved':
          return {
            actor: `${ticket.creator} (Ticket Requester)`,
            queue: 'User Verification Queue',
            statusSummary: 'Technician marked solution as resolved. Awaiting user verification and closure.',
            adminNotified: 'Admin Notified of Resolution',
            nextStep: 'Requester confirms fix and closes ticket (or reopens to Admin).',
          }
        case 'Closed':
          return {
            actor: 'Closed & Archived',
            queue: 'Historical Registry',
            statusSummary: 'Ticket successfully verified and closed by requester. All SLAs archived.',
            adminNotified: 'Admin Closure Audit Logged',
            nextStep: 'Lifecycle complete.',
          }
        case 'Reopened':
          return {
            actor: 'Amara Okafor (Service Desk Administrator)',
            queue: 'Admin Queue (Exceptions)',
            statusSummary: 'User reported issue persists upon verification. Ticket bypassed technician and routed to Admin Queue for audit.',
            adminNotified: 'Admin Exception Alert Triggered',
            nextStep: 'Admin reassigns technician or refers for investigation.',
          }
        default:
          return {
            actor: `${ticket.assignee === 'Unassigned' ? designatedTechnicianName : ticket.assignee}`,
            queue: 'Active Queue',
            statusSummary: 'Ticket progressing along its standard resolution flow.',
            adminNotified: 'Admin Notified',
            nextStep: 'Standard lifecycle progression.',
          }
      }
    }
  }, [ticket, isCR, designatedTechnicianName, departmentHOD])

  // Lifecycle Action Handlers
  const handleHODApprove = () => {
    hodApprove(ticket)
  }

  const handleHODReject = () => {
    setShowRejectModal(true)
  }

  const handleConfirmRejectModal = (_targetTicketId: string, reason: string, category: string) => {
    hodNotApprove(ticket, reason, category)
    setShowRejectModal(false)
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
          note: 'Accepted ticket into active queue with established turnaround ETA.',
          tone: 'blue',
        },
      ],
    }
    handleUpdateTicket(updated)
    triggerToast('Ticket moved to In Progress!')
  }

  const handleConfirmClassifyCR = (
    _targetTicketId: string,
    justification: string,
    requiresHodApproval: boolean
  ) => {
    markAsChangeRequest(ticket, justification, requiresHodApproval)
  }

  const handleConfirmForwardToTesting = (
    targetTicketId: string,
    notes: string,
    environment: string,
    tester: string
  ) => {
    const updated: Ticket = {
      ...ticket,
      status: 'In Testing',
      crStage: 'Testing' as const,
      tester: tester,
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: currentRole,
          action: 'Implementation Complete & Forwarded to Testing Team',
          note: `Technician completed implementation work on ${environment}. Forwarded to Testing Team (${tester}) for QA verification. Implementation notes: ${notes}`,
          tone: 'blue',
        },
        {
          id: `t-${Date.now() + 1}`,
          time: 'Just now',
          user: 'System Notification Service',
          role: 'System',
          action: 'Testing Queue Intake Dispatched',
          note: `QA tester ${tester} alerted for staging verification.`,
          tone: 'green',
        },
      ],
    }
    handleUpdateTicket(updated)
    triggerToast('Implementation complete! Forwarded to Testing Team for QA verification.')
  }

  const handleConfirmVendorEscalate = (
    targetTicketId: string,
    vendorName: string,
    mode: 'co-assign' | 'handover',
    diagnosticNotes: string
  ) => {
    if (!ticket) return

    const isHandover = mode === 'handover'
    const updated: Ticket = {
      ...ticket,
      vendor: vendorName,
      coAssignee: isHandover ? ticket.coAssignee : vendorName,
      assignee: isHandover ? vendorName : ticket.assignee,
      assigneeRole: isHandover ? 'External Vendor' : ticket.assigneeRole,
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: currentRole,
          action: isHandover ? 'Ticket Transferred to External Vendor' : 'External Vendor Co-Assigned',
          note: `Escalated to ${vendorName} by ${currentUser.name} (${currentRole}). Mode: ${
            isHandover ? 'Full Handover / Ownership Transfer' : 'Collaborative Co-Assignment'
          }. Diagnostic: ${diagnosticNotes}`,
          tone: 'purple' as const,
        },
        {
          id: `t-${Date.now() + 1}`,
          time: 'Just now',
          user: 'System Notification Service',
          role: 'System',
          action: 'Vendor Dispatch Notification Sent',
          note: `Secure dispatch sent to ${vendorName} partner lead via Vendor Portal gateway. Response SLA timer monitored.`,
          tone: 'blue' as const,
        },
      ],
    }

    handleUpdateTicket(updated)
    setShowVendorModal(false)
    triggerToast(
      isHandover
        ? `Ticket transferred to ${vendorName} as primary assignee!`
        : `External vendor ${vendorName} co-assigned to ticket!`
    )
  }

  const handleAdminApproveCR = () => {
    adminApproveCR(ticket)
  }

  const handleAdminRejectCR = () => {
    setShowCRRejectModal(true)
  }

  const handleTestingPass = () => {
    testingResult(ticket, true, 'Verified in the test environment.')
  }

  const handleTestingFail = () => {
    setShowTestFailModal(true)
  }

  const handlePostClarification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClarificationMessage.trim()) return

    const isTargetUser = clarificationTargetRole === 'End User'
    const newEntry = {
      id: `c-${Date.now()}`,
      time: 'Just now',
      from: `${currentUser.name} (${currentRole})`,
      to: clarificationTargetRole,
      targetRole: clarificationTargetRole,
      message: newClarificationMessage.trim(),
    }

    const nextStatus: Ticket['status'] = isTargetUser && ticket.status === 'In Progress'
      ? 'Awaiting Clarification'
      : ticket.status

    const updated: Ticket = {
      ...ticket,
      status: nextStatus,
      clarifications: [...ticket.clarifications, newEntry],
      timeline: [
        ...ticket.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: currentRole,
          action: `Clarification Requested from ${clarificationTargetRole}`,
          note: newClarificationMessage.trim() + (isTargetUser ? ' (SLA Timer Paused until user response)' : ''),
          tone: 'purple',
        },
      ],
    }

    handleUpdateTicket(updated)
    setNewClarificationMessage('')
    triggerToast(
      isTargetUser
        ? 'Clarification requested! Ticket set to Awaiting Clarification and SLA paused.'
        : 'Clarification request posted to history.'
    )
  }

  const isClarificationPaused = ticket.status === 'Awaiting Clarification'

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Top Breadcrumb Link */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/tickets"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--primary)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Tickets Registry</span>
        </Link>
      </div>

      {/* UNIFIED MAIN CONTAINER (No awkward sidebar) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 1. Header Card with integrated Badges & SLA Countdown */}
        <div className="modern-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  background: 'var(--primary-soft)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                {ticket.id}
              </span>

              <span
                className="badge-tag"
                style={{
                  background: ticket.type === 'Change Request' ? '#F5F3FF' : '#EFF6FF',
                  color: ticket.type === 'Change Request' ? '#6D28D9' : '#1D4ED8',
                  fontWeight: 600,
                }}
              >
                {ticket.type}
              </span>

              <span className={`badge-tag ${getStatusBadge(ticket.status)}`}>
                {ticket.status}
              </span>

              <SeverityBadge id={ticket.severity} prefix="Severity: " />

              <PriorityBadge id={ticket.priority} prefix="Priority: " />

              <span
                className="badge-tag"
                style={{
                  background: '#ECFDF5',
                  color: '#047857',
                  fontWeight: 600,
                }}
              >
                <Workflow size={12} style={{ marginRight: '4px' }} />
                {isCR ? 'Change Request Workflow' : 'Standard Ticket Workflow'}
              </span>
            </div>

            {/* SLA Countdown pill in Header */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: ticket.slaBreached
                  ? '#FEF2F2'
                  : isClarificationPaused
                  ? '#FFFBEB'
                  : '#ECFDF5',
                border: ticket.slaBreached
                  ? '1px solid #FECACA'
                  : isClarificationPaused
                  ? '1px solid #FDE68A'
                  : '1px solid #A7F3D0',
                color: ticket.slaBreached
                  ? '#B91C1C'
                  : isClarificationPaused
                  ? '#B45309'
                  : '#047857',
              }}
            >
              {isClarificationPaused ? <PauseCircle size={15} /> : <Clock size={15} />}
              <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {ticket.slaBreached
                  ? 'SLA BREACHED'
                  : isClarificationPaused
                  ? 'SLA PAUSED (Awaiting Customer)'
                  : `${ticket.slaTimeRemaining} remaining`}
              </span>
            </div>
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: 1.3,
            }}
          >
            {ticket.subject}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap',
            }}
          >
            <span>
              <strong>Requester:</strong> {ticket.creator} ({ticket.department})
            </span>
            <span>&bull;</span>
            <span>
              <strong>Application:</strong> {ticket.app} ({ticket.classification})
            </span>
            <span>&bull;</span>
            <span>
              <strong>Designated Assignee:</strong> {ticket.assignee === 'Unassigned' ? `${designatedTechnicianName} (Upon approval)` : ticket.assignee}
            </span>
            <span>&bull;</span>
            <span>
              <strong>Created:</strong> {ticket.created}
            </span>
          </div>

          {/* Top Quick Actions Toolbar */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Viewing as <strong>{currentRole}</strong> ({currentUser.name})
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Technician Primary Actions */}
              {currentRole === 'Technician' && (
                <>
                  {ticket.type !== 'Change Request' && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        height: '32px',
                        fontSize: '12px',
                        color: '#7C3AED',
                        borderColor: '#DDD6FE',
                        background: '#F5F3FF',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onClick={() => setShowClassifyCRModal(true)}
                    >
                      <GitBranch size={14} /> Convert to Change Request
                    </button>
                  )}

                  {ticket.status === 'Assigned' && (
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ height: '32px', fontSize: '12px', gap: '6px' }}
                      onClick={handleTechnicianStart}
                    >
                      Start Work
                    </button>
                  )}

                  {ticket.status === 'In Progress' && ticket.type === 'Change Request' && (
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ height: '32px', fontSize: '12px', background: '#BE185D', borderColor: '#9D174D', gap: '6px' }}
                      onClick={() => setShowTestingModal(true)}
                    >
                      <FlaskConical size={14} /> Complete Work &amp; Forward to Testing
                    </button>
                  )}

                  {ticket.status === 'In Progress' && ticket.type !== 'Change Request' && (
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ height: '32px', fontSize: '12px', gap: '6px' }}
                      onClick={() => setTicketToResolve(ticket)}
                    >
                      <CheckCircle2 size={14} /> Mark Resolved
                    </button>
                  )}

                  {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        height: '32px',
                        fontSize: '12px',
                        color: '#0D9488',
                        borderColor: '#99F6E4',
                        background: '#F0FDFA',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onClick={() => setShowVendorModal(true)}
                    >
                      <Building2 size={14} /> Escalate to Vendor
                    </button>
                  )}
                </>
              )}

              {/* HOD Primary Actions */}
              {currentRole === 'HOD' && ticket.status === 'Pending Approval' && (
                <>
                  {!isCR && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '32px', fontSize: '12px', color: '#7C3AED', borderColor: '#DDD6FE', background: '#F5F3FF' }}
                      onClick={() => setShowClassifyCRModal(true)}
                    >
                      <GitBranch size={14} /> Mark as CR
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ height: '32px', fontSize: '12px', color: '#DC2626', borderColor: '#FCA5A5' }}
                    onClick={handleHODReject}
                  >
                    {isCR ? 'Reject' : 'Do Not Approve'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ height: '32px', fontSize: '12px', gap: '6px' }}
                    onClick={handleHODApprove}
                  >
                    <CheckCircle2 size={14} /> Approve Request
                  </button>
                </>
              )}

              {/* Admin Primary Actions */}
              {currentRole === 'Admin Team' && ticket.status === 'Admin Review' && isCR && ticket.crStage !== 'Implementation' && (
                <>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ height: '32px', fontSize: '12px', color: '#DC2626', borderColor: '#FCA5A5' }}
                    onClick={handleAdminRejectCR}
                  >
                    Reject CR
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ height: '32px', fontSize: '12px', gap: '6px' }}
                    onClick={handleAdminApproveCR}
                  >
                    <CheckCircle2 size={14} /> Approve CR
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Draft: the requester submits it for approval */}
        {ticket.status === 'Draft' && (
          <div className="modern-card" style={{ padding: '14px 20px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px' }}>
              <strong>Draft.</strong> Not submitted yet. Nobody has been notified.
            </span>
            {ticket.creator === currentUser.name && (
              <button type="button" className="btn-primary" onClick={() => submitDraft(ticket)}>
                Submit for approval
              </button>
            )}
          </div>
        )}

        {/* HOD did not approve: now with the Admin team */}
        {ticket.status === 'Admin Review' && ticket.hodRejection && (
          <div className="modern-card" style={{ padding: '14px 20px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <strong style={{ fontSize: '13.5px', color: '#991B1B' }}>
              Not approved by the Department Head ({ticket.hodRejection.by})
            </strong>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#7F1D1D' }}>
              {ticket.hodRejection.category}: {ticket.hodRejection.reason}. The Admin team decides: assign, ask for clarification, forward to a department or vendor, or reject.
            </p>
          </div>
        )}

        {/* 1.5 Pending HOD Approval Banner */}
        {ticket.status === 'Pending Approval' && (
          <div
            className="modern-card"
            style={{
              padding: '16px 20px',
              borderRadius: '10px',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '14.5px', color: '#92400E' }}>
                    Awaiting Department Head (HOD) Approval
                  </strong>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#FEF3C7', color: '#B45309', fontWeight: 700 }}>
                    Stage 2: Pending
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#B45309' }}>
                  This ticket has been sent to <strong>{departmentHOD}</strong> (Head of {ticket.department}) for authorization before work begins.
                  {hodRemaining(ticket, now) ? ` Approval time limit: ${hodRemaining(ticket, now)}.` : ''}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentRole === 'HOD' ? (
                <span className="badge-tag" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 700, padding: '6px 12px' }}>
                  Action Required by You
                </span>
              ) : (
                <span className="badge-tag" style={{ background: '#FFFFFF', color: '#B45309', border: '1px solid #FDE68A', fontWeight: 600, padding: '6px 12px' }}>
                  Automated Alert Dispatched to {departmentHOD}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 2. Sleek Connected Stepper Bar */}
        <div className="modern-card" style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isCR ? 'Change Request Lifecycle Tracker' : 'Standard Ticket Resolution Stepper'}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Step {currentStepIndex + 1} of {stepperStages.length}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {stepperStages.map((stage, idx) => {
              const isPast = idx < currentStepIndex
              const isCurrent = idx === currentStepIndex

              return (
                <React.Fragment key={stage.label}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: isPast
                          ? '#ECFDF5'
                          : isCurrent
                          ? 'var(--primary)'
                          : '#F1F5F9',
                        color: isPast
                          ? '#047857'
                          : isCurrent
                          ? '#FFFFFF'
                          : '#64748B',
                        border: isPast
                          ? '1px solid #A7F3D0'
                          : isCurrent
                          ? 'none'
                          : '1px solid var(--border)',
                        boxShadow: isCurrent ? '0 0 0 3px rgba(37, 99, 235, 0.2)' : 'none',
                      }}
                    >
                      {isPast ? <Check size={13} strokeWidth={3} /> : idx + 1}
                    </div>

                    <div style={{ lineHeight: 1.1 }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? 'var(--primary)' : isPast ? 'var(--text-main)' : 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {stage.label}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {stage.actor}
                      </div>
                    </div>
                  </div>

                  {/* Connected line */}
                  {idx < stepperStages.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        minWidth: '24px',
                        height: '2px',
                        background: isPast ? '#10B981' : 'var(--border)',
                        margin: '0 10px',
                      }}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* 3. Aggregated Tabs Container */}
        <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 24px 0',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface-subtle)',
              overflowX: 'auto',
            }}
          >
            <button
              type="button"
              className={`nav-link-btn ${activeTab === 'details' ? 'active' : ''}`}
              style={{ width: 'auto', padding: '9px 16px', fontSize: '13px' }}
              onClick={() => setActiveTab('details')}
            >
              Overview &amp; Details
            </button>

            <button
              type="button"
              className={`nav-link-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              style={{ width: 'auto', padding: '9px 16px', fontSize: '13px' }}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline ({ticket.timeline.length})
            </button>

            <button
              type="button"
              className={`nav-link-btn ${activeTab === 'clarifications' ? 'active' : ''}`}
              style={{ width: 'auto', padding: '9px 16px', fontSize: '13px' }}
              onClick={() => setActiveTab('clarifications')}
            >
              Clarifications ({ticket.clarifications.length})
            </button>

            <button
              type="button"
              className={`nav-link-btn ${activeTab === 'attachments' ? 'active' : ''}`}
              style={{ width: 'auto', padding: '9px 16px', fontSize: '13px' }}
              onClick={() => setActiveTab('attachments')}
            >
              Attachments (2)
            </button>

            {/* QA Testing Tab: CONDITIONAL! Only shown for Change Requests or when in Testing */}
            {isTestingRelevant && (
              <button
                type="button"
                className={`nav-link-btn ${activeTab === 'testing' ? 'active' : ''}`}
                style={{ width: 'auto', padding: '9px 16px', fontSize: '13px' }}
                onClick={() => setActiveTab('testing')}
              >
                QA Testing
              </button>
            )}
          </div>

          {/* Tab Body */}
          <div style={{ padding: '24px 28px' }}>
            {/* TAB 1: OVERVIEW & DETAILS */}
            {activeTab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                {/* Active Cross-Department Referral Banner if present */}
                {ticket.referral && (
                  <div
                    style={{
                      padding: '14px 18px',
                      background: '#FAF5FF',
                      border: '1px solid #E9D5FF',
                      borderLeft: '4px solid #9333EA',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <Share2 size={18} color="#9333EA" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ fontSize: '13px' }}>
                      <div style={{ fontWeight: 700, color: '#6B21A8', marginBottom: '2px' }}>
                        Cross-Department Referral &bull; Awaiting {ticket.referral.department} Assessment
                      </div>
                      <p style={{ margin: 0, color: '#7E22CE', lineHeight: 1.5 }}>
                        <strong>Referred by {ticket.referral.referredBy}:</strong> {ticket.referral.reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Section A: Live Journey & Current State Box */}
                <div
                  style={{
                    padding: '18px 22px',
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 100%)',
                    border: '1px solid #DBEAFE',
                    borderLeft: '4px solid var(--primary)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={15} color="var(--primary)" />
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', fontWeight: 800 }}>
                          Current Stage &amp; Active Queue
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: '#047857',
                          background: '#ECFDF5',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          border: '1px solid #A7F3D0',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                        {currentStateInfo.adminNotified}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                      Currently with: <span style={{ color: 'var(--primary)' }}>{currentStateInfo.actor}</span>
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        background: '#FFFFFF',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        color: 'var(--text-secondary)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      }}
                    >
                      {currentStateInfo.queue}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {currentStateInfo.statusSummary}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      background: '#FFFFFF',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid #BFDBFE',
                      boxShadow: '0 1px 2px rgba(37,99,235,0.06)',
                    }}
                  >
                    <ArrowRight size={14} />
                    <span>Next Milestone: <strong>{currentStateInfo.nextStep}</strong></span>
                  </div>
                </div>

                {/* Section B: Request Description */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={15} color="var(--primary)" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                          Issue Narrative &amp; Reported Impact
                        </h4>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Detailed symptom description submitted by {ticket.creator} ({ticket.department})
                        </span>
                      </div>
                    </div>

                    <span className="badge-tag" style={{ background: '#F8FAFC', color: 'var(--text-secondary)', fontSize: '11.5px', fontWeight: 600 }}>
                      Verified Requester Statement
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '14px 18px',
                      background: 'var(--surface-subtle)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--primary)',
                      fontSize: '14px',
                      lineHeight: 1.65,
                      color: 'var(--text-main)',
                      fontWeight: 500,
                    }}
                  >
                    {ticket.description}
                  </div>
                </div>

                {/* Section C: Technical Questionnaire Intake Fields */}
                {ticket.dynamicFields && Object.keys(ticket.dynamicFields).length > 0 && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Tag size={15} color="#7C3AED" />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Technical Intake Specifications
                          </h4>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            System-specific questionnaire parameters submitted for {ticket.app}
                          </span>
                        </div>
                      </div>

                      <span className="badge-tag" style={{ background: '#F5F3FF', color: '#6D28D9', fontWeight: 600, border: '1px solid #DDD6FE' }}>
                        {ticket.app} Intake Form
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '14px',
                      }}
                    >
                      {Object.entries(ticket.dynamicFields).map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            padding: '14px 16px',
                            background: 'var(--surface-subtle)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                          </span>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', wordBreak: 'break-word', fontFamily: String(v).includes('@') || String(v).includes('.') ? 'var(--font-mono)' : 'inherit' }}>
                            {String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section D: Routing Matrix, SLAs & Requester Context in a Clean Grid */}
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {/* Card 1: ITIL Classification & SLA Governance */}
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShieldCheck size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Classification &amp; SLA Governance
                          </h4>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            Automated routing &amp; escalation matrix
                          </span>
                        </div>
                      </div>

                      {/* Hierarchy Row */}
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                          Service Catalog Hierarchy
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span className="badge-tag" style={{ background: '#F1F5F9', color: 'var(--text-main)', fontWeight: 600 }}>
                            {ticket.classification}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>&rarr;</span>
                          <span className="badge-tag" style={{ background: '#EFF6FF', color: 'var(--primary)', fontWeight: 700, border: '1px solid #BFDBFE' }}>
                            {ticket.app}
                          </span>
                        </div>
                      </div>

                      {/* Assigned Specialist Row */}
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                          Designated Resolver Group
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EEF2FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                            {designatedTechnicianName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                              {designatedTechnicianName}
                            </strong>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              {ticket.assignee === 'Unassigned' ? 'Auto-routed on HOD Approval' : 'Primary Active Resolver'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SLA Targets Grid */}
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                          SLA Contract Targets
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div style={{ padding: '10px 12px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Response SLA</span>
                            <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                              {ticket.severity === 'Critical' ? '30m' : ticket.severity === 'High' ? '1h' : ticket.severity === 'Medium' ? '2h' : '4h'} target
                            </strong>
                          </div>
                          <div style={{ padding: '10px 12px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Resolution SLA</span>
                            <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                              {ticket.sla} guarantee
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Clock State Row */}
                      <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SLA Timer Engine:</span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: ticket.slaBreached ? '#FEF2F2' : isClarificationPaused ? '#FFFBEB' : '#ECFDF5',
                            color: ticket.slaBreached ? '#DC2626' : isClarificationPaused ? '#D97706' : '#059669',
                            border: `1px solid ${ticket.slaBreached ? '#FECACA' : isClarificationPaused ? '#FDE68A' : '#A7F3D0'}`,
                          }}
                        >
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ticket.slaBreached ? '#DC2626' : isClarificationPaused ? '#D97706' : '#10B981' }} />
                          {ticket.slaBreached ? 'Breached' : isClarificationPaused ? 'Clock Paused (Customer Action)' : `Active (${ticket.slaTimeRemaining} remaining)`}
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Requester Profile & Directory Context */}
                    <div
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Requester Directory Profile
                          </h4>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            Active Directory employee identity
                          </span>
                        </div>
                      </div>

                      {/* Requester Identity Hero */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#DBEAFE', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800 }}>
                          {ticket.creator.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <strong style={{ fontSize: '14.5px', color: 'var(--text-main)', display: 'block' }}>
                            {ticket.creator}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                            <span className="badge-tag" style={{ background: '#EFF6FF', color: 'var(--primary)', fontSize: '11px', padding: '2px 8px', fontWeight: 600 }}>
                              {ticket.department}
                            </span>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Verified Staff</span>
                          </div>
                        </div>
                      </div>

                      {/* Reporting Manager (HOD) */}
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                          Reporting Manager &amp; Department Head (HOD)
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                            {departmentHOD.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block' }}>
                              {departmentHOD}
                            </strong>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              Authorized Department Approver
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Directory Sync & Multi-Factor Status */}
                      <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            background: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            borderRadius: '8px',
                            color: '#166534',
                            fontSize: '12px',
                          }}
                        >
                          <CheckCircle2 size={16} color="#059669" />
                          <span>
                            <strong>Active Directory Synced</strong> &bull; Authenticated Internal Profile
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section E: Resolution Summary (if Resolved or Closed) */}
                {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                  <div
                    style={{
                      padding: '20px 24px',
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <CheckCircle2 size={18} color="#059669" />
                      <strong style={{ fontSize: '14.5px', color: '#166534' }}>
                        Resolution Summary &amp; Root Cause Analysis
                      </strong>
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: '13.5px', color: '#15803D', lineHeight: 1.6 }}>
                      {ticket.resolutionSummary || 'Technical issue investigated and resolved by designated specialist.'}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12.5px', color: '#166534', paddingTop: '12px', borderTop: '1px solid #DCFCE7' }}>
                      <div>
                        <span style={{ color: '#15803D' }}>Root Cause:</span>{' '}
                        <strong style={{ color: '#166534' }}>{ticket.rootCause || 'Configuration corrected'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#15803D' }}>Resolution Turnaround:</span>{' '}
                        <strong style={{ color: '#166534' }}>{ticket.resolutionTime || '3.5 hours'}</strong>
                      </div>
                      {ticket.closureRemarks && (
                        <div>
                          <span style={{ color: '#15803D' }}>Closure Remarks:</span>{' '}
                          <strong style={{ color: '#166534' }}>{ticket.closureRemarks}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: TIMELINE */}
            {activeTab === 'timeline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ticket.timeline.map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px 16px',
                      background: 'var(--surface-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background:
                          evt.tone === 'green'
                            ? '#DCFCE7'
                            : evt.tone === 'red'
                            ? '#FEE2E2'
                            : evt.tone === 'purple'
                            ? '#F3E8FF'
                            : '#DBEAFE',
                        color:
                          evt.tone === 'green'
                            ? '#166534'
                            : evt.tone === 'red'
                            ? '#991B1B'
                            : evt.tone === 'purple'
                            ? '#6B21A8'
                            : '#1E40AF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {evt.user.split(' ').map((n) => n[0]).join('')}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
                          {evt.action}
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{evt.time}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginBottom: '2px' }}>
                        {evt.user} {evt.role ? `(${evt.role})` : ''}
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {evt.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: CLARIFICATIONS */}
            {activeTab === 'clarifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Clarification SLA Pausing Guidance Box */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#92400E',
                  }}
                >
                  <PauseCircle size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>SLA Clock Pausing Rule:</strong> When clarification is requested from the user, the technician resolution clock pauses automatically until the user responds, protecting SLA integrity.
                  </div>
                </div>

                {ticket.clarifications.length === 0 ? (
                  <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No clarification requests have been logged on this ticket.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {ticket.clarifications.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          padding: '12px 16px',
                          background: '#FFFFFF',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                            {c.from} &rarr; {c.to || c.targetRole}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-main)', lineHeight: 1.4 }}>
                          {c.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Clarification Form */}
                <form
                  onSubmit={handlePostClarification}
                  style={{
                    padding: '16px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Request clarification from:
                    </span>
                    <select
                      className="form-input-control"
                      style={{ width: 'auto', height: '32px', fontSize: '12px' }}
                      value={clarificationTargetRole}
                      onChange={(e) => setClarificationTargetRole(e.target.value)}
                    >
                      <option value="End User">Ticket Requester (End User)</option>
                      <option value="HOD">Department Head (HOD)</option>
                      <option value="Admin Team">Admin Team</option>
                      <option value="Risk & Compliance">Risk &amp; Compliance</option>
                      <option value="Operations">Operations Department</option>
                      <option value="External Vendor">External Vendor</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    className="form-input-control"
                    style={{ height: 'auto', padding: '8px 10px', fontSize: '12.5px' }}
                    placeholder="Type your question or clarification request..."
                    value={newClarificationMessage}
                    onChange={(e) => setNewClarificationMessage(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ marginTop: '8px', height: '32px', fontSize: '12px' }}
                    disabled={!newClarificationMessage.trim()}
                  >
                    <Send size={13} /> Send Clarification Request
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: ATTACHMENTS */}
            {activeTab === 'attachments' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} color="var(--primary)" />
                    <div>
                      <strong style={{ fontSize: '12.5px', color: 'var(--text-main)', display: 'block' }}>
                        error_trace_dump_401.log
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>42 KB &bull; Intake attachment</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="icon-action-btn"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => triggerToast('Downloading error_trace_dump_401.log...')}
                  >
                    <Download size={14} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} color="var(--primary)" />
                    <div>
                      <strong style={{ fontSize: '12.5px', color: 'var(--text-main)', display: 'block' }}>
                        technical_specification.pdf
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>248 KB &bull; Specification document</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="icon-action-btn"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => triggerToast('Downloading technical_specification.pdf...')}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: QA TESTING (CONDITIONAL) */}
            {isTestingRelevant && activeTab === 'testing' && (
              <div style={{ padding: '16px 20px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FlaskConical size={18} color="var(--primary)" />
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                      Quality Assurance Validation
                    </strong>
                  </div>
                  <span
                    className="badge-tag"
                    style={{
                      background: ticket.status === 'In Testing' ? '#FFFBEB' : '#DCFCE7',
                      color: ticket.status === 'In Testing' ? '#B45309' : '#15803D',
                    }}
                  >
                    {ticket.status === 'In Testing' ? 'Awaiting QA Verification' : 'Verified by QA Team'}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Testing Lead: <strong>Fatima Al-Zadjali</strong>. Verified on UAT staging environment against functional criteria before production closure.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Role-Based Action Bar */}
        <div
          className="modern-card"
          style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: '#FFFFFF',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Actions available for <strong>{currentRole}</strong>
          </span>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* HOD Actions */}
            {currentRole === 'HOD' && ticket.status === 'Pending Approval' && (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setTicketToRefer(ticket)}
                >
                  <Share2 size={14} /> Refer to Department
                </button>
                {!isCR && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowClassifyCRModal(true)}
                  >
                    <GitBranch size={14} /> Mark as Change Request
                  </button>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                  onClick={handleHODReject}
                >
                  {isCR ? 'Reject Change' : 'Do Not Approve'}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleHODApprove}
                >
                  <CheckCircle2 size={14} /> {isCR ? 'Approve Change' : 'Approve Request'}
                </button>
              </>
            )}

            {/* Technician Actions */}
            {currentRole === 'Technician' && (
              <>
                {ticket.status === 'Assigned' && (
                  <>
                    {ticket.type !== 'Change Request' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowClassifyCRModal(true)}
                      >
                        <GitBranch size={14} /> Convert to Change Request
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleTechnicianStart}
                    >
                      Start Work
                    </button>
                  </>
                )}

                {ticket.status === 'In Progress' && (
                  <>
                    {ticket.type === 'Change Request' ? (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ background: '#BE185D', borderColor: '#9D174D' }}
                        onClick={() => setShowTestingModal(true)}
                      >
                        <FlaskConical size={14} /> Complete Work &amp; Forward to Testing Team
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setShowClassifyCRModal(true)}
                        >
                          <GitBranch size={14} /> Convert to Change Request
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => setTicketToResolve(ticket)}
                        >
                          <CheckCircle2 size={14} /> Mark Resolved
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {/* Admin Team Actions */}
            {currentRole === 'Admin Team' && (
              <>
                {ticket.status === 'Admin Review' && isCR && ticket.crStage !== 'Implementation' ? (
                  <>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                      onClick={handleAdminRejectCR}
                    >
                      Reject Change Request
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleAdminApproveCR}
                    >
                      <CheckCircle2 size={14} /> Approve Change Request
                    </button>
                  </>
                ) : ticket.status === 'Admin Review' && isCR ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setTicketToAssign(ticket)}
                  >
                    <UserCheck size={14} /> Assign Implementation
                  </button>
                ) : (
                  <>
                    {ticket.type !== 'Change Request' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowClassifyCRModal(true)}
                      >
                        <GitBranch size={14} /> Convert to Change Request
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setTicketToRefer(ticket)}
                    >
                      <Share2 size={14} /> Refer to Department
                    </button>
                    {ticket.status === 'Admin Review' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                        onClick={handleAdminRejectCR}
                      >
                        Reject Ticket
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setTicketToAssign(ticket)}
                    >
                      <UserCheck size={14} /> {ticket.status === 'Admin Review' ? 'Assign Technician' : 'Reassign Technician'}
                    </button>
                  </>
                )}
              </>
            )}

            {/* End User Actions */}
            {currentRole === 'End User' && ticket.status === 'Resolved' && (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                  onClick={() => setTicketToReopen(ticket)}
                >
                  Reopen Ticket
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setTicketToClose(ticket)}
                >
                  <CheckCircle2 size={14} /> Verify &amp; Close
                </button>
              </>
            )}

            {/* Testing Team Actions */}
            {currentRole === 'Testing Team' && ticket.status === 'In Testing' && (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                  onClick={handleTestingFail}
                >
                  Fail QA Test
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleTestingPass}
                >
                  <CheckCircle2 size={14} /> Pass QA Test
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Classify / Refer as Change Request Modal */}
      {showClassifyCRModal && (
        <ClassifyChangeRequestModal
          ticket={ticket}
          onClose={() => setShowClassifyCRModal(false)}
          onConfirm={handleConfirmClassifyCR}
        />
      )}

      {/* Forward to Testing Team Modal */}
      {showTestingModal && (
        <ForwardToTestingModal
          ticket={ticket}
          onClose={() => setShowTestingModal(false)}
          onConfirm={handleConfirmForwardToTesting}
        />
      )}

      {/* Reject Ticket Modal */}
      {showRejectModal && (
        <RejectTicketModal
          ticket={ticket}
          approverRole={currentRole}
          approverName={currentUser.name}
          onClose={() => setShowRejectModal(false)}
          onConfirmReject={handleConfirmRejectModal}
          forwardToAdmin={!isCR}
        />
      )}

      {/* Admin reject (Change Request or ticket) */}
      {showCRRejectModal && (
        <ReasonModal
          title={isCR ? `Reject change ${ticket.id}` : `Reject ticket ${ticket.id}`}
          label="Reason for rejecting"
          placeholder="The requester and the HOD see this reason."
          confirmLabel="Confirm rejection"
          onClose={() => setShowCRRejectModal(false)}
          onConfirm={(reason) => adminRejectCR(ticket, reason)}
        />
      )}

      {/* Test failed */}
      {showTestFailModal && (
        <ReasonModal
          title={`Fail test for ${ticket.id}`}
          label="What failed in the test"
          placeholder="Describe the defect. The ticket goes back to the technician."
          confirmLabel="Fail the test"
          onClose={() => setShowTestFailModal(false)}
          onConfirm={(notes) => testingResult(ticket, false, notes)}
        />
      )}

      {/* Escalate to External Vendor Modal */}
      {showVendorModal && (
        <EscalateToVendorModal
          ticket={ticket}
          technicianName={currentUser.name}
          onClose={() => setShowVendorModal(false)}
          onConfirmEscalate={handleConfirmVendorEscalate}
        />
      )}
    </div>
  )
}
