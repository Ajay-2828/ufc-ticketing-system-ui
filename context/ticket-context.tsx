'use client'

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import {
  Role,
  Ticket,
  initialTickets,
  usersByRole,
  policySettings,
  TicketPriority,
  classificationTree,
  ClassificationConfig,
} from '@/app/ticket-data'

export interface CurrentUserProfile {
  name: string
  title: string
  dept: string
  initials: string
  avatarColor: string
}

interface TicketContextType {
  // Current user & role
  currentRole: Role
  setCurrentRole: (role: Role) => void
  currentUser: CurrentUserProfile

  // Tickets state
  tickets: Ticket[]
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>
  visibleTickets: Ticket[]

  // Policy & Thresholds
  closureThreshold: number
  setClosureThreshold: (val: number) => void
  unclosedResolvedCount: number
  isBlockedByThreshold: boolean

  // Classifications
  classificationTreeData: ClassificationConfig[]
  setClassificationTreeData: React.Dispatch<React.SetStateAction<ClassificationConfig[]>>

  // Search & Toast
  globalSearch: string
  setGlobalSearch: (q: string) => void
  toastMessage: string | null
  triggerToast: (msg: string) => void

  // Modals & Drawers
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

  // Action Handlers
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
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('Admin Team')
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [globalSearch, setGlobalSearch] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [closureThreshold, setClosureThreshold] = useState(
    policySettings.unresolvedClosureThreshold
  )

  const [classificationTreeData, setClassificationTreeData] =
    useState<ClassificationConfig[]>(classificationTree)

  // Active Modals & Drawer
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [ticketToClose, setTicketToClose] = useState<Ticket | null>(null)
  const [ticketToReopen, setTicketToReopen] = useState<Ticket | null>(null)
  const [ticketToAssign, setTicketToAssign] = useState<Ticket | null>(null)
  const [ticketToResolve, setTicketToResolve] = useState<Ticket | null>(null)
  const [ticketToRefer, setTicketToRefer] = useState<Ticket | null>(null)

  const currentUser = useMemo(() => {
    return usersByRole[currentRole]
  }, [currentRole])

  const unclosedResolvedCount = useMemo(() => {
    return tickets.filter(
      (t) =>
        t.status === 'Resolved' &&
        (t.creator.includes('Tariq') || t.creator === currentUser.name)
    ).length
  }, [tickets, currentUser.name])

  const isBlockedByThreshold =
    currentRole === 'End User' && unclosedResolvedCount >= closureThreshold

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

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
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Closed',
              closureRemarks: remarks,
              rating,
              timeline: [
                ...t.timeline,
                {
                  id: `t-${Date.now()}`,
                  time: 'Just now',
                  user: currentUser.name,
                  role: currentRole,
                  action: 'Verified & Closed by End User',
                  note: `Closure confirmed. Satisfaction rating: ${rating}/5 stars. ${remarks}`,
                  tone: 'green',
                },
              ],
            }
          : t
      )
    )
    setTicketToClose(null)
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null)
    }
    triggerToast(`Ticket ${ticketId} verified and closed! Satisfaction score recorded.`)
  }

  const handleConfirmReopen = (ticketId: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Reopened',
              timeline: [
                ...t.timeline,
                {
                  id: `t-${Date.now()}`,
                  time: 'Just now',
                  user: currentUser.name,
                  role: currentRole,
                  action: 'Ticket Reopened by End User',
                  note: `Issue unresolved: ${reason}. Routed directly to Admin Exception Queue.`,
                  tone: 'red',
                },
              ],
            }
          : t
      )
    )
    setTicketToReopen(null)
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null)
    }
    triggerToast(`Ticket ${ticketId} reopened and routed directly to Admin Exception Queue!`)
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
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              assignee,
              priority: priority || t.priority,
              status: 'In Progress',
              eta: eta ? `${eta}h` : t.eta,
              dueDate: dueDate || t.dueDate,
              vendor: vendor || t.vendor,
              timeline: [
                ...t.timeline,
                {
                  id: `t-${Date.now()}`,
                  time: 'Just now',
                  user: currentUser.name,
                  role: currentRole,
                  action: 'Assigned to Technician by Admin',
                  note: `Allocated to ${assignee}. Priority set to ${priority}. Target ETA: ${eta || 'Standard SLA'} hrs. Due: ${dueDate || 'SLA target'}. ${remarks || ''}`.trim(),
                  tone: 'blue',
                },
              ],
            }
          : t
      )
    )
    setTicketToAssign(null)
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null)
    }
    triggerToast(`Ticket ${ticketId} assigned to ${assignee}!`)
  }

  const handleConfirmResolve = (
    ticketId: string,
    summary: string,
    rootCause: string,
    timeSpent: string
  ) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Resolved',
              resolutionSummary: summary,
              rootCause,
              resolutionTime: timeSpent,
              timeline: [
                ...t.timeline,
                {
                  id: `t-${Date.now()}`,
                  time: 'Just now',
                  user: currentUser.name,
                  role: currentRole,
                  action: 'Marked Resolved by Technician',
                  note: `Resolution: ${summary}. Root Cause: ${rootCause}. Active time: ${timeSpent}. Awaiting user verification.`,
                  tone: 'green',
                },
              ],
            }
          : t
      )
    )
    setTicketToResolve(null)
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null)
    }
    triggerToast(`Ticket ${ticketId} marked as Resolved! End user notified.`)
  }

  const handleConfirmReferral = (ticketId: string, targetDept: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              department: targetDept,
              status: 'Awaiting Clarification',
              timeline: [
                ...t.timeline,
                {
                  id: `t-${Date.now()}`,
                  time: 'Just now',
                  user: currentUser.name,
                  role: currentRole,
                  action: `Referred to ${targetDept}`,
                  note: `Referral reason: ${reason}`,
                  tone: 'purple',
                },
              ],
            }
          : t
      )
    )
    setTicketToRefer(null)
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null)
    }
    triggerToast(`Ticket ${ticketId} referred to ${targetDept}!`)
  }

  const visibleTickets = useMemo(() => {
    let result = tickets

    if (currentRole === 'End User') {
      result = tickets.filter(
        (t) => t.creator.includes('Tariq') || t.creator === currentUser.name
      )
    } else if (currentRole === 'Technician') {
      const techFirstName = currentUser.name.split(' ')[0]
      result = tickets.filter(
        (t) =>
          t.assignee.includes(techFirstName) ||
          (t.coAssignee && t.coAssignee.includes(techFirstName)) ||
          t.assignee === 'Unassigned' ||
          t.status === 'In Progress'
      )
    } else if (currentRole === 'HOD') {
      result = tickets.filter(
        (t) => t.department === 'Finance & Risk' || t.status === 'Pending Approval'
      )
    } else if (currentRole === 'Testing Team') {
      result = tickets.filter(
        (t) => t.status === 'In Testing' || t.type === 'Change Request'
      )
    } else if (currentRole === 'External Vendor') {
      result = tickets.filter(
        (t) => t.assignee.includes('TechServe') || t.assignee.includes('Vendor')
      )
    }

    if (globalSearch.trim() !== '') {
      const q = globalSearch.toLowerCase()
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
  }, [tickets, currentRole, currentUser.name, globalSearch])

  return (
    <TicketContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        tickets,
        setTickets,
        visibleTickets,
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
