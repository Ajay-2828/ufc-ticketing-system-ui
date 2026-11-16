'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  Upload,
  CheckCircle2,
  FileText,
  Save,
  Send,
  X,
  Plus,
} from 'lucide-react'
import { useTicketContext } from '@/context/ticket-context'
import { fmtHours, resolveSla, snapshotOf } from '@/lib/masters'
import {
  Ticket,
  TicketSeverity,
  applicationQuestionnaires,
  departmentsData,
  policySettings,
} from '@/app/ticket-data'

export default function CreateTicketPage() {
  const router = useRouter()
  const {
    currentRole,
    currentUser,
    unclosedResolvedCount,
    classificationTreeData,
    submitNewTicket,
    severities,
    priorities,
    slaPolicies,
    calendars,
    mastersSettings,
    isBlockedByThreshold,
    closureThreshold,
  } = useTicketContext()

  // Active Directory lookup for user's HOD
  const userDeptConfig = departmentsData.find(
    (d) => d.name === (currentUser.dept || 'Finance & Risk')
  )

  // Application-wise access: a department only sees and raises tickets for the
  // applications assigned to it. The Admin team sees everything.
  const [department, setDepartment] = useState(currentUser.dept || 'Finance & Risk')
  const deptApps = useMemo(() => {
    if (currentRole === 'Admin Team') return undefined
    return departmentsData.find((d) => d.name === department)?.assignedApplications
  }, [currentRole, department])
  const availableCategories = useMemo(() => {
    if (!deptApps) return classificationTreeData
    return classificationTreeData
      .map((main) => ({
        ...main,
        subClassifications: main.subClassifications.filter((s) => deptApps.includes(s.name)),
      }))
      .filter((main) => main.subClassifications.length > 0)
  }, [classificationTreeData, deptApps])

  const initialMain =
    availableCategories[0]?.name ||
    classificationTreeData[0]?.name ||
    'Software'
  const [selectedClassification, setSelectedClassification] = useState(initialMain)

  const activeClassificationObj =
    availableCategories.find((c) => c.name === selectedClassification) ||
    availableCategories[0] ||
    classificationTreeData[0]

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

  const designatedTechnicians = activeSubClassObj?.technicians || []

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [ticketType, setTicketType] = useState<'Incident' | 'Service Request' | 'Issue'>('Incident')
  // Empty means: use the starting priority of the severity (Priority master)
  const [priorityOverride, setPriorityOverride] = useState<string>('')
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({})
  const [attachedFiles, setAttachedFiles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Severity, priority and SLA all come from the masters
  const canChangePriority = currentRole !== 'End User' || mastersSettings.endUserCanChangePriority
  const resolved = resolveSla(
    { severities, priorities, slaPolicies, calendars },
    activeIssueTypeObj,
    canChangePriority && priorityOverride ? priorityOverride : undefined
  )
  const autoSeverity = resolved.severityId
  const severityMaster = severities.find((s) => s.id === autoSeverity)
  const finalPriority = resolved.priorityId
  const targetResolutionHours = resolved.resolutionHours
  const targetResponseHours = resolved.responseHours
  const slaSnapshot = snapshotOf(resolved)

  // Get dynamic questionnaire questions
  const questions = applicationQuestionnaires[selectedSubClass] || []

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
    if (!subject.trim() || !activeSubClassObj) return
    // Required questions must be answered before a real submit
    if (!isDraft && questions.some((q) => q.required && !(dynamicAnswers[q.id] || '').trim())) {
      return
    }

    setIsSubmitting(true)
    const isCR = activeIssueTypeObj?.isChangeRequest || false
    const ticket = submitNewTicket({
      subject,
      description,
      type: ticketType,
      classification: selectedClassification,
      subClassification: selectedSubClass,
      issueType: selectedIssueType,
      severity: autoSeverity,
      priority: finalPriority,
      department,
      dynamicFields: dynamicAnswers,
      isCR,
      crRequiresHod: activeIssueTypeObj?.crRequiresHodApproval !== false,
      hodLimitHours: resolved.hodLimitHours,
      slaHours: targetResolutionHours,
      slaSnapshot,
      isDraft,
    })
    router.push(`/tickets/${ticket.id}`)
  }

  return (
    <div>
      {/* Back Link */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/tickets"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--primary)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Tickets</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="page-header-flex" style={{ marginBottom: '22px' }}>
        <div>
          <div className="page-eyebrow">
            <Sparkles size={14} /> New Support Ticket
          </div>
          <h1 className="page-title-main">Create New Service Ticket</h1>
          <p className="page-desc-sub">
            Fill in the details below. Dynamic technician assignment and SLA target response times will automatically calibrate based on your selected issue type.
          </p>
        </div>
      </div>

      {/* Blocked State Banner (Section 5 Threshold Rule) */}
      {isBlockedByThreshold && (
        <div
          className="modern-card"
          style={{
            marginBottom: '24px',
            padding: '16px 20px',
            background: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <AlertCircle size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '14px', color: '#991B1B' }}>
              Ticket Submission Blocked: Unclosed Ticket Threshold Reached
            </strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#B91C1C', lineHeight: 1.5 }}>
              You currently have <strong>{unclosedResolvedCount}</strong> resolved tickets awaiting your verification. Under UFC ITSM policy (threshold of {closureThreshold}), please verify and close your resolved tickets before opening a new request.
            </p>
          </div>
        </div>
      )}

      {/* 2-Column Full-Page Layout */}
      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN: Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. Cascading Classification Card */}
            <div className="modern-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  1
                </span>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Service Classification & Category
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '14px',
                  background: 'var(--surface-subtle)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <label className="form-field-label">Main Classification *</label>
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

                <div>
                  <label className="form-field-label">Sub-Classification / System *</label>
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

                <div>
                  <label className="form-field-label">Issue Type *</label>
                  <select
                    className="form-input-control"
                    disabled={isBlockedByThreshold}
                    value={selectedIssueType}
                    onChange={(e) => setSelectedIssueType(e.target.value)}
                  >
                    {availableIssueTypes.map((i) => (
                      <option key={i.name} value={i.name}>
                        {i.name} {i.isChangeRequest ? '(CR)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ticket type. A Change Request is decided by the issue type. */}
              <div style={{ marginTop: '14px', maxWidth: '320px' }}>
                <label className="form-field-label">Ticket Type *</label>
                {activeIssueTypeObj?.isChangeRequest ? (
                  <div className="form-input-control" style={{ background: '#FAF5FF', color: '#6B21A8', fontWeight: 600 }}>
                    Change Request (set by the issue type)
                  </div>
                ) : (
                  <select
                    className="form-input-control"
                    disabled={isBlockedByThreshold}
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value as 'Incident' | 'Service Request' | 'Issue')}
                  >
                    <option value="Incident">Incident</option>
                    <option value="Service Request">Service Request</option>
                    <option value="Issue">Issue</option>
                  </select>
                )}
              </div>

              {/* Read-Only Auto-Severity Badge (Section 5) */}
              <div
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Auto-Calculated Severity:
                  </span>
                  <span
                    className="badge-tag"
                    style={{ background: `${severityMaster?.color || '#64748B'}22`, color: severityMaster?.color || '#475569', fontWeight: 700 }}
                  >
                    {severityMaster?.name || autoSeverity}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    starts as {priorities.find((p) => p.id === finalPriority)?.name || finalPriority}
                  </span>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  (Set by the issue type in the Severity master. Read-only for users.)
                </span>
              </div>
            </div>

            {/* 2. Ticket Details Card */}
            <div className="modern-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  2
                </span>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Subject & Description
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-field-label">Subject / Incident Summary *</label>
                  <input
                    type="text"
                    required
                    disabled={isBlockedByThreshold}
                    className="form-input-control"
                    placeholder="e.g. Unable to process end-of-day reconciliation batch on Flexcube"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-field-label">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    disabled={isBlockedByThreshold}
                    className="form-input-control"
                    placeholder="Provide specific details of the problem, error messages received, steps to reproduce, or transaction references..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 3. Dynamic Application Questionnaire (Section 5) */}
            {questions.length > 0 && (
              <div className="modern-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--primary-soft)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Application Questionnaire: {selectedSubClass}
                  </h3>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  These diagnostic fields are required by technical specialists to expedite troubleshooting without repeated clarification rounds.
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '14px',
                  }}
                >
                  {questions.map((q) => (
                    <div key={q.id}>
                      <label className="form-field-label">
                        {q.label} {q.required && <span style={{ color: '#EF4444' }}>*</span>}
                      </label>
                      {q.type === 'dropdown' ? (
                        <select
                          className="form-input-control"
                          disabled={isBlockedByThreshold}
                          required={q.required}
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
                          disabled={isBlockedByThreshold}
                          required={q.required}
                          placeholder={q.placeholder || `Enter ${q.label.toLowerCase()}...`}
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

            {/* 4. Attachments & Priority Card */}
            <div className="modern-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  4
                </span>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Attachments & Governance
                </h3>
              </div>

              {/* Upload Zone */}
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  background: 'var(--surface-subtle)',
                  marginBottom: '16px',
                }}
              >
                <Upload size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Attach screenshots, diagnostic logs, or supporting documents
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  PNG, JPG, PDF up to 10MB per file
                </div>
                <input
                  type="file"
                  id="ticket-file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  disabled={isBlockedByThreshold}
                />
                <label
                  htmlFor="ticket-file-upload"
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    marginTop: '12px',
                    cursor: isBlockedByThreshold ? 'not-allowed' : 'pointer',
                  }}
                >
                  Choose Files
                </label>
              </div>

              {attachedFiles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {attachedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#EEF4FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        color: 'var(--primary)',
                      }}
                    >
                      <FileText size={14} />
                      <span>{f}</span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() =>
                          setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))
                        }
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Priority: starts from the severity, can be changed where the master allows */}
              {canChangePriority && (
                <div
                  style={{
                    padding: '14px',
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                  }}
                >
                  <label className="form-field-label" style={{ color: '#92400E' }}>
                    Priority (from the Priority master)
                  </label>
                  <select
                    className="form-input-control"
                    value={priorityOverride}
                    onChange={(e) => setPriorityOverride(e.target.value)}
                  >
                    <option value="">
                      Starting priority of the severity ({priorities.find((p) => p.id === severityMaster?.defaultPriorityId)?.name || 'none'})
                    </option>
                    {[...priorities]
                      .filter((p) => p.active)
                      .sort((a, b) => a.rank - b.rank)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                  <span style={{ fontSize: '11px', color: '#B45309', marginTop: '4px', display: 'block' }}>
                    The priority can change the response and resolution times if the SLA policy has times for it.
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Action Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: '12px',
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => router.push('/tickets')}
              >
                Cancel
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={isBlockedByThreshold || isSubmitting}
                  onClick={(e) => handleSubmit(e, true)}
                >
                  <Save size={15} /> Save as Draft
                </button>

                <button
                  type="submit"
                  className="btn-gold"
                  disabled={isBlockedByThreshold || isSubmitting}
                >
                  <Send size={15} /> Submit Ticket
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Routing Preview Card (Section 5) */}
          <div
            style={{
              position: 'sticky',
              top: '90px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              className="modern-card"
              style={{
                padding: '20px',
                border: '1.5px solid var(--primary-soft)',
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Automated Routing Preview
                </h4>
              </div>

              <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Review the automated routing and turnaround SLAs calculated for this ticket:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'var(--surface-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    TECHNICIANS OF THIS SUB-CLASS (ASSIGNED ON APPROVAL, ROUND ROBIN)
                  </span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {designatedTechnicians.length ? designatedTechnicians.join(' & ') : 'None set: the Admin team assigns it'}
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 12px',
                    background: 'var(--surface-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    SLA TARGETS
                  </span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    Response: {fmtHours(targetResponseHours)} &bull; Resolution: {fmtHours(targetResolutionHours)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {resolved.policy?.name || 'No SLA policy'} &bull; {resolved.calendar.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    Due if raised now: {new Date(slaSnapshot.resolutionDue).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 12px',
                    background: 'var(--surface-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    APPROVAL GOVERNANCE
                  </span>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {activeIssueTypeObj?.isChangeRequest
                      ? 'Admin approval first, then HOD if switched on, then Management'
                      : currentRole === 'HOD'
                      ? 'Raised by the HOD, no separate approval'
                      : `${userDeptConfig?.hodName || 'Department Head'} (HOD) • ${fmtHours(resolved.hodLimitHours)} limit`}
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 12px',
                    background: activeIssueTypeObj?.isChangeRequest ? '#FAF5FF' : '#F0FDF4',
                    borderRadius: '8px',
                    border: `1px solid ${
                      activeIssueTypeObj?.isChangeRequest ? '#E9D5FF' : '#BBF7D0'
                    }`,
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: activeIssueTypeObj?.isChangeRequest ? '#7C3AED' : '#15803D',
                      fontWeight: 600,
                    }}
                  >
                    WORKFLOW TEMPLATE
                  </span>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: activeIssueTypeObj?.isChangeRequest ? '#6B21A8' : '#166534',
                      marginTop: '2px',
                    }}
                  >
                    {activeIssueTypeObj?.isChangeRequest
                      ? 'Change Request Pipeline (Admin Review 1st)'
                      : 'Standard Ticket Workflow'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

