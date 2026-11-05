'use client'

import React from 'react'
import { ExceptionsQueue } from '@/components/queues/exceptions-queue'
import { useTicketContext } from '@/context/ticket-context'

export default function ExceptionsPage() {
  const {
    visibleTickets,
    setSelectedTicket,
    setTicketToAssign,
    setTicketToRefer,
  } = useTicketContext()

  return (
    <ExceptionsQueue
      tickets={visibleTickets}
      onSelectTicket={setSelectedTicket}
      onAssignTicket={(t) => setTicketToAssign(t)}
      onReferTicket={(t) => setTicketToRefer(t)}
    />
  )
}

