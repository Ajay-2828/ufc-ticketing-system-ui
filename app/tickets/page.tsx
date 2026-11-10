'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { TicketList } from '@/components/tickets/ticket-list'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function TicketsPage() {
  const router = useRouter()
  const { visibleTickets, currentRole, isBlockedByThreshold } = useTicketContext()

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

  // Show gold Create Ticket action in All Tickets page for any user
  const canCreateInList = currentRole !== 'External Vendor'

  return (
    <TicketList
      tickets={visibleTickets}
      title={title}
      subtitle={subtitle}
      onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
      onOpenCreateModal={canCreateInList ? () => router.push('/tickets/new') : undefined}
      createDisabled={isBlockedByThreshold}
      createDisabledReason="Policy threshold of unclosed resolved tickets reached"
    />
  )
}
