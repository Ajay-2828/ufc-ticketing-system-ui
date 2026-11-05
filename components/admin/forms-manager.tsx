'use client'

import React, { useState } from 'react'
import {
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react'
import { applicationQuestionnaires, DynamicQuestion } from '@/app/ticket-data'

export function FormsManager() {
  const [selectedApp, setSelectedApp] = useState<string>('Flexcube')
  const [questionnaires, setQuestionnaires] = useState<Record<string, DynamicQuestion[]>>(applicationQuestionnaires)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const currentQuestions = questionnaires[selectedApp] || []

  const handleAddQuestion = () => {
    const label = prompt('Enter question label / field name:')
    if (!label) return

    const newQ: DynamicQuestion = {
      id: `q-${Date.now()}`,
      label,
      type: 'text',
      required: false,
      placeholder: `Enter ${label.toLowerCase()}`,
    }

    setQuestionnaires({
      ...questionnaires,
      [selectedApp]: [...currentQuestions, newQ],
    })
    setToastMessage(`Added "${label}" to ${selectedApp} dynamic questionnaire!`)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const handleToggleRequired = (id: string) => {
    setQuestionnaires({
      ...questionnaires,
      [selectedApp]: currentQuestions.map((q) =>
        q.id === id ? { ...q, required: !q.required } : q
      ),
    })
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestionnaires({
      ...questionnaires,
      [selectedApp]: currentQuestions.filter((q) => q.id !== id),
    })
  }

  return (
    <div>
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <FileText size={14} /> Section 3.2 Dynamic Application Questionnaires
          </div>
          <h1 className="page-title-main">Dynamic Form & Custom Fields Manager</h1>
          <p className="page-desc-sub">
            When an employee selects an application during ticket creation, these questionnaire
            fields are automatically injected.
          </p>
        </div>

        {toastMessage && (
          <div className="alert-card-banner alert-success" style={{ margin: 0, padding: '8px 14px' }}>
            <CheckCircle2 size={16} /> {toastMessage}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Left: App Selector */}
        <div className="modern-card">
          <div className="modern-card-header">
            <h3 className="card-title-lg">Applications</h3>
          </div>
          <div style={{ padding: '6px' }}>
            {Object.keys(questionnaires).map((app) => (
              <button
                key={app}
                type="button"
                className="nav-link-btn"
                style={{
                  background: selectedApp === app ? 'var(--primary-soft)' : 'transparent',
                  color: selectedApp === app ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: selectedApp === app ? 700 : 500,
                  marginBottom: '2px',
                }}
                onClick={() => setSelectedApp(app)}
              >
                <span>{app}</span>
                <span className="nav-badge-count">{questionnaires[app].length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Question Editor */}
        <div className="modern-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 700 }}>
                {selectedApp} Question Configuration
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                Field properties, input types, and validation rules.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ height: '34px', fontSize: '12.5px' }}
              onClick={handleAddQuestion}
            >
              <Plus size={14} /> Add Question
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQuestions.map((q) => (
              <div
                key={q.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'var(--surface)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                    {q.label}
                  </strong>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Type: <b style={{ textTransform: 'capitalize' }}>{q.type}</b>
                    {q.options && ` · Options: ${q.options.slice(0, 3).join(', ')}...`}
                  </span>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={() => handleToggleRequired(q.id)}
                  />
                  Mandatory
                </label>

                <button
                  type="button"
                  className="icon-action-btn"
                  style={{ width: '30px', height: '30px', border: 'none', color: 'var(--rose)' }}
                  onClick={() => handleDeleteQuestion(q.id)}
                  title="Remove question"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Preview of Dynamic Questionnaire */}
        <div className="modern-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Eye size={16} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
              Live End-User Intake Preview
            </h4>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Rendered inside the ticket creation modal when <b>{selectedApp}</b> is selected:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentQuestions.map((q) => (
              <div key={q.id} className="form-field-group">
                <label className="form-field-label" style={{ fontSize: '12px' }}>
                  {q.label} {q.required && <span style={{ color: 'var(--rose)' }}>*</span>}
                </label>
                {q.type === 'dropdown' ? (
                  <select className="form-input-control" style={{ height: '34px', fontSize: '12px' }}>
                    <option value="">{q.placeholder || 'Select...'}</option>
                    {q.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input-control"
                    style={{ height: '34px', fontSize: '12px' }}
                    placeholder={q.placeholder || `Enter ${q.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

