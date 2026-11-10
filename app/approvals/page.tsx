'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ApprovalQueue } from '@/components/queues/approval-queue'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function ApprovalsPage() {
  const router = useRouter()
  const {
    visibleTickets,
    handleUpdateTicket,
    setTicketToRefer,
    triggerToast,
    currentUser,
    currentRole,
  } = useTicketContext()

  return (
    <ApprovalQueue
      tickets={visibleTickets.filter(
        (t) => t.status === 'Pending Approval' || t.status === 'Admin Review'
      )}
      onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
      onApproveTicket={(t) => {
        const updated = {
          ...t,
          status: 'Assigned' as const,
          timeline: [
            ...t.timeline,
            {
              id: `t-${Date.now()}`,
              time: 'Just now',
              user: currentUser.name,
              role: currentRole,
              action: 'Request Approved by HOD',
              note: `Authorized within SLA limits. Dispatched to designated technician ${t.assignee}.`,
              tone: 'green' as const,
            },
          ],
        }
        handleUpdateTicket(updated)
        triggerToast(`Ticket ${t.id} approved and dispatched!`)
      }}
      onRejectTicket={(t) => {
        const updated = {
          ...t,
          status: 'Closed' as const,
          closureRemarks: 'Rejected by Department Head during approval review.',
          timeline: [
            ...t.timeline,
            {
              id: `t-${Date.now()}`,
              time: 'Just now',
              user: currentUser.name,
              role: currentRole,
              action: 'Request Rejected by HOD',
              note: 'Department Head rejected the request.',
              tone: 'red' as const,
            },
          ],
        }
        handleUpdateTicket(updated)
        triggerToast(`Ticket ${t.id} rejected and closed.`)
      }}
      onReferTicket={(t) => setTicketToRefer(t)}
    />
  )
}
