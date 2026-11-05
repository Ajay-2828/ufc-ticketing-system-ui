'use client'

import React from 'react'
import { TestingQueue } from '@/components/queues/testing-queue'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function TestingPage() {
  const { visibleTickets, setSelectedTicket, handleUpdateTicket, triggerToast } =
    useTicketContext()

  return (
    <TestingQueue
      tickets={visibleTickets}
      onSelectTicket={(t: Ticket) => setSelectedTicket(t)}
      onPassTest={(t: Ticket) => {
        const updated: Ticket = {
          ...t,
          status: 'Resolved',
          timeline: [
            ...t.timeline,
            {
              id: `t-${Date.now()}`,
              time: 'Just now',
              user: 'Fatima Al-Zadjali',
              role: 'Testing Team',
              action: 'QA Test Verification Passed',
              note: 'Solution tested and passed all verification test cases.',
              tone: 'green',
            },
          ],
        }
        handleUpdateTicket(updated)
        triggerToast(`Ticket ${t.id} passed QA testing and marked as Resolved!`)
      }}
      onFailTest={(t: Ticket) => {
        const updated: Ticket = {
          ...t,
          status: 'In Progress',
          timeline: [
            ...t.timeline,
            {
              id: `t-${Date.now()}`,
              time: 'Just now',
              user: 'Fatima Al-Zadjali',
              role: 'Testing Team',
              action: 'QA Test Verification Failed',
              note: 'Defects encountered during test execution. Returned to technician for fix.',
              tone: 'red',
            },
          ],
        }
        handleUpdateTicket(updated)
        triggerToast(`Ticket ${t.id} failed QA testing and returned to technician.`)
      }}
    />
  )
}
