'use client'

import React from 'react'
import { TicketList } from '@/components/tickets/ticket-list'
import { useTicketContext } from '@/context/ticket-context'

export default function DepartmentTicketsPage() {
  const { visibleTickets, setSelectedTicket } = useTicketContext()

  return (
    <TicketList
      tickets={visibleTickets}
      title="Departmental Requests Registry"
      subtitle="Operational view of technology requests within your department"
      onSelectTicket={setSelectedTicket}
    />
  )
}

