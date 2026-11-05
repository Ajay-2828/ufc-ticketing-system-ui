'use client'

import React from 'react'
import { ReportsView } from '@/components/reports/reports-view'
import { useTicketContext } from '@/context/ticket-context'

export default function ReportsPage() {
  const { visibleTickets } = useTicketContext()

  return <ReportsView tickets={visibleTickets} />
}

