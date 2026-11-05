'use client'

import React, { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ResolveTicketModalProps {
  ticket: Ticket
  onClose: () => void
  onConfirmResolve: (
    ticketId: string,
    summary: string,
    rootCause: string,
    resolutionTime: string
  ) => void
}

export function ResolveTicketModal({
  ticket,
  onClose,
  onConfirmResolve,
}: ResolveTicketModalProps) {
  const [summary, setSummary] = useState('')
  const [rootCause, setRootCause] = useState('Configuration / Parameter Error')
  const [resolutionTime, setResolutionTime] = useState('1h 45m')

  const rootCauses = [
    'Configuration / Parameter Error',
    'Software Bug / Code Defect',
    'User Credential / Password Lockout',
    'Database Lock / Query Timeout',
    'Network Routing / VPN Failure',
    'Hardware / Peripheral Malfunction',
    'Third-Party / Vendor Gateway Outage',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!summary.trim()) return
    onConfirmResolve(ticket.id, summary, rootCause, resolutionTime)
    onClose()
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog-header">
          <div>
            <div className="page-eyebrow" style={{ color: 'var(--emerald)' }}>
              <CheckCircle2 size={14} /> Technician Resolution (Section 3.12)
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              Resolve Ticket {ticket.id}
            </h2>
          </div>
          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body">
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Subject
              </span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {ticket.subject}
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Resolution Summary *</label>
              <textarea
                rows={3}
                required
                className="form-textarea-control"
                placeholder="Detail the technical fix applied, configuration adjusted, or services restarted..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
              <div className="form-field-group">
                <label className="form-field-label">Identified Root Cause *</label>
                <select
                  className="form-input-control"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                >
                  {rootCauses.map((rc) => (
                    <option key={rc} value={rc}>
                      {rc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Total Resolution Time</label>
                <input
                  type="text"
                  className="form-input-control"
                  placeholder="e.g. 2h 15m"
                  value={resolutionTime}
                  onChange={(e) => setResolutionTime(e.target.value)}
                />
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '8px' }}>
              <strong>Lifecycle Rule (Section 3.12):</strong> Once marked resolved, this ticket will remain in <strong>Resolved</strong> status until confirmed and closed by the requester (End User).
            </div>
          </div>

          <div className="modal-dialog-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-success"
              disabled={!summary.trim()}
            >
              <CheckCircle2 size={16} /> Mark as Resolved
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

