'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface ReasonModalProps {
  title: string
  label: string
  placeholder?: string
  confirmLabel: string
  danger?: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

/** Small reason dialog. Replaces the browser prompt() boxes. */
export function ReasonModal({
  title,
  label,
  placeholder,
  confirmLabel,
  danger = true,
  onClose,
  onConfirm,
}: ReasonModalProps) {
  const [reason, setReason] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    onConfirm(reason.trim())
    onClose()
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div className="modal-dialog-box" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-dialog-header">
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }} type="button" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-dialog-body">
            <div className="form-field-group">
              <label className="form-field-label">
                {label} <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                className="form-input-control"
                rows={4}
                required
                autoFocus
                placeholder={placeholder}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ fontSize: '13px', lineHeight: 1.5 }}
              />
            </div>
          </div>
          <div className="modal-dialog-footer" style={{ justifyContent: 'space-between' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className={danger ? 'btn-danger' : 'btn-primary'}
              style={
                danger
                  ? { background: '#DC2626', color: '#FFFFFF', borderColor: '#B91C1C', fontWeight: 700, opacity: !reason.trim() ? 0.6 : 1 }
                  : { opacity: !reason.trim() ? 0.6 : 1 }
              }
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
