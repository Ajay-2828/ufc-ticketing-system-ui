'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { VendorPortal } from '@/components/queues/vendor-portal'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function VendorPortalPage() {
  const router = useRouter()
  const { visibleTickets, setTicketToResolve } = useTicketContext()

  return (
    <VendorPortal
      tickets={visibleTickets}
      onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
      onResolveTicket={(t) => setTicketToResolve(t)}
    />
  )
}
