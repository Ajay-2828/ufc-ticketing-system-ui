'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react'
import {
  Role,
  Ticket,
  TicketTimelineItem,
  TicketSeverity,
  TicketPriority,
  TicketType,
  initialTickets,
  usersByRole,
  policySettings,
  classificationTree,
  ClassificationConfig,
  departmentsData,
  SeverityMaster,
  PriorityMaster,
  SlaPolicy,
  BusinessCalendar,
  MastersSettings,
  SlaSnapshot,
  initialSeverities,
  initialPriorities,
  initialSlaPolicies,
  initialCalendars,
  initialMastersSettings,
} from '@/app/ticket-data'
import { MS_DAY, MS_HOUR, nextTicketId, pickTechnician } from '@/lib/workflow'

export interface CurrentUserProfile {
  name: string
  title: string
  dept: string
  initials: string
  avatarColor: string
}

/** Everything the create form collects. The context turns it into a ticket. */
export interface NewTicketForm {
  subject: string
  description: string
  type: Exclude<TicketType, 'Change Request'>
  classification: string
  subClassification: string
  issueType: string
  severity: TicketSeverity
  priority: TicketPriority
  department: string
  dynamicFields: Record<string, string>
  isCR: boolean
  crRequiresHod: boolean
  hodLimitHours: number
  slaHours: number
  isDraft: boolean
  /** SLA as resolved from the masters when the ticket is raised */
  slaSnapshot?: SlaSnapshot
}

interface TicketContextType {
  currentRole: Role
  setCurrentRole: (role: Role) => void
  currentUser: CurrentUserProfile

  tickets: Ticket[]
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>
  visibleTickets: Ticket[]
  /** Clock tick (refreshed every 15 seconds) so countdowns stay live */
  now: number

  /* Masters: severity, priority, SLA policies, business calendars */
  severities: SeverityMaster[]
  setSeverities: React.Dispatch<React.SetStateAction<SeverityMaster[]>>
  priorities: PriorityMaster[]
  setPriorities: React.Dispatch<React.SetStateAction<PriorityMaster[]>>
  slaPolicies: SlaPolicy[]
  setSlaPolicies: React.Dispatch<React.SetStateAction<SlaPolicy[]>>
  calendars: BusinessCalendar[]
  setCalendars: React.Dispatch<React.SetStateAction<BusinessCalendar[]>>
  mastersSettings: MastersSettings
  setMastersSettings: React.Dispatch<React.SetStateAction<MastersSettings>>

  closureThreshold: number
  setClosureThreshold: (val: number) => void
  unclosedResolvedCount: number
  isBlockedByThreshold: boolean

  classificationTreeData: ClassificationConfig[]
  setClassificationTreeData: React.Dispatch<React.SetStateAction<ClassificationConfig[]>>

  globalSearch: string
  setGlobalSearch: (q: string) => void
  toastMessage: string | null
  triggerToast: (msg: string) => void

  selectedTicket: Ticket | null
  setSelectedTicket: (t: Ticket | null) => void
  showCreateModal: boolean
  setShowCreateModal: (show: boolean) => void
  ticketToClose: Ticket | null
  setTicketToClose: (t: Ticket | null) => void
  ticketToReopen: Ticket | null
  setTicketToReopen: (t: Ticket | null) => void
  ticketToAssign: Ticket | null
  setTicketToAssign: (t: Ticket | null) => void
  ticketToResolve: Ticket | null
  setTicketToResolve: (t: Ticket | null) => void
  ticketToRefer: Ticket | null
  setTicketToRefer: (t: Ticket | null) => void

  handleCreateTicket: (newPartial: Partial<Ticket>) => void
  handleUpdateTicket: (updated: Ticket) => void
  handleConfirmClose: (ticketId: string, remarks: string, rating: number) => void
  handleConfirmReopen: (ticketId: string, reason: string) => void
  handleConfirmAssign: (
    ticketId: string,
    assignee: string,
    priority: TicketPriority,
    eta: string,
    dueDate: string,
    remarks: string,
    vendor?: string
  ) => void
  handleConfirmResolve: (
    ticketId: string,
    summary: string,
    rootCause: string,
    timeSpent: string
  ) => void
  handleConfirmReferral: (ticketId: string, targetDept: string, reason: string) => void

  /* Workflow actions (flows decided on 2026-11-16) */
  submitNewTicket: (form: NewTicketForm) => Ticket
  submitDraft: (ticket: Ticket) => void
  hodApprove: (ticket: Ticket) => void
  hodNotApprove: (ticket: Ticket, reason: string, category: string) => void
  markAsChangeRequest: (ticket: Ticket, justification: string, requiresHod: boolean) => void
  adminApproveCR: (ticket: Ticket) => void
  adminRejectCR: (ticket: Ticket, reason: string) => void
  managementDecide: (ticket: Ticket, approve: boolean, remarks: string) => void
  testingResult: (ticket: Ticket, passed: boolean, notes: string) => void
  respondToReferral: (ticketId: string, response: string) => void
  addVendorUpdate: (ticketId: string, text: string) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

function stamp(): string {
  return new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

let seq = 0
function tl(
  user: string,
  action: string,
  note: string,
  tone: TicketTimelineItem['tone'],
  role?: string
): TicketTimelineItem {
  seq += 1
  return { id: `t-${Date.now()}-${seq}`, time: stamp(), user, role, action, note, tone }
}

export function TicketProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('Admin Team')
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [globalSearch, setGlobalSearch] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [now, setNow] = useState<number>(() => Date.now())

  const [severities, setSeverities] = useState<SeverityMaster[]>(initialSeverities)
  const [priorities, setPriorities] = useState<PriorityMaster[]>(initialPriorities)
  const [slaPolicies, setSlaPolicies] = useState<SlaPolicy[]>(initialSlaPolicies)
  const [calendars, setCalendars] = useState<BusinessCalendar[]>(initialCalendars)
  const [mastersSettings, setMastersSettings] = useState<MastersSettings>(initialMastersSettings)

  const [closureThreshold, setClosureThreshold] = useState(
    policySettings.unresolvedClosureThreshold
  )
  const [classificationTreeData, setClassificationTreeData] =
    useState<ClassificationConfig[]>(classificationTree)

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [ticketToClose, setTicketToClose] = useState<Ticket | null>(null)
  const [ticketToReopen, setTicketToReopen] = useState<Ticket | null>(null)
  const [ticketToAssign, setTicketToAssign] = useState<Ticket | null>(null)
  const [ticketToResolve, setTicketToResolve] = useState<Ticket | null>(null)
  const [ticketToRefer, setTicketToRefer] = useState<Ticket | null>(null)

  const currentUser = useMemo(() => usersByRole[currentRole], [currentRole])

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }, [])

  /** Replace one ticket by id with the result of `fn`. */
  const patch = useCallback((id: string, fn: (t: Ticket) => Ticket) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? fn(t) : t)))
  }, [])

  const closeDrawerIf = (id: string) => {
    if (selectedTicket && selectedTicket.id === id) setSelectedTicket(null)
  }

  /* ---------- derived: threshold ---------- */
  const unclosedResolvedCount = useMemo(
    () =>
      tickets.filter((t) => t.status === 'Resolved' && t.creator === currentUser.name).length,
    [tickets, currentUser.name]
  )
  const isBlockedByThreshold =
    currentRole === 'End User' && unclosedResolvedCount >= closureThreshold

  /* ---------- timers: HOD time limit and unclosed-resolved reminder ---------- */
  const ticketsRef = useRef(tickets)
  ticketsRef.current = tickets
  useEffect(() => {
    const id = setInterval(() => {
      const t0 = Date.now()
      setNow(t0)
      const list = ticketsRef.current
      const expired = list.filter(
        (t) =>
          t.status === 'Pending Approval' &&
          t.hodDeadline &&
          t0 > t.hodDeadline &&
          !t.hodExpiredNotified
      )
      const unclosed = list.filter(
        (t) =>
          t.status === 'Resolved' &&
          t.resolvedAt &&
          t0 - t.resolvedAt >= policySettings.hodReminderDays * MS_DAY &&
          !t.unclosedReminderSent
      )
      if (!expired.length && !unclosed.length) return
      const expiredIds = new Set(expired.map((t) => t.id))
      const unclosedIds = new Set(unclosed.map((t) => t.id))
      setTickets((prev) =>
        prev.map((t) => {
          if (expiredIds.has(t.id)) {
            return {
              ...t,
              hodExpiredNotified: true,
              timeline: [
                ...t.timeline,
                tl(
                  'System',
                  'HOD did not respond within the time limit',
                  `${t.creator} was notified. The ticket stays with the Department Head until a decision.`,
                  'amber',
                  'System'
                ),
              ],
            }
          }
          if (unclosedIds.has(t.id)) {
            return {
              ...t,
              unclosedReminderSent: true,
              timeline: [
                ...t.timeline,
                tl(
                  'System',
                  'Resolved ticket not closed',
                  `The ticket stayed Resolved for ${policySettings.hodReminderDays} days. The Department Head and ${t.creator} were reminded.`,
                  'amber',
                  'System'
                ),
              ],
            }
          }
          return t
        })
      )
      if (expired.length) {
        triggerToast(
          `${expired.map((t) => t.id).join(', ')}: HOD did not respond in time. Requester notified.`
        )
      }
    }, 15000)
    return () => clearInterval(id)
  }, [triggerToast])

  /* ---------- basic handlers (kept) ---------- */
  const handleCreateTicket = (newPartial: Partial<Ticket>) => {
    const fullTicket = newPartial as Ticket
    setTickets((prev) => [fullTicket, ...prev])
    setShowCreateModal(false)
    triggerToast(`Ticket ${fullTicket.id} created successfully and routed!`)
  }

  const handleUpdateTicket = (updated: Ticket) => {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    setSelectedTicket(updated)
    triggerToast(`Ticket ${updated.id} updated to "${updated.status}"!`)
  }

  const handleConfirmClose = (ticketId: string, remarks: string, rating: number) => {
    patch(ticketId, (t) => ({
      ...t,
      status: 'Closed',
      closureRemarks: remarks,
      rating,
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          'Verified & Closed by End User',
          `Closure confirmed. Satisfaction rating: ${rating}/5. ${remarks}`.trim(),
          'green',
          currentRole
        ),
      ],
    }))
    setTicketToClose(null)
    closeDrawerIf(ticketId)
    triggerToast(`Ticket ${ticketId} verified and closed.`)
  }

  const handleConfirmReopen = (ticketId: string, reason: string) => {
    patch(ticketId, (t) => ({
      ...t,
      status: 'Reopened',
      unclosedReminderSent: false,
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          'Ticket Reopened by End User',
          `Issue unresolved: ${reason}. Routed directly to the Admin team.`,
          'red',
          currentRole
        ),
      ],
    }))
    setTicketToReopen(null)
    closeDrawerIf(ticketId)
    triggerToast(`Ticket ${ticketId} reopened and sent directly to the Admin team.`)
  }

  const handleConfirmAssign = (
    ticketId: string,
    assignee: string,
    priority: TicketPriority,
    eta: string,
    dueDate: string,
    remarks: string,
    vendor?: string
  ) => {
    patch(ticketId, (t) => ({
      ...t,
      assignee,
      priority: priority || t.priority,
      status: 'In Progress',
      crStage: t.type === 'Change Request' ? 'Implementation' : t.crStage,
      eta: eta ? `${eta}h` : t.eta,
      dueDate: dueDate || t.dueDate,
      vendor: vendor || t.vendor,
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          t.type === 'Change Request' ? 'Implementation assigned by Admin' : 'Assigned by Admin',
          `Allocated to ${assignee}. Priority ${priority}. ETA: ${eta || 'standard SLA'} hrs. Due: ${dueDate || 'SLA target'}. ${remarks || ''}`.trim(),
          'blue',
          currentRole
        ),
      ],
    }))
    setTicketToAssign(null)
    closeDrawerIf(ticketId)
    triggerToast(`Ticket ${ticketId} assigned to ${assignee}.`)
  }

  const handleConfirmResolve = (
    ticketId: string,
    summary: string,
    rootCause: string,
    timeSpent: string
  ) => {
    patch(ticketId, (t) => ({
      ...t,
      status: 'Resolved',
      resolvedAt: Date.now(),
      unclosedReminderSent: false,
      resolutionSummary: summary,
      rootCause,
      resolutionTime: timeSpent,
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          'Marked Resolved by Technician',
          `Resolution: ${summary}. Root cause: ${rootCause}. Active time: ${timeSpent}. Waiting for the end user to close.`,
          'green',
          currentRole
        ),
      ],
    }))
    setTicketToResolve(null)
    closeDrawerIf(ticketId)
    triggerToast(`Ticket ${ticketId} resolved. It stays Resolved until the end user closes it.`)
  }

  /** HOD or Admin refers the ticket to another department. The ticket keeps its own department. */
  const handleConfirmReferral = (ticketId: string, targetDept: string, reason: string) => {
    patch(ticketId, (t) => ({
      ...t,
      status: 'Awaiting Clarification',
      referral: {
        department: targetDept,
        reason,
        referredBy: `${currentUser.name} (${currentRole})`,
        time: stamp(),
        previousStatus: t.status === 'Awaiting Clarification' ? t.referral?.previousStatus : t.status,
      },
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          `Referred to ${targetDept}`,
          `Reason: ${reason}. ${targetDept} answers through the portal and the ticket then returns to ${currentRole === 'HOD' ? 'the HOD' : 'its previous step'}.`,
          'purple',
          currentRole
        ),
      ],
    }))
    setTicketToRefer(null)
    closeDrawerIf(ticketId)
    triggerToast(`Ticket ${ticketId} referred to ${targetDept}.`)
  }

  /** The referred department answers. The ticket goes back to where it was. */
  const respondToReferral = (ticketId: string, response: string) => {
    patch(ticketId, (t) => {
      const back = t.referral?.previousStatus || 'Pending Approval'
      return {
        ...t,
        status: back,
        referral: t.referral
          ? { ...t.referral, response, responder: currentUser.name, responseTime: stamp() }
          : t.referral,
        timeline: [
          ...t.timeline,
          tl(
            currentUser.name,
            `Clarification from ${currentUser.dept}`,
            `${response} The ticket is back at: ${back}.`,
            'blue',
            currentRole
          ),
        ],
      }
    })
    triggerToast(`Answer sent for ${ticketId}.`)
  }

  /* ---------- flow 1: create, HOD, Admin ---------- */
  const submitNewTicket = (f: NewTicketForm): Ticket => {
    const type: TicketType = f.isCR ? 'Change Request' : f.type
    const id = nextTicketId(tickets, type)
    const t0 = Date.now()
    const staffCreator = currentRole === 'HOD'
    const base: Ticket = {
      id,
      subject: f.subject,
      description: f.description,
      type,
      app: f.subClassification,
      classification: f.classification,
      subClassification: f.subClassification,
      issueType: f.issueType,
      severity: f.severity,
      priority: f.priority,
      status: 'Pending Approval',
      department: f.department,
      creator: currentUser.name,
      creatorRole: currentRole,
      creatorAvatar: currentUser.initials,
      assignee: 'Unassigned',
      sla: `${f.slaHours}h remaining`,
      slaTimeRemaining: `${String(Math.floor(f.slaHours)).padStart(2, '0')}:00:00`,
      slaBreached: false,
      created: stamp(),
      createdAt: t0,
      slaSnapshot: f.slaSnapshot,
      dynamicFields: f.dynamicFields,
      timeline: [],
      clarifications: [],
      crRequiresHod: f.isCR ? f.crRequiresHod : undefined,
      crStage: f.isCR ? 'Admin' : undefined,
    }
    const created = tl(
      currentUser.name,
      f.isDraft ? 'Saved as draft' : 'Ticket submitted',
      `${f.classification} / ${f.subClassification} / ${f.issueType}. Severity ${f.severity} (from the issue type). Target resolution ${f.slaHours}h.`,
      'blue',
      currentRole
    )
    let ticket: Ticket
    if (f.isDraft) {
      ticket = { ...base, status: 'Draft', timeline: [created] }
    } else if (f.isCR) {
      ticket = {
        ...base,
        status: 'Admin Review',
        timeline: [
          created,
          tl(
            'System',
            'Sent to Admin for review',
            `Change Request. HOD approval for this change: ${f.crRequiresHod ? 'required' : 'not required'}.`,
            'purple',
            'System'
          ),
        ],
      }
    } else if (staffCreator) {
      // The HOD raised it, so the HOD step is implicit. Assign straight away.
      const pick = pickTechnician(classificationTreeData, base, tickets)
      ticket = pick.assignee
        ? {
            ...base,
            status: 'Assigned',
            assignee: pick.assignee,
            timeline: [
              created,
              tl('System', 'Auto-assigned', `${pick.assignee}. ${pick.note} Raised by the HOD, so no separate approval.`, 'green', 'System'),
            ],
          }
        : {
            ...base,
            status: 'Admin Review',
            timeline: [created, tl('System', 'Sent to Admin', `${pick.note} The Admin team assigns it.`, 'amber', 'System')],
          }
    } else {
      ticket = {
        ...base,
        status: 'Pending Approval',
        hodTimeRemaining: `${String(f.hodLimitHours).padStart(2, '0')}:00:00`,
        hodDeadline: t0 + f.hodLimitHours * MS_HOUR,
        timeline: [
          created,
          tl(
            'System',
            'Sent to the Department Head',
            `HOD approval time limit: ${f.hodLimitHours}h. If the HOD does not decide in time, ${currentUser.name} is notified.`,
            'amber',
            'System'
          ),
        ],
      }
    }
    setTickets((prev) => [ticket, ...prev])
    triggerToast(
      f.isDraft
        ? `Draft ${id} saved.`
        : `Ticket ${id} submitted. ${ticket.status === 'Pending Approval' ? 'Waiting for the HOD.' : 'Routed.'}`
    )
    return ticket
  }

  const submitDraft = (ticket: Ticket) => {
    const hours = parseInt(ticket.hodTimeRemaining || '2', 10) || 2
    const t0 = Date.now()
    patch(ticket.id, (t) => ({
      ...t,
      status: t.type === 'Change Request' ? 'Admin Review' : 'Pending Approval',
      hodTimeRemaining: `${String(hours).padStart(2, '0')}:00:00`,
      hodDeadline: t.type === 'Change Request' ? undefined : t0 + hours * MS_HOUR,
      timeline: [
        ...t.timeline,
        tl(currentUser.name, 'Draft submitted', t.type === 'Change Request' ? 'Sent to Admin.' : 'Sent to the Department Head.', 'blue', currentRole),
      ],
    }))
    triggerToast(`Ticket ${ticket.id} submitted.`)
  }

  /** HOD approves. Normal ticket: auto-assign. Change Request: next stage. */
  const hodApprove = (ticket: Ticket) => {
    if (ticket.type === 'Change Request') {
      patch(ticket.id, (t) => ({
        ...t,
        status: 'Management Approval',
        crStage: 'Management',
        timeline: [
          ...t.timeline,
          tl(currentUser.name, 'Change approved by the HOD', 'Sent to Management for the final decision.', 'green', 'HOD'),
        ],
      }))
      triggerToast(`Change ${ticket.id} approved. Sent to Management.`)
      return
    }
    const pick = pickTechnician(classificationTreeData, ticket, tickets)
    patch(ticket.id, (t) => ({
      ...t,
      status: pick.assignee ? 'Assigned' : 'Admin Review',
      assignee: pick.assignee || t.assignee,
      timeline: [
        ...t.timeline,
        tl(currentUser.name, 'Approved by the HOD', 'Authorised within the SLA limit.', 'green', 'HOD'),
        pick.assignee
          ? tl('System', 'Auto-assigned', `${pick.assignee}. ${pick.note}`, 'blue', 'System')
          : tl('System', 'Sent to Admin', `${pick.note} The Admin team assigns it.`, 'amber', 'System'),
      ],
    }))
    triggerToast(
      pick.assignee
        ? `Approved. Assigned to ${pick.assignee}.`
        : 'Approved. No technician available, sent to Admin.'
    )
  }

  /** HOD does not approve: the ticket goes to Admin (Change Requests are rejected). */
  const hodNotApprove = (ticket: Ticket, reason: string, category: string) => {
    if (ticket.type === 'Change Request') {
      patch(ticket.id, (t) => ({
        ...t,
        status: 'Rejected',
        closureRemarks: `Rejected by HOD: ${reason} (${category})`,
        timeline: [
          ...t.timeline,
          tl(currentUser.name, 'Change rejected by the HOD', `${category}: ${reason}. Requester and Admin notified.`, 'red', 'HOD'),
        ],
      }))
      triggerToast(`Change ${ticket.id} rejected. Notifications sent.`)
      return
    }
    patch(ticket.id, (t) => ({
      ...t,
      status: 'Admin Review',
      hodRejection: { by: currentUser.name, reason, category, time: stamp() },
      timeline: [
        ...t.timeline,
        tl(currentUser.name, 'Not approved by the HOD', `${category}: ${reason}`, 'red', 'HOD'),
        tl('System', 'Sent to the Admin team', `${t.creator} was notified. Admin decides: assign, ask for clarification, forward, or reject.`, 'amber', 'System'),
      ],
    }))
    triggerToast(`Not approved. ${ticket.id} sent to the Admin team.`)
  }

  /** Technician or HOD marks a ticket as a Change Request. It goes to Admin approval. */
  const markAsChangeRequest = (ticket: Ticket, justification: string, requiresHod: boolean) => {
    patch(ticket.id, (t) => ({
      ...t,
      type: 'Change Request',
      status: 'Admin Review',
      crStage: 'Admin',
      crRequiresHod: requiresHod,
      hodDeadline: undefined,
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          `Marked as Change Request by ${currentRole}`,
          `${justification}. HOD approval for this change: ${requiresHod ? 'required' : 'not required'}. Sent to Admin approval.`,
          'purple',
          currentRole
        ),
      ],
    }))
    triggerToast(`${ticket.id} marked as Change Request and sent to Admin approval.`)
  }

  /* ---------- flow 2: Change Request ---------- */
  const adminApproveCR = (ticket: Ticket) => {
    const needsHod = ticket.crRequiresHod !== false
    patch(ticket.id, (t) => ({
      ...t,
      status: needsHod ? 'Pending Approval' : 'Management Approval',
      crStage: needsHod ? 'HOD' : 'Management',
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          'Change approved by Admin',
          needsHod
            ? 'Sent to the Department Head for change approval, then Management.'
            : 'HOD approval is not required for this change. Sent to Management.',
          'purple',
          'Admin Team'
        ),
      ],
    }))
    triggerToast(
      needsHod ? 'Approved by Admin. Sent to the HOD.' : 'Approved by Admin. HOD step skipped, sent to Management.'
    )
  }

  const adminRejectCR = (ticket: Ticket, reason: string) => {
    patch(ticket.id, (t) => ({
      ...t,
      status: 'Rejected',
      closureRemarks: `Rejected by Admin: ${reason}`,
      timeline: [
        ...t.timeline,
        tl(currentUser.name, 'Change rejected by Admin', `${reason}. Requester and end user notified.`, 'red', 'Admin Team'),
      ],
    }))
    triggerToast(`Change ${ticket.id} rejected. Notifications sent.`)
  }

  /** Management approves (then Admin assigns the implementer) or rejects. */
  const managementDecide = (ticket: Ticket, approve: boolean, remarks: string) => {
    patch(ticket.id, (t) =>
      approve
        ? {
            ...t,
            status: 'Admin Review',
            crStage: 'Implementation',
            timeline: [
              ...t.timeline,
              tl(currentUser.name, 'Change approved by Management', `${remarks || 'Approved.'} Admin now assigns the implementation.`, 'green', 'Management'),
            ],
          }
        : {
            ...t,
            status: 'Rejected',
            closureRemarks: `Rejected by Management: ${remarks}`,
            timeline: [
              ...t.timeline,
              tl(currentUser.name, 'Change rejected by Management', `${remarks}. Requester, HOD and Admin notified.`, 'red', 'Management'),
            ],
          }
    )
    triggerToast(approve ? `Change ${ticket.id} approved. Admin assigns the implementer.` : `Change ${ticket.id} rejected.`)
  }

  /** Tester result. Pass: Resolved (end user closes). Fail: back to the implementer. */
  const testingResult = (ticket: Ticket, passed: boolean, notes: string) => {
    patch(ticket.id, (t) => ({
      ...t,
      status: passed ? 'Resolved' : 'In Progress',
      crStage: passed ? t.crStage : 'Implementation',
      resolvedAt: passed ? Date.now() : t.resolvedAt,
      unclosedReminderSent: passed ? false : t.unclosedReminderSent,
      testResults: {
        tester: currentUser.name,
        status: passed ? 'Passed' : 'Failed',
        environment: t.testResults?.environment || 'Staging',
        notes,
        time: stamp(),
      },
      timeline: [
        ...t.timeline,
        tl(
          currentUser.name,
          passed ? 'Test done: passed' : 'Test failed',
          passed
            ? `${notes || 'All checks passed.'} Resolved. Waiting for the end user to close.`
            : `Defect: ${notes}. Returned to ${t.assignee} for rework.`,
          passed ? 'green' : 'red',
          'Testing Team'
        ),
      ],
    }))
    triggerToast(passed ? `Test passed. ${ticket.id} is Resolved.` : `Test failed. ${ticket.id} returned to the technician.`)
  }

  const addVendorUpdate = (ticketId: string, text: string) => {
    patch(ticketId, (t) => ({
      ...t,
      timeline: [...t.timeline, tl(currentUser.name, 'Vendor progress update', text, 'blue', 'External Vendor')],
    }))
    triggerToast(`Update posted on ${ticketId}.`)
  }

  /* ---------- who sees what ---------- */
  const visibleTickets = useMemo(() => {
    const me = currentUser.name
    let result = tickets
    switch (currentRole) {
      case 'End User':
        result = tickets.filter((t) => t.creator === me)
        break
      case 'Technician':
        result = tickets.filter(
          (t) => t.assignee === me || t.coAssignee === me || t.creator === me
        )
        break
      case 'HOD':
        result = tickets.filter(
          (t) =>
            departmentsData.some((d) => d.name === t.department && d.hodName === me) ||
            t.creator === me ||
            t.referral?.department === currentUser.dept
        )
        break
      case 'Management':
        result = tickets.filter((t) => t.type === 'Change Request')
        break
      case 'Testing Team':
        result = tickets.filter((t) => t.status === 'In Testing' || t.testResults?.tester === me)
        break
      case 'External Vendor':
        result = tickets.filter(
          (t) =>
            t.vendor === currentUser.dept ||
            t.coAssignee === currentUser.dept ||
            t.assignee === currentUser.dept
        )
        break
      case 'Other Departments':
        result = tickets.filter((t) => t.referral?.department === currentUser.dept)
        break
      default:
        result = tickets
    }
    const q = globalSearch.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.app.toLowerCase().includes(q) ||
          t.creator.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q)
      )
    }
    return result
  }, [tickets, currentRole, currentUser.name, currentUser.dept, globalSearch])

  return (
    <TicketContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        tickets,
        setTickets,
        visibleTickets,
        now,
        severities,
        setSeverities,
        priorities,
        setPriorities,
        slaPolicies,
        setSlaPolicies,
        calendars,
        setCalendars,
        mastersSettings,
        setMastersSettings,
        closureThreshold,
        setClosureThreshold,
        unclosedResolvedCount,
        isBlockedByThreshold,
        classificationTreeData,
        setClassificationTreeData,
        globalSearch,
        setGlobalSearch,
        toastMessage,
        triggerToast,
        selectedTicket,
        setSelectedTicket,
        showCreateModal,
        setShowCreateModal,
        ticketToClose,
        setTicketToClose,
        ticketToReopen,
        setTicketToReopen,
        ticketToAssign,
        setTicketToAssign,
        ticketToResolve,
        setTicketToResolve,
        ticketToRefer,
        setTicketToRefer,
        handleCreateTicket,
        handleUpdateTicket,
        handleConfirmClose,
        handleConfirmReopen,
        handleConfirmAssign,
        handleConfirmResolve,
        handleConfirmReferral,
        submitNewTicket,
        submitDraft,
        hodApprove,
        hodNotApprove,
        markAsChangeRequest,
        adminApproveCR,
        adminRejectCR,
        managementDecide,
        testingResult,
        respondToReferral,
        addVendorUpdate,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}

export function useTicketContext() {
  const context = useContext(TicketContext)
  if (!context) {
    throw new Error('useTicketContext must be used within a TicketProvider')
  }
  return context
}
