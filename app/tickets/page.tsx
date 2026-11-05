'use client'

import React from 'react'
import { TicketList } from '@/components/tickets/ticket-list'
import { useTicketContext } from '@/context/ticket-context'

export default function TicketsPage() {
  const { visibleTickets, currentRole, setSelectedTicket } = useTicketContext()

  const title =
    currentRole === 'End User'
      ? 'My Submitted Tickets'
      : currentRole === 'HOD'
      ? 'Departmental Requests Registry'
      : 'All Enterprise Tickets'

  const subtitle =
    currentRole === 'End User'
      ? 'Track the real-time status, technician ETA, and resolutions of requests you have raised'
      : 'Comprehensive directory of IT incidents, service requests, and issues across UFC'

  return (
    <TicketList
      tickets={visibleTickets}
      title={title}
      subtitle={subtitle}
      onSelectTicket={setSelectedTicket}
    />
  )
}

