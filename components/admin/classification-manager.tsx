'use client'

import React, { useState, useMemo } from 'react'
import {
  FolderKanban,
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

const ALL_SYSTEM_APPLICATIONS = [
  'Flexcube',
  'Atomverse',
  'Firewall',
  'Network Access',
  'SWIFT Alliance Gateway',
  'ATM & POS Switch',
  'Active Directory & Identity',
  'Database & Storage',
  'Workstations & Peripherals',
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

  // TAB 1: Tree State & Sub-views
  const [viewMode, setViewMode] = useState<'matrix' | 'hierarchy'>('matrix')
  const [matrixSearch, setMatrixSearch] = useState('')
  const [matrixCategoryFilter, setMatrixCategoryFilter] = useState('All')
  const [matrixSeverityFilter, setMatrixSeverityFilter] = useState('All')
  const [matrixWorkflowFilter, setMatrixWorkflowFilter] = useState('All')

  const [selectedMain, setSelectedMain] = useState(
    classificationTree[0]?.name || 'Core Banking & Applications'
  )
  const [selectedSub, setSelectedSub] = useState(
    classificationTree[0]?.subClassifications[0]?.name || 'Flexcube'
  )

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

  // TAB 2: Applications & Access State
  const [departments, setDepartments] = useState<DepartmentConfig[]>(initialDepartmentsData)
  const [deptSearch, setDeptSearch] = useState('')

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
      `"${r.issue.isChangeRequest ? 'Change Request' : 'Standard'}"`,
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
  const handleToggleDepartmentApp = (deptName: string, appName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.name !== deptName) return dept
        const hasApp = dept.assignedApplications.includes(appName)
        return {
          ...dept,
          assignedApplications: hasApp
            ? dept.assignedApplications.filter((a) => a !== appName)
            : [...dept.assignedApplications, appName],
        }
      })
    )
    setHasUnsavedChanges(true)
  }

  const handleRowSelectAll = (deptName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.name !== deptName) return dept
        return {
          ...dept,
          assignedApplications: [...ALL_SYSTEM_APPLICATIONS],
        }
      })
    )
    setHasUnsavedChanges(true)
    triggerToast(`Granted all applications to ${deptName}`)
  }

  const handleRowDeselectAll = (deptName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.name !== deptName) return dept
        return {
          ...dept,
          assignedApplications: [],
        }
      })
    )
    setHasUnsavedChanges(true)
    triggerToast(`Removed all application access for ${deptName}`)
  }

  const handleColumnSelectAll = (appName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.assignedApplications.includes(appName)) return dept
        return {
          ...dept,
          assignedApplications: [...dept.assignedApplications, appName],
        }
      })
    )
    setHasUnsavedChanges(true)
    triggerToast(`Granted ${appName} access to all departments`)
  }

  const handleColumnDeselectAll = (appName: string) => {
    setDepartments((prev) =>
      prev.map((dept) => ({
        ...dept,
        assignedApplications: dept.assignedApplications.filter((a) => a !== appName),
      }))
    )
    setHasUnsavedChanges(true)
    triggerToast(`Revoked ${appName} access from all departments`)
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

      {/* Enterprise Page Header */}
      <div className="page-header-flex" style={{ marginBottom: '18px' }}>
        <div>
          <div className="page-eyebrow">
            <ShieldCheck size={14} /> Administration / Classification & Service Catalog
          </div>
          <h1 className="page-title-main">Classification & Catalog Administration</h1>
          <p className="page-desc-sub">
            Configure multi-tier ITSM taxonomy, department-to-application entitlements, ticket types, SLAs, auto-severity, and lifecycle statuses.
          </p>
        </div>

        {/* Global Toolbar: Incomplete Configuration Indicator + Data Dump */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {incompleteSubClassifications.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#DC2626',
                fontWeight: 600,
              }}
              title="Taxonomy nodes missing technicians or issue rules"
            >
              <AlertTriangle size={14} />
              <span>{incompleteSubClassifications.length} Incomplete Nodes</span>
            </div>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setJsonInputText(JSON.stringify(classificationTree, null, 2))
              setShowDataDumpModal(true)
            }}
            title="Import/Export data dumps and load standard industry packages"
          >
            <Database size={15} /> Data Dump Tools
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportCSV}
            title="Export catalog matrix as CSV for Excel"
          >
            <FileSpreadsheet size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* 5 SUB-TABS (Section 15: Administration Page 1) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '22px',
          paddingBottom: '2px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('tree')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'tree' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeTab === 'tree' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'tree' ? 700 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <FolderKanban size={16} />
          <span>Classification Tree</span>
          <span
            className="badge-tag badge-tag-sm"
            style={{
              background: activeTab === 'tree' ? 'var(--primary)' : '#E2E8F0',
              color: activeTab === 'tree' ? '#FFFFFF' : '#475569',
              fontSize: '11px',
              padding: '1px 6px',
            }}
          >
            {allMatrixRows.length} Items
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('access')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'access' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeTab === 'access' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'access' ? 700 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Building2 size={16} />
          <span>Applications & Access</span>
          <span
            className="badge-tag badge-tag-sm"
            style={{
              background: activeTab === 'access' ? 'var(--primary)' : '#E2E8F0',
              color: activeTab === 'access' ? '#FFFFFF' : '#475569',
              fontSize: '11px',
              padding: '1px 6px',
            }}
          >
            {departments.length} Depts
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('types')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'types' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeTab === 'types' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'types' ? 700 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <FileText size={16} />
          <span>Ticket Types</span>
          <span
            className="badge-tag badge-tag-sm"
            style={{
              background: activeTab === 'types' ? 'var(--primary)' : '#E2E8F0',
              color: activeTab === 'types' ? '#FFFFFF' : '#475569',
              fontSize: '11px',
              padding: '1px 6px',
            }}
          >
            {ticketTypes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('severity')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'severity' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeTab === 'severity' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'severity' ? 700 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <SlidersHorizontal size={16} />
          <span>Severity & Priority</span>
          <span
            className="badge-tag badge-tag-sm"
            style={{
              background: activeTab === 'severity' ? 'var(--primary)' : '#E2E8F0',
              color: activeTab === 'severity' ? '#FFFFFF' : '#475569',
              fontSize: '11px',
              padding: '1px 6px',
            }}
          >
            P1 - P4
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('statuses')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'statuses' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeTab === 'statuses' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'statuses' ? 700 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Statuses</span>
          <span
            className="badge-tag badge-tag-sm"
            style={{
              background: activeTab === 'statuses' ? 'var(--primary)' : '#E2E8F0',
              color: activeTab === 'statuses' ? '#FFFFFF' : '#475569',
              fontSize: '11px',
              padding: '1px 6px',
            }}
          >
            9 Lifecycle
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CLASSIFICATION TREE & MATRIX (Section 15.1) */}
      {/* ========================================================================= */}
      {activeTab === 'tree' && (
        <div>
          {/* Sub-view switcher: Data Grid vs Hierarchy Tree */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: '9px',
                padding: '3px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '6px 14px',
                  fontSize: '12.5px',
                  fontWeight: viewMode === 'matrix' ? 700 : 500,
                  border: 'none',
                  borderRadius: '6px',
                  background: viewMode === 'matrix' ? 'var(--primary-soft)' : 'transparent',
                  color: viewMode === 'matrix' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setViewMode('matrix')}
                title="Unified Enterprise Data Grid"
              >
                <Table size={15} />
                <span>Unified Data Grid</span>
              </button>

              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '6px 14px',
                  fontSize: '12.5px',
                  fontWeight: viewMode === 'hierarchy' ? 700 : 500,
                  border: 'none',
                  borderRadius: '6px',
                  background: viewMode === 'hierarchy' ? 'var(--primary-soft)' : 'transparent',
                  color: viewMode === 'hierarchy' ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setViewMode('hierarchy')}
                title="Taxonomy Hierarchy Tree"
              >
                <Layers size={15} />
                <span>Hierarchy Tree</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  const firstRow = allMatrixRows[0]
                  if (firstRow) {
                    setRoutingPreviewTarget({
                      main: firstRow.category,
                      sub: firstRow.sub,
                      issueName: firstRow.issue.name,
                      severity: firstRow.issue.autoSeverity,
                      responseHours: firstRow.issue.slaResponseHours,
                      resolutionHours: firstRow.issue.slaResolutionHours,
                      hodLimitHours: firstRow.issue.hodApprovalLimitHours,
                      isCR: !!firstRow.issue.isChangeRequest,
                      technicians: firstRow.technicians,
                    })
                    setShowRoutingPreviewModal(true)
                  }
                }}
              >
                <Eye size={15} /> Preview Routing
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAddMainModal(true)}
              >
                <Plus size={15} /> Add Main Category
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddIssueModal(true)}
              >
                <Plus size={15} /> Add Issue Type
              </button>
            </div>
          </div>

          {/* Operational Metrics Bar */}
          <div
            className="modern-card"
            style={{
              padding: '16px 24px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--primary-soft)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FolderKanban size={22} />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Catalog Coverage
                </span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {classificationTree.length} Main Categories &bull; {classificationTree.reduce((acc, m) => acc + m.subClassifications.length, 0)} Sub-Services
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL RULES</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{allMatrixRows.length}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>P1 CRITICAL</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626' }}>
                  {allMatrixRows.filter((r) => r.issue.autoSeverity === 'Critical').length}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CHANGE REQUESTS</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#7C3AED' }}>
                  {allMatrixRows.filter((r) => r.issue.isChangeRequest).length}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>DESIGNATED TECHS</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#059669' }}>
                  {Array.from(new Set(allMatrixRows.flatMap((r) => r.technicians))).length} Specialists
                </div>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: MATRIX (Unified Data Grid) */}
          {viewMode === 'matrix' && (
            <div className="modern-card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Matrix Filter & Search Bar */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 320px' }}>
                  <div className="search-bar" style={{ width: '100%', maxWidth: '340px' }}>
                    <Search size={15} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Search category, system, issue or engineer..."
                      value={matrixSearch}
                      onChange={(e) => setMatrixSearch(e.target.value)}
                    />
                    {matrixSearch && (
                      <button
                        type="button"
                        onClick={() => setMatrixSearch('')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={14} color="var(--text-muted)" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <select
                    className="form-input-control"
                    style={{ width: 'auto', minWidth: '160px', padding: '7px 12px', fontSize: '12.5px' }}
                    value={matrixCategoryFilter}
                    onChange={(e) => setMatrixCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {classificationTree.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  {/* Severity Filter */}
                  <select
                    className="form-input-control"
                    style={{ width: 'auto', minWidth: '130px', padding: '7px 12px', fontSize: '12.5px' }}
                    value={matrixSeverityFilter}
                    onChange={(e) => setMatrixSeverityFilter(e.target.value)}
                  >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical (P1)</option>
                    <option value="High">High (P2)</option>
                    <option value="Medium">Medium (P3)</option>
                    <option value="Low">Low (P4)</option>
                  </select>

                  {/* Workflow Path Filter */}
                  <select
                    className="form-input-control"
                    style={{ width: 'auto', minWidth: '130px', padding: '7px 12px', fontSize: '12.5px' }}
                    value={matrixWorkflowFilter}
                    onChange={(e) => setMatrixWorkflowFilter(e.target.value)}
                  >
                    <option value="All">All Workflows</option>
                    <option value="Standard">Standard Tickets</option>
                    <option value="Change Request">Change Requests</option>
                  </select>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  Showing <strong>{filteredMatrixRows.length}</strong> of {allMatrixRows.length} rules
                </div>
              </div>

              {/* Data Table */}
              <div className="table-responsive-container">
                <table className="custom-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Category &rarr; Sub-Service</th>
                      <th style={{ width: '24%' }}>Catalog Issue Type</th>
                      <th style={{ width: '18%' }}>Designated Techs (1 or 2)</th>
                      <th style={{ width: '10%' }}>Auto Severity</th>
                      <th style={{ width: '8%', textAlign: 'center' }}>Resp / Resol</th>
                      <th style={{ width: '8%', textAlign: 'center' }}>HOD Limit</th>
                      <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMatrixRows.map((r) => {
                      const hasIncompleteTechs = !r.technicians || r.technicians.length === 0
                      return (
                        <tr
                          key={`${r.category}-${r.sub}-${r.issue.name}`}
                          style={{
                            background: r.issue.isChangeRequest ? '#FAF5FF' : undefined,
                            borderLeft: hasIncompleteTechs ? '3px solid #DC2626' : undefined,
                          }}
                        >
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {r.category}
                              </span>
                              <strong style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                                {r.sub}
                              </strong>
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                                {r.issue.name}
                              </strong>
                              {r.issue.isChangeRequest && (
                                <span
                                  className="badge-tag"
                                  style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: '10.5px' }}
                                >
                                  CR
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Workflow: {r.issue.isChangeRequest ? 'Change Request (Draft)' : 'Standard Published'}
                            </span>
                          </td>

                          <td>
                            {hasIncompleteTechs ? (
                              <span style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600 }}>
                                ⚠️ 0 Techs Assigned
                              </span>
                            ) : (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {r.technicians.map((t) => (
                                  <span
                                    key={t}
                                    className="badge-tag"
                                    style={{
                                      background: '#EEF4FF',
                                      color: '#2563EB',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          <td>
                            <span
                              className={`badge-tag badge-severity-${r.issue.autoSeverity.toLowerCase()}`}
                            >
                              {r.issue.autoSeverity}
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                              {r.issue.slaResponseHours}h / {r.issue.slaResolutionHours}h
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>SLA target</span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#D97706' }}>
                              {r.issue.hodApprovalLimitHours}h
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '5px',
                                  color: 'var(--text-muted)',
                                }}
                                onClick={() => {
                                  setRoutingPreviewTarget({
                                    main: r.category,
                                    sub: r.sub,
                                    issueName: r.issue.name,
                                    severity: r.issue.autoSeverity,
                                    responseHours: r.issue.slaResponseHours,
                                    resolutionHours: r.issue.slaResolutionHours,
                                    hodLimitHours: r.issue.hodApprovalLimitHours,
                                    isCR: !!r.issue.isChangeRequest,
                                    technicians: r.technicians,
                                  })
                                  setShowRoutingPreviewModal(true)
                                }}
                                title="Preview live ticket routing"
                              >
                                <Eye size={15} />
                              </button>

                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '5px',
                                  color: 'var(--text-muted)',
                                }}
                                onClick={() =>
                                  setEditingIssue({
                                    mainName: r.category,
                                    subName: r.sub,
                                    issue: { ...r.issue },
                                  })
                                }
                                title="Edit SLA & Rules"
                              >
                                <Edit2 size={15} />
                              </button>

                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '5px',
                                  color: '#EF4444',
                                }}
                                onClick={() =>
                                  handleDeleteIssueType(r.category, r.sub, r.issue.name)
                                }
                                title="Delete catalog issue"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: HIERARCHY TREE */}
          {viewMode === 'hierarchy' && (
            <div className="layout-split-view">
              {/* Left Column: Category Hierarchy Tree */}
              <div className="modern-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                    Taxonomy Hierarchy
                  </h3>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ height: '30px', fontSize: '11.5px', padding: '0 10px' }}
                    onClick={() => setShowAddMainModal(true)}
                  >
                    <Plus size={13} /> Main
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {classificationTree.map((main) => {
                    const isMainSelected = main.name === selectedMain
                    return (
                      <div
                        key={main.name}
                        style={{
                          border: `1.5px solid ${isMainSelected ? 'var(--primary)' : 'var(--border)'}`,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: isMainSelected ? 'var(--surface-subtle)' : '#FFFFFF',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setSelectedMain(main.name)
                            if (main.subClassifications.length > 0) {
                              setSelectedSub(main.subClassifications[0].name)
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FolderKanban
                              size={16}
                              color={isMainSelected ? 'var(--primary)' : 'var(--text-muted)'}
                            />
                            <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                              {main.name}
                            </strong>
                          </div>
                          <span
                            className="badge-tag"
                            style={{
                              background: '#E2E8F0',
                              color: '#475569',
                              fontSize: '11px',
                              padding: '2px 6px',
                            }}
                          >
                            {main.subClassifications.length} subs
                          </span>
                        </div>

                        {/* Sub-classifications list */}
                        {isMainSelected && (
                          <div
                            style={{
                              padding: '6px 12px 10px',
                              background: '#FFFFFF',
                              borderTop: '1px solid var(--border)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                            }}
                          >
                            {main.subClassifications.map((sub) => {
                              const isSubSelected = sub.name === selectedSub
                              const hasNoTechs = !sub.technicians || sub.technicians.length === 0
                              return (
                                <div
                                  key={sub.name}
                                  style={{
                                    padding: '8px 12px',
                                    borderRadius: '7px',
                                    background: isSubSelected ? 'var(--primary-soft)' : 'transparent',
                                    color: isSubSelected ? 'var(--primary)' : 'var(--text-main)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    fontSize: '12.5px',
                                    fontWeight: isSubSelected ? 700 : 500,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedSub(sub.name)
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ChevronRight size={14} />
                                    <span>{sub.name}</span>
                                    {hasNoTechs && (
                                      <span style={{ color: '#DC2626', fontSize: '11px' }}>⚠️</span>
                                    )}
                                  </div>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    {sub.issueTypes.length} issues
                                  </span>
                                </div>
                              )
                            })}

                            <button
                              type="button"
                              style={{
                                marginTop: '4px',
                                padding: '6px 10px',
                                background: 'transparent',
                                border: '1px dashed var(--border)',
                                borderRadius: '6px',
                                color: 'var(--primary)',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                              }}
                              onClick={() => setShowAddSubModal(true)}
                            >
                              <Plus size={13} /> Add sub-category under {main.name}...
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Active Sub-Classification Configuration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {activeSub ? (
                  <>
                    {/* Designated Technicians Card (Section 4 Rule: 1 or 2 Technicians) */}
                    <div className="modern-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div>
                          <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: 600 }}>
                            {selectedMain} &rarr; Sub-Classification: {selectedSub}
                          </div>
                          <h3 style={{ margin: '3px 0 0', fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {selectedSub} Configuration
                          </h3>
                        </div>

                        <button
                          type="button"
                          className="btn-primary"
                          style={{ height: '32px', fontSize: '12px' }}
                          onClick={() => setShowAddIssueModal(true)}
                        >
                          <Plus size={14} /> Add Issue Type
                        </button>
                      </div>

                      {/* Designated Technicians Panel */}
                      <div
                        style={{
                          background: 'var(--surface-subtle)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          padding: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserCheck size={16} color="var(--primary)" />
                            <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                              Designated Technicians for Auto-Assignment
                            </strong>
                          </div>
                          <span
                            className="badge-tag"
                            style={{
                              background: activeSub.technicians.length === 0 ? '#FEF2F2' : '#EEF4FF',
                              color: activeSub.technicians.length === 0 ? '#DC2626' : '#2563EB',
                              fontSize: '11px',
                            }}
                          >
                            {activeSub.technicians.length} of 2 Assigned
                          </span>
                        </div>

                        <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          Every ticket raised under {selectedSub} is automatically assigned to these engineers. UFC rules allow <strong>one or two technicians</strong> per sub-classification.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {activeSub.technicians.map((tech) => (
                            <div
                              key={tech}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: '#FFFFFF',
                                border: '1.5px solid var(--border)',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                boxShadow: 'var(--shadow-xs)',
                              }}
                            >
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: 'var(--primary-soft)',
                                  color: 'var(--primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                }}
                              >
                                {tech
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <div>
                                <strong style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
                                  {tech}
                                </strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  Primary Auto-Assignee
                                </div>
                              </div>
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px',
                                  color: '#94A3B8',
                                  marginLeft: '6px',
                                }}
                                onClick={() => handleRemoveTechnicianFromActiveSub(tech)}
                                title="Remove technician"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}

                          {activeSub.technicians.length < 2 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <select
                                className="form-input-control"
                                style={{ height: '38px', fontSize: '12px', width: 'auto' }}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAddTechnicianToActiveSub(e.target.value)
                                    e.target.value = ''
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  + Assign designated IT specialist...
                                </option>
                                {availableITStaff
                                  .filter((staff) => !activeSub.technicians.includes(staff.name))
                                  .map((staff) => (
                                    <option key={staff.name} value={staff.name}>
                                      {staff.name} &bull; {staff.title}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Issue Types & SLA Matrix under Active Sub */}
                    <div className="modern-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Configured Issue Types & SLA Matrix ({activeSub.issueTypes.length})
                          </h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Faster SLAs apply for disruptive events (e.g. login failures) vs standard changes.
                          </span>
                        </div>
                      </div>

                      <div className="table-responsive-container">
                        <table className="custom-data-table">
                          <thead>
                            <tr>
                              <th>Configured Issue Type</th>
                              <th>Auto-Severity</th>
                              <th style={{ textAlign: 'center' }}>Response SLA</th>
                              <th style={{ textAlign: 'center' }}>Resolution SLA</th>
                              <th style={{ textAlign: 'center' }}>HOD Approval Limit</th>
                              <th style={{ textAlign: 'center' }}>Workflow Path</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeSub.issueTypes.map((issue) => (
                              <tr key={issue.name}>
                                <td>
                                  <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                                    {issue.name}
                                  </strong>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    Auto-routes to: {activeSub.technicians.join(' & ')}
                                  </div>
                                </td>

                                <td>
                                  <span
                                    className={`badge-tag badge-severity-${issue.autoSeverity.toLowerCase()}`}
                                  >
                                    {issue.autoSeverity}
                                  </span>
                                </td>

                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                      type="number"
                                      step="0.5"
                                      min="0.25"
                                      className="form-input-control"
                                      style={{ width: '56px', textAlign: 'center', padding: '4px' }}
                                      value={issue.slaResponseHours}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0.5
                                        const updated = classificationTree.map((main) => {
                                          if (main.name !== selectedMain) return main
                                          return {
                                            ...main,
                                            subClassifications: main.subClassifications.map((s) => {
                                              if (s.name !== selectedSub) return s
                                              return {
                                                ...s,
                                                issueTypes: s.issueTypes.map((it) =>
                                                  it.name === issue.name ? { ...it, slaResponseHours: val } : it
                                                ),
                                              }
                                            }),
                                          }
                                        })
                                        onUpdateClassificationTree(updated)
                                        setHasUnsavedChanges(true)
                                      }}
                                    />
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hrs</span>
                                  </div>
                                </td>

                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                      type="number"
                                      step="0.5"
                                      min="0.5"
                                      className="form-input-control"
                                      style={{ width: '56px', textAlign: 'center', padding: '4px' }}
                                      value={issue.slaResolutionHours}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 1
                                        const updated = classificationTree.map((main) => {
                                          if (main.name !== selectedMain) return main
                                          return {
                                            ...main,
                                            subClassifications: main.subClassifications.map((s) => {
                                              if (s.name !== selectedSub) return s
                                              return {
                                                ...s,
                                                issueTypes: s.issueTypes.map((it) =>
                                                  it.name === issue.name ? { ...it, slaResolutionHours: val } : it
                                                ),
                                              }
                                            }),
                                          }
                                        })
                                        onUpdateClassificationTree(updated)
                                        setHasUnsavedChanges(true)
                                      }}
                                    />
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hrs</span>
                                  </div>
                                </td>

                                <td style={{ textAlign: 'center' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                      type="number"
                                      step="0.5"
                                      min="0.5"
                                      className="form-input-control"
                                      style={{ width: '56px', textAlign: 'center', padding: '4px' }}
                                      value={issue.hodApprovalLimitHours}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 2
                                        const updated = classificationTree.map((main) => {
                                          if (main.name !== selectedMain) return main
                                          return {
                                            ...main,
                                            subClassifications: main.subClassifications.map((s) => {
                                              if (s.name !== selectedSub) return s
                                              return {
                                                ...s,
                                                issueTypes: s.issueTypes.map((it) =>
                                                  it.name === issue.name ? { ...it, hodApprovalLimitHours: val } : it
                                                ),
                                              }
                                            }),
                                          }
                                        })
                                        onUpdateClassificationTree(updated)
                                        setHasUnsavedChanges(true)
                                      }}
                                    />
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>hrs</span>
                                  </div>
                                </td>

                                <td style={{ textAlign: 'center' }}>
                                  <span
                                    className="badge-tag"
                                    style={{
                                      background: issue.isChangeRequest ? '#F3E8FF' : '#F1F5F9',
                                      color: issue.isChangeRequest ? '#7C3AED' : '#475569',
                                      fontSize: '11px',
                                    }}
                                  >
                                    {issue.isChangeRequest ? 'Change Request' : 'Standard'}
                                  </span>
                                </td>

                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                    <button
                                      type="button"
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        color: 'var(--text-muted)',
                                      }}
                                      onClick={() => {
                                        setRoutingPreviewTarget({
                                          main: selectedMain,
                                          sub: selectedSub,
                                          issueName: issue.name,
                                          severity: issue.autoSeverity,
                                          responseHours: issue.slaResponseHours,
                                          resolutionHours: issue.slaResolutionHours,
                                          hodLimitHours: issue.hodApprovalLimitHours,
                                          isCR: !!issue.isChangeRequest,
                                          technicians: activeSub.technicians,
                                        })
                                        setShowRoutingPreviewModal(true)
                                      }}
                                      title="Preview routing"
                                    >
                                      <Eye size={14} />
                                    </button>

                                    <button
                                      type="button"
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        color: '#EF4444',
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="modern-card" style={{ padding: '40px', textAlign: 'center' }}>
                    <AlertTriangle size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: 'var(--text-main)' }}>
                      No sub-classification selected
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                      Select a category and sub-service on the left or create a new one to begin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: APPLICATIONS & ACCESS ENTITLEMENT MATRIX (Section 15.2) */}
      {/* ========================================================================= */}
      {activeTab === 'access' && (
        <div>
          {/* Header Banner & Context */}
          <div
            className="modern-card"
            style={{
              padding: '18px 22px',
              marginBottom: '20px',
              background: '#FFFFFF',
              borderLeft: '4px solid var(--primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Department-to-Application Entitlement Matrix (Role-Based Visibility)
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Section 5 Rule: When an end user creates a ticket, cascading application and sub-classification dropdowns only display systems that their department is entitled to access. Changes take effect across user sessions immediately.
                </p>
              </div>

              <div className="search-bar" style={{ width: '260px', flexShrink: 0 }}>
                <Search size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Filter departments..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                />
                {deptSearch && (
                  <button
                    type="button"
                    onClick={() => setDeptSearch('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={14} color="var(--text-muted)" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Entitlement Grid Table */}
          <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive-container">
              <table className="custom-data-table" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ width: '22%', position: 'sticky', left: 0, background: '#F8FAFC', zIndex: 2 }}>
                      Department & Head (HOD)
                    </th>
                    {ALL_SYSTEM_APPLICATIONS.map((app) => {
                      const allDeptsHaveApp = departments.every((d) =>
                        d.assignedApplications.includes(app)
                      )
                      return (
                        <th
                          key={app}
                          style={{
                            textAlign: 'center',
                            minWidth: '120px',
                            padding: '12px 8px',
                            fontSize: '11.5px',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <span>{app}</span>
                            <button
                              type="button"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '10px',
                                color: 'var(--primary)',
                                textDecoration: 'underline',
                                padding: 0,
                              }}
                              onClick={() => {
                                if (allDeptsHaveApp) {
                                  handleColumnDeselectAll(app)
                                } else {
                                  handleColumnSelectAll(app)
                                }
                              }}
                            >
                              {allDeptsHaveApp ? 'Deselect Col' : 'Select Col'}
                            </button>
                          </div>
                        </th>
                      )
                    })}
                    <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepts.map((dept) => {
                    const permittedCount = dept.assignedApplications.length
                    const allPermitted = permittedCount === ALL_SYSTEM_APPLICATIONS.length
                    return (
                      <tr key={dept.name}>
                        <td style={{ position: 'sticky', left: 0, background: '#FFFFFF', zIndex: 1 }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                              {dept.name}
                            </strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              HOD: {dept.hodName} ({dept.hodEmail})
                            </span>
                            <div style={{ marginTop: '4px' }}>
                              <span
                                className="badge-tag badge-tag-sm"
                                style={{
                                  background: permittedCount > 0 ? '#EEF4FF' : '#FEF2F2',
                                  color: permittedCount > 0 ? '#2563EB' : '#DC2626',
                                  fontSize: '10.5px',
                                }}
                              >
                                {permittedCount} of {ALL_SYSTEM_APPLICATIONS.length} Allowed
                              </span>
                            </div>
                          </div>
                        </td>

                        {ALL_SYSTEM_APPLICATIONS.map((app) => {
                          const isAssigned = dept.assignedApplications.includes(app)
                          return (
                            <td
                              key={app}
                              style={{
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                background: isAssigned ? '#F0FDF4' : 'transparent',
                              }}
                            >
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '6px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                onClick={() => handleToggleDepartmentApp(dept.name, app)}
                                title={`${isAssigned ? 'Revoke' : 'Grant'} ${app} access for ${dept.name}`}
                              >
                                {isAssigned ? (
                                  <CheckSquare size={18} color="#059669" />
                                ) : (
                                  <Square size={18} color="#CBD5E1" />
                                )}
                              </button>
                            </td>
                          )
                        })}

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <button
                              type="button"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '11px',
                                color: 'var(--primary)',
                                textDecoration: 'underline',
                                padding: 0,
                              }}
                              onClick={() => {
                                if (allPermitted) {
                                  handleRowDeselectAll(dept.name)
                                } else {
                                  handleRowSelectAll(dept.name)
                                }
                              }}
                            >
                              {allPermitted ? 'Deselect Row' : 'Select All Row'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TICKET TYPES & WORKFLOW TEMPLATES (Section 15.3) */}
      {/* ========================================================================= */}
      {activeTab === 'types' && (
        <div>
          {/* Top Banner explaining Type vs Classification separation */}
          <div
            className="modern-card"
            style={{
              padding: '18px 22px',
              marginBottom: '20px',
              background: '#FFFFFF',
              borderLeft: '4px solid #7C3AED',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Ticket Types & Associated Workflow Templates (Section 4 Architecture)
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Ticket type and classification are separate dimensions. Example: Type = Incident, Main = Applications, Sub = Flexcube, Issue = Login not working. <strong>Type decides which workflow template runs.</strong> The classification tree decides assignee, SLA, and auto-severity.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddTypeModal(true)}
              >
                <Plus size={15} /> Add Ticket Type
              </button>
            </div>
          </div>

          {/* Ticket Types Table */}
          <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Ticket Type Name & Code</th>
                    <th style={{ width: '32%' }}>Description & Use Case</th>
                    <th style={{ width: '22%' }}>Associated Workflow Template</th>
                    <th style={{ width: '12%', textAlign: 'center' }}>Default Priority</th>
                    <th style={{ width: '12%', textAlign: 'center' }}>Active Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketTypes.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className="badge-tag"
                            style={{
                              background: t.id === 'Change Request' ? '#F3E8FF' : '#EEF4FF',
                              color: t.id === 'Change Request' ? '#7C3AED' : '#2563EB',
                              fontWeight: 700,
                              fontSize: '11px',
                            }}
                          >
                            {t.code || t.id.slice(0, 3).toUpperCase()}
                          </span>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>
                            {t.name}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          {t.description}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Layers size={14} color="var(--primary)" />
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {t.defaultWorkflow}
                          </span>
                        </div>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <span
                          className="badge-tag"
                          style={{
                            background: t.defaultPriority === 'Urgent' ? '#FEF2F2' : '#F1F5F9',
                            color: t.defaultPriority === 'Urgent' ? '#DC2626' : '#475569',
                            fontSize: '11.5px',
                          }}
                        >
                          {t.defaultPriority || 'Normal'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: t.active !== false ? '#DCFCE7' : '#F1F5F9',
                            color: t.active !== false ? '#15803D' : '#64748B',
                          }}
                          onClick={() => handleToggleTypeActive(t.id)}
                        >
                          {t.active !== false ? 'Active' : 'Disabled'}
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

      {/* ========================================================================= */}
      {/* TAB 4: SEVERITY & PRIORITY (Section 15.4) */}
      {/* ========================================================================= */}
      {activeTab === 'severity' && (
        <div>
          {/* Important Principle Banner */}
          <div
            className="modern-card"
            style={{
              padding: '18px 22px',
              marginBottom: '20px',
              background: '#FFFFFF',
              borderLeft: '4px solid #D97706',
            }}
          >
            <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
              Severity vs Priority Architecture (Section 2 & 5 Core Principles)
            </h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Severity</strong> is an objective measure of system impact auto-calculated from the issue type configuration. End users can never edit severity. <strong>Priority</strong> is a subjective measure of business urgency that can only be manually set or overridden by permitted IT staff (Technicians, Admin Team).
            </p>
          </div>

          <div className="layout-split-view">
            {/* Left: Severity Levels (P1 - P4) */}
            <div className="modern-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Auto-Severity Matrix (Impact-Based)
                </h4>
                <span className="badge-tag" style={{ background: '#FEF3C7', color: '#B45309', fontSize: '11px' }}>
                  Auto-Calculated
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {severitySettings.map((sev, idx) => (
                  <div
                    key={sev.level}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '14px',
                      background: sev.bg,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Flame size={16} color={sev.color} />
                        <strong style={{ fontSize: '13.5px', color: sev.color }}>
                          {sev.level}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                        <span>
                          Resp: <strong>{sev.defaultResponseHours}h</strong>
                        </span>
                        <span>
                          Resol: <strong>{sev.defaultResolutionHours}h</strong>
                        </span>
                      </div>
                    </div>

                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {sev.definition}
                    </p>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      <strong>Scope:</strong> {sev.scope}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Priority Levels (Urgency / Override) */}
            <div className="modern-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Operational Priority Levels (Urgency-Based)
                </h4>
                <span className="badge-tag" style={{ background: '#EEF4FF', color: '#2563EB', fontSize: '11px' }}>
                  IT Role Override Only
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '13px', color: '#DC2626' }}>Urgent Priority</strong>
                    <span className="badge-tag" style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '10.5px' }}>
                      Immediate Queue Jump
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Immediate operational necessity. Escalates the ticket to the top of all technician workbenches regardless of creation timestamp.
                  </p>
                </div>

                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '13px', color: '#EA580C' }}>High Priority</strong>
                    <span className="badge-tag" style={{ background: '#FFF7ED', color: '#EA580C', fontSize: '10.5px' }}>
                      Accelerated
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    High business impact, prioritizing work ahead of standard tickets to ensure compliance with strict SLA thresholds.
                  </p>
                </div>

                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '13px', color: '#0284C7' }}>Normal Priority (Default)</strong>
                    <span className="badge-tag" style={{ background: '#E0F2FE', color: '#0284C7', fontSize: '10.5px' }}>
                      Standard Queue
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Standard processing order. Handled under normal dispatch order and standard published SLA timelines.
                  </p>
                </div>

                <div
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '14px',
                    background: '#FFFFFF',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '13px', color: '#64748B' }}>Low Priority</strong>
                    <span className="badge-tag" style={{ background: '#F1F5F9', color: '#64748B', fontSize: '10.5px' }}>
                      Discretionary
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Minor operational impact or planned future tasks. Technicians service these during low-load intervals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: LIFECYCLE STATUSES (Section 15.5) */}
      {/* ========================================================================= */}
      {activeTab === 'statuses' && (
        <div>
          {/* Status Header Banner & Category Filter */}
          <div
            className="modern-card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                The 9 Standard Lifecycle Statuses (Section 15.5)
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Each status defines SLA clock behavior, category assignment, terminal closure rules, and reopen eligibility.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['All', 'Open', 'In Progress', 'Waiting', 'Closed'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '12px',
                    fontWeight: statusCategoryFilter === cat ? 700 : 500,
                    background: statusCategoryFilter === cat ? 'var(--primary-soft)' : '#FFFFFF',
                    color: statusCategoryFilter === cat ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setStatusCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Statuses Data Table */}
          <div className="modern-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Status Name & Token</th>
                    <th style={{ width: '14%' }}>Category</th>
                    <th style={{ width: '12%', textAlign: 'center' }}>Terminal Flag</th>
                    <th style={{ width: '14%', textAlign: 'center' }}>Allow Reopen</th>
                    <th style={{ width: '16%' }}>SLA Clock Behavior</th>
                    <th style={{ width: '22%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStatuses.map((st) => (
                    <tr key={st.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: st.color,
                              flexShrink: 0,
                            }}
                          />
                          <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                            {st.name}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span
                          className="badge-tag"
                          style={{
                            background:
                              st.category === 'Closed'
                                ? '#F1F5F9'
                                : st.category === 'Waiting'
                                ? '#FEF3C7'
                                : st.category === 'In Progress'
                                ? '#E0F2FE'
                                : '#EEF4FF',
                            color:
                              st.category === 'Closed'
                                ? '#475569'
                                : st.category === 'Waiting'
                                ? '#B45309'
                                : st.category === 'In Progress'
                                ? '#0369A1'
                                : '#1D4ED8',
                            fontSize: '11px',
                          }}
                        >
                          {st.category}
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        {st.terminal ? (
                          <span className="badge-tag" style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px' }}>
                            Yes (Terminal)
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No</span>
                        )}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        {st.allowReopen ? (
                          <span className="badge-tag" style={{ background: '#DCFCE7', color: '#15803D', fontSize: '11px' }}>
                            Eligible for Reopen
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Locked</span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color={st.category === 'Waiting' ? '#D97706' : '#2563EB'} />
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {st.category === 'Waiting'
                              ? 'Paused (Waiting on Actor)'
                              : st.terminal
                              ? 'Stopped (Permanently Closed)'
                              : 'Active (Ticking)'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {st.desc}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROUTING PREVIEW MODAL (Section 5 & 15.1) */}
      {/* ========================================================================= */}
      {showRoutingPreviewModal && routingPreviewTarget && (
        <div className="modal-dialog-backdrop">
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
        <div className="modal-dialog-backdrop">
          <div className="modal-dialog-box">
            <div className="modal-dialog-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Add Main Classification Category
              </h3>
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
                    Category Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder="e.g. Cloud Infrastructure, Database Services, Cyber Security"
                    value={newMainName}
                    onChange={(e) => setNewMainName(e.target.value)}
                  />
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
                  Create Main Category
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
        <div className="modal-dialog-backdrop">
          <div className="modal-dialog-box">
            <div className="modal-dialog-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Add Sub-Classification under {selectedMain}
              </h3>
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
                    Sub-Service / Application Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder="e.g. Oracle Database Engine, Firewall Gateway, Active Directory"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                  />
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
      {showAddIssueModal && (
        <div className="modal-dialog-backdrop">
          <div className="modal-dialog-box" style={{ maxWidth: '520px' }}>
            <div className="modal-dialog-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Add Catalog Issue Type & Tune SLA
              </h3>
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
                    Issue Type Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input-control"
                    placeholder="e.g. Application not opening, Password reset, Transaction timeout"
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
                      onChange={(e) => setNewIssueIsCR(e.target.checked)}
                    />
                    <span>Classify as Change Request (Requires CAB / Management Review & Testing)</span>
                  </label>
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
        <div className="modal-dialog-backdrop">
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
                          },
                        })
                      }
                    />
                    <span>Flag as Change Request (Requires Testing & CAB Review)</span>
                  </label>
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
      {/* ADD TICKET TYPE MODAL (TAB 3) */}
      {/* ========================================================================= */}
      {showAddTypeModal && (
        <div className="modal-dialog-backdrop">
          <div className="modal-dialog-box">
            <div className="modal-dialog-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Add New Ticket Type
              </h3>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px', border: 'none' }}
                onClick={() => setShowAddTypeModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicketType}>
              <div className="modal-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label-control">
                      Type Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input-control"
                      placeholder="e.g. Vulnerability Remediation"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label-control">
                      Code <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input-control"
                      placeholder="e.g. VUL"
                      value={newTypeCode}
                      onChange={(e) => setNewTypeCode(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label-control">Associated Workflow Template</label>
                  <select
                    className="form-input-control"
                    value={newTypeWorkflow}
                    onChange={(e) => setNewTypeWorkflow(e.target.value)}
                  >
                    <option value="Standard Ticket Workflow (Published)">Standard Ticket Workflow (Published)</option>
                    <option value="Change Request Workflow (Draft)">Change Request Workflow (Draft)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label-control">Default Priority</label>
                  <select
                    className="form-input-control"
                    value={newTypePriority}
                    onChange={(e) => setNewTypePriority(e.target.value)}
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="form-label-control">Description</label>
                  <textarea
                    rows={3}
                    className="form-input-control"
                    placeholder="Describe when this ticket type should be selected..."
                    value={newTypeDesc}
                    onChange={(e) => setNewTypeDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddTypeModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Ticket Type
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
        <div className="modal-dialog-backdrop">
          <div className="modal-dialog-box" style={{ maxWidth: '640px' }}>
            <div className="modal-dialog-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-main)' }}>
                  ITSM Catalog Data Dumps & Presets
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
                          Banking Core & Scope of Work Matrix
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
                      onClick={() => handleLoadPreset(BANKING_CORE_PRESET, 'Banking Core & Scope of Work')}
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
