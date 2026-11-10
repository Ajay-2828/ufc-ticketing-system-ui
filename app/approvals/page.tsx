'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApprovalQueue } from '@/components/queues/approval-queue'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'
import { RejectTicketModal } from '@/components/tickets/reject-ticket-modal'

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

  const [ticketToReject, setTicketToReject] = useState<Ticket | null>(null)

  const handleConfirmReject = (ticketId: string, reason: string, category: string) => {
    const target = visibleTickets.find((t) => t.id === ticketId)
    if (!target) return

    const updated = {
      ...target,
      status: 'Closed' as const,
      closureRemarks: `Rejected by ${currentRole}: ${reason} (Category: ${category})`,
      timeline: [
        ...target.timeline,
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: currentRole,
          action: `Request Rejected by ${currentRole}`,
          note: `Category: ${category}. Justification: ${reason}. Notifications dispatched to requester & administration.`,
          tone: 'red' as const,
        },
        {
          id: `t-${Date.now() + 1}`,
          time: 'Just now',
          user: 'System Notification Service',
          role: 'System',
          action: 'Rejection Notification Dispatched',
          note: `Automated alert sent to ${target.creator} (${target.department}) with formal rejection remarks.`,
          tone: 'amber' as const,
        },
      ],
    }
    handleUpdateTicket(updated)
    setTicketToReject(null)
    triggerToast(`Ticket ${ticketId} rejected and closed. Stakeholders notified!`)
  }

  return (
    <>
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
        onRejectTicket={(t) => setTicketToReject(t)}
        onReferTicket={(t) => setTicketToRefer(t)}
      />

      {ticketToReject && (
        <RejectTicketModal
          ticket={ticketToReject}
          approverRole={currentRole}
          approverName={currentUser.name}
          onClose={() => setTicketToReject(null)}
          onConfirmReject={handleConfirmReject}
        />
      )}
    </>
  )
}
