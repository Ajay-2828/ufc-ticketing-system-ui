'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TechnicianWorkbench } from '@/components/queues/technician-workbench'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'
import { ClassifyChangeRequestModal } from '@/components/tickets/classify-change-request-modal'

export default function WorkQueuePage() {
  const router = useRouter()
  const {
    visibleTickets,
    setTicketToResolve,
    handleUpdateTicket,
    markAsChangeRequest,
    triggerToast,
    currentUser,
    currentRole,
  } = useTicketContext()

  const [ticketToClassifyCR, setTicketToClassifyCR] = useState<Ticket | null>(null)

  const handleConfirmClassifyCR = (
    _ticketId: string,
    justification: string,
    requiresHodApproval: boolean
  ) => {
    if (!ticketToClassifyCR) return
    markAsChangeRequest(ticketToClassifyCR, justification, requiresHodApproval)
    setTicketToClassifyCR(null)
  }

  return (
    <>
      <TechnicianWorkbench
        tickets={visibleTickets}
        onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
        onResolveTicket={(t) => setTicketToResolve(t)}
        onClassifyCR={(t) => setTicketToClassifyCR(t)}
        onStartWork={(t) => {
          const updated: Ticket = {
            ...t,
            status: 'In Progress',
            timeline: [
              ...t.timeline,
              {
                id: `t-${Date.now()}`,
                time: 'Just now',
                user: currentUser.name,
                role: currentRole,
                action: 'Work Started by Technician',
                note: 'Accepted ticket into active queue — Response SLA satisfied. Troubleshooting in progress.',
                tone: 'blue',
              },
            ],
          }
          handleUpdateTicket(updated)
          triggerToast(`Work started on ticket ${t.id}! Moved to In Progress.`)
        }}
        onSendTesting={(t) => {
          const updated: Ticket = {
            ...t,
            status: 'In Testing',
            crStage: 'Testing' as const,
            timeline: [
              ...t.timeline,
              {
                id: `t-${Date.now()}`,
                time: 'Just now',
                user: currentUser.name,
                role: currentRole,
                action: 'Submitted to QA & Testing',
                note: 'Technical implementation complete. Awaiting testing team verification.',
                tone: 'blue',
              },
            ],
          }
          handleUpdateTicket(updated)
          triggerToast(`Ticket ${t.id} submitted to QA & Testing!`)
        }}
      />

      {ticketToClassifyCR && (
        <ClassifyChangeRequestModal
          ticket={ticketToClassifyCR}
          onClose={() => setTicketToClassifyCR(null)}
          onConfirm={handleConfirmClassifyCR}
        />
      )}
    </>
  )
}
