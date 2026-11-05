'use client'

import React, { useState, useMemo } from 'react'
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Clock,
  Sparkles,
  Info,
  UserCheck,
  ShieldCheck,
  FileText,
  Save,
  Send,
} from 'lucide-react'
import {
  Ticket,
  ClassificationConfig,
  applicationQuestionnaires,
  departmentsList,
  departmentsData,
  policySettings,
  Role,
} from '@/app/ticket-data'

interface CreateTicketModalProps {
  onClose: () => void
  onCreateTicket: (ticket: Partial<Ticket>) => void
  currentRole: Role
  currentUser: { name: string; dept: string; initials: string }
  unclosedResolvedCount: number
  classificationTree: ClassificationConfig[]
}

export function CreateTicketModal({
  onClose,
  onCreateTicket,
  currentRole,
  currentUser,
  unclosedResolvedCount,
  classificationTree,
}: CreateTicketModalProps) {
  const isBlockedByThreshold =
    currentRole === 'End User' &&
    unclosedResolvedCount >= policySettings.unresolvedClosureThreshold

  // Application-level access (Section 5 & 18):
  // Filter sub-classifications by department entitlement if End User
  const userDeptConfig = departmentsData.find((d) => d.name === (currentUser.dept || 'Finance & Risk'))
  const allowedApps = userDeptConfig?.assignedApplications || []

  const availableCategories = useMemo(() => {
    if (currentRole === 'Admin Team' || currentRole === 'Technician') {
      return classificationTree
    }
    // Filter categories that have at least one allowed sub-classification
    return classificationTree
      .map((cat) => ({
        ...cat,
        subClassifications: cat.subClassifications.filter(
          (sub) => allowedApps.length === 0 || allowedApps.includes(sub.name)
        ),
      }))
      .filter((cat) => cat.subClassifications.length > 0)
  }, [classificationTree, currentRole, allowedApps])

  const initialMain = availableCategories[0]?.name || classificationTree[0]?.name || 'Core Banking & Applications'
  const [selectedClassification, setSelectedClassification] = useState(initialMain)

  const activeClassificationObj =
    availableCategories.find((c) => c.name === selectedClassification) ||
    availableCategories[0] ||
    classificationTree[0]

  const availableSubClasses = activeClassificationObj?.subClassifications || []
  const initialSub = availableSubClasses[0]?.name || 'Flexcube'

  const [selectedSubClass, setSelectedSubClass] = useState(initialSub)
  const activeSubClassObj =
    availableSubClasses.find((s) => s.name === selectedSubClass) ||
    availableSubClasses[0]

  const availableIssueTypes = activeSubClassObj?.issueTypes || []
  const [selectedIssueType, setSelectedIssueType] = useState(
    availableIssueTypes[0]?.name || 'Login not working'
  )

  const activeIssueTypeObj =
    availableIssueTypes.find((i) => i.name === selectedIssueType) ||
    availableIssueTypes[0]

  const designatedTechnicians = activeSubClassObj?.technicians || ['Daniel Mensah']

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState(currentUser.dept || 'Finance & Risk')
  const [priorityOverride, setPriorityOverride] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P2')
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({})
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  // Get dynamic questionnaire questions
  const questions =
    applicationQuestionnaires[selectedSubClass] ||
    applicationQuestionnaires['Flexcube'] ||
    []

  const handleClassificationChange = (clsName: string) => {
    setSelectedClassification(clsName)
    const clsObj = availableCategories.find((c) => c.name === clsName)
    if (clsObj && clsObj.subClassifications.length > 0) {
      const firstSub = clsObj.subClassifications[0]
      setSelectedSubClass(firstSub.name)
      if (firstSub.issueTypes.length > 0) {
        setSelectedIssueType(firstSub.issueTypes[0].name)
      }
    }
    setDynamicAnswers({})
  }

  const handleSubClassChange = (subName: string) => {
    setSelectedSubClass(subName)
    const subObj = availableSubClasses.find((s) => s.name === subName)
    if (subObj && subObj.issueTypes.length > 0) {
      setSelectedIssueType(subObj.issueTypes[0].name)
    }
    setDynamicAnswers({})
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name
      setAttachedFiles((prev) => [...prev, fileName])
    }
  }

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    if (!subject.trim()) return

    const isCR = activeIssueTypeObj?.isChangeRequest || false
    const autoSeverity = activeIssueTypeObj?.autoSeverity || 'Medium'
    const calculatedPriority =
      autoSeverity === 'Critical'
        ? 'P1'
        : autoSeverity === 'High'
        ? 'P2'
        : autoSeverity === 'Medium'
        ? 'P3'
        : 'P4'

    const finalPriority =
      currentRole !== 'End User' ? priorityOverride : calculatedPriority

    const primaryTechnician = designatedTechnicians[0] || 'Daniel Mensah'
    const coTechnician = designatedTechnicians[1] || undefined

    const ticketId = isCR
      ? `CR-2026-${Math.floor(100 + Math.random() * 900)}`
      : `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`

    const newTicket: Partial<Ticket> = {
      id: ticketId,
      subject,
      description,
      type: isCR ? 'Change Request' : 'Incident',
      app: selectedSubClass,
      classification: selectedClassification,
      subClassification: selectedSubClass,
      issueType: selectedIssueType,
      severity: autoSeverity,
      priority: finalPriority,
      status: isDraft ? 'Awaiting Clarification' : 'Pending Approval',
      department,
      creator: currentUser.name,
      creatorRole: currentRole,
      creatorAvatar: currentUser.initials,
      assignee: primaryTechnician,
      coAssignee: coTechnician,
      sla: `${activeIssueTypeObj?.slaResolutionHours || 4}h remaining`,
      slaTimeRemaining: `0${activeIssueTypeObj?.slaResolutionHours || 4}:00:00`,
      slaBreached: false,
      hodTimeRemaining: `0${activeIssueTypeObj?.hodApprovalLimitHours || 2}:00:00`,
      created: 'Just now',
      dynamicFields: dynamicAnswers,
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: 'Just now',
          user: currentUser.name,
          role: currentRole,
          action: isDraft ? 'Ticket Saved as Draft' : 'Ticket Submitted',
          note: `Classification: ${selectedClassification} / ${selectedSubClass}. Auto-assigned to designated technician: ${primaryTechnician}${
            coTechnician ? ` & ${coTechnician}` : ''
          }. Auto-calculated Severity: ${autoSeverity}.`,
          tone: 'blue',
        },
        ...(!isDraft
          ? [
              {
                id: `t2-${Date.now()}`,
                time: 'Just now',
                user: 'System Notification',
                action: 'Awaiting Department Head (HOD) Approval',
                note: `Approval timer active: ${activeIssueTypeObj?.hodApprovalLimitHours || 2}h limit. Assigned HOD: ${userDeptConfig?.hodName || 'Grace Nsubuga'} (from AD).`,
                tone: 'amber' as const,
              },
            ]
          : []),
      ],
      clarifications: [],
    }

    onCreateTicket(newTicket)
    setSubmitted(true)
    setTimeout(() => {
      onClose()
    }, 1200)
  }

  return (
    <div className="modal-overlay-backdrop" onClick={onClose}>
      <div
        className="modal-dialog-box"
        style={{ maxWidth: '960px', width: '95vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-dialog-header">
          <div>
            <div className="page-eyebrow">
              <Sparkles size={14} /> Section 5 &bull; IT Service Management Intake
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Create New Ticket</h2>
          </div>
          <button onClick={onClose} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>
              Ticket Created Successfully!
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: '480px' }}>
              Auto-routed to designated technician <b>{designatedTechnicians[0]}</b> and sent to your HOD <b>{userDeptConfig?.hodName || 'Grace Nsubuga'}</b> for SLA approval.
            </p>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <div
              className="modal-dialog-body"
              style={{
                maxHeight: 'calc(85vh - 140px)',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: '24px',
                alignItems: 'start',
              }}
            >
              {/* LEFT COLUMN: Ticket Form (Fields in order per Section 5) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Blocked State Banner (Section 5) */}
                {isBlockedByThreshold && (
                  <div className="alert-card-banner alert-danger">
                    <AlertCircle size={22} style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Ticket Submission Blocked: Threshold Reached</strong>
                      <p style={{ margin: '3px 0 0', fontSize: '12.5px' }}>
                        You currently have <b>{unclosedResolvedCount}</b> resolved tickets awaiting verification. Under UFC service desk governance, please verify and close outstanding resolved tickets before raising new requests.
                      </p>
                    </div>
                  </div>
                )}

                {/* 1. Cascading Classification Dropdowns */}
                <div
                  style={{
                    background: 'var(--surface-subtle)',
                    padding: '16px 18px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                  }}
                >
                  <div className="form-field-group">
                    <label className="form-field-label">1. Main Category *</label>
                    <select
                      className="form-input-control"
                      disabled={isBlockedByThreshold}
                      value={selectedClassification}
                      onChange={(e) => handleClassificationChange(e.target.value)}
                    >
                      {availableCategories.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">2. Sub-Application *</label>
                    <select
                      className="form-input-control"
                      disabled={isBlockedByThreshold}
                      value={selectedSubClass}
                      onChange={(e) => handleSubClassChange(e.target.value)}
                    >
                      {availableSubClasses.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="form-field-label">3. Specific Issue Type *</label>
                    <select
                      className="form-input-control"
                      disabled={isBlockedByThreshold}
                      value={selectedIssueType}
                      onChange={(e) => setSelectedIssueType(e.target.value)}
                    >
                      {availableIssueTypes.map((i) => (
                        <option key={i.name} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Severity Read-Only Badge (Section 5, Step 2: Auto-calculated, Not editable) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      2. Auto-Calculated Severity (Read-Only):
                    </span>
                    <span
                      className="badge-tag"
                      style={{
                        background:
                          activeIssueTypeObj?.autoSeverity === 'Critical'
                            ? '#FEE2E2'
                            : activeIssueTypeObj?.autoSeverity === 'High'
                            ? '#FEF3C7'
                            : '#DBEAFE',
                        color:
                          activeIssueTypeObj?.autoSeverity === 'Critical'
                            ? '#B91C1C'
                            : activeIssueTypeObj?.autoSeverity === 'High'
                            ? '#B45309'
                            : '#1D4ED8',
                        fontWeight: 700,
                      }}
                    >
                      {activeIssueTypeObj?.autoSeverity || 'Medium'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Calculated from issue type SLA policy
                  </span>
                </div>

                {/* 3. Subject and Description */}
                <div className="form-field-group">
                  <label className="form-field-label">3. Subject / Summary *</label>
                  <input
                    type="text"
                    required
                    disabled={isBlockedByThreshold}
                    placeholder="Brief summary of the incident or request"
                    className="form-input-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Description & Steps to Reproduce *</label>
                  <textarea
                    rows={4}
                    required
                    disabled={isBlockedByThreshold}
                    placeholder="Provide detailed information, error messages, and business impact..."
                    className="form-input-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* 4. Application-Specific Questionnaire (Section 5) */}
                {questions.length > 0 && (
                  <div
                    style={{
                      border: '1.5px solid #BFDBFE',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      background: '#EFF6FF25',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontWeight: 700, fontSize: '13.5px', marginBottom: '12px' }}>
                      <FileText size={16} /> 4. {selectedSubClass} Application Intake Questionnaire
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                      {questions.map((q) => (
                        <div key={q.id} className="form-field-group">
                          <label className="form-field-label">
                            {q.label} {q.required && '*'}
                          </label>
                          {q.type === 'dropdown' ? (
                            <select
                              className="form-input-control"
                              required={q.required}
                              disabled={isBlockedByThreshold}
                              value={dynamicAnswers[q.id] || ''}
                              onChange={(e) =>
                                setDynamicAnswers({ ...dynamicAnswers, [q.id]: e.target.value })
                              }
                            >
                              <option value="">Select option...</option>
                              {q.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={q.type === 'number' ? 'number' : 'text'}
                              className="form-input-control"
                              required={q.required}
                              disabled={isBlockedByThreshold}
                              placeholder={q.placeholder || ''}
                              value={dynamicAnswers[q.id] || ''}
                              onChange={(e) =>
                                setDynamicAnswers({ ...dynamicAnswers, [q.id]: e.target.value })
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Attachments (PNG, JPG, PDF up to 10 MB) */}
                <div className="form-field-group">
                  <label className="form-field-label">5. Attachments (PNG, JPG, PDF up to 10 MB each)</label>
                  <label
                    style={{
                      border: '1.5px dashed var(--border)',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isBlockedByThreshold ? 'not-allowed' : 'pointer',
                      background: 'var(--surface-subtle)',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <Upload size={20} color="var(--primary)" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>
                      Click to upload error screenshots or logs
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Supports PNG, JPG, PDF up to 10 MB each
                    </span>
                    <input
                      type="file"
                      disabled={isBlockedByThreshold}
                      accept=".png,.jpg,.jpeg,.pdf"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </label>

                  {attachedFiles.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {attachedFiles.map((file, i) => (
                        <span key={i} className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                          <Paperclip size={12} /> {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Priority (Shown only if permitted: Technician, Admin, HOD) */}
                {currentRole !== 'End User' && (
                  <div className="form-field-group">
                    <label className="form-field-label">6. Priority Override (Authorized IT Staff Only)</label>
                    <select
                      className="form-input-control"
                      value={priorityOverride}
                      onChange={(e) => setPriorityOverride(e.target.value as never)}
                    >
                      <option value="P1">P1 - Critical Priority</option>
                      <option value="P2">P2 - High Priority</option>
                      <option value="P3">P3 - Medium Priority</option>
                      <option value="P4">P4 - Low Priority</option>
                    </select>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: PROPOSED ROUTING PREVIEW CARD (Section 5 Recommended UX) */}
              <div
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'sticky',
                  top: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>
                  <UserCheck size={18} /> Automated Routing Preview
                </div>

                {/* Assigned Technicians */}
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Assigned Technicians
                  </span>
                  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {designatedTechnicians.map((tech) => (
                      <div
                        key={tech}
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid #BFDBFE',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <span className="user-avatar-circle avatar-indigo" style={{ width: '26px', height: '26px', fontSize: '11px' }}>
                          {tech.split(' ').map((x) => x[0]).join('')}
                        </span>
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-main)' }}>{tech}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Certified Lead</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SLA Targets */}
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Target Service Level Agreements
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '6px' }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1st Response</span>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
                        ⚡ {activeIssueTypeObj?.slaResponseHours || 1}h
                      </div>
                    </div>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Resolution</span>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--emerald)', marginTop: '2px' }}>
                        ⏱ {activeIssueTypeObj?.slaResolutionHours || 4}h
                      </div>
                    </div>
                  </div>
                </div>

                {/* HOD Approval Governance */}
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Approval Governance
                  </span>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', marginTop: '6px', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>HOD Required:</span>
                      <strong style={{ color: 'var(--amber)' }}>Yes (Enforced)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Approver (from AD):</span>
                      <strong>{userDeptConfig?.hodName || 'Grace Nsubuga'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Approval Limit:</span>
                      <strong>{activeIssueTypeObj?.hodApprovalLimitHours || 2} hours</strong>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Tickets are routed without admin triage unless an SLA or verification exception occurs.
                </div>
              </div>
            </div>

            {/* Modal Footer (Section 5: Actions: Submit, Save as draft) */}
            <div className="modal-dialog-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-secondary"
                disabled={isBlockedByThreshold}
                onClick={(e) => handleSubmit(e, true)}
              >
                <Save size={14} /> Save as Draft
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                  disabled={isBlockedByThreshold || !subject.trim()}
                >
                  <Send size={14} /> Submit Request
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
