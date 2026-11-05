'use client'

import React, { useState } from 'react'
import {
  Users,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Server,
  ArrowRight,
} from 'lucide-react'
import { policySettings } from '@/app/ticket-data'

export function ActiveDirectorySync() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(policySettings.activeDirectoryStatus.lastSync)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSyncNow = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      setLastSync('Just now')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <Server size={14} /> Directory & Identity Services (ITIL Identity Governance)
          </div>
          <h1 className="page-title-main">Active Directory (AD) Integration</h1>
          <p className="page-desc-sub">
            Synchronizes enterprise employee accounts, organizational reporting hierarchies, and
            Department Head (HOD) manager assignments directly from corporate LDAP.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleSyncNow}
          disabled={syncing}
        >
          <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Synchronizing with LDAP...' : 'Sync Directory Now'}
        </button>
      </div>

      {showSuccess && (
        <div className="alert-card-banner alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle2 size={20} />
          <span>Active Directory delta synchronization completed successfully! 148 user accounts and HOD manager relationships verified.</span>
        </div>
      )}

      {/* Connection Status Card */}
      <div
        className="modern-card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          border: '1px solid #BFDBFE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '16px', color: '#0F172A' }}>
                Corporate Domain: ufc.om (AD LDS)
              </strong>
              <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>
                Connected & Verified
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
              Active Directory LDAP Secure (Port 636) · Last full sync: <b>{lastSync}</b> ·{' '}
              <b>148 users active</b>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>SYNC SCHEDULE</span>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF' }}>Every 15 Minutes</div>
        </div>
      </div>

      {/* Attribute Mapping Table */}
      <div className="modern-card">
        <div className="modern-card-header">
          <div>
            <h3 className="card-title-lg">Active Directory Schema & Role Mapping (Automated HOD Hierarchy Sync)</h3>
            <p className="card-subtitle-sm">
              Manager attributes map directly to approval workflows so tickets automatically route
              to the requester&apos;s correct HOD.
            </p>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Active Directory LDAP Attribute</th>
                <th></th>
                <th>UFC Service Desk Target Field</th>
                <th>Workflow Usage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {policySettings.activeDirectoryStatus.syncedAttributes.map((attr) => (
                <tr key={attr.adAttr}>
                  <td>
                    <code
                      style={{
                        background: 'var(--surface-muted)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: 'var(--primary)',
                      }}
                    >
                      {attr.adAttr}
                    </code>
                  </td>
                  <td style={{ width: '40px', color: 'var(--text-muted)' }}>
                    <ArrowRight size={14} />
                  </td>
                  <td>
                    <strong style={{ fontSize: '13.5px' }}>{attr.ufcField}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {attr.adAttr === 'manager'
                        ? 'Auto-resolves HOD approval destination'
                        : attr.adAttr === 'title'
                        ? 'Maps technician vs end-user role permissions'
                        : 'User authentication & profile identity'}
                    </span>
                  </td>
                  <td>
                    <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>
                      {attr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

