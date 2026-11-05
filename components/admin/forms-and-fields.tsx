'use client'

import React, { useState } from 'react'
import {
  FileCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  RotateCcw,
  Sliders,
  Layers,
  HelpCircle,
  X,
} from 'lucide-react'
import { applicationQuestionnaires, DynamicQuestion } from '@/app/ticket-data'

interface CustomFieldDef {
  id: string
  label: string
  type: 'text' | 'number' | 'date' | 'dropdown' | 'multi-select' | 'checkbox' | 'radio' | 'attachment' | 'lookup'
  stage: 'Creation' | 'Assignment' | 'Update' | 'Resolution' | 'Testing'
  roles: string[]
  mandatory: boolean
  visible: boolean
}

export function FormsAndFields() {
  const [activeTab, setActiveTab] = useState<'questionnaires' | 'customFields'>('questionnaires')
  const [selectedApp, setSelectedApp] = useState<string>('Flexcube')

  // Questionnaires state
  const [questionnaires, setQuestionnaires] = useState<Record<string, DynamicQuestion[]>>(
    applicationQuestionnaires
  )

  // Custom fields state (Section 15, Tab 2)
  const [customFields, setCustomFields] = useState<CustomFieldDef[]>([
    {
      id: 'cf-root-cause',
      label: 'Root Cause Classification',
      type: 'dropdown',
      stage: 'Resolution',
      roles: ['Technician', 'Admin Team'],
      mandatory: true,
      visible: true,
    },
    {
      id: 'cf-maintenance-window',
      label: 'Approved Maintenance Window',
      type: 'dropdown',
      stage: 'Assignment',
      roles: ['Admin Team', 'Technician'],
      mandatory: false,
      visible: true,
    },
    {
      id: 'cf-test-evidence',
      label: 'UAT Execution Test Evidence',
      type: 'attachment',
      stage: 'Testing',
      roles: ['Testing Team'],
      mandatory: true,
      visible: true,
    },
    {
      id: 'cf-third-party-ref',
      label: 'Vendor Ticket / Case Reference',
      type: 'text',
      stage: 'Update',
      roles: ['Technician', 'External Vendor', 'Admin Team'],
      mandatory: false,
      visible: true,
    },
  ])

  // Modals state
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false)
  const [showAddCustomFieldModal, setShowAddCustomFieldModal] = useState(false)

  // Question form state
  const [newQuestionLabel, setNewQuestionLabel] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<'text' | 'number' | 'dropdown' | 'attachment'>('text')
  const [newQuestionOptions, setNewQuestionOptions] = useState('')
  const [newQuestionRequired, setNewQuestionRequired] = useState(true)

  // Custom field form state
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<CustomFieldDef['type']>('text')
  const [newFieldStage, setNewFieldStage] = useState<CustomFieldDef['stage']>('Creation')
  const [newFieldMandatory, setNewFieldMandatory] = useState(false)

  // Unsaved changes tracker
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const markDirty = () => setHasUnsavedChanges(true)

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestionLabel.trim()) return

    const newQ: DynamicQuestion = {
      id: `q-${Date.now()}`,
      label: newQuestionLabel.trim(),
      type: newQuestionType,
      options:
        newQuestionType === 'dropdown'
          ? newQuestionOptions.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined,
      required: newQuestionRequired,
    }

    setQuestionnaires({
      ...questionnaires,
      [selectedApp]: [...(questionnaires[selectedApp] || []), newQ],
    })

    setNewQuestionLabel('')
    setNewQuestionOptions('')
    setShowAddQuestionModal(false)
    markDirty()
    triggerToast(`Added questionnaire field to ${selectedApp}`)
  }

  const handleDeleteQuestion = (qId: string) => {
    setQuestionnaires({
      ...questionnaires,
      [selectedApp]: questionnaires[selectedApp].filter((q) => q.id !== qId),
    })
    markDirty()
    triggerToast('Question removed.')
  }

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFieldLabel.trim()) return

    const newField: CustomFieldDef = {
      id: `cf-${Date.now()}`,
      label: newFieldLabel.trim(),
      type: newFieldType,
      stage: newFieldStage,
      roles: ['All Roles'],
      mandatory: newFieldMandatory,
      visible: true,
    }

    setCustomFields([...customFields, newField])
    setNewFieldLabel('')
    setShowAddCustomFieldModal(false)
    markDirty()
    triggerToast(`Created custom field "${newField.label}"`)
  }

  const handleDeleteCustomField = (id: string) => {
    setCustomFields(customFields.filter((f) => f.id !== id))
    markDirty()
    triggerToast('Custom field removed.')
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    triggerToast('Forms & Fields configuration saved successfully!')
  }

  const handleDiscard = () => {
    setQuestionnaires(applicationQuestionnaires)
    setHasUnsavedChanges(false)
    triggerToast('Changes discarded.')
  }

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 1000,
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Sparkles size={16} color="#60A5FA" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="page-header-flex">
        <div>
          <div className="page-eyebrow">
            <FileCheck size={14} /> Section 15 · Forms & Questionnaires
          </div>
          <h1 className="page-title-main">Forms & Custom Fields</h1>
          <p className="page-desc-sub">
            Customize application-specific questionnaires and add mandatory or role-based fields across the ticket lifecycle.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '3px',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'questionnaires' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'questionnaires' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'questionnaires' ? 700 : 500,
            }}
            onClick={() => setActiveTab('questionnaires')}
          >
            <FileCheck size={14} /> Application Questionnaires
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              height: '32px',
              fontSize: '12.5px',
              border: 'none',
              background: activeTab === 'customFields' ? 'var(--primary-soft)' : 'transparent',
              color: activeTab === 'customFields' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'customFields' ? 700 : 500,
            }}
            onClick={() => setActiveTab('customFields')}
          >
            <Sliders size={14} /> Lifecycle Custom Fields
          </button>
        </div>
      </div>

      {/* TAB 1: APPLICATION QUESTIONNAIRES */}
      {activeTab === 'questionnaires' && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left App Selector */}
          <div className="modern-card">
            <div className="modern-card-header">
              <h3 className="card-title-lg">Target Application</h3>
            </div>
            <div style={{ padding: '6px' }}>
              {Object.keys(questionnaires).map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '13px',
                    textAlign: 'left',
                    border: 'none',
                    borderRadius: '8px',
                    background: selectedApp === app ? 'var(--primary-soft)' : 'transparent',
                    color: selectedApp === app ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: selectedApp === app ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2px',
                  }}
                >
                  <span>{app}</span>
                  <span className="badge-tag badge-tag-sm" style={{ background: '#E2E8F0', color: '#475569', fontSize: '11px' }}>
                    {questionnaires[app]?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Questionnaire Fields List */}
          <div className="modern-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  {selectedApp} Intake Questionnaire ({questionnaires[selectedApp]?.length || 0} Fields)
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Fields presented to end users when creating a ticket under {selectedApp}.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{ height: '34px', fontSize: '12.5px' }}
                onClick={() => setShowAddQuestionModal(true)}
              >
                <Plus size={14} /> Add Question
              </button>
            </div>

            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Field Label</th>
                    <th>Input Type</th>
                    <th>Options / Options Count</th>
                    <th>Validation</th>
                    <th style={{ width: '60px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(questionnaires[selectedApp] || []).map((q) => (
                    <tr key={q.id}>
                      <td>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{q.label}</strong>
                        {q.placeholder && (
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            Placeholder: {q.placeholder}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', textTransform: 'uppercase', fontWeight: 600 }}>
                          {q.type}
                        </span>
                      </td>
                      <td>
                        {q.options && q.options.length > 0 ? (
                          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                            {q.options.join(', ')}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Free Text Input</span>
                        )}
                      </td>
                      <td>
                        {q.required ? (
                          <span className="badge-tag badge-tag-sm" style={{ background: '#FEF2F2', color: '#B91C1C', fontWeight: 600 }}>
                            Mandatory *
                          </span>
                        ) : (
                          <span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#64748B' }}>
                            Optional
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="icon-action-btn"
                          style={{ width: '28px', height: '28px', border: 'none', color: 'var(--rose)' }}
                          onClick={() => handleDeleteQuestion(q.id)}
                          title="Delete Field"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIFECYCLE CUSTOM FIELDS (Section 15) */}
      {activeTab === 'customFields' && (
        <div className="modern-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                Enterprise Custom Fields Library ({customFields.length})
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Field types: text, number, date, dropdown, multi-select, checkbox, radio button, attachment, lookup. Used in creation, assignment, update, resolution, testing.
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ height: '34px', fontSize: '12.5px' }}
              onClick={() => setShowAddCustomFieldModal(true)}
            >
              <Plus size={14} /> Add Custom Field
            </button>
          </div>

          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Data Type</th>
                  <th>Lifecycle Stage</th>
                  <th>Role Visibility</th>
                  <th>Validation</th>
                  <th style={{ width: '60px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {customFields.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{f.label}</strong>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#F5F3FF', color: '#6D28D9', fontWeight: 600 }}>
                        {f.type}
                      </span>
                    </td>
                    <td>
                      <span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                        {f.stage}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {f.roles.join(', ')}
                      </span>
                    </td>
                    <td>
                      {f.mandatory ? (
                        <span className="badge-tag badge-tag-sm" style={{ background: '#FEF2F2', color: '#B91C1C', fontWeight: 600 }}>
                          Required
                        </span>
                      ) : (
                        <span className="badge-tag badge-tag-sm" style={{ background: '#F1F5F9', color: '#64748B' }}>
                          Optional
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="icon-action-btn"
                        style={{ width: '28px', height: '28px', border: 'none', color: 'var(--rose)' }}
                        onClick={() => handleDeleteCustomField(f.id)}
                        title="Delete Custom Field"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Add Questionnaire Question */}
      {showAddQuestionModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowAddQuestionModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div>
                <div className="page-eyebrow">{selectedApp} Questionnaire</div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Add Dynamic Field</h2>
              </div>
              <button onClick={() => setShowAddQuestionModal(false)} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddQuestion}>
              <div className="modal-dialog-body">
                <div className="form-field-group">
                  <label className="form-field-label">Question Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Host IP, Release Version, Customer Account No"
                    className="form-input-control"
                    value={newQuestionLabel}
                    onChange={(e) => setNewQuestionLabel(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Input Type *</label>
                  <select
                    className="form-input-control"
                    value={newQuestionType}
                    onChange={(e) => setNewQuestionType(e.target.value as never)}
                  >
                    <option value="text">Text Input</option>
                    <option value="number">Numeric</option>
                    <option value="dropdown">Dropdown Select</option>
                    <option value="attachment">Attachment Upload</option>
                  </select>
                </div>

                {newQuestionType === 'dropdown' && (
                  <div className="form-field-group">
                    <label className="form-field-label">Options (Comma separated) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Production, UAT, Disaster Recovery"
                      className="form-input-control"
                      value={newQuestionOptions}
                      onChange={(e) => setNewQuestionOptions(e.target.value)}
                    />
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    checked={newQuestionRequired}
                    onChange={(e) => setNewQuestionRequired(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Mandatory field before submission</span>
                </label>
              </div>

              <div className="modal-dialog-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddQuestionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={!newQuestionLabel.trim()}>
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Custom Field */}
      {showAddCustomFieldModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowAddCustomFieldModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div>
                <div className="page-eyebrow">Lifecycle Field Builder</div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Create Custom Field</h2>
              </div>
              <button onClick={() => setShowAddCustomFieldModal(false)} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomField}>
              <div className="modal-dialog-body">
                <div className="form-field-group">
                  <label className="form-field-label">Field Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Root Cause Category, Maintenance Window"
                    className="form-input-control"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Field Type *</label>
                  <select
                    className="form-input-control"
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as never)}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="multi-select">Multi-Select</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio Button</option>
                    <option value="attachment">Attachment</option>
                    <option value="lookup">Lookup</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Lifecycle Stage *</label>
                  <select
                    className="form-input-control"
                    value={newFieldStage}
                    onChange={(e) => setNewFieldStage(e.target.value as never)}
                  >
                    <option value="Creation">Creation</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Update">Update</option>
                    <option value="Resolution">Resolution</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    checked={newFieldMandatory}
                    onChange={(e) => setNewFieldMandatory(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Mandatory field for assigned role</span>
                </label>
              </div>

              <div className="modal-dialog-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddCustomFieldModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={!newFieldLabel.trim()}>
                  Save Custom Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNSAVED CHANGES FLOATING BAR (Section 15) */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in Forms & Fields.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{
                height: '32px',
                fontSize: '12px',
                padding: '0 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
              }}
              onClick={handleDiscard}
            >
              Discard
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ height: '32px', fontSize: '12px', padding: '0 14px' }}
              onClick={handleSave}
            >
              <Save size={13} /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

