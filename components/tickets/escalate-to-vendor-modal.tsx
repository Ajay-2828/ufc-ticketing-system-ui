'use client'

import React, { useState } from 'react'
import {
  X,
  Building2,
  Users,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Ticket, vendorAccounts } from '@/app/ticket-data'

interface EscalateToVendorModalProps {
  ticket: Ticket
  technicianName: string
  onClose: () => void
  onConfirmEscalate: (
    ticketId: string,
    vendorName: string,
    mode: 'co-assign' | 'handover',
    diagnosticNotes: string
  ) => void
}

export function EscalateToVendorModal({
  ticket,
  technicianName,
  onClose,
  onConfirmEscalate,
}: EscalateToVendorModalProps) {
  const [selectedVendor, setSelectedVendor] = useState(
    vendorAccounts[0]?.name || 'TechServe Solutions Ltd'
  )
  const [escalationMode, setEscalationMode] = useState<'co-assign' | 'handover'>('co-assign')
  const [diagnosticNotes, setDiagnosticNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  const activeVendorConfig = vendorAccounts.find((v) => v.name === selectedVendor) || vendorAccounts[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!diagnosticNotes.trim()) {
      setError('Please provide technical justification / diagnostic notes for the vendor.')
      return
    }
    setError(null)
    onConfirmEscalate(ticket.id, selectedVendor, escalationMode, diagnosticNotes.trim())
    onClose()
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-dialog-header">
          <div>
            <div className="page-eyebrow" style={{ color: '#7C3AED' }}>
              <Building2 size={14} /> Tier-3 Vendor Escalation
            </div>
            <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800 }}>
              Escalate to External Vendor
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-action-btn"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Context Ticket Card */}
            <div
              style={{
                background: 'var(--surface-subtle)',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {ticket.id}
                </span>
                <span className="badge-tag badge-tag-sm" style={{ background: '#F5F3FF', color: '#7C3AED', fontWeight: 700 }}>
                  Active SLA: {ticket.slaTimeRemaining}
                </span>
              </div>
              <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                {ticket.subject}
              </strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Application: <strong>{ticket.app}</strong> &bull; Primary Lead: <strong>{technicianName}</strong>
              </div>
            </div>

            {/* Vendor Partner Selector */}
            <div className="form-field-group">
              <label className="form-field-label">
                Select Certified External Vendor Partner *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {vendorAccounts.map((v) => {
                  const isSelected = selectedVendor === v.name
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVendor(v.name)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #7C3AED' : '1px solid var(--border)',
                        background: isSelected ? '#FAF5FF' : 'var(--surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Building2 size={15} color={isSelected ? '#7C3AED' : 'var(--text-muted)'} />
                        <strong style={{ fontSize: '13px', color: isSelected ? '#6D28D9' : 'var(--text-main)' }}>
                          {v.name}
                        </strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Contract: <code>{v.contractRef}</code>
                      </div>
                      <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, marginTop: '3px' }}>
                        ✓ {v.status}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Escalation Mode */}
            <div className="form-field-group">
              <label className="form-field-label">
                Escalation Mode &amp; Responsibility Ownership *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setEscalationMode('co-assign')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: escalationMode === 'co-assign' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: escalationMode === 'co-assign' ? 'var(--primary-soft)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Users size={15} color={escalationMode === 'co-assign' ? 'var(--primary)' : 'var(--text-muted)'} />
                    <strong style={{ fontSize: '13px', color: escalationMode === 'co-assign' ? 'var(--primary)' : 'var(--text-main)' }}>
                      Co-Assign (Collaborative)
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    You remain primary lead. Vendor engineer is co-assigned to provide Tier-3 patch or diagnostics.
                  </p>
                </div>

                <div
                  onClick={() => setEscalationMode('handover')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: escalationMode === 'handover' ? '2px solid #7C3AED' : '1px solid var(--border)',
                    background: escalationMode === 'handover' ? '#FAF5FF' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <ArrowRight size={15} color={escalationMode === 'handover' ? '#7C3AED' : 'var(--text-muted)'} />
                    <strong style={{ fontSize: '13px', color: escalationMode === 'handover' ? '#6D28D9' : 'var(--text-main)' }}>
                      Full Handover (Transfer)
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    Vendor assumes full primary ownership and resolution SLA responsibility under vendor agreement.
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnostic Justification Notes */}
            <div className="form-field-group">
              <label className="form-field-label">
                Technical Diagnostic &amp; Reason for Vendor Escalation *
              </label>
              <textarea
                className="form-input-control"
                rows={3}
                placeholder="e.g., L2 troubleshooting identified core database lock on partition. Vendor L3 Oracle RAC patch required under MSA SLA."
                value={diagnosticNotes}
                onChange={(e) => {
                  setDiagnosticNotes(e.target.value)
                  if (error) setError(null)
                }}
                style={{ resize: 'vertical' }}
              />
              <span className="form-field-helper">
                This note will be logged in the permanent audit timeline and forwarded to the vendor lead.
              </span>
            </div>

            {/* Contract SLA Info Callout */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12px',
                color: '#065F46',
              }}
            >
              <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
              <div>
                <strong>Contractual Protection Active:</strong> Dispatches immediately to{' '}
                <strong>{activeVendorConfig.leadContact}</strong> via the secure Vendor Portal. Contract SLA response window is <strong>2 hours</strong>.
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '12.5px' }}>
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-dialog-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                background: '#7C3AED',
                borderColor: '#6D28D9',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Building2 size={15} /> Confirm Vendor Escalation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

