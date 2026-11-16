'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Send } from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'

/**
 * Other departments (Operations, Risk, Compliance...) only answer clarification requests.
 * A referred ticket keeps its own department and returns to where it was once answered.
 */
export default function ClarificationsPage() {
  const router = useRouter()
  const { visibleTickets, respondToReferral, currentRole, currentUser } = useTicketContext()
  const [answers, setAnswers] = useState<Record<string, string>>({})

  if (currentRole !== 'Other Departments') {
    return (
      <div className="modern-card" style={{ padding: '24px', maxWidth: '560px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800 }}>Clarifications</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
          This page is for the other departments (Operations, Risk, Business, Compliance) who answer
          clarification requests sent by the HOD or the Admin team.
        </p>
      </div>
    )
  }

  const open = visibleTickets.filter(
    (t) => t.status === 'Awaiting Clarification' && t.referral && !t.referral.response
  )
  const answered = visibleTickets.filter((t) => t.referral?.response)

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <MessageSquare size={14} /> {currentUser.dept}
          </div>
          <h1 className="page-title-main">Clarification Requests</h1>
          <p className="page-desc-sub">
            Answer the questions sent to your department. Your answer goes back to the ticket and the
            ticket returns to the step it came from.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {open.length === 0 && (
          <div className="modern-card" style={{ padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
            Nothing is waiting for your department.
          </div>
        )}
        {open.map((t) => (
          <div key={t.id} className="modern-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <code
                style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => router.push(`/tickets/${t.id}`)}
              >
                {t.id}
              </code>
              <strong style={{ fontSize: '14.5px' }}>{t.subject}</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                from {t.department} &bull; raised by {t.creator}
              </span>
            </div>
            <div style={{ fontSize: '13px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px' }}>
              <b>{t.referral?.referredBy}</b> asks: {t.referral?.reason}
            </div>
            <textarea
              className="form-input-control"
              rows={3}
              placeholder="Your answer"
              value={answers[t.id] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [t.id]: e.target.value }))}
              style={{ fontSize: '13px' }}
            />
            <div>
              <button
                type="button"
                className="btn-primary"
                disabled={!(answers[t.id] || '').trim()}
                onClick={() => {
                  respondToReferral(t.id, answers[t.id].trim())
                  setAnswers((a) => ({ ...a, [t.id]: '' }))
                }}
              >
                <Send size={14} /> Send answer
              </button>
            </div>
          </div>
        ))}

        {answered.length > 0 && (
          <>
            <h3 style={{ margin: '10px 0 0', fontSize: '14px', fontWeight: 700 }}>Answered</h3>
            {answered.map((t) => (
              <div key={t.id} className="modern-card" style={{ padding: '12px 16px', fontSize: '13px' }}>
                <code style={{ color: 'var(--primary)', fontWeight: 700 }}>{t.id}</code> {t.subject}
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Your answer ({t.referral?.responseTime}): {t.referral?.response}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
