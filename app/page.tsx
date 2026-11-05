'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { useTicketContext } from '@/context/ticket-context'
import { Ticket } from '@/app/ticket-data'

export default function HomePage() {
  const router = useRouter()
  const {
    visibleTickets,
    currentRole,
    unclosedResolvedCount,
    setSelectedTicket,
    setShowCreateModal,
  } = useTicketContext()

  const handleNavigateTab = (tab: string) => {
    switch (tab) {
      case 'Exceptions':
        router.push('/exceptions')
        break
      case 'All Tickets':
      case 'My Tickets':
      case 'Department Tickets':
        router.push('/tickets')
        break
      case 'Work Queue':
        router.push('/work-queue')
        break
      case 'Approvals':
        router.push('/approvals')
        break
      case 'Reports':
        router.push('/reports')
        break
      case 'Classification':
        router.push('/admin/classification')
        break
      default:
        break
    }
  }

  return (
    <DashboardView
      currentRole={currentRole}
      tickets={visibleTickets}
      unclosedResolvedCount={unclosedResolvedCount}
      onSelectTicket={(t: Ticket) => setSelectedTicket(t)}
      onOpenCreateModal={() => setShowCreateModal(true)}
      onNavigateTab={handleNavigateTab}
    />
  )
}
