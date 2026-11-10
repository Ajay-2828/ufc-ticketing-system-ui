'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ExceptionsQueue } from '@/components/queues/exceptions-queue'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function ExceptionsPage() {
  const router = useRouter()
  const {
    visibleTickets,
    setTicketToAssign,
    setTicketToRefer,
  } = useTicketContext()

  return (
    <ExceptionsQueue
      tickets={visibleTickets}
      onSelectTicket={(t: Ticket) => router.push(`/tickets/${t.id}`)}
      onAssignTicket={(t) => setTicketToAssign(t)}
      onReferTicket={(t) => setTicketToRefer(t)}
    />
  )
}
