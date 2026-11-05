'use client'

import React from 'react'
import { ChangeManagement } from '@/components/queues/change-management'
import { useTicketContext } from '@/context/ticket-context'

export default function ChangeRequestsPage() {
  const { visibleTickets, setSelectedTicket, handleUpdateTicket, triggerToast } =
    useTicketContext()

  return (
    <ChangeManagement
      tickets={visibleTickets}
      onSelectTicket={setSelectedTicket}
      onApproveCR={(t) => {
        const updated = {
          ...t,
          status: 'In Progress' as const,
          timeline: [
            ...t.timeline,
            {
              id: `t-${Date.now()}`,
              time: 'Just now',
              user: 'Change Advisory Board',
              role: 'Management' as const,
              action: 'Change Request Approved',
              note: 'CAB reviewed and authorized release schedule.',
              tone: 'green' as const,
            },
          ],
        }
        handleUpdateTicket(updated)
        triggerToast(`Change Request ${t.id} approved for implementation!`)
      }}
      onRejectCR={(t) => {
        const updated = {
          ...t,
          status: 'Closed' as const,
          closureRemarks: 'Change Request rejected by CAB.',
          timeline: [
            ...t.timeline,
            {
              id: `t-${Date.now()}`,
              time: 'Just now',
              user: 'Change Advisory Board',
              role: 'Management' as const,
              action: 'Change Request Rejected',
              note: 'Rejected due to architectural or risk constraints.',
              tone: 'red' as const,
            },
          ],
        }
        handleUpdateTicket(updated)
        triggerToast(`Change Request ${t.id} rejected and archived.`)
      }}
    />
  )
}

