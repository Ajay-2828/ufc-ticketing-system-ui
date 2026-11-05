'use client'

import React, { useState } from 'react'
import { X, Share2 } from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ReferralModalProps {
  ticket: Ticket
  onClose: () => void
  onConfirmReferral: (ticketId: string, targetDept: string, reason: string) => void
}

export function ReferralModal({
  ticket,
  onClose,
  onConfirmReferral,
}: ReferralModalProps) {
  const [targetDept, setTargetDept] = useState('Risk & Compliance')
  const [reason, setReason] = useState('')

  const referralDepartments = [
    'Risk & Compliance',
    'Operations',
    'Finance & Treasury',
    'Business Development',
    'Security & SOC',
    'Internal Audit',
    'External Legal Counsel',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    onConfirmReferral(ticket.id, targetDept, reason)
    onClose()
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: '540px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog-header">
          <div>
            <div className="page-eyebrow">
              <Share2 size={14} /> Cross-Department Collaboration (Section 3.9)
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              Refer Ticket {ticket.id}
            </h2>
          </div>
          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body">
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--surface-subtle)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              Under enterprise governance policy, the ticket referral feature is reserved for <strong>Department Heads (HODs) and the Admin Team</strong> to seek specialized assessment or inter-departmental authorization.
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Target Department for Referral *</label>
              <select
                className="form-input-control"
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
              >
                {referralDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Reason for Referral / Specific Questions *</label>
              <textarea
                rows={4}
                required
                className="form-textarea-control"
                placeholder="State the regulatory, operational, or business justification required from this department..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-dialog-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!reason.trim()}
            >
              <Share2 size={16} /> Submit Referral Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

