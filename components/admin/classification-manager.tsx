'use client'

import React, { useState, useMemo } from 'react'
import {
  FolderKanban,
  Laptop,
  HardDrive,
  Plus,
  Users,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Edit2,
  Trash2,
  X,
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Upload,
  Table,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  SlidersHorizontal,
  Database,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  FileCode,
  FileText,
  AlertTriangle,
  AlertCircle,
  Eye,
  Building2,
  CheckSquare,
  Square,
  Flame,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  Lock,
} from 'lucide-react'
import {
  ClassificationConfig,
  SubClassificationConfig,
  IssueTypeConfig,
  TicketSeverity,
  classificationTree as initialClassificationTree,
  departmentsData as initialDepartmentsData,
  ticketTypesList as initialTicketTypesList,
  ticketStatusesList as initialTicketStatusesList,
  DepartmentConfig,
  COMMON_MASTER_ISSUES,
  COMMON_HARDWARE_ISSUES,
  applicationQuestionnaires,
  DynamicQuestion,
} from '@/app/ticket-data'

interface ClassificationManagerProps {
  classificationTree: ClassificationConfig[]
  onUpdateClassificationTree: (tree: ClassificationConfig[]) => void
}

type AdminClassificationTab = 'tree' | 'access' | 'types' | 'severity' | 'statuses'

const availableITStaff = [
  { name: 'Daniel Mensah', title: 'Senior Support Engineer (L2)', dept: 'Infrastructure' },
  { name: 'Maya Patel', title: 'Core Banking Technical Consultant', dept: 'Core Banking' },
  { name: 'Ibrahim Sani', title: 'Infrastructure & EUC Specialist', dept: 'End User Computing' },
  { name: 'TechServe Ltd', title: 'Certified Vendor Consultant', dept: 'External Partner' },
  { name: 'SecureNet Ops', title: 'Network Security Engineer', dept: 'External Partner' },
  { name: 'Fatima Al-Zadjali', title: 'QA & Testing Lead', dept: 'Quality Assurance' },
]

// Preset Package 1: Banking IT & Core Infrastructure
const BANKING_CORE_PRESET: ClassificationConfig[] = initialClassificationTree

// Preset Package 2: Digital Retail Banking & FinTech Platform
const DIGITAL_FINTECH_PRESET: ClassificationConfig[] = [
  {
    name: 'Digital Channels & Omnichannel',
    iconName: 'LayoutDashboard',
    subClassifications: [
      {
        name: 'Retail Mobile App (iOS & Android)',
        technicians: ['Maya Patel', 'Ibrahim Sani'],
        issueTypes: [
          { name: 'Biometric face login handshake failure', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Push notification OTP delivery delay', autoSeverity: 'Critical', slaResponseHours: 0.25, slaResolutionHours: 1, hodApprovalLimitHours: 0.5 },
          { name: 'Bill payment debit without confirmation', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Card activation biometric scan rejection', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'Mobile release update v4.2 rollback (CR)', autoSeverity: 'High', slaResponseHours: 2, slaResolutionHours: 24, hodApprovalLimitHours: 12, isChangeRequest: true },
        ],
      },
      {
        name: 'Corporate Internet Banking (CIB)',
        technicians: ['Maya Patel', 'TechServe Ltd'],
        issueTypes: [
          { name: 'Dual-authorizer digital signature timeout', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Bulk payroll salary batch upload parse error', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 1.5, hodApprovalLimitHours: 1 },
          { name: 'Foreign exchange live rate feed freeze', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 3, hodApprovalLimitHours: 1.5 },
          { name: 'Corporate user RBAC role assignment', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
        ],
      },
    ],
  },
  {
    name: 'Payment Hub & Settlement Rails',
    iconName: 'ShieldCheck',
    subClassifications: [
      {
        name: 'Instant Payment Switch (IPS / CBO)',
        technicians: ['Daniel Mensah', 'TechServe Ltd'],
        issueTypes: [
          { name: 'IPS gateway timeout on Central Bank rail', autoSeverity: 'Critical', slaResponseHours: 0.25, slaResolutionHours: 1, hodApprovalLimitHours: 0.5 },
          { name: 'Peer-to-peer mobile proxy resolution failure', autoSeverity: 'High', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Daily clearing batch reconciliation discrepancy', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
        ],
      },
      {
        name: 'Card Management & Payment Gateway',
        technicians: ['Maya Patel', 'SecureNet Ops'],
        issueTypes: [
          { name: '3D Secure 2.0 OTP verification gateway drop', autoSeverity: 'Critical', slaResponseHours: 0.25, slaResolutionHours: 1, hodApprovalLimitHours: 0.5 },
          { name: 'Visa / Mastercard chargeback interface timeout', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'Merchant POS key injection certificate renewal (CR)', autoSeverity: 'High', slaResponseHours: 4, slaResolutionHours: 24, hodApprovalLimitHours: 12, isChangeRequest: true },
        ],
      },
    ],
  },
  {
    name: 'Financial Crime & Compliance Tech',
    iconName: 'Server',
    subClassifications: [
      {
        name: 'AML & Sanctions Screening Engine',
        technicians: ['Daniel Mensah', 'Maya Patel'],
        issueTypes: [
          { name: 'Real-time wire transfer false positive block', autoSeverity: 'High', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'OFAC / UN list daily delta sync failure', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'High-risk PEP customer alert generation stall', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
        ],
      },
      {
        name: 'Transaction Fraud Scoring',
        technicians: ['Ibrahim Sani', 'SecureNet Ops'],
        issueTypes: [
          { name: 'Fraud scoring API latency spike (>800ms)', autoSeverity: 'Critical', slaResponseHours: 0.25, slaResolutionHours: 1, hodApprovalLimitHours: 0.5 },
          { name: 'Card transaction behavioral rule tuning (CR)', autoSeverity: 'Medium', slaResponseHours: 4, slaResolutionHours: 16, hodApprovalLimitHours: 8, isChangeRequest: true },
        ],
      },
    ],
  },
]

// Preset Package 3: Corporate Enterprise IT Services
const ENTERPRISE_IT_PRESET: ClassificationConfig[] = [
  {
    name: 'Workplace & Productivity',
    iconName: 'LayoutDashboard',
    subClassifications: [
      {
        name: 'Microsoft 365 & Exchange Online',
        technicians: ['Ibrahim Sani', 'Daniel Mensah'],
        issueTypes: [
          { name: 'Executive email mailbox delivery bounce', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Shared mailbox delegation permission error', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'Teams audio conferencing gateway degradation', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 3, hodApprovalLimitHours: 1.5 },
          { name: 'Exchange retention policy compliance update (CR)', autoSeverity: 'Low', slaResponseHours: 4, slaResolutionHours: 48, hodApprovalLimitHours: 24, isChangeRequest: true },
        ],
      },
      {
        name: 'Enterprise ERP & HRMS',
        technicians: ['Maya Patel', 'TechServe Ltd'],
        issueTypes: [
          { name: 'Payroll run batch calculation exception', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Employee leave balance synchronization mismatch', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'ERP monthly financial book closing lock error', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
        ],
      },
    ],
  },
  {
    name: 'Cyber Security Operations',
    iconName: 'ShieldCheck',
    subClassifications: [
      {
        name: 'Endpoint Detection & Response (EDR)',
        technicians: ['Daniel Mensah', 'SecureNet Ops'],
        issueTypes: [
          { name: 'Ransomware / Malicious script alert quarantine', autoSeverity: 'Critical', slaResponseHours: 0.25, slaResolutionHours: 1, hodApprovalLimitHours: 0.5 },
          { name: 'EDR sensor disconnected on critical server', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 3, hodApprovalLimitHours: 1.5 },
          { name: 'USB storage device unauthorized mount', autoSeverity: 'High', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
        ],
      },
      {
        name: 'Zero Trust Network Access (ZTNA)',
        technicians: ['Ibrahim Sani', 'SecureNet Ops'],
        issueTypes: [
          { name: 'ZTNA gateway certificate expiry alert', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Branch office secure web proxy bypass attempt', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
        ],
      },
    ],
  },
]



export function ClassificationManager({
  classificationTree,
  onUpdateClassificationTree,
}: ClassificationManagerProps) {
  // Page 1: 5 Sub-Tabs per Section 15
  const [activeTab, setActiveTab] = useState<AdminClassificationTab>('tree')

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // TAB 1: Tree State & Sub-views - Defaults to 3-Tier Hierarchy Tree
  const [viewMode, setViewMode] = useState<'hierarchy' | 'matrix'>('hierarchy')
  const [matrixSearch, setMatrixSearch] = useState('')
  const [matrixCategoryFilter, setMatrixCategoryFilter] = useState('All')
  const [matrixSeverityFilter, setMatrixSeverityFilter] = useState('All')
  const [matrixWorkflowFilter, setMatrixWorkflowFilter] = useState('All')

  const [selectedMain, setSelectedMain] = useState(
    classificationTree[0]?.name || 'Software'
  )
  const [selectedSub, setSelectedSub] = useState(
    classificationTree[0]?.subClassifications[0]?.name || 'Pro People'
  )

  // Intake Questionnaire State (Industry standard: Embedded directly in catalog item)
  const [questionnaires, setQuestionnaires] = useState<Record<string, DynamicQuestion[]>>(applicationQuestionnaires)
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false)
  const [newQuestionLabel, setNewQuestionLabel] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<'text' | 'number' | 'dropdown' | 'attachment'>('text')
  const [newQuestionOptions, setNewQuestionOptions] = useState('')
  const [newQuestionPlaceholder, setNewQuestionPlaceholder] = useState('')
  const [newQuestionRequired, setNewQuestionRequired] = useState(true)

  // Pick from Common Issues modal state
  const [showPickCommonIssuesModal, setShowPickCommonIssuesModal] = useState(false)
  const [selectedCommonIssueNames, setSelectedCommonIssueNames] = useState<string[]>([])

  // Modals state
  const [showAddMainModal, setShowAddMainModal] = useState(false)
  const [showAddSubModal, setShowAddSubModal] = useState(false)
  const [showAddIssueModal, setShowAddIssueModal] = useState(false)
  const [showDataDumpModal, setShowDataDumpModal] = useState(false)
  const [dataDumpTab, setDataDumpTab] = useState<'presets' | 'json' | 'csv'>('presets')
  const [jsonInputText, setJsonInputText] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [copiedJson, setCopiedJson] = useState(false)

  // Routing Preview Modal State (Section 5 & 15)
  const [showRoutingPreviewModal, setShowRoutingPreviewModal] = useState(false)
  const [routingPreviewTarget, setRoutingPreviewTarget] = useState<{
    main: string
    sub: string
    issueName: string
    severity: string
    responseHours: number
    resolutionHours: number
    hodLimitHours: number
    isCR: boolean
    technicians: string[]
  } | null>(null)

  // Edit Issue Type modal state
  const [editingIssue, setEditingIssue] = useState<{
    mainName: string
    subName: string
    issue: IssueTypeConfig
  } | null>(null)

  // Form states for adding main category
  const [newMainName, setNewMainName] = useState('')

  // Form states for adding sub category
  const [newSubName, setNewSubName] = useState('')
  const [newSubTech1, setNewSubTech1] = useState(availableITStaff[0].name)
  const [newSubTech2, setNewSubTech2] = useState('None')

  // Form states for adding issue type
  const [newIssueMainTarget, setNewIssueMainTarget] = useState(classificationTree[0]?.name || '')
  const [newIssueSubTarget, setNewIssueSubTarget] = useState(
    classificationTree[0]?.subClassifications[0]?.name || ''
  )
  const [newIssueName, setNewIssueName] = useState('')
  const [newIssueSeverity, setNewIssueSeverity] = useState<TicketSeverity>('Medium')
  const [newIssueResponseHours, setNewIssueResponseHours] = useState(1)
  const [newIssueResolutionHours, setNewIssueResolutionHours] = useState(4)
  const [newIssueHodLimitHours, setNewIssueHodLimitHours] = useState(2)
  const [newIssueIsCR, setNewIssueIsCR] = useState(false)
  const [newIssueRequiresHodApproval, setNewIssueRequiresHodApproval] = useState(true)

  // TAB 2: Applications & Access State
  const [departments, setDepartments] = useState<DepartmentConfig[]>(initialDepartmentsData)
  const [deptSearch, setDeptSearch] = useState('')
  const [deptCategoryFilter, setDeptCategoryFilter] = useState<'All' | 'Software' | 'Hardware'>('All')

  // Dynamically extract all sub-classifications directly from the active classificationTree
  const allSubClassifications = useMemo(() => {
    const list: { mainName: string; subName: string; issueCount: number }[] = []
    classificationTree.forEach((main) => {
      main.subClassifications.forEach((sub) => {
        list.push({ mainName: main.name, subName: sub.name, issueCount: sub.issueTypes.length })
      })
    })
    return list
  }, [classificationTree])

  const visibleEntitlementSystems = useMemo(() => {
    if (deptCategoryFilter === 'All') return allSubClassifications
    return allSubClassifications.filter((s) => s.mainName.toLowerCase().includes(deptCategoryFilter.toLowerCase()))
  }, [allSubClassifications, deptCategoryFilter])

  // TAB 3: Ticket Types State
  const [ticketTypes, setTicketTypes] = useState(initialTicketTypesList)
  const [showAddTypeModal, setShowAddTypeModal] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')
  const [newTypeCode, setNewTypeCode] = useState('')
  const [newTypeWorkflow, setNewTypeWorkflow] = useState('Standard Ticket Workflow (Published)')
  const [newTypePriority, setNewTypePriority] = useState('Normal')
  const [newTypeDesc, setNewTypeDesc] = useState('')

  // TAB 4: Severity & Priority State
  const [severitySettings, setSeveritySettings] = useState([
    {
      level: 'Critical (P1)',
      severity: 'Critical',
      color: '#DC2626',
      bg: '#FEF2F2',
      defaultResponseHours: 0.5,
      defaultResolutionHours: 2,
      definition: 'Complete outage of mission-critical banking service, core ledger, or central payment rails impacting multiple customers or branch networks.',
      scope: 'Enterprise-wide disruption, immediate financial/regulatory exposure',
    },
    {
      level: 'High (P2)',
      severity: 'High',
      color: '#EA580C',
      bg: '#FFF7ED',
      defaultResponseHours: 1,
      defaultResolutionHours: 4,
      definition: 'Major degradation of business process or application without viable workaround; transaction latency spikes or critical customer-facing feature offline.',
      scope: 'Key business function impaired, high volume of affected users',
    },
    {
      level: 'Medium (P3)',
      severity: 'Medium',
      color: '#D97706',
      bg: '#FEF3C7',
      defaultResponseHours: 2,
      defaultResolutionHours: 8,
      definition: 'Standard operational issue or partial service impairment where an operational workaround exists; single branch or department affected.',
      scope: 'Non-critical workflow disruption, workaround available',
    },
    {
      level: 'Low (P4)',
      severity: 'Low',
      color: '#64748B',
      bg: '#F8FAFC',
      defaultResponseHours: 4,
      defaultResolutionHours: 24,
      definition: 'Routine inquiry, minor cosmetic UI defect, user assistance, standard documentation request, or scheduled non-urgent maintenance.',
      scope: 'Cosmetic or informational, no direct operational downtime',
    },
  ])

  // TAB 5: Statuses State (9 statuses per Section 15.5)
  const [ticketStatuses, setTicketStatuses] = useState(initialTicketStatusesList)
  const [statusCategoryFilter, setStatusCategoryFilter] = useState<'All' | 'Open' | 'In Progress' | 'Waiting' | 'Closed'>('All')

  const activeMain =
    classificationTree.find((c) => c.name === selectedMain) ||
    classificationTree[0]

  const activeSub =
    activeMain?.subClassifications.find((s) => s.name === selectedSub) ||
    activeMain?.subClassifications[0]

  // Detect incomplete configurations across the taxonomy (e.g. sub with 0 technicians)
  const incompleteSubClassifications = useMemo(() => {
    const list: Array<{ main: string; sub: string; reason: string }> = []
    classificationTree.forEach((main) => {
      main.subClassifications.forEach((sub) => {
        if (!sub.technicians || sub.technicians.length === 0) {
          list.push({ main: main.name, sub: sub.name, reason: '0 technicians designated (auto-routing broken)' })
        }
        if (sub.issueTypes.length === 0) {
          list.push({ main: main.name, sub: sub.name, reason: 'No issue types configured' })
        }
      })
    })
    return list
  }, [classificationTree])

  // Flattened Data Grid items for the Enterprise Matrix View
  const allMatrixRows = useMemo(() => {
    const rows: Array<{
      category: string
      sub: string
      technicians: string[]
      issue: IssueTypeConfig
    }> = []

    classificationTree.forEach((main) => {
      main.subClassifications.forEach((sub) => {
        sub.issueTypes.forEach((it) => {
          rows.push({
            category: main.name,
            sub: sub.name,
            technicians: sub.technicians,
            issue: it,
          })
        })
      })
    })

    return rows
  }, [classificationTree])

  const filteredMatrixRows = useMemo(() => {
    return allMatrixRows.filter((r) => {
      const q = matrixSearch.toLowerCase().trim()
      const matchesSearch =
        !q ||
        r.category.toLowerCase().includes(q) ||
        r.sub.toLowerCase().includes(q) ||
        r.issue.name.toLowerCase().includes(q) ||
        r.technicians.some((t) => t.toLowerCase().includes(q))

      const matchesCategory =
        matrixCategoryFilter === 'All' || r.category === matrixCategoryFilter

      const matchesSeverity =
        matrixSeverityFilter === 'All' || r.issue.autoSeverity === matrixSeverityFilter

      const matchesWorkflow =
        matrixWorkflowFilter === 'All' ||
        (matrixWorkflowFilter === 'Change Request' ? r.issue.isChangeRequest : !r.issue.isChangeRequest)

      return matchesSearch && matchesCategory && matchesSeverity && matchesWorkflow
    })
  }, [allMatrixRows, matrixSearch, matrixCategoryFilter, matrixSeverityFilter, matrixWorkflowFilter])

  // 1. Add Main Classification
  const handleCreateMainClassification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMainName.trim()) return

    const newMain: ClassificationConfig = {
      name: newMainName.trim(),
      iconName: 'FolderKanban',
      subClassifications: [
        {
          name: 'General Service Tier',
          technicians: [availableITStaff[0].name],
          issueTypes: [
            {
              name: 'General Service Inquiry',
              autoSeverity: 'Medium',
              slaResponseHours: 2,
              slaResolutionHours: 8,
              hodApprovalLimitHours: 4,
            },
          ],
        },
      ],
    }

    const updated = [...classificationTree, newMain]
    onUpdateClassificationTree(updated)
    setSelectedMain(newMain.name)
    setSelectedSub('General Service Tier')
    setNewMainName('')
    setShowAddMainModal(false)
    setHasUnsavedChanges(true)
    triggerToast(`Main classification "${newMain.name}" created!`)
  }

  // 2. Add Sub-Classification
  const handleCreateSubClassification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubName.trim()) return

    const selectedTechs = [newSubTech1]
    if (newSubTech2 && newSubTech2 !== 'None' && newSubTech2 !== newSubTech1) {
      selectedTechs.push(newSubTech2)
    }

    const newSub: SubClassificationConfig = {
      name: newSubName.trim(),
      technicians: selectedTechs,
      issueTypes: [
        {
          name: `${newSubName.trim()} System Outage`,
          autoSeverity: 'Critical',
          slaResponseHours: 0.5,
          slaResolutionHours: 2,
          hodApprovalLimitHours: 1,
        },
        {
          name: `${newSubName.trim()} Routine Request`,
          autoSeverity: 'Medium',
          slaResponseHours: 2,
          slaResolutionHours: 8,
          hodApprovalLimitHours: 4,
        },
      ],
    }

    const updated = classificationTree.map((main) => {
      if (main.name !== selectedMain) return main
      return {
        ...main,
        subClassifications: [...main.subClassifications, newSub],
      }
    })

    onUpdateClassificationTree(updated)
    setSelectedSub(newSub.name)
    setNewSubName('')
    setShowAddSubModal(false)
    setHasUnsavedChanges(true)
    triggerToast(
      `Sub-service "${newSub.name}" created with designated technicians: ${selectedTechs.join(', ')}!`
    )
  }

  // 3. Add Issue Type
  const handleCreateIssueType = (e: React.FormEvent) => {
    e.preventDefault()
    const targetMainName = viewMode === 'matrix' ? newIssueMainTarget : selectedMain
    const targetSubName = viewMode === 'matrix' ? newIssueSubTarget : selectedSub

    if (!newIssueName.trim() || !targetMainName || !targetSubName) return

    const newIssue: IssueTypeConfig = {
      name: newIssueName.trim(),
      autoSeverity: newIssueSeverity,
      slaResponseHours: Number(newIssueResponseHours) || 1,
      slaResolutionHours: Number(newIssueResolutionHours) || 4,
      hodApprovalLimitHours: Number(newIssueHodLimitHours) || 2,
      isChangeRequest: newIssueIsCR,
      crRequiresHodApproval: newIssueIsCR ? newIssueRequiresHodApproval : undefined,
    }

    const updated = classificationTree.map((main) => {
      if (main.name !== targetMainName) return main
      return {
        ...main,
        subClassifications: main.subClassifications.map((sub) => {
          if (sub.name !== targetSubName) return sub
          return {
            ...sub,
            issueTypes: [...sub.issueTypes, newIssue],
          }
        }),
      }
    })

    onUpdateClassificationTree(updated)
    setNewIssueName('')
    setShowAddIssueModal(false)
    setHasUnsavedChanges(true)
    triggerToast(`Added "${newIssue.name}" under ${targetSubName}`)
  }

  // 3b. Intake Questionnaire Handlers (Embedded in Service Catalog)
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestionLabel.trim() || !selectedSub) return

    const newQ: DynamicQuestion = {
      id: `q-${Date.now()}`,
      label: newQuestionLabel.trim(),
      type: newQuestionType,
      placeholder: newQuestionPlaceholder.trim() || undefined,
      options:
        newQuestionType === 'dropdown'
          ? newQuestionOptions
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
      required: newQuestionRequired,
    }

    const updatedList = [...(questionnaires[selectedSub] || []), newQ]
    setQuestionnaires((prev) => ({
      ...prev,
      [selectedSub]: updatedList,
    }))
    applicationQuestionnaires[selectedSub] = updatedList

    setNewQuestionLabel('')
    setNewQuestionOptions('')
    setNewQuestionPlaceholder('')
    setNewQuestionRequired(true)
    setShowAddQuestionModal(false)
    setHasUnsavedChanges(true)
    triggerToast(`Added intake question to ${selectedSub}`)
  }

  const handleDeleteQuestion = (qId: string) => {
    if (!selectedSub) return
    const updatedList = (questionnaires[selectedSub] || []).filter((q) => q.id !== qId)
    setQuestionnaires((prev) => ({
      ...prev,
      [selectedSub]: updatedList,
    }))
    applicationQuestionnaires[selectedSub] = updatedList
    setHasUnsavedChanges(true)
    triggerToast('Intake question removed.')
  }

  // 3c. Add Common Issues from Master Pool to Active Sub (Software or Hardware)
  const handleAddCommonIssuesToActiveSub = (issueNames: string[]) => {
    if (!activeSub || issueNames.length === 0) return

    const pool = selectedMain === 'Hardware' ? COMMON_HARDWARE_ISSUES : COMMON_MASTER_ISSUES

    const issuesToAdd: IssueTypeConfig[] = issueNames
      .filter((name) => !activeSub.issueTypes.some((it) => it.name === name))
      .map((name) => {
        const master =
          pool.find((m) => m.name === name) ||
          COMMON_MASTER_ISSUES.find((m) => m.name === name) ||
          COMMON_HARDWARE_ISSUES.find((m) => m.name === name)
        return {
          name: name,
          autoSeverity: master?.autoSeverity || 'Medium',
          slaResponseHours: master?.slaResponseHours || 1,
          slaResolutionHours: master?.slaResolutionHours || 4,
          hodApprovalLimitHours: master?.hodApprovalLimitHours || 2,
        }
      })

    if (issuesToAdd.length === 0) {
      triggerToast('All selected issues are already added to this software.')
      setShowPickCommonIssuesModal(false)
      return
    }

    const updated = classificationTree.map((main) => {
      if (main.name !== selectedMain) return main
      return {
        ...main,
        subClassifications: main.subClassifications.map((sub) => {
          if (sub.name !== selectedSub) return sub
          return {
            ...sub,
            issueTypes: [...sub.issueTypes, ...issuesToAdd],
          }
        }),
      }
    })

    onUpdateClassificationTree(updated)
    setShowPickCommonIssuesModal(false)
    setHasUnsavedChanges(true)
    triggerToast(`Added ${issuesToAdd.length} common issue(s) to ${selectedSub}`)
  }

  // 4. Update Technicians (1 or 2 Rule)
  const handleAddTechnicianToActiveSub = (techName: string) => {
    if (!activeSub || activeSub.technicians.includes(techName)) return
    if (activeSub.technicians.length >= 2) {
      alert('ITSM Rule: A maximum of two technicians can be designated per sub-classification.')
      return
    }

    const updated = classificationTree.map((main) => {
      if (main.name !== selectedMain) return main
      return {
        ...main,
        subClassifications: main.subClassifications.map((sub) => {
          if (sub.name !== selectedSub) return sub
          return {
            ...sub,
            technicians: [...sub.technicians, techName],
          }
        }),
      }
    })

    onUpdateClassificationTree(updated)
    setHasUnsavedChanges(true)
    triggerToast(`Assigned ${techName} to ${selectedSub}`)
  }

  const handleRemoveTechnicianFromActiveSub = (techName: string) => {
    if (!activeSub) return
    if (activeSub.technicians.length <= 1) {
      alert('At least one designated technician is required for automated ticket routing.')
      return
    }

    const updated = classificationTree.map((main) => {
      if (main.name !== selectedMain) return main
      return {
        ...main,
        subClassifications: main.subClassifications.map((sub) => {
          if (sub.name !== selectedSub) return sub
          return {
            ...sub,
            technicians: sub.technicians.filter((t) => t !== techName),
          }
        }),
      }
    })

    onUpdateClassificationTree(updated)
    setHasUnsavedChanges(true)
    triggerToast(`Removed ${techName}`)
  }

  const handleDeleteIssueType = (categoryName: string, subName: string, issueName: string) => {
    if (!confirm(`Delete "${issueName}" from the catalog?`)) return
    const updated = classificationTree.map((main) => {
      if (main.name !== categoryName) return main
      return {
        ...main,
        subClassifications: main.subClassifications.map((sub) => {
          if (sub.name !== subName) return sub
          return {
            ...sub,
            issueTypes: sub.issueTypes.filter((it) => it.name !== issueName),
          }
        }),
      }
    })
    onUpdateClassificationTree(updated)
    setHasUnsavedChanges(true)
    triggerToast(`Deleted "${issueName}"`)
  }

  // Save Edited Issue
  const handleSaveEditedIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingIssue) return

    const updated = classificationTree.map((main) => {
      if (main.name !== editingIssue.mainName) return main
      return {
        ...main,
        subClassifications: main.subClassifications.map((sub) => {
          if (sub.name !== editingIssue.subName) return sub
          return {
            ...sub,
            issueTypes: sub.issueTypes.map((it) => {
              if (it.name !== editingIssue.issue.name) return it
              return editingIssue.issue
            }),
          }
        }),
      }
    })

    onUpdateClassificationTree(updated)
    setEditingIssue(null)
    setHasUnsavedChanges(true)
    triggerToast(`Updated SLA rules for "${editingIssue.issue.name}"`)
  }

  // Export JSON Data Dump
  const handleExportDataDump = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(classificationTree, null, 2)
    )}`
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonString)
    downloadAnchor.setAttribute('download', 'ufc_itsm_catalog_data_dump.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    triggerToast('ITIL Service Catalog Schema exported (JSON)!')
  }

  // Export CSV Matrix for Excel
  const handleExportCSV = () => {
    const headers = [
      'Category',
      'Sub-Classification',
      'Catalog Issue Type',
      'Designated Technicians',
      'Auto Severity',
      'Response SLA (Hours)',
      'Resolution SLA (Hours)',
      'HOD Limit (Hours)',
      'Workflow Path',
    ]

    const rows = allMatrixRows.map((r) => [
      `"${r.category.replace(/"/g, '""')}"`,
      `"${r.sub.replace(/"/g, '""')}"`,
      `"${r.issue.name.replace(/"/g, '""')}"`,
      `"${r.technicians.join(' & ').replace(/"/g, '""')}"`,
      `"${r.issue.autoSeverity}"`,
      r.issue.slaResponseHours,
      r.issue.slaResolutionHours,
      r.issue.hodApprovalLimitHours,
      `"${r.issue.isChangeRequest ? (r.issue.crRequiresHodApproval !== false ? 'Change Request (Admin ➔ HOD)' : 'Change Request (Admin Only)') : 'Standard'}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', encodedUri)
    downloadAnchor.setAttribute('download', 'ufc_itsm_routing_matrix.csv')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    triggerToast('Exported complete catalog matrix as CSV for Excel!')
  }

  // Load Preset Package
  const handleLoadPreset = (preset: ClassificationConfig[], presetName: string) => {
    if (
      !confirm(
        `Load "${presetName}"? This will populate the service catalog with standard industry rules.`
      )
    )
      return
    onUpdateClassificationTree(preset)
    setSelectedMain(preset[0]?.name || '')
    setSelectedSub(preset[0]?.subClassifications[0]?.name || '')
    setShowDataDumpModal(false)
    setHasUnsavedChanges(true)
    triggerToast(
      `Loaded "${presetName}" with ${preset.reduce((acc, m) => acc + m.subClassifications.reduce((a, s) => a + s.issueTypes.length, 0), 0)} catalog items!`
    )
  }

  // Apply Pasted JSON Dump
  const handleApplyJsonDump = () => {
    try {
      const parsed = JSON.parse(jsonInputText)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('JSON dump must be a non-empty array of classification categories.')
      }
      onUpdateClassificationTree(parsed)
      setSelectedMain(parsed[0]?.name || '')
      setSelectedSub(parsed[0]?.subClassifications[0]?.name || '')
      setShowDataDumpModal(false)
      setJsonError(null)
      setHasUnsavedChanges(true)
      triggerToast('Custom JSON data dump imported successfully!')
    } catch (err: unknown) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON format')
    }
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(classificationTree, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
    triggerToast('Copied JSON schema to clipboard!')
  }

  // TAB 2: Applications & Access Handlers
  const handleToggleDepartmentApp = (deptName: string, systemName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.name !== deptName) return dept
        const hasSystem = dept.assignedApplications.includes(systemName)
        return {
          ...dept,
          assignedApplications: hasSystem
            ? dept.assignedApplications.filter((a) => a !== systemName)
            : [...dept.assignedApplications, systemName],
        }
      })
    )
    setHasUnsavedChanges(true)
  }

  const handleRowSelectAll = (deptName: string) => {
    const visibleNames = visibleEntitlementSystems.map((s) => s.subName)
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.name !== deptName) return dept
        return {
          ...dept,
          assignedApplications: Array.from(new Set([...dept.assignedApplications, ...visibleNames])),
        }
      })
    )
    setHasUnsavedChanges(true)
    triggerToast(`Granted visible systems to ${deptName}`)
  }

  const handleRowDeselectAll = (deptName: string) => {
    const visibleNames = visibleEntitlementSystems.map((s) => s.subName)
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.name !== deptName) return dept
        return {
          ...dept,
          assignedApplications: dept.assignedApplications.filter((a) => !visibleNames.includes(a)),
        }
      })
    )
    setHasUnsavedChanges(true)
    triggerToast(`Removed visible systems access for ${deptName}`)
  }

  const handleColumnSelectAll = (systemName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.assignedApplications.includes(systemName)) return dept
        return {
          ...dept,
          assignedApplications: [...dept.assignedApplications, systemName],
        }
      })
    )
    setHasUnsavedChanges(true)
    triggerToast(`Granted ${systemName} to all departments`)
  }

  const handleColumnDeselectAll = (systemName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => ({
        ...dept,
        assignedApplications: dept.assignedApplications.filter((a) => a !== systemName),
      }))
    )
    setHasUnsavedChanges(true)
    triggerToast(`Revoked ${systemName} from all departments`)
  }

  // TAB 3: Ticket Types Handlers
  const handleToggleTypeActive = (typeId: string) => {
    setTicketTypes((prev) =>
      prev.map((t) => (t.id === typeId ? { ...t, active: !t.active } : t))
    )
    setHasUnsavedChanges(true)
  }

  const handleCreateTicketType = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTypeName.trim() || !newTypeCode.trim()) return

    const newType = {
      id: newTypeName.trim(),
      name: newTypeName.trim(),
      code: newTypeCode.trim().toUpperCase(),
      description: newTypeDesc.trim() || 'Custom business ticket type',
      defaultWorkflow: newTypeWorkflow,
      defaultPriority: newTypePriority,
      active: true,
    }

    setTicketTypes((prev) => [...prev, newType])
    setNewTypeName('')
    setNewTypeCode('')
    setNewTypeDesc('')
    setShowAddTypeModal(false)
    setHasUnsavedChanges(true)
    triggerToast(`Added ticket type "${newType.name}" (${newType.code})`)
  }

  // Save / Discard Page Changes
  const handleSavePageChanges = () => {
    setHasUnsavedChanges(false)
    triggerToast('All Classification & Access settings published successfully!')
  }

  const handleDiscardPageChanges = () => {
    onUpdateClassificationTree(initialClassificationTree)
    setDepartments(initialDepartmentsData)
    setTicketTypes(initialTicketTypesList)
    setTicketStatuses(initialTicketStatusesList)
    setHasUnsavedChanges(false)
    triggerToast('All unsaved changes discarded.')
  }

  const filteredStatuses = useMemo(() => {
    if (statusCategoryFilter === 'All') return ticketStatuses
    return ticketStatuses.filter((s) => s.category === statusCategoryFilter)
  }, [ticketStatuses, statusCategoryFilter])

  const filteredDepts = useMemo(() => {
    if (!deptSearch.trim()) return departments
    const q = deptSearch.toLowerCase()
    return departments.filter(
      (d) => d.name.toLowerCase().includes(q) || d.hodName.toLowerCase().includes(q)
    )
  }, [departments, deptSearch])

  return (
    <div>
      {/* Toast Notification */}
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

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title-main" style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
            Classification &amp; Issue SLA Manager
          </h1>
          <p className="page-desc-sub" style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            3-Level Catalog: Main Classification &bull; Sub-Classification (1-2 Technicians) &bull; Issues &amp; SLAs
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ height: '36px', fontSize: '12.5px', gap: '6px' }}
          onClick={() => setShowAddMainModal(true)}
        >
          <Plus size={14} /> Add Main Category
        </button>
      </div>

      <div>
        {/* LEVEL 1: Main Classification Selector (Software vs Hardware) */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
            {classificationTree.map((main) => {
              const isSelected = main.name === selectedMain
              const isSoftware = main.name.toLowerCase().includes('soft')
              return (
                <div
                  key={main.name}
                  onClick={() => {
                    setSelectedMain(main.name)
                    if (main.subClassifications.length > 0) {
                      setSelectedSub(main.subClassifications[0].name)
                    }
                  }}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-soft)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 2px 10px rgba(37, 99, 235, 0.1)' : 'var(--shadow-xs)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: isSelected ? 'var(--primary)' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSoftware ? <Laptop size={20} /> : <HardDrive size={20} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                          {main.name}
                        </h3>
                        {isSelected && (
                          <span style={{ fontSize: '10px', background: 'var(--primary)', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            Active
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                        {isSoftware
                          ? 'Applications: Pro People, Pro Biz, Pro Pupil, Flexcube...'
                          : 'Devices: Laptops, Printers, Monitors, Peripherals, Network...'}
                      </span>
                    </div>
                  </div>
                  <span
                    className="badge-tag"
                    style={{
                      background: isSelected ? 'var(--primary)' : '#E2E8F0',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      fontWeight: 700,
                      fontSize: '11px',
                      padding: '3px 8px',
                    }}
                  >
                    {main.subClassifications.length} Subs
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="layout-split-view">
          {/* Left Column: Level 2 — Sub-Classifications under selectedMain */}
          <div className="modern-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800, color: 'var(--primary)' }}>
                  Level 2: Sub-Classification
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {selectedMain} Systems
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ height: '30px', fontSize: '11.5px', padding: '0 10px' }}
                onClick={() => setShowAddSubModal(true)}
              >
                <Plus size={13} /> Add Sub
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(activeMain?.subClassifications || []).map((sub) => {
                const isSubSelected = sub.name === selectedSub
                const hasNoTechs = !sub.technicians || sub.technicians.length === 0
                return (
                  <div
                    key={sub.name}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1.5px solid ${isSubSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSubSelected ? 'var(--primary-soft)' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => setSelectedSub(sub.name)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ChevronRight size={14} color={isSubSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                        <strong style={{ fontSize: '13.5px', color: isSubSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                          {sub.name}
                        </strong>
                        {hasNoTechs && (
                          <span style={{ color: '#DC2626', fontSize: '11px' }} title="No technicians assigned">⚠️</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', paddingLeft: '20px' }}>
                        👤 {sub.technicians && sub.technicians.length > 0 ? sub.technicians.join(', ') : 'Unassigned'}
                      </div>
                    </div>

                    <span
                      className="badge-tag"
                      style={{
                        background: isSubSelected ? '#DBEAFE' : '#F1F5F9',
                        color: isSubSelected ? '#1E40AF' : '#475569',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                      }}
                    >
                      {sub.issueTypes.length} Issues
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Active Sub-Classification Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeSub ? (
              <>
                {/* Header Breadcrumb & Quick Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    boxShadow: 'var(--shadow-xs)',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '2px',
                      }}
                    >
                      <span>{selectedMain}</span>
                      <ChevronRight size={12} color="var(--text-muted)" />
                      <span style={{ color: 'var(--text-main)' }}>{selectedSub}</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
                      {selectedSub}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '32px', fontSize: '11.5px', padding: '0 10px', gap: '5px' }}
                      onClick={() => {
                        const first = activeSub.issueTypes[0]
                        if (first) {
                          setRoutingPreviewTarget({
                            main: selectedMain,
                            sub: selectedSub,
                            issueName: first.name,
                            severity: first.autoSeverity,
                            responseHours: first.slaResponseHours,
                            resolutionHours: first.slaResolutionHours,
                            hodLimitHours: first.hodApprovalLimitHours,
                            isCR: !!first.isChangeRequest,
                            technicians: activeSub.technicians,
                          })
                          setShowRoutingPreviewModal(true)
                        }
                      }}
                    >
                      <Eye size={13} /> Preview Routing
                    </button>
                  </div>
                </div>

                {/* Designated Technicians Card (Section 4 Rule: 1 or 2 Technicians) */}
                <div
                  className="modern-card"
                  style={{
                    padding: '14px 18px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    marginBottom: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserCheck size={16} color="var(--primary)" />
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                        Designated Technicians ({activeSub.technicians.length} of 2)
                      </strong>
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Approved tickets for {selectedSub} auto-assign here
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {activeSub.technicians.map((tech) => (
                      <div
                        key={tech}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'var(--primary-soft)',
                          border: '1px solid #BFDBFE',
                          borderRadius: '8px',
                          padding: '6px 12px',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: '#FFFFFF',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {tech
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>
                          {tech}
                        </span>
                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onClick={() => handleRemoveTechnicianFromActiveSub(tech)}
                          title="Remove technician"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}

                    {activeSub.technicians.length < 2 && (
                      <select
                        className="form-input-control"
                        style={{ height: '34px', fontSize: '12px', width: 'auto', padding: '0 10px' }}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddTechnicianToActiveSub(e.target.value)
                            e.target.value = ''
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          + Assign designated technician...
                        </option>
                        {availableITStaff
                          .filter((staff) => !activeSub.technicians.includes(staff.name))
                          .map((staff) => (
                            <option key={staff.name} value={staff.name}>
                              {staff.name} &bull; {staff.title}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Level 3: Clean 4-Column Issue Types & SLA Matrix */}
                <div className="modern-card" style={{ padding: '18px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                        Configured Issues &amp; SLAs ({activeSub.issueTypes.length})
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Target resolution times and severity levels for {selectedSub}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: '32px', fontSize: '12px', padding: '0 10px', gap: '5px' }}
                        onClick={() => {
                          setSelectedCommonIssueNames([])
                          setShowPickCommonIssuesModal(true)
                        }}
                      >
                        <Plus size={13} /> Common Issues Library
                      </button>

                      <button
                        type="button"
                        className="btn-primary"
                        style={{ height: '32px', fontSize: '12px', padding: '0 12px', gap: '5px' }}
                        onClick={() => {
                          setNewIssueMainTarget(selectedMain)
                          setNewIssueSubTarget(selectedSub)
                          setShowAddIssueModal(true)
                        }}
                      >
                        <Plus size={13} /> Add Custom Issue
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive-container">
                    <table className="custom-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '38%' }}>Issue Name</th>
                          <th style={{ width: '26%' }}>Severity &amp; SLA</th>
                          <th style={{ width: '22%' }}>Workflow Path</th>
                          <th style={{ width: '14%', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeSub.issueTypes.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={24} color="#94A3B8" />
                                <span style={{ fontSize: '13.5px', fontWeight: 500 }}>No issues configured for {selectedSub} yet.</span>
                                <button
                                  type="button"
                                  className="btn-primary"
                                  style={{ height: '32px', fontSize: '12px', marginTop: '6px' }}
                                  onClick={() => {
                                    setSelectedCommonIssueNames([])
                                    setShowPickCommonIssuesModal(true)
                                  }}
                                >
                                  <Plus size={13} /> Pick from Common Issues
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          activeSub.issueTypes.map((issue) => (
                            <tr key={issue.name}>
                              {/* 1. Issue Name */}
                              <td>
                                <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                                  {issue.name}
                                </strong>
                              </td>

                              {/* 2. Combined Severity & SLA Target */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span
                                    className={`badge-tag badge-severity-${issue.autoSeverity.toLowerCase()}`}
                                    style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 700 }}
                                  >
                                    {issue.autoSeverity}
                                  </span>
                                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {issue.slaResolutionHours >= 1
                                      ? `${issue.slaResolutionHours}h resolution`
                                      : `${Math.round(issue.slaResolutionHours * 60)}m resolution`}
                                  </span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    ({issue.slaResponseHours >= 1 ? `${issue.slaResponseHours}h` : `${Math.round(issue.slaResponseHours * 60)}m`} resp)
                                  </span>
                                </div>
                              </td>

                              {/* 3. Workflow Path */}
                              <td>
                                {issue.isChangeRequest ? (
                                  <span
                                    className="badge-tag"
                                    style={{
                                      background: issue.crRequiresHodApproval !== false ? '#F3E8FF' : '#EFF6FF',
                                      color: issue.crRequiresHodApproval !== false ? '#7C3AED' : '#2563EB',
                                      fontSize: '11px',
                                      padding: '3px 8px',
                                      fontWeight: 700,
                                      border: `1px solid ${issue.crRequiresHodApproval !== false ? '#E9D5FF' : '#BFDBFE'}`,
                                    }}
                                  >
                                    {issue.crRequiresHodApproval !== false
                                      ? 'Change Request (Admin ➔ HOD)'
                                      : 'Change Request (Admin Only)'}
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      color: '#64748B',
                                      fontSize: '12px',
                                      fontWeight: 500,
                                    }}
                                  >
                                    Standard
                                  </span>
                                )}
                              </td>

                              {/* 4. Actions */}
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                  <button
                                    type="button"
                                    className="btn-secondary"
                                    style={{ height: '28px', fontSize: '11.5px', padding: '0 8px', gap: '4px' }}
                                    onClick={() =>
                                      setEditingIssue({
                                        mainName: selectedMain,
                                        subName: selectedSub,
                                        issue: { ...issue },
                                      })
                                    }
                                    title="Edit SLA & Severity"
                                  >
                                    <Edit2 size={12} /> Edit SLA
                                  </button>

                                  <button
                                    type="button"
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: '5px',
                                      color: '#EF4444',
                                      borderRadius: '4px',
                                    }}
                                    onClick={() =>
                                      handleDeleteIssueType(selectedMain, selectedSub, issue.name)
                                    }
                                    title="Delete issue"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Level 3b: Intake Questionnaire Fields (Industry standard: configured directly with catalog item) */}
                <div className="modern-card" style={{ padding: '18px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                          Intake Questionnaire for {selectedSub}
                        </h4>
                        <span
                          className="badge-tag"
                          style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '11px', fontWeight: 700 }}
                        >
                          {(questionnaires[selectedSub] || []).length} Custom Fields
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Fields presented to end-users when raising a ticket under {selectedSub}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '32px', fontSize: '12px', padding: '0 12px', gap: '5px' }}
                      onClick={() => setShowAddQuestionModal(true)}
                    >
                      <Plus size={13} /> Add Intake Question
                    </button>
                  </div>

                  {!(questionnaires[selectedSub] && questionnaires[selectedSub].length > 0) ? (
                    <div
                      style={{
                        padding: '24px 16px',
                        textAlign: 'center',
                        background: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px dashed var(--border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Standard Ticket Form Active
                      </p>
                      <span style={{ fontSize: '12px' }}>
                        Users will complete standard fields (Title, Description, Priority, Attachment). Click &quot;Add Intake Question&quot; to prompt for system-specific data (e.g. Account No, Screen Error, Asset Tag).
                      </span>
                    </div>
                  ) : (
                    <div className="table-responsive-container">
                      <table className="custom-data-table">
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>Field Label &amp; Placeholder</th>
                            <th style={{ width: '22%' }}>Input Type</th>
                            <th style={{ width: '24%' }}>Validation</th>
                            <th style={{ width: '14%', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questionnaires[selectedSub].map((q) => (
                            <tr key={q.id}>
                              <td>
                                <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block' }}>
                                  {q.label}
                                </strong>
                                {q.placeholder && (
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    Placeholder: &quot;{q.placeholder}&quot;
                                  </span>
                                )}
                                {q.options && q.options.length > 0 && (
                                  <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '2px' }}>
                                    Options: {q.options.slice(0, 3).join(', ')}{q.options.length > 3 ? ` +${q.options.length - 3} more` : ''}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span
                                  className="badge-tag"
                                  style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}
                                >
                                  {q.type}
                                </span>
                              </td>
                              <td>
                                {q.required ? (
                                  <span
                                    className="badge-tag"
                                    style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '11px', fontWeight: 700 }}
                                  >
                                    Mandatory *
                                  </span>
                                ) : (
                                  <span
                                    className="badge-tag"
                                    style={{ background: '#F8FAFC', color: '#64748B', fontSize: '11px', fontWeight: 600 }}
                                  >
                                    Optional
                                  </span>
                                )}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    color: '#EF4444',
                                    borderRadius: '4px',
                                  }}
                                  onClick={() => handleDeleteQuestion(q.id)}
                                  title="Delete question"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="modern-card" style={{ padding: '40px', textAlign: 'center' }}>
                <AlertTriangle size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: 'var(--text-main)' }}>
                  No system selected
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  Select a category and system on the left or create a new one to begin.
                </p>
              </div>
            )}
          </div>
        </div>
          {/* Workflow Governance & Change Request Exception Guide */}
          <div
            className="modern-card"
            style={{
              padding: '20px 24px',
              marginTop: '24px',
              background: '#FFFFFF',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800, color: 'var(--primary)' }}>
                Workflow & Lifecycle Governance
              </span>
              <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                Standard Ticket Workflow vs. Change Request Exception Path
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Every ticket follows the Standard Workflow by default. The only exception is a Change Request (system patch/upgrade or elevated by technician).
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {/* Standard Workflow Card */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '10px',
                  background: '#F0FDF4',
                  border: '1.5px solid #BBF7D0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ background: '#16A34A', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                    Standard Workflow (Default)
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#166534', fontWeight: 600 }}>All Normal Incidents & Requests</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#14532D' }}>
                  <div><strong>1. User Submission:</strong> User files ticket under Software or Hardware</div>
                  <div><strong>2. HOD Approval:</strong> User's Department Head (Active Directory) approves/rejects</div>
                  <div><strong>3. Auto-Assignment:</strong> Routed directly to 1 or 2 designated technicians</div>
                  <div><strong>4. Resolution:</strong> Technician works and marks ticket as resolved</div>
                  <div><strong>5. User Closure:</strong> Requester confirms resolution and closes ticket</div>
                </div>
              </div>

              {/* Change Request Exception Card */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '10px',
                  background: '#FAF5FF',
                  border: '1.5px solid #E9D5FF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ background: '#7C3AED', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                    Change Request (Exception Path)
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#6B21A8', fontWeight: 600 }}>System Patches, Upgrades & Major Config</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#581C87' }}>
                  <div><strong>1. Elevation:</strong> Issue configured as Change Request or flagged by Technician/Admin</div>
                  <div><strong>2. Admin &amp; HOD Review:</strong> Admin reviews package &bull; HOD re-approves impact</div>
                  <div><strong>3. Managerial Approval:</strong> Management / CAB authorizes change window</div>
                  <div><strong>4. Implementation:</strong> Designated technician executes patch/configuration</div>
                  <div><strong>5. QA Testing &amp; Closure:</strong> Testing team tests and verifies &bull; Marked resolved &bull; User closes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      

      {/* ========================================================================= */}
      {/* ROUTING PREVIEW MODAL (Section 5 & 15.1) */}
      {/* ========================================================================= */}
      {showRoutingPreviewModal && routingPreviewTarget && (
        <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box" style={{ maxWidth: '580px' }}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={18} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Interactive Routing Simulation
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowRoutingPreviewModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                }}
              >
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Classification Simulation Path
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                  {routingPreviewTarget.main} &rarr; {routingPreviewTarget.sub} &rarr; {routingPreviewTarget.issueName}
                </div>
              </div>

              {/* Simulated Output Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      TARGET AUTO-ASSIGNEES
                    </span>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {routingPreviewTarget.technicians.join(' & ') || 'No technician assigned (Broken routing)'}
                    </div>
                  </div>
                  <span className="badge-tag" style={{ background: '#EEF4FF', color: '#2563EB' }}>
                    1 or 2 Rule Enforced
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      AUTO-SEVERITY & SLA TARGETS
                    </span>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {routingPreviewTarget.severity} &bull; Response: {routingPreviewTarget.responseHours}h &bull; Resolution: {routingPreviewTarget.resolutionHours}h
                    </div>
                  </div>
                  <span
                    className={`badge-tag badge-severity-${routingPreviewTarget.severity.toLowerCase()}`}
                  >
                    {routingPreviewTarget.severity}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      HOD APPROVAL ROUTE (FROM ACTIVE DIRECTORY)
                    </span>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      Grace Nsubuga (HOD) &bull; Max limit: {routingPreviewTarget.hodLimitHours} hours
                    </div>
                  </div>
                  <span className="badge-tag" style={{ background: '#FEF3C7', color: '#B45309' }}>
                    AD Synced
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      LIFECYCLE WORKFLOW PATH
                    </span>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {routingPreviewTarget.isCR
                        ? 'Change Request Workflow (Draft) &bull; Testing Gate Required'
                        : 'Standard Ticket Workflow (Published) &bull; Direct Auto-Assignment'}
                    </div>
                  </div>
                  <span
                    className="badge-tag"
                    style={{
                      background: routingPreviewTarget.isCR ? '#F3E8FF' : '#EEF4FF',
                      color: routingPreviewTarget.isCR ? '#7C3AED' : '#2563EB',
                    }}
                  >
                    {routingPreviewTarget.isCR ? 'CR Route' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-dialog-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowRoutingPreviewModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD MAIN CLASSIFICATION MODAL */}
      {/* ========================================================================= */}
      {showAddMainModal && (
        <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box">
            <div className="modal-dialog-header">
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800, color: 'var(--primary)' }}>
                  Level 1 &bull; Main Classification
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Create Main Classification
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowAddMainModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMainClassification}>
              <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label-control">
                    Main Classification Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder="e.g. Software, Hardware, Network Infrastructure"
                    value={newMainName}
                    onChange={(e) => setNewMainName(e.target.value)}
                  />
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Defines the top-level branch for all downstream sub-classifications and issues.
                  </span>
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddMainModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Main Classification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD SUB-CLASSIFICATION MODAL */}
      {/* ========================================================================= */}
      {showAddSubModal && (
        <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box">
            <div className="modal-dialog-header">
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800, color: 'var(--primary)' }}>
                  Level 2 &bull; Sub-Classification under {selectedMain}
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Create Sub-Classification ({selectedMain})
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowAddSubModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubClassification}>
              <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label-control">
                    Sub-Classification Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder={selectedMain === 'Software' ? 'e.g. Pro HR, Mobile Banking, CRM' : 'e.g. Laptops & Desktops, Printers, Scanners'}
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                  />
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Every ticket filed under this sub-classification will auto-assign to the technicians below.
                  </span>
                </div>

                <div>
                  <label className="form-label-control">
                    Primary Designated Technician <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    className="form-input-control"
                    value={newSubTech1}
                    onChange={(e) => setNewSubTech1(e.target.value)}
                  >
                    {availableITStaff.map((staff) => (
                      <option key={staff.name} value={staff.name}>
                        {staff.name} &bull; {staff.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label-control">
                    Secondary Designated Technician (Optional)
                  </label>
                  <select
                    className="form-input-control"
                    value={newSubTech2}
                    onChange={(e) => setNewSubTech2(e.target.value)}
                  >
                    <option value="None">None (Single Technician Model)</option>
                    {availableITStaff
                      .filter((s) => s.name !== newSubTech1)
                      .map((staff) => (
                        <option key={staff.name} value={staff.name}>
                          {staff.name} &bull; {staff.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddSubModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Sub-Classification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD ISSUE TYPE MODAL */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* MODAL: PICK COMMON ISSUES FROM MASTER CATALOG */}
      {/* ========================================================================= */}
      {showPickCommonIssuesModal && activeSub && (() => {
        const currentCommonPool = selectedMain === 'Hardware' ? COMMON_HARDWARE_ISSUES : COMMON_MASTER_ISSUES
        return (
          <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box" style={{ maxWidth: '640px' }}>
            <div className="modal-dialog-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Pick Issues for {selectedSub}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Select common IT issues from the master catalog to attach to {selectedSub}.
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowPickCommonIssuesModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-dialog-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  padding: '8px 12px',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {selectedMain} Master Issues Pool ({currentCommonPool.length} available)
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      const availableNames = currentCommonPool
                        .filter((ci) => !activeSub.issueTypes.some((it) => it.name === ci.name))
                        .map((ci) => ci.name)
                      setSelectedCommonIssueNames(availableNames)
                    }}
                  >
                    Select All Unadded
                  </button>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedCommonIssueNames([])}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentCommonPool.map((masterIssue) => {
                  const isAlreadyAdded = activeSub.issueTypes.some((it) => it.name === masterIssue.name)
                  const isChecked = selectedCommonIssueNames.includes(masterIssue.name)

                  return (
                    <div
                      key={masterIssue.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1.5px solid ${
                          isAlreadyAdded
                            ? '#E2E8F0'
                            : isChecked
                            ? 'var(--primary)'
                            : 'var(--border)'
                        }`,
                        background: isAlreadyAdded
                          ? '#F8FAFC'
                          : isChecked
                          ? 'var(--primary-soft)'
                          : '#FFFFFF',
                        opacity: isAlreadyAdded ? 0.65 : 1,
                        cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onClick={() => {
                        if (isAlreadyAdded) return
                        if (isChecked) {
                          setSelectedCommonIssueNames(
                            selectedCommonIssueNames.filter((n) => n !== masterIssue.name)
                          )
                        } else {
                          setSelectedCommonIssueNames([...selectedCommonIssueNames, masterIssue.name])
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          disabled={isAlreadyAdded}
                          checked={isAlreadyAdded || isChecked}
                          onChange={() => {}}
                          style={{ cursor: isAlreadyAdded ? 'not-allowed' : 'pointer' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                              {masterIssue.name}
                            </strong>
                            <span
                              className={`badge-tag badge-severity-${masterIssue.autoSeverity.toLowerCase()}`}
                              style={{ fontSize: '10px', padding: '1px 6px' }}
                            >
                              {masterIssue.autoSeverity}
                            </span>
                          </div>
                          {masterIssue.description && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {masterIssue.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ textAlign: 'right', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          <div>Resp: <strong>{masterIssue.slaResponseHours >= 1 ? `${masterIssue.slaResponseHours}h` : `${Math.round(masterIssue.slaResponseHours * 60)}m`}</strong></div>
                          <div>Resol: <strong>{masterIssue.slaResolutionHours >= 1 ? `${masterIssue.slaResolutionHours}h` : `${Math.round(masterIssue.slaResolutionHours * 60)}m`}</strong></div>
                        </div>

                        {isAlreadyAdded && (
                          <span
                            className="badge-tag"
                            style={{ background: '#ECFDF5', color: '#059669', fontSize: '10.5px' }}
                          >
                            ✓ Added
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="modal-dialog-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPickCommonIssuesModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={selectedCommonIssueNames.length === 0}
                onClick={() => handleAddCommonIssuesToActiveSub(selectedCommonIssueNames)}
              >
                Add {selectedCommonIssueNames.length > 0 ? `${selectedCommonIssueNames.length} ` : ''}Selected to {selectedSub}
              </button>
            </div>
          </div>
        </div>
        )
      })()}

      {showAddIssueModal && (
        <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box" style={{ maxWidth: '520px' }}>
            <div className="modal-dialog-header">
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800, color: 'var(--primary)' }}>
                  Level 3 &bull; Sub-Sub Classification / Issue
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Create Issue under {selectedMain} &gt; {selectedSub}
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowAddIssueModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateIssueType}>
              <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label-control">Target Category</label>
                    <select
                      className="form-input-control"
                      value={viewMode === 'matrix' ? newIssueMainTarget : selectedMain}
                      onChange={(e) => {
                        setNewIssueMainTarget(e.target.value)
                        const targetMain = classificationTree.find((m) => m.name === e.target.value)
                        if (targetMain && targetMain.subClassifications.length > 0) {
                          setNewIssueSubTarget(targetMain.subClassifications[0].name)
                        }
                      }}
                    >
                      {classificationTree.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-control">Target Sub-Service</label>
                    <select
                      className="form-input-control"
                      value={viewMode === 'matrix' ? newIssueSubTarget : selectedSub}
                      onChange={(e) => setNewIssueSubTarget(e.target.value)}
                    >
                      {(
                        classificationTree.find(
                          (m) => m.name === (viewMode === 'matrix' ? newIssueMainTarget : selectedMain)
                        )?.subClassifications || []
                      ).map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label-control">
                    Issue / Sub-Sub Classification Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder={selectedMain === 'Software' ? 'e.g. Cannot login to Pro People, Session timeout' : 'e.g. Device will not turn on, Screen display blank'}
                    value={newIssueName}
                    onChange={(e) => setNewIssueName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label-control">Auto Severity</label>
                    <select
                      className="form-input-control"
                      value={newIssueSeverity}
                      onChange={(e) => setNewIssueSeverity(e.target.value as TicketSeverity)}
                    >
                      <option value="Critical">Critical (P1)</option>
                      <option value="High">High (P2)</option>
                      <option value="Medium">Medium (P3)</option>
                      <option value="Low">Low (P4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label-control">Response SLA (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.25"
                      required
                      className="form-input-control"
                      value={newIssueResponseHours}
                      onChange={(e) => setNewIssueResponseHours(parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label-control">Resolution SLA (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      className="form-input-control"
                      value={newIssueResolutionHours}
                      onChange={(e) => setNewIssueResolutionHours(parseFloat(e.target.value) || 4)}
                    />
                  </div>

                  <div>
                    <label className="form-label-control">HOD Approval Limit (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      className="form-input-control"
                      value={newIssueHodLimitHours}
                      onChange={(e) => setNewIssueHodLimitHours(parseFloat(e.target.value) || 2)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newIssueIsCR}
                      onChange={(e) => {
                        setNewIssueIsCR(e.target.checked)
                        if (e.target.checked) setNewIssueRequiresHodApproval(true)
                      }}
                    />
                    <span>Classify as Change Request (Requires CAB / Management Review &amp; Testing)</span>
                  </label>

                  {newIssueIsCR && (
                    <div
                      style={{
                        marginTop: '10px',
                        marginLeft: '24px',
                        padding: '12px 14px',
                        background: '#FAF5FF',
                        borderRadius: '8px',
                        border: '1px solid #E9D5FF',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#581C87',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={newIssueRequiresHodApproval}
                          onChange={(e) => setNewIssueRequiresHodApproval(e.target.checked)}
                          style={{ accentColor: '#7C3AED' }}
                        />
                        Require Department Head (HOD) Approval
                      </label>
                      <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#6B21A8', lineHeight: 1.4 }}>
                        {newIssueRequiresHodApproval
                          ? '✓ Ticket routes to Admin Team first, then to requester\'s Department Head for sign-off.'
                          : '⚡ HOD approval waived (routine change). Ticket routes to Admin Team, then directly to implementation.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddIssueModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Issue Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT ISSUE TYPE MODAL */}
      {/* ========================================================================= */}
      {editingIssue && (
        <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box">
            <div className="modal-dialog-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Edit SLA: {editingIssue.issue.name}
              </h3>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setEditingIssue(null)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedIssue}>
              <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Fast SLA Presets */}
                <div>
                  <label className="form-label-control" style={{ marginBottom: '6px' }}>
                    Quick SLA Presets
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    <button
                      type="button"
                      style={{
                        padding: '6px 8px',
                        border: '1.5px solid #FEE2E2',
                        background: '#FEF2F2',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#DC2626',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onClick={() => {
                        setEditingIssue({
                          ...editingIssue,
                          issue: {
                            ...editingIssue.issue,
                            autoSeverity: 'Critical',
                            slaResponseHours: 0.5,
                            slaResolutionHours: 2,
                            hodApprovalLimitHours: 1,
                          },
                        })
                      }}
                    >
                      ⚡ Critical (30m / 2h)
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 8px',
                        border: '1.5px solid #FFEDD5',
                        background: '#FFF7ED',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#EA580C',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onClick={() => {
                        setEditingIssue({
                          ...editingIssue,
                          issue: {
                            ...editingIssue.issue,
                            autoSeverity: 'High',
                            slaResponseHours: 1,
                            slaResolutionHours: 4,
                            hodApprovalLimitHours: 2,
                          },
                        })
                      }}
                    >
                      🟠 High (1h / 4h)
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 8px',
                        border: '1.5px solid #FEF08A',
                        background: '#FEFCE8',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#854D0E',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onClick={() => {
                        setEditingIssue({
                          ...editingIssue,
                          issue: {
                            ...editingIssue.issue,
                            autoSeverity: 'Medium',
                            slaResponseHours: 2,
                            slaResolutionHours: 8,
                            hodApprovalLimitHours: 4,
                          },
                        })
                      }}
                    >
                      🟡 Medium (2h / 8h)
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 8px',
                        border: '1.5px solid #E2E8F0',
                        background: '#F8FAFC',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onClick={() => {
                        setEditingIssue({
                          ...editingIssue,
                          issue: {
                            ...editingIssue.issue,
                            autoSeverity: 'Low',
                            slaResponseHours: 4,
                            slaResolutionHours: 24,
                            hodApprovalLimitHours: 8,
                          },
                        })
                      }}
                    >
                      🟢 Routine (4h / 24h)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label-control">Auto-Calculated Severity</label>
                  <select
                    className="form-input-control"
                    value={editingIssue.issue.autoSeverity}
                    onChange={(e) =>
                      setEditingIssue({
                        ...editingIssue,
                        issue: {
                          ...editingIssue.issue,
                          autoSeverity: e.target.value as TicketSeverity,
                        },
                      })
                    }
                  >
                    <option value="Critical">Critical (P1)</option>
                    <option value="High">High (P2)</option>
                    <option value="Medium">Medium (P3)</option>
                    <option value="Low">Low (P4)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label-control">Response SLA (Hours)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      className="form-input-control"
                      value={editingIssue.issue.slaResponseHours}
                      onChange={(e) =>
                        setEditingIssue({
                          ...editingIssue,
                          issue: {
                            ...editingIssue.issue,
                            slaResponseHours: parseFloat(e.target.value) || 0.5,
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="form-label-control">Resolution SLA (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      className="form-input-control"
                      value={editingIssue.issue.slaResolutionHours}
                      onChange={(e) =>
                        setEditingIssue({
                          ...editingIssue,
                          issue: {
                            ...editingIssue.issue,
                            slaResolutionHours: parseFloat(e.target.value) || 1,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label-control">HOD Approval Limit (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    className="form-input-control"
                    value={editingIssue.issue.hodApprovalLimitHours}
                    onChange={(e) =>
                      setEditingIssue({
                        ...editingIssue,
                        issue: {
                          ...editingIssue.issue,
                          hodApprovalLimitHours: parseFloat(e.target.value) || 1,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!editingIssue.issue.isChangeRequest}
                      onChange={(e) =>
                        setEditingIssue({
                          ...editingIssue,
                          issue: {
                            ...editingIssue.issue,
                            isChangeRequest: e.target.checked,
                            crRequiresHodApproval: e.target.checked
                              ? (editingIssue.issue.crRequiresHodApproval ?? true)
                              : undefined,
                          },
                        })
                      }
                    />
                    <span>Flag as Change Request (Requires Testing &amp; CAB Review)</span>
                  </label>

                  {editingIssue.issue.isChangeRequest && (
                    <div
                      style={{
                        marginTop: '10px',
                        marginLeft: '24px',
                        padding: '12px 14px',
                        background: '#FAF5FF',
                        borderRadius: '8px',
                        border: '1px solid #E9D5FF',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#581C87',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={editingIssue.issue.crRequiresHodApproval !== false}
                          onChange={(e) =>
                            setEditingIssue({
                              ...editingIssue,
                              issue: {
                                ...editingIssue.issue,
                                crRequiresHodApproval: e.target.checked,
                              },
                            })
                          }
                          style={{ accentColor: '#7C3AED' }}
                        />
                        Require Department Head (HOD) Approval
                      </label>
                      <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#6B21A8', lineHeight: 1.4 }}>
                        {editingIssue.issue.crRequiresHodApproval !== false
                          ? '✓ Ticket routes to Admin Team first, then to requester\'s Department Head for sign-off.'
                          : '⚡ HOD approval waived (routine change). Ticket routes to Admin Team, then directly to implementation.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingIssue(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ========================================================================= */}
      {/* DATA DUMP & PRESETS MODAL */}
      {/* ========================================================================= */}
      {showDataDumpModal && (
        <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box" style={{ maxWidth: '640px' }}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
                  ITSM Catalog Schema & Industry Presets
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowDataDumpModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 20px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface-subtle)',
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                style={{
                  height: '32px',
                  fontSize: '12px',
                  background: dataDumpTab === 'presets' ? 'var(--primary)' : 'transparent',
                  color: dataDumpTab === 'presets' ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: dataDumpTab === 'presets' ? 'var(--primary)' : 'transparent',
                }}
                onClick={() => setDataDumpTab('presets')}
              >
                Standard Industry Presets
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{
                  height: '32px',
                  fontSize: '12px',
                  background: dataDumpTab === 'json' ? 'var(--primary)' : 'transparent',
                  color: dataDumpTab === 'json' ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: dataDumpTab === 'json' ? 'var(--primary)' : 'transparent',
                }}
                onClick={() => setDataDumpTab('json')}
              >
                JSON Schema Dump
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{
                  height: '32px',
                  fontSize: '12px',
                  background: dataDumpTab === 'csv' ? 'var(--primary)' : 'transparent',
                  color: dataDumpTab === 'csv' ? '#FFFFFF' : 'var(--text-secondary)',
                  borderColor: dataDumpTab === 'csv' ? 'var(--primary)' : 'transparent',
                }}
                onClick={() => setDataDumpTab('csv')}
              >
                Tabular CSV Export
              </button>
            </div>

            <div className="modal-dialog-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {dataDumpTab === 'presets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Instantly load battle-tested ITIL service catalog packages configured for banking and enterprise operations:
                  </p>

                  {/* Preset 1 */}
                  <div
                    style={{
                      border: '1.5px solid var(--border)',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge-tag" style={{ background: '#DCFCE7', color: '#15803D' }}>
                          Current Standard
                        </span>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                          Enterprise Core Services &amp; Applications Matrix
                        </strong>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Includes Oracle Flexcube, Atomverse Mobile/Web, Cisco Firewall, Network Access, and Workstation hardware.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span>📁 3 Categories</span>
                        <span>⚙️ 5 Systems</span>
                        <span>📋 26 Catalog Rules</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '34px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      onClick={() => handleLoadPreset(BANKING_CORE_PRESET, 'Enterprise Core Services Matrix')}
                    >
                      <RotateCcw size={13} /> Reset Default
                    </button>
                  </div>

                  {/* Preset 2 */}
                  <div
                    style={{
                      border: '1.5px solid var(--border)',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge-tag" style={{ background: '#EEF4FF', color: '#2563EB' }}>
                          FinTech Modern
                        </span>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                          Digital Retail Banking & Payment Hub
                        </strong>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Includes Retail Mobile App (iOS/Android), Corporate Internet Banking (CIB), Instant Payment Switch (IPS), and AML Sanctions Screening.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span>📁 3 Categories</span>
                        <span>⚙️ 6 Systems</span>
                        <span>📋 21 Catalog Rules</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '34px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      onClick={() => handleLoadPreset(DIGITAL_FINTECH_PRESET, 'Digital Retail Banking & Payment Hub')}
                    >
                      <RotateCcw size={13} /> Apply Dump
                    </button>
                  </div>

                  {/* Preset 3 */}
                  <div
                    style={{
                      border: '1.5px solid var(--border)',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge-tag" style={{ background: '#FAF5FF', color: '#7C3AED' }}>
                          ITIL Enterprise
                        </span>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                          Corporate Enterprise IT & Workplace
                        </strong>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Includes Microsoft 365, Teams, ERP HRMS, CrowdStrike EDR Endpoint Security, and Zero Trust Network Access (ZTNA).
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span>📁 2 Categories</span>
                        <span>⚙️ 4 Systems</span>
                        <span>📋 18 Catalog Rules</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '34px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      onClick={() => handleLoadPreset(ENTERPRISE_IT_PRESET, 'Corporate Enterprise IT & Workplace')}
                    >
                      <RotateCcw size={13} /> Apply Dump
                    </button>
                  </div>
                </div>
              )}

              {dataDumpTab === 'json' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Paste custom classification JSON schema or download current backup:
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: '30px', fontSize: '11.5px', padding: '0 10px' }}
                        onClick={handleCopyJson}
                      >
                        {copiedJson ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                        {copiedJson ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ height: '30px', fontSize: '11.5px', padding: '0 10px' }}
                        onClick={handleExportDataDump}
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </div>

                  {jsonError && (
                    <div
                      style={{
                        padding: '10px 14px',
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        color: '#B91C1C',
                        fontSize: '12.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <AlertTriangle size={15} />
                      {jsonError}
                    </div>
                  )}

                  <textarea
                    rows={12}
                    className="form-input-control"
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      lineHeight: 1.4,
                      background: '#0F172A',
                      color: '#F8FAFC',
                      padding: '12px',
                    }}
                    value={jsonInputText}
                    onChange={(e) => setJsonInputText(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={handleApplyJsonDump}
                  >
                    <CheckCircle2 size={15} /> Validate & Apply Custom JSON Dump
                  </button>
                </div>
              )}

              {dataDumpTab === 'csv' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Export a high-density tabular CSV representation of the entire Routing Matrix and SLAs for opening in Microsoft Excel, PowerBI, or Google Sheets.
                  </p>

                  <div
                    style={{
                      background: 'var(--surface-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '14px 18px',
                    }}
                  >
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                      CSV Column Schema ({allMatrixRows.length} Rows)
                    </strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      <code>Category</code> &bull; <code>Sub-Classification</code> &bull;{' '}
                      <code>Catalog Issue Type</code> &bull; <code>Designated Technicians</code> &bull;{' '}
                      <code>Auto Severity</code> &bull; <code>Response SLA (Hours)</code> &bull;{' '}
                      <code>Resolution SLA (Hours)</code> &bull; <code>HOD Limit (Hours)</code> &bull;{' '}
                      <code>Workflow Path</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleExportCSV}
                    >
                      <FileSpreadsheet size={15} /> Download CSV for Excel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-dialog-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowDataDumpModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD INTAKE QUESTION MODAL (Industry Standard: Catalog Builder) */}
      {/* ========================================================================= */}
      {showAddQuestionModal && (
        <div className="modal-overlay-backdrop">
          <div className="modal-dialog-box" style={{ maxWidth: '480px' }}>
            <div className="modal-dialog-header">
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800, color: 'var(--primary)' }}>
                  Service Catalog &bull; Intake Questionnaire
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Add Intake Question for {selectedSub}
                </h3>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowAddQuestionModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddQuestion}>
              <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label-control">
                    Field Label <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder="e.g. Account Number / CIF, Screen Error Code, Asset Tag"
                    value={newQuestionLabel}
                    onChange={(e) => setNewQuestionLabel(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label-control">Input Type</label>
                    <select
                      className="form-input-control"
                      value={newQuestionType}
                      onChange={(e) => setNewQuestionType(e.target.value as any)}
                    >
                      <option value="text">Text Input</option>
                      <option value="number">Numeric Input</option>
                      <option value="dropdown">Dropdown Select</option>
                      <option value="attachment">File Attachment</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label-control">Validation</label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        height: '38px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newQuestionRequired}
                        onChange={(e) => setNewQuestionRequired(e.target.checked)}
                      />
                      <span>Mandatory on ticket submission</span>
                    </label>
                  </div>
                </div>

                {newQuestionType === 'dropdown' && (
                  <div>
                    <label className="form-label-control">
                      Dropdown Options <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input-control"
                      placeholder="e.g. Production, UAT, Sandbox, DR"
                      value={newQuestionOptions}
                      onChange={(e) => setNewQuestionOptions(e.target.value)}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                      Separate multiple options with commas
                    </span>
                  </div>
                )}

                <div>
                  <label className="form-label-control">Placeholder / Hint (Optional)</label>
                  <input
                    type="text"
                    className="form-input-control"
                    placeholder="e.g. 021-998341-01 or UFC-LPT-2024"
                    value={newQuestionPlaceholder}
                    onChange={(e) => setNewQuestionPlaceholder(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddQuestionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Question to {selectedSub}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING UNSAVED-CHANGES BAR (Section 15 Rule) */}
      {/* ========================================================================= */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} color="#FBBF24" />
            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
              You have unsaved changes in Classification & Access settings.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
              onClick={handleDiscardPageChanges}
            >
              Discard
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{
                background: 'var(--primary)',
                borderColor: 'var(--primary)',
              }}
              onClick={handleSavePageChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
