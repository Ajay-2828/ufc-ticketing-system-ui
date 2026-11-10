'use client'

import React, { useState } from 'react'
import { X, AlertTriangle, Send, Bell, ShieldAlert } from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface RejectTicketModalProps {
  ticket: Ticket
  approverRole?: string
  approverName?: string
  onClose: () => void
  onConfirmReject: (ticketId: string, reason: string, category: string) => void
}

export function RejectTicketModal({
  ticket,
  approverRole = 'Department Head (HOD)',
  approverName = 'Approver',
  onClose,
  onConfirmReject,
}: RejectTicketModalProps) {
  const [reason, setReason] = useState('')
  const [category, setCategory] = useState('Insufficient Business Justification')

  const rejectionCategories = [
    'Insufficient Business Justification',
    'Policy / Budget Non-Compliance',
    'Scope Not Authorized for Department',
    'Duplicate / Redundant Request',
    'Alternative Internal Tool Exists',
    'Technical / Security Risk Unacceptable',
    'Other / Operational Reason',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    onConfirmReject(ticket.id, reason.trim(), category)
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
            <div className="page-eyebrow" style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} /> Authorization Decision
            </div>
            <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800 }}>
              Reject Ticket {ticket.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="icon-action-btn"
            style={{ width: '32px', height: '32px' }}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Warning Alert Banner */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                fontSize: '12.5px',
                color: '#991B1B',
              }}
            >
              <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Rejection Closes This Request:</strong> Rejecting will immediately terminate the approval workflow, change ticket status to <strong>Closed</strong>, and log your formal justification in the timeline.
              </div>
            </div>

            {/* Target Ticket Card */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Target Request &bull; {ticket.type}
              </span>
              <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                {ticket.subject}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Submitted by <b>{ticket.creator}</b> ({ticket.department}) for <b>{ticket.app}</b>
              </span>
            </div>

            {/* Rejection Category Dropdown */}
            <div className="form-field-group">
              <label className="form-field-label">
                Primary Reason Category <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                className="form-input-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ fontSize: '13px' }}
              >
                {rejectionCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Justification */}
            <div className="form-field-group">
              <label className="form-field-label">
                Mandatory Rejection Remarks &amp; Justification <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                className="form-input-control"
                rows={3}
                required
                placeholder="Explain why this request is not authorized. The requester and administrative audit log will see this justification..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ fontSize: '13px', lineHeight: 1.5 }}
              />
            </div>

            {/* Automated Notification Notice */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#F8FAFC',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
              }}
            >
              <Bell size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>
                Automated email alerts with your reason will be sent to <b>{ticket.creator}</b> and the <b>Administration Team</b>.
              </span>
            </div>
          </div>

          <div className="modal-dialog-footer" style={{ justifyContent: 'space-between' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-danger"
              disabled={!reason.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#DC2626',
                color: '#FFFFFF',
                borderColor: '#B91C1C',
                fontWeight: 700,
                opacity: !reason.trim() ? 0.6 : 1,
              }}
            >
              <ShieldAlert size={14} /> Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

