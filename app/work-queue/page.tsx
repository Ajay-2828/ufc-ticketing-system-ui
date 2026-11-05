'use client'

import React from 'react'
import { TechnicianWorkbench } from '@/components/queues/technician-workbench'
import { useTicketContext } from '@/context/ticket-context'

export default function WorkQueuePage() {
  const {
    visibleTickets,
    setSelectedTicket,
    setTicketToResolve,
    handleUpdateTicket,
    triggerToast,
    currentUser,
    currentRole,
  } = useTicketContext()

  return (
    <TechnicianWorkbench
      tickets={visibleTickets}
      onSelectTicket={setSelectedTicket}
      onResolveTicket={(t) => setTicketToResolve(t)}
      onSendTesting={(t) => {
        const updated = {
          ...t,
          status: 'In Testing' as const,
          timeline: [
            ...t.timeline,
            {
              id: `t-${Date.now()}`,
              time: 'Just now',
              user: currentUser.name,
              role: currentRole,
              action: 'Submitted to QA & Testing',
              note: 'Technical implementation complete. Awaiting testing team verification.',
              tone: 'blue' as const,
            },
          ],
        }
        handleUpdateTicket(updated)
        triggerToast(`Ticket ${t.id} submitted to QA & Testing!`)
      }}
    />
  )
}

