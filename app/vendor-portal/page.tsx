'use client'

import React from 'react'
import { VendorPortal } from '@/components/queues/vendor-portal'
import { useTicketContext } from '@/context/ticket-context'

export default function VendorPortalPage() {
  const { visibleTickets, setSelectedTicket, setTicketToResolve } =
    useTicketContext()

  return (
    <VendorPortal
      tickets={visibleTickets}
      onSelectTicket={setSelectedTicket}
      onResolveTicket={(t) => setTicketToResolve(t)}
    />
  )
}

