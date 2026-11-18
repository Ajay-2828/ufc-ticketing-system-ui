'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApprovalQueue } from '@/components/queues/approval-queue'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket, isChangeFlow } from '@/app/ticket-data'
import { RejectTicketModal } from '@/components/tickets/reject-ticket-modal'

export default function ApprovalsPage() {
  const router = useRouter()
  const {
    visibleTickets,
    hodApprove,
    hodNotApprove,
    setTicketToRefer,
    currentUser,
    currentRole,
  } = useTicketContext()

  const [ticketToReject, setTicketToReject] = useState<Ticket | null>(null)

  const handleConfirmReject = (ticketId: string, reason: string, category: string) => {
    const target = visibleTickets.find((t) => t.id === ticketId)
    if (!target) return
    hodNotApprove(target, reason, category)
    setTicketToReject(null)
  }

  return (
    <>
      <ApprovalQueue
        tickets={visibleTickets.filter((t) => t.status === 'Pending Approval')}
        onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
        onApproveTicket={(t) => hodApprove(t)}
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
          forwardToAdmin={!isChangeFlow(ticketToReject)}
        />
      )}
    </>
  )
}
