'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminFormsPage() {
  const router = useRouter()

  useEffect(() => {
    // Industry standard: Intake forms are managed directly in Classification catalog
    router.replace('/admin/classification')
  }, [router])

  return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
      Redirecting to Classification &amp; Catalog Manager...
    </div>
  )
}

