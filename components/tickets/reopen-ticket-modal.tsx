'use client'

import React, { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ReopenTicketModalProps {
  ticket: Ticket
  onClose: () => void
  onConfirmReopen: (ticketId: string, reason: string) => void
}

export function ReopenTicketModal({
  ticket,
  onClose,
  onConfirmReopen,
}: ReopenTicketModalProps) {
  const [reopenReason, setReopenReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reopenReason.trim()) return
    onConfirmReopen(ticket.id, reopenReason)
    onClose()
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog-header">
          <div>
            <div className="page-eyebrow" style={{ color: 'var(--rose)' }}>
              <AlertCircle size={14} /> Service Desk Exception
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              Reopen Ticket {ticket.id}
            </h2>
          </div>
          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body">
            <div className="alert-card-banner alert-warning" style={{ margin: 0 }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12.5px' }}>
                Under UFC Ticket Policy Section 3.12, reopened tickets bypass technician triage and are routed <strong>directly to the Service Desk Admin Team Exception Queue</strong> for priority review.
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">
                Why does this issue require reopening? *
              </label>
              <textarea
                rows={4}
                required
                className="form-textarea-control"
                placeholder="Explain what is still not working or what recurrent symptoms appeared after the technician marked it resolved..."
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-dialog-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-danger"
              disabled={!reopenReason.trim()}
            >
              Confirm Reopen & Route to Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

