'use client'

import React, { useState } from 'react'
import { X, CheckCircle2, Star } from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface CloseTicketModalProps {
  ticket: Ticket
  onClose: () => void
  onConfirmClose: (ticketId: string, remarks: string, rating: number) => void
}

export function CloseTicketModal({
  ticket,
  onClose,
  onConfirmClose,
}: CloseTicketModalProps) {
  const [remarks, setRemarks] = useState('')
  const [rating, setRating] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirmClose(ticket.id, remarks, rating)
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
            <div className="page-eyebrow" style={{ color: 'var(--emerald)' }}>
              <CheckCircle2 size={14} /> End User Verification
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
              Verify & Close {ticket.id}
            </h2>
          </div>
          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-dialog-body">
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '14px', borderRadius: '10px' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '13px', color: '#065F46', fontWeight: 700 }}>
                Resolution Provided by Technician:
              </h4>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#047857' }}>
                {ticket.resolutionSummary || 'Technical resolution and testing have been completed.'}
              </p>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">How satisfied are you with this resolution?</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: star <= rating ? '#EAB308' : '#CBD5E1',
                    }}
                  >
                    <Star size={28} fill={star <= rating ? '#EAB308' : 'none'} />
                  </button>
                ))}
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '8px' }}>
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Satisfactory' : 'Needs improvement'}
                </span>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-field-label">Closure Remarks (Optional)</label>
              <textarea
                rows={3}
                className="form-textarea-control"
                placeholder="Confirm that you tested the solution and everything is working as expected..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Note: Closing this ticket helps maintain healthy service desk metrics and unlocks your quota if you were near the unclosed tickets limit.
            </div>
          </div>

          <div className="modal-dialog-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-success">
              <CheckCircle2 size={16} /> Confirm Resolution & Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

