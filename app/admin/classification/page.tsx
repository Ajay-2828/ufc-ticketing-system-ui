'use client'

import React from 'react'
import { ClassificationManager } from '@/components/admin/classification-manager'
import { useTicketContext } from '@/context/ticket-context'

export default function AdminClassificationPage() {
  const { classificationTreeData, setClassificationTreeData } = useTicketContext()

  return (
    <ClassificationManager
      classificationTree={classificationTreeData}
      onUpdateClassificationTree={setClassificationTreeData}
    />
  )
}

