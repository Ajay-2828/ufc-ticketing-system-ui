'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { TicketList } from '@/components/tickets/ticket-list'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function DepartmentTicketsPage() {
  const router = useRouter()
  const { visibleTickets } = useTicketContext()

  return (
    <TicketList
      tickets={visibleTickets}
      title="Departmental Requests Registry"
      subtitle="Operational view of technology requests within your department"
      onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
    />
  )
}
