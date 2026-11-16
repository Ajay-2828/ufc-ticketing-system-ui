'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChangeManagement } from '@/components/queues/change-management'
import { ReasonModal } from '@/components/tickets/reason-modal'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function ChangeRequestsPage() {
  const router = useRouter()
  const { visibleTickets, managementDecide, currentRole } = useTicketContext()
  const [toReject, setToReject] = useState<Ticket | null>(null)

  return (
    <>
      <ChangeManagement
        tickets={visibleTickets}
        canDecide={currentRole === 'Management'}
        onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
        onApproveCR={(t) => managementDecide(t, true, 'Approved for implementation.')}
        onRejectCR={(t) => setToReject(t)}
      />
      {toReject && (
        <ReasonModal
          title={`Reject change ${toReject.id}`}
          label="Reason for rejecting"
          placeholder="The requester, the HOD and Admin see this reason."
          confirmLabel="Confirm rejection"
          onClose={() => setToReject(null)}
          onConfirm={(reason) => managementDecide(toReject, false, reason)}
        />
      )}
    </>
  )
}
