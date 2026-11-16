export const roles = [
  'End User',
  'Technician',
  'HOD',
  'Admin Team',
  'Management',
  'Testing Team',
  'External Vendor',
  'Other Departments',
] as const

export type Role = (typeof roles)[number]

export type TicketStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Admin Review'
  | 'Assigned'
  | 'In Progress'
  | 'Awaiting Clarification'
  | 'Management Approval'
  | 'In Testing'
  | 'Resolved'
  | 'Closed'
  | 'Reopened'
  | 'Rejected'

/** Severity id from the Severity master (Critical, High, Medium, Low by default) */
export type TicketSeverity = string
export type TicketType = 'Incident' | 'Service Request' | 'Issue' | 'Change Request'
/** Priority id from the Priority master (P1 to P4 by default) */
export type TicketPriority = string

export interface DynamicQuestion {
  id: string
  label: string
  type: 'text' | 'number' | 'dropdown' | 'attachment'
  options?: string[]
  required: boolean
  placeholder?: string
}

export interface IssueTypeConfig {
  name: string
  autoSeverity: TicketSeverity
  slaResponseHours: number
  slaResolutionHours: number
  hodApprovalLimitHours: number
  /** SLA policy from the SLA master. The hour fields above are kept in step with it. */
  slaPolicyId?: string
  isChangeRequest?: boolean
  crRequiresHodApproval?: boolean // Configures whether HOD approval is required for this Change Request (defaults to true)
}

export interface SubClassificationConfig {
  name: string
  technicians: string[]
  issueTypes: IssueTypeConfig[]
}

export interface ClassificationConfig {
  name: string
  iconName: string
  subClassifications: SubClassificationConfig[]
}

export interface TicketTimelineItem {
  id: string
  time: string
  user: string
  role?: string
  action: string
  note?: string
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'purple'
}

export interface ClarificationItem {
  id: string
  from: string
  to: string
  targetRole: string
  message: string
  time: string
  response?: string
  responder?: string
  responseTime?: string
}

export interface Ticket {
  id: string
  subject: string
  description: string
  type: TicketType
  app: string
  classification: string
  subClassification: string
  issueType: string
  severity: TicketSeverity
  priority: TicketPriority
  status: TicketStatus
  department: string
  creator: string
  creatorRole: string
  creatorAvatar: string
  assignee: string
  assigneeRole?: string
  coAssignee?: string
  vendor?: string
  tester?: string
  sla: string
  slaTimeRemaining: string
  slaBreached: boolean
  hodTimeRemaining?: string
  created: string
  eta?: string
  dueDate?: string
  resolutionSummary?: string
  rootCause?: string
  resolutionTime?: string
  closureRemarks?: string
  rating?: number
  dynamicFields: Record<string, string>
  timeline: TicketTimelineItem[]
  clarifications: ClarificationItem[]
  /** Change Request stage: Admin review, HOD approval (if switched on), Management, implementation, testing */
  crStage?: 'Admin' | 'HOD' | 'Management' | 'Implementation' | 'Testing'
  /** Whether this Change Request needs HOD approval (configurable per issue type) */
  crRequiresHod?: boolean
  /** Set when the HOD did not approve a ticket and it was forwarded to Admin */
  hodRejection?: {
    by: string
    reason: string
    category: string
    time: string
  }
  createdAt?: number
  /** Severity, priority and SLA as they were when the ticket was raised */
  slaSnapshot?: SlaSnapshot
  /** Epoch ms when the HOD approval time limit runs out */
  hodDeadline?: number
  hodExpiredNotified?: boolean
  resolvedAt?: number
  unclosedReminderSent?: boolean
  referral?: {
    department: string
    reason: string
    referredBy: string
    time: string
    /** Status to return to once the department answers */
    previousStatus?: TicketStatus
    response?: string
    responder?: string
    responseTime?: string
  }
  testResults?: {
    tester: string
    status: 'Passed' | 'Failed'
    environment: string
    notes: string
    time: string
  }
}

export const usersByRole: Record<Role, { name: string; title: string; dept: string; initials: string; avatarColor: string }> = {
  'End User': {
    name: 'Tariq Bello',
    title: 'Digital Banking Officer',
    dept: 'Digital Banking',
    initials: 'TB',
    avatarColor: 'blue',
  },
  'Technician': {
    name: 'Daniel Mensah',
    title: 'Senior Support Engineer (L2)',
    dept: 'Infrastructure & Core',
    initials: 'DM',
    avatarColor: 'indigo',
  },
  'HOD': {
    name: 'Grace Nsubuga',
    title: 'Head of Department (Core and Digital Banking)',
    dept: 'Core Banking',
    initials: 'GN',
    avatarColor: 'emerald',
  },
  'Admin Team': {
    name: 'Amara Okafor',
    title: 'Service Desk Lead & Administrator',
    dept: 'IT Service Management',
    initials: 'AO',
    avatarColor: 'purple',
  },
  'Management': {
    name: 'Khalfan Al-Busaidi',
    title: 'VP of Operations & Technology',
    dept: 'Executive Management',
    initials: 'KB',
    avatarColor: 'amber',
  },
  'Testing Team': {
    name: 'Fatima Al-Zadjali',
    title: 'Lead QA & UAT Engineer',
    dept: 'Quality Assurance',
    initials: 'FZ',
    avatarColor: 'rose',
  },
  'External Vendor': {
    name: 'TechServe Support Lead',
    title: 'Authorized Vendor Representative',
    dept: 'TechServe Ltd',
    initials: 'TS',
    avatarColor: 'teal',
  },
  'Other Departments': {
    name: 'Hassan Qureshi',
    title: 'Operations Manager (clarifications only)',
    dept: 'Operations',
    initials: 'HQ',
    avatarColor: 'blue',
  },
}

export const departmentsList = [
  'Core Banking',
  'Digital Banking',
  'Infrastructure',
  'Security & Compliance',
  'Finance & Risk',
  'Operations',
  'People & Talent',
  'Business Development',
]

export const applicationQuestionnaires: Record<string, DynamicQuestion[]> = {
  'Pro People': [
    { id: 'ppEmployeeId', label: 'Employee ID / Staff Number', type: 'text', required: true, placeholder: 'e.g. UFC-0482' },
    { id: 'ppModule', label: 'HR Module', type: 'dropdown', options: ['Payroll & Payslips', 'Leave & Attendance', 'Performance Appraisal', 'Employee Profile / Self-Service', 'Recruitment'], required: true },
    { id: 'ppErrorCode', label: 'Screen Error / Message', type: 'text', required: false, placeholder: 'e.g. Session timeout or permission denied' },
  ],
  'Pro Biz': [
    { id: 'pbModule', label: 'Business Module', type: 'dropdown', options: ['General Ledger', 'Accounts Payable', 'Fixed Assets', 'Budgeting & Approvals'], required: true },
    { id: 'pbBatchId', label: 'Batch / Voucher Number', type: 'text', required: false, placeholder: 'e.g. VCH-2026-8812' },
  ],
  'Pro Pupil': [
    { id: 'pupilId', label: 'Student / Record ID', type: 'text', required: true, placeholder: 'e.g. STU-99214' },
    { id: 'academicYear', label: 'Academic Year / Term', type: 'text', required: false, placeholder: 'e.g. 2026/2027 Term 1' },
  ],
  'Laptops': [
    { id: 'assetTag', label: 'Hardware Asset Tag #', type: 'text', required: true, placeholder: 'e.g. UFC-LPT-2024-091' },
    { id: 'deviceSerial', label: 'Machine Serial Number', type: 'text', required: false, placeholder: 'e.g. 5CD2410M7P' },
    { id: 'location', label: 'Office Floor & Desk Location', type: 'dropdown', options: ['Muscat HQ - 7th Floor', 'Muscat HQ - 8th Floor', 'Salalah Branch', 'Sohar Branch', 'Remote / Work From Home'], required: true },
    { id: 'osVersion', label: 'Operating System & Version', type: 'text', required: true, placeholder: 'e.g. Windows 11 Enterprise 23H2 or macOS Sequoia' },
  ],
  'Flexcube': [
    { id: 'moduleName', label: 'Flexcube Module Name', type: 'dropdown', options: ['Payments', 'Demand Deposits', 'Term Deposits', 'Retail Lending', 'Trade Finance', 'General Ledger'], required: true, placeholder: 'Select affected module' },
    { id: 'errorCode', label: 'Error Code / ORA Exception', type: 'text', required: true, placeholder: 'e.g. FC-ERR-9021 or ORA-01017' },
    { id: 'customerNo', label: 'Customer Account / CIF Number', type: 'text', required: false, placeholder: 'e.g. 021-998341-01' },
    { id: 'environment', label: 'Host Environment', type: 'dropdown', options: ['Production', 'UAT / Staging', 'Disaster Recovery (DR)', 'Sandbox / Dev'], required: true },
    { id: 'transactionRef', label: 'Transaction Reference ID', type: 'text', required: false, placeholder: 'e.g. TXN-202611-94281' },
    { id: 'version', label: 'Flexcube Release Version', type: 'text', required: false, placeholder: 'v14.7.0.2 Patch 3' },
  ],
  'Atomverse': [
    { id: 'channel', label: 'Banking Channel', type: 'dropdown', options: ['iOS App', 'Android App', 'Corporate Web Portal', 'Retail Web Portal'], required: true },
    { id: 'deviceInfo', label: 'Device Model & Operating System', type: 'text', required: true, placeholder: 'e.g. iPhone 15 Pro (iOS 18.2) / Samsung Galaxy S24' },
    { id: 'appVersion', label: 'Atomverse App Build / Release', type: 'text', required: true, placeholder: 'e.g. v3.4.1 (Build 492)' },
    { id: 'customerCif', label: 'Customer Mobile / CIF ID', type: 'text', required: false, placeholder: 'e.g. CIF-884190' },
    { id: 'errorCode', label: 'API Status Code / Error Message', type: 'text', required: false, placeholder: 'e.g. 401 Unauthorized / Token Expired' },
  ],
  'Firewall': [
    { id: 'sourceIp', label: 'Source IP / Subnet', type: 'text', required: true, placeholder: 'e.g. 10.240.12.0/24' },
    { id: 'destinationIp', label: 'Destination IP / Hostname', type: 'text', required: true, placeholder: 'e.g. 192.168.100.45 or api.partner.ufc.om' },
    { id: 'portsProtocol', label: 'Ports & Protocols', type: 'text', required: true, placeholder: 'e.g. TCP 443, 8443, UDP 53' },
    { id: 'businessJustification', label: 'Business & Regulatory Justification', type: 'text', required: true, placeholder: 'Describe the API connection or vendor tunnel' },
    { id: 'changeWindow', label: 'Requested Maintenance Window', type: 'dropdown', options: ['Emergency Out-of-hours', 'Weekend Maintenance (Sat 02:00-06:00)', 'Standard Weekday Night'], required: true },
  ],
  'End User Computing': [
    { id: 'assetTag', label: 'Hardware Asset Tag #', type: 'text', required: true, placeholder: 'e.g. UFC-LPT-2024-091' },
    { id: 'deviceSerial', label: 'Machine Serial Number', type: 'text', required: false, placeholder: 'e.g. 5CD2410M7P' },
    { id: 'location', label: 'Office Floor & Desk Location', type: 'dropdown', options: ['Muscat HQ - 7th Floor', 'Muscat HQ - 8th Floor', 'Salalah Branch', 'Sohar Branch', 'Remote / Work From Home'], required: true },
    { id: 'osVersion', label: 'Operating System & Version', type: 'text', required: true, placeholder: 'e.g. Windows 11 Enterprise 23H2 or macOS Sequoia' },
  ],
  'Network Access': [
    { id: 'connectionType', label: 'Connection Type', type: 'dropdown', options: ['Corporate GlobalProtect VPN', 'Branch Office MPLS', 'HQ Office Wi-Fi (UFC-Corp)', 'Core Data Center LAN'], required: true },
    { id: 'userVpnId', label: 'Active Directory User / VPN ID', type: 'text', required: true, placeholder: 'e.g. tbello@ufc.om' },
    { id: 'frequency', label: 'Disconnection Frequency', type: 'dropdown', options: ['Continuous / Cannot Connect', 'Drops Every 10-15 Minutes', 'Slow Throughput / Latency Spikes'], required: true },
  ],
}

export const COMMON_MASTER_ISSUES = [
  {
    name: 'Login not working',
    autoSeverity: 'Critical' as TicketSeverity,
    slaResponseHours: 0.5,
    slaResolutionHours: 2,
    hodApprovalLimitHours: 1,
    description: 'User cannot authenticate or credentials rejected',
  },
  {
    name: 'Application not opening',
    autoSeverity: 'High' as TicketSeverity,
    slaResponseHours: 1,
    slaResolutionHours: 4,
    hodApprovalLimitHours: 2,
    description: 'Application crashes on launch or displays blank screen',
  },
  {
    name: 'Password reset',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 8,
    hodApprovalLimitHours: 4,
    description: 'User locked out or requests password reset',
  },
  {
    name: 'Slow performance / Freezing',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 6,
    hodApprovalLimitHours: 3,
    description: 'High latency, spin wheels, or unresponsiveness',
  },
  {
    name: 'Report generation failure',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 6,
    hodApprovalLimitHours: 3,
    description: 'PDF/Excel export fails or timeout during report queries',
  },
  {
    name: 'Data sync error',
    autoSeverity: 'High' as TicketSeverity,
    slaResponseHours: 1,
    slaResolutionHours: 4,
    hodApprovalLimitHours: 2,
    description: 'Records not synchronizing across modules or databases',
  },
  {
    name: 'User access & permissions',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 8,
    hodApprovalLimitHours: 4,
    description: 'User needs role privileges or access to specific screen',
  },
  {
    name: 'Transaction timeout',
    autoSeverity: 'Critical' as TicketSeverity,
    slaResponseHours: 0.5,
    slaResolutionHours: 2,
    hodApprovalLimitHours: 1,
    description: 'Processing payments, batches, or records fails with timeout',
  },
]

export const COMMON_HARDWARE_ISSUES = [
  {
    name: 'Device will not power on / Power fault',
    autoSeverity: 'Critical' as TicketSeverity,
    slaResponseHours: 0.5,
    slaResolutionHours: 2,
    hodApprovalLimitHours: 1,
    description: 'Hardware does not turn on, no power indicator or dead battery',
  },
  {
    name: 'Screen display / Blank screen / Flickering',
    autoSeverity: 'High' as TicketSeverity,
    slaResponseHours: 1,
    slaResolutionHours: 4,
    hodApprovalLimitHours: 2,
    description: 'Display panel blank, lines on screen, or flickering backlight',
  },
  {
    name: 'Battery not charging / Fast draining',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 6,
    hodApprovalLimitHours: 3,
    description: 'Laptop battery failing to hold charge or charger not recognized',
  },
  {
    name: 'Keyboard or trackpad unresponsive',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 8,
    hodApprovalLimitHours: 4,
    description: 'Keys not typing, trackpad cursor jumping, or physical key stuck',
  },
  {
    name: 'Operating System crash / Blue screen (BSOD)',
    autoSeverity: 'Critical' as TicketSeverity,
    slaResponseHours: 0.5,
    slaResolutionHours: 2,
    hodApprovalLimitHours: 1,
    description: 'Windows BSOD crash on startup or hard drive failure',
  },
  {
    name: 'Paper jam / Feeder error',
    autoSeverity: 'High' as TicketSeverity,
    slaResponseHours: 1,
    slaResolutionHours: 3,
    hodApprovalLimitHours: 1.5,
    description: 'Paper jammed in printer roller or input tray not picking up paper',
  },
  {
    name: 'Toner / Ink cartridge replacement',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 6,
    hodApprovalLimitHours: 3,
    description: 'Low toner warning or faded prints requiring toner swap',
  },
  {
    name: 'Printer offline / Network disconnection',
    autoSeverity: 'High' as TicketSeverity,
    slaResponseHours: 1,
    slaResolutionHours: 3,
    hodApprovalLimitHours: 1.5,
    description: 'Network printer unreachable by IP address or print queue stuck',
  },
  {
    name: 'Overheating / Excessive fan noise',
    autoSeverity: 'Medium' as TicketSeverity,
    slaResponseHours: 2,
    slaResolutionHours: 8,
    hodApprovalLimitHours: 4,
    description: 'Chassis running extremely hot, loud fan spinning continuously',
  },
  {
    name: 'Network port / Wi-Fi disconnected',
    autoSeverity: 'Critical' as TicketSeverity,
    slaResponseHours: 0.5,
    slaResolutionHours: 2,
    hodApprovalLimitHours: 1,
    description: 'Ethernet cable port dead or Wi-Fi radio not connecting',
  },
]

export const classificationTree: ClassificationConfig[] = [
  {
    name: 'Software',
    iconName: 'LayoutDashboard',
    subClassifications: [
      {
        name: 'Pro People',
        technicians: ['Daniel Mensah', 'Maya Patel'],
        issueTypes: [
          { name: 'Login not working', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Application not opening', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'Password reset', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'Slow performance / Freezing', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 6, hodApprovalLimitHours: 3 },
          { name: 'Data sync error', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
        ],
      },
      {
        name: 'Pro Biz',
        technicians: ['Maya Patel', 'Ibrahim Sani'],
        issueTypes: [
          { name: 'Login not working', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Application not opening', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'Report generation failure', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 6, hodApprovalLimitHours: 3 },
          { name: 'Data sync error', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'Transaction timeout', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
        ],
      },
      {
        name: 'Pro Pupil',
        technicians: ['Ibrahim Sani', 'Daniel Mensah'],
        issueTypes: [
          { name: 'Login not working', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Password reset', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'User access & permissions', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'Slow performance / Freezing', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 6, hodApprovalLimitHours: 3 },
        ],
      },
      {
        name: 'Flexcube',
        technicians: ['Daniel Mensah', 'Maya Patel'],
        issueTypes: [
          { name: 'Login not working', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Application not opening', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'Transaction timeout', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 3, hodApprovalLimitHours: 1 },
          { name: 'Password reset', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'End of Day (EOD) Batch Stalled', autoSeverity: 'Critical', slaResponseHours: 0.25, slaResolutionHours: 1.5, hodApprovalLimitHours: 1 },
          { name: 'Core Patch Upgrade (Change Request)', autoSeverity: 'High', slaResponseHours: 4, slaResolutionHours: 48, hodApprovalLimitHours: 24, isChangeRequest: true, crRequiresHodApproval: true },
          { name: 'Emergency Hotfix Deployment (CR - Direct to Admin)', autoSeverity: 'Critical', slaResponseHours: 1, slaResolutionHours: 12, hodApprovalLimitHours: 4, isChangeRequest: true, crRequiresHodApproval: false },
        ],
      },
      {
        name: 'Atomverse',
        technicians: ['Ibrahim Sani', 'Maya Patel'],
        issueTypes: [
          { name: 'Login not working', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Customer biometric login failure', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'OTP delivery timeout', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Mobile onboarding flow crash', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 6, hodApprovalLimitHours: 3 },
          { name: 'Payment gateway timeout', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
        ],
      },
    ],
  },
  {
    name: 'Hardware',
    iconName: 'Server',
    subClassifications: [
      {
        name: 'Laptops & Workstations',
        technicians: ['Daniel Mensah', 'Ibrahim Sani'],
        issueTypes: [
          { name: 'Device will not power on / Power fault', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Screen display / Blank screen / Flickering', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'Battery not charging / Fast draining', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 6, hodApprovalLimitHours: 3 },
          { name: 'Keyboard or trackpad unresponsive', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'Operating System crash / Blue screen (BSOD)', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Overheating / Excessive fan noise', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
        ],
      },
      {
        name: 'Printers & Scanners',
        technicians: ['Ibrahim Sani', 'TechServe Ltd'],
        issueTypes: [
          { name: 'Paper jam / Feeder error', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 3, hodApprovalLimitHours: 1.5 },
          { name: 'Toner / Ink cartridge replacement', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 6, hodApprovalLimitHours: 3 },
          { name: 'Printer offline / Network disconnection', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 3, hodApprovalLimitHours: 1.5 },
          { name: 'Printout streaks / poor quality', autoSeverity: 'Low', slaResponseHours: 4, slaResolutionHours: 12, hodApprovalLimitHours: 6 },
        ],
      },
      {
        name: 'Monitors & Displays',
        technicians: ['Daniel Mensah', 'TechServe Ltd'],
        issueTypes: [
          { name: 'Screen display / Blank screen / Flickering', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'HDMI / DisplayPort cable or adapter failure', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 6, hodApprovalLimitHours: 3 },
          { name: 'Color distortion or vertical lines', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
        ],
      },
      {
        name: 'Keyboards, Mice & Peripherals',
        technicians: ['Ibrahim Sani', 'Daniel Mensah'],
        issueTypes: [
          { name: 'Keyboard or trackpad unresponsive', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
          { name: 'Docking station ports not responding', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'Webcam / Microphone not detected', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
        ],
      },
      {
        name: 'Network Equipment & Routers',
        technicians: ['Daniel Mensah', 'SecureNet Ops'],
        issueTypes: [
          { name: 'Wi-Fi Access Point offline', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Ethernet wall port dead / No link', autoSeverity: 'High', slaResponseHours: 1, slaResolutionHours: 4, hodApprovalLimitHours: 2 },
          { name: 'VPN router gateway drop', autoSeverity: 'Critical', slaResponseHours: 0.5, slaResolutionHours: 2, hodApprovalLimitHours: 1 },
          { name: 'Switch port speed / Duplex mismatch', autoSeverity: 'Medium', slaResponseHours: 2, slaResolutionHours: 8, hodApprovalLimitHours: 4 },
        ],
      },
    ],
  },
]

export const initialTickets: Ticket[] = [
  {
    id: 'INC-2024-0842',
    subject: 'Unable to access Flexcube after scheduled password reset',
    description: 'Multiple users in the Core Banking team receive ORA-01017 invalid username/password despite recent active directory password sync. Account appears locked in Flexcube security table.',
    type: 'Incident',
    app: 'Flexcube',
    classification: 'Software',
    subClassification: 'Flexcube',
    issueType: 'Login not working',
    severity: 'High',
    priority: 'P1',
    status: 'Pending Approval',
    department: 'Core Banking',
    creator: 'Tariq Bello',
    creatorRole: 'End User',
    creatorAvatar: 'TB',
    assignee: 'Unassigned',
    sla: '06:42:18 remaining',
    slaTimeRemaining: '06:42:18',
    slaBreached: false,
    hodTimeRemaining: '01:18:42',
    created: 'Today, 09:42',
    dynamicFields: {
      moduleName: 'Payments',
      errorCode: 'ORA-01017: invalid username/password',
      customerNo: '021-998341-01',
      environment: 'Production',
      transactionRef: 'TXN-998241',
      version: 'v14.7.0.2',
    },
    timeline: [
      { id: 't1', time: 'Today, 09:42', user: 'Tariq Bello', role: 'End User', action: 'Ticket created', note: 'Submitted via UFC Desk dynamic portal.', tone: 'blue' },
      { id: 't2', time: 'Today, 09:43', user: 'System Rule Engine', action: 'Auto-classification evaluated', note: 'Applications / Flexcube -> Auto-severity set to High. SLA Resolution 4h.', tone: 'purple' },
      { id: 't3', time: 'Today, 09:43', user: 'System Notification', action: 'Pending HOD Approval', note: 'Escalation notification dispatched to Department Head Grace Nwosu (Core Banking). 2h approval SLA active.', tone: 'amber' },
    ],
    clarifications: [
      {
        id: 'c1',
        from: 'Grace Nwosu (HOD)',
        to: 'Tariq Bello (Creator)',
        targetRole: 'End User',
        message: 'Tariq, are branch teller terminals also experiencing this, or is it isolated to HQ Core Banking users?',
        time: 'Today, 09:48',
        response: 'Currently affecting 4 teller terminals at HQ and 1 user at Salalah branch.',
        responder: 'Tariq Bello',
        responseTime: 'Today, 09:54',
      },
    ],
  },
  {
    id: 'INC-2024-0841',
    subject: 'Corporate VPN dropping intermittently during high load',
    description: 'GlobalProtect VPN tunnel drops connection every 15-20 minutes for remote staff connecting to Core Banking and Swift portals.',
    type: 'Incident',
    app: 'Network Access',
    classification: 'Hardware',
    subClassification: 'Network Equipment & Routers',
    issueType: 'Corporate VPN dropping connections',
    severity: 'Medium',
    priority: 'P2',
    status: 'In Progress',
    department: 'Infrastructure',
    creator: 'Chinedu Okoro',
    creatorRole: 'End User',
    creatorAvatar: 'CO',
    assignee: 'Daniel Mensah',
    assigneeRole: 'Technician',
    coAssignee: 'TechServe Ltd',
    vendor: 'TechServe Ltd',
    sla: '01:18:42 remaining',
    slaTimeRemaining: '01:18:42',
    slaBreached: false,
    created: 'Today, 06:25',
    eta: 'Today, 14:00',
    dueDate: 'Today, 17:00',
    dynamicFields: {
      connectionType: 'Corporate GlobalProtect VPN',
      userVpnId: 'cokoro@ufc.om',
      frequency: 'Drops Every 10-15 Minutes',
    },
    timeline: [
      { id: 't1', time: 'Today, 06:25', user: 'Chinedu Okoro', action: 'Ticket submitted', tone: 'blue' },
      { id: 't2', time: 'Today, 07:10', user: 'Daniel Owusu (HOD)', action: 'HOD Approved', note: 'Approved and forwarded to Admin Team.', tone: 'green' },
      { id: 't3', time: 'Today, 07:20', user: 'Amara Okafor (Admin)', action: 'Assigned to Daniel Mensah', note: 'Co-assigned with vendor TechServe Ltd. Priority P2.', tone: 'purple' },
      { id: 't4', time: 'Today, 08:00', user: 'Daniel Mensah', action: 'Work started', note: 'Inspecting firewall state tables and gateway session timeouts.', tone: 'blue' },
    ],
    clarifications: [],
  },
  {
    id: 'INC-2024-0839',
    subject: 'Transaction timeout on customer onboarding API',
    description: 'Atomverse customer KYC verification calls timing out after 60s when fetching Civil Registry data.',
    type: 'Incident',
    app: 'Atomverse',
    classification: 'Software',
    subClassification: 'Atomverse',
    issueType: 'Transaction timeout',
    severity: 'Critical',
    priority: 'P1',
    status: 'Resolved',
    department: 'Digital Banking',
    creator: 'Tariq Bello',
    creatorRole: 'End User',
    creatorAvatar: 'TB',
    assignee: 'Maya Patel',
    assigneeRole: 'Technician',
    sla: 'Breached (00:00:00)',
    slaTimeRemaining: '00:00:00',
    slaBreached: true,
    created: 'Yesterday, 14:08',
    resolutionSummary: 'Increased HTTP connection pool size on middleware and cleared hung DB lock on CIF_KYC_AUDIT table.',
    rootCause: 'Database connection starvation caused by hung long-running query from batch sync.',
    resolutionTime: '3h 45m',
    dynamicFields: {
      channel: 'Corporate Web Portal',
      deviceInfo: 'Production Kubernetes Cluster Node #4',
      appVersion: 'v3.4.1 (Build 492)',
      customerCif: 'CIF-994012',
      errorCode: '504 Gateway Timeout',
    },
    timeline: [
      { id: 't1', time: 'Yesterday, 14:08', user: 'Tariq Bello', action: 'Ticket created', tone: 'blue' },
      { id: 't2', time: 'Yesterday, 14:30', user: 'Chinedu Okoro (HOD)', action: 'Approved by HOD', tone: 'green' },
      { id: 't3', time: 'Yesterday, 14:45', user: 'Amara Okafor (Admin)', action: 'Assigned to Maya Patel', tone: 'purple' },
      { id: 't4', time: 'Yesterday, 18:30', user: 'Maya Patel (Technician)', action: 'Marked Resolved', note: 'Pool size scaled up. Ready for end user verification.', tone: 'green' },
    ],
    clarifications: [],
  },
  {
    id: 'INC-2024-0832',
    subject: 'Partner API firewall rule for payment aggregator tunnel',
    description: 'Setup bi-directional TLS 1.3 firewall rules for the new Central Bank of Oman payment switch integration.',
    type: 'Change Request',
    app: 'Firewall',
    classification: 'Hardware',
    subClassification: 'Network Equipment & Routers',
    issueType: 'Partner API firewall rule',
    severity: 'High',
    priority: 'P2',
    status: 'In Progress',
    department: 'Security & Compliance',
    creator: 'Daniel Mensah',
    creatorRole: 'Technician',
    creatorAvatar: 'DM',
    assignee: 'Daniel Mensah',
    vendor: 'TechServe Ltd',
    sla: '12:09:33 remaining',
    slaTimeRemaining: '12:09:33',
    slaBreached: false,
    created: '3 Nov 2026, 16:21',
    eta: 'Tomorrow, 10:00',
    dueDate: '6 Nov 2026',
    dynamicFields: {
      sourceIp: '10.240.12.0/24',
      destinationIp: '192.168.100.45 (CBO Switch)',
      portsProtocol: 'TCP 8443, 9443',
      businessJustification: 'Required for national retail payment instant settlement compliance.',
      changeWindow: 'Weekend Maintenance (Sat 02:00-06:00)',
    },
    timeline: [
      { id: 't1', time: '3 Nov, 16:21', user: 'Daniel Mensah', action: 'Created as Change Request', tone: 'blue' },
      { id: 't2', time: '3 Nov, 17:00', user: 'Amara Okafor (Admin)', action: 'Admin Review Completed', note: 'Architectural impact assessed.', tone: 'purple' },
      { id: 't3', time: '4 Nov, 08:30', user: 'Grace Nwosu (HOD)', action: 'Department Head Approved', tone: 'green' },
      { id: 't4', time: '4 Nov, 09:15', user: 'Khalfan Al-Busaidi (Management)', action: 'Management Approved', note: 'Approved for implementation with rollback script verified.', tone: 'green' },
      { id: 't5', time: '4 Nov, 10:00', user: 'TechServe Ltd (Vendor)', action: 'Implementation in progress', note: 'Configuring rule definition on Fortinet cluster.', tone: 'blue' },
    ],
    clarifications: [],
  },
  {
    id: 'INC-2024-0829',
    subject: 'Customer onboarding workflow update failed on UAT test',
    description: 'Ticket was previously resolved but the customer reported that the OTP retry button still stays disabled after 60s in the latest test build.',
    type: 'Incident',
    app: 'Atomverse',
    classification: 'Software',
    subClassification: 'Atomverse',
    issueType: 'Mobile onboarding flow crash',
    severity: 'High',
    priority: 'P1',
    status: 'Reopened',
    department: 'Digital Banking',
    creator: 'Tariq Bello',
    creatorRole: 'End User',
    creatorAvatar: 'TB',
    assignee: 'Amara Okafor',
    assigneeRole: 'Admin Team',
    sla: '02:45:10 remaining',
    slaTimeRemaining: '02:45:10',
    slaBreached: false,
    created: '2 Nov 2026, 11:20',
    dynamicFields: {
      channel: 'Android App',
      deviceInfo: 'Pixel 8 (Android 15)',
      appVersion: 'v3.4.1 (Build 492)',
    },
    timeline: [
      { id: 't1', time: '2 Nov, 11:20', user: 'Tariq Bello', action: 'Created', tone: 'blue' },
      { id: 't2', time: '3 Nov, 15:00', user: 'Maya Patel', action: 'Resolved', tone: 'green' },
      { id: 't3', time: 'Today, 08:15', user: 'Tariq Bello', action: 'Ticket Reopened by End User', note: 'Issue persists on Android 15 devices. Routed directly to Admin Exception Queue for priority triage.', tone: 'red' },
    ],
    clarifications: [],
  },
  {
    id: 'INC-2024-0820',
    subject: 'Flexcube EOD Batch Stalled on Interest Calculation',
    description: 'Nightly batch job stalled on job step 14 (Interest Accrual for Demand Deposits). Error code FC-EOD-409.',
    type: 'Incident',
    app: 'Flexcube',
    classification: 'Software',
    subClassification: 'Flexcube',
    issueType: 'End of Day (EOD) Batch Stalled',
    severity: 'Critical',
    priority: 'P1',
    status: 'In Testing',
    department: 'Core Banking',
    creator: 'Grace Nwosu',
    creatorRole: 'HOD',
    creatorAvatar: 'GN',
    assignee: 'Daniel Mensah',
    tester: 'Fatima Al-Zadjali',
    sla: '00:45:00 remaining',
    slaTimeRemaining: '00:45:00',
    slaBreached: false,
    created: 'Today, 02:30',
    dynamicFields: {
      moduleName: 'Demand Deposits',
      errorCode: 'FC-EOD-409: Deadlock detected in interest table',
      environment: 'Production',
    },
    timeline: [
      { id: 't1', time: 'Today, 02:30', user: 'Grace Nwosu', action: 'Emergency ticket raised', tone: 'red' },
      { id: 't2', time: 'Today, 02:45', user: 'Amara Okafor', action: 'Fast-tracked & assigned to Daniel Mensah', tone: 'purple' },
      { id: 't3', time: 'Today, 04:10', user: 'Daniel Mensah', action: 'Hotfix applied on database partition', tone: 'blue' },
      { id: 't4', time: 'Today, 04:30', user: 'System', action: 'Forwarded to Testing Team', note: 'Assigned to Fatima Al-Zadjali for batch verification.', tone: 'purple' },
    ],
    clarifications: [],
  },
  {
    id: 'INC-2024-0815',
    subject: 'New starter laptop and security credential setup',
    description: 'Hardware provisioning and Active Directory profile creation for Senior Credit Analyst joining Operations next Sunday.',
    type: 'Service Request',
    app: 'End User Computing',
    classification: 'Hardware',
    subClassification: 'Laptops & Workstations',
    issueType: 'New starter laptop and account provisioning',
    severity: 'Low',
    priority: 'P3',
    status: 'Closed',
    department: 'People & Talent',
    creator: 'Lena Woods',
    creatorRole: 'End User',
    creatorAvatar: 'LW',
    assignee: 'Ibrahim Sani',
    sla: 'Closed within SLA',
    slaTimeRemaining: 'Closed',
    slaBreached: false,
    created: '1 Nov 2026, 10:00',
    resolutionSummary: 'Dell Latitude 7440 configured with standard Windows 11 Enterprise image, BitLocker enabled, and security tokens issued.',
    rootCause: 'Standard service fulfillment',
    resolutionTime: '18h 30m',
    closureRemarks: 'Employee confirmed receipt of laptop and successfully logged into domain.',
    rating: 5,
    dynamicFields: {
      assetTag: 'UFC-LPT-2026-142',
      location: 'Muscat HQ - 7th Floor',
      osVersion: 'Windows 11 Enterprise 23H2',
    },
    timeline: [
      { id: 't1', time: '1 Nov, 10:00', user: 'Lena Woods', action: 'Request raised', tone: 'blue' },
      { id: 't2', time: '1 Nov, 11:30', user: 'HOD People & Talent', action: 'Approved', tone: 'green' },
      { id: 't3', time: '2 Nov, 14:00', user: 'Ibrahim Sani', action: 'Resolved', tone: 'green' },
      { id: 't4', time: '2 Nov, 16:30', user: 'Lena Woods', action: 'Verified & Closed by End User', note: '5-star rating provided.', tone: 'green' },
    ],
    clarifications: [],
  },
  {
    id: 'INC-2024-0834',
    subject: 'Branch printer spooler error on teller desk 3',
    description: 'Thermal receipt printer failing to print deposit slips.',
    type: 'Incident',
    app: 'End User Computing',
    classification: 'Hardware',
    subClassification: 'Laptops & Workstations',
    issueType: 'BSOD / Operating system boot failure',
    severity: 'Medium',
    priority: 'P2',
    status: 'Resolved',
    department: 'Digital Banking',
    creator: 'Tariq Bello',
    creatorRole: 'End User',
    creatorAvatar: 'TB',
    assignee: 'Ibrahim Sani',
    sla: 'Resolved',
    slaTimeRemaining: 'Resolved',
    slaBreached: false,
    created: '28 Oct 2026, 09:12',
    resolutionSummary: 'Reinstalled Epson USB driver and cleared corrupted print spool folder.',
    rootCause: 'Driver corruption after Windows automatic update.',
    resolutionTime: '1h 20m',
    dynamicFields: {
      assetTag: 'UFC-PRN-0921',
      location: 'Muscat HQ - 7th Floor',
      osVersion: 'Windows 11 Enterprise',
    },
    timeline: [
      { id: 't1', time: '28 Oct, 09:12', user: 'Tariq Bello', action: 'Created', tone: 'blue' },
      { id: 't2', time: '28 Oct, 11:00', user: 'Ibrahim Sani', action: 'Resolved', note: 'Pending Tariq Bello verification.', tone: 'green' },
    ],
    clarifications: [],
  },
  {
    id: 'INC-2024-0828',
    subject: 'Outlook calendar invitation sync latency',
    description: 'Calendar invites taking 45+ minutes to appear on mobile device.',
    type: 'Service Request',
    app: 'End User Computing',
    classification: 'Hardware',
    subClassification: 'Laptops & Workstations',
    issueType: 'BSOD / Operating system boot failure',
    severity: 'Low',
    priority: 'P3',
    status: 'Resolved',
    department: 'Digital Banking',
    creator: 'Tariq Bello',
    creatorRole: 'End User',
    creatorAvatar: 'TB',
    assignee: 'Daniel Mensah',
    sla: 'Resolved',
    slaTimeRemaining: 'Resolved',
    slaBreached: false,
    created: '26 Oct 2026, 14:00',
    resolutionSummary: 'Rebuilt Exchange ActiveSync mailbox synchronization profile.',
    rootCause: 'Corrupt device sync token in Microsoft 365 tenant.',
    resolutionTime: '45m',
    dynamicFields: {
      assetTag: 'UFC-MOB-0192',
      location: 'Muscat HQ - 7th Floor',
      osVersion: 'iOS 18.1',
    },
    timeline: [
      { id: 't1', time: '26 Oct, 14:00', user: 'Tariq Bello', action: 'Created', tone: 'blue' },
      { id: 't2', time: '26 Oct, 15:30', user: 'Daniel Mensah', action: 'Resolved', note: 'Pending Tariq Bello closure.', tone: 'green' },
    ],
    clarifications: [],
  },
]

export const standardSeveritySLAs: Record<TicketSeverity, { resolutionHours: number; responseHours: number }> = {
  Critical: { resolutionHours: 2, responseHours: 0.5 },
  High: { resolutionHours: 4, responseHours: 1 },
  Medium: { resolutionHours: 8, responseHours: 2 },
  Low: { resolutionHours: 24, responseHours: 4 },
}

export const policySettings = {
  unresolvedClosureThreshold: 3,
  hodReminderDays: 3,
  hodDefaultTimeoutHours: 24,
  /** Technicians currently on leave. Auto-assignment skips them. */
  techniciansOnLeave: [] as string[],
  databaseEncryption: true,
  adSyncIntervalMinutes: 15,
  activeDirectoryStatus: {
    connected: true,
    lastSync: '2 minutes ago',
    totalUsers: 148,
    syncedAttributes: [
      { adAttr: 'sAMAccountName', ufcField: 'Username / User ID', status: 'Mapped & Active' },
      { adAttr: 'displayName', ufcField: 'Full Name', status: 'Mapped & Active' },
      { adAttr: 'mail', ufcField: 'Email Address', status: 'Mapped & Active' },
      { adAttr: 'department', ufcField: 'Department', status: 'Mapped & Active' },
      { adAttr: 'title', ufcField: 'Designation / Role', status: 'Mapped & Active' },
      { adAttr: 'manager', ufcField: 'Department Head (HOD)', status: 'Mapped & Active' },
      { adAttr: 'userAccountControl', ufcField: 'Account Status (Active/Disabled)', status: 'Mapped & Active' },
    ],
  },
}

export const notificationEvents = [
  { id: 'TKT_CREATED', name: 'Ticket created', recipients: 'Requester, HOD', defaultEmail: true, defaultInApp: true, description: 'Sent immediately when a user files a new request' },
  { id: 'HOD_APPROVAL_REQ', name: 'Department Head approval required', recipients: 'Department Head (HOD)', defaultEmail: true, defaultInApp: true, description: 'Alerts HOD with timer countdown' },
  { id: 'HOD_DECISION', name: 'Ticket approved / rejected by HOD', recipients: 'Requester, Admin Team', defaultEmail: true, defaultInApp: true, description: 'Contains approval comments or mandatory rejection reason' },
  { id: 'HOD_SLA_EXPIRED', name: 'HOD did not respond within SLA time limit', recipients: 'Requester, Admin Team', defaultEmail: true, defaultInApp: true, description: 'Notifies end user and escalates to Admin' },
  { id: 'TKT_ASSIGNED', name: 'Ticket assigned / reassigned to technician', recipients: 'Assigned Technician, Vendor', defaultEmail: true, defaultInApp: true, description: 'Includes ETA, Due Date, and Priority' },
  { id: 'CLARIFICATION_REQ', name: 'Clarification requested by team', recipients: 'Target Stakeholder (User/HOD/Vendor)', defaultEmail: true, defaultInApp: true, description: 'Direct question on ticket with 1-click reply link' },
  { id: 'CLARIFICATION_REC', name: 'Clarification response received', recipients: 'Assigned Technician, Admin Team', defaultEmail: true, defaultInApp: true, description: 'Appends response to ticket audit timeline' },
  { id: 'ETA_UPDATED', name: 'ETA assigned or updated', recipients: 'Requester, HOD', defaultEmail: true, defaultInApp: true, description: 'Keeps business updated on expected turnaround' },
  { id: 'DUE_DATE_REMINDER', name: 'SLA due date warning (1h remaining)', recipients: 'Assigned Technician, Admin Team', defaultEmail: true, defaultInApp: true, description: 'Urgent reminder before SLA breach' },
  { id: 'CR_APPROVAL_REQ', name: 'Change Request awaiting Management decision', recipients: 'Management Team, Admin Team', defaultEmail: true, defaultInApp: true, description: 'Change package with rollback strategy' },
  { id: 'TESTING_ASSIGNED', name: 'Testing and verification assigned', recipients: 'Testing Team', defaultEmail: true, defaultInApp: true, description: 'Solution ready for QA verification' },
  { id: 'TESTING_COMPLETED', name: 'Testing completed (Passed or Failed)', recipients: 'Assigned Technician, Admin Team', defaultEmail: true, defaultInApp: true, description: 'QA verification report' },
  { id: 'TKT_RESOLVED', name: 'Ticket resolved by technician', recipients: 'Requester (End User), HOD', defaultEmail: true, defaultInApp: true, description: 'Prompts end user to verify and close' },
  { id: 'RESOLVED_UNCLOSED_REMINDER', name: 'Resolved ticket not closed (notifies HOD)', recipients: 'Department Head (HOD), End User', defaultEmail: true, defaultInApp: true, description: 'Escalation to HOD when ticket remains unclosed' },
  { id: 'TKT_REOPENED', name: 'Ticket reopened by requester', recipients: 'Admin Team Exception Queue', defaultEmail: true, defaultInApp: true, description: 'Directly routed to Admin Team Exception Queue' },
  { id: 'TKT_CLOSED', name: 'Ticket closed after confirmation', recipients: 'Requester, Technician, HOD', defaultEmail: true, defaultInApp: true, description: 'Final closure confirmation and satisfaction score' },
]

export interface DepartmentConfig {
  name: string
  hodName: string
  hodEmail: string
  assignedApplications: string[]
}

export const departmentsData: DepartmentConfig[] = [
  {
    name: 'Core Banking',
    hodName: 'Grace Nsubuga',
    hodEmail: 'gnsubuga@ufc.om',
    assignedApplications: ['Flexcube', 'Pro Biz', 'Atomverse', 'Laptops & Workstations', 'Printers & Scanners', 'Monitors & Displays'],
  },
  {
    name: 'Digital Banking',
    hodName: 'Grace Nsubuga',
    hodEmail: 'gnsubuga@ufc.om',
    assignedApplications: ['Atomverse', 'Pro Biz', 'Laptops & Workstations', 'Network Equipment & Routers'],
  },
  {
    name: 'Infrastructure',
    hodName: 'Daniel Mensah',
    hodEmail: 'dmensah@ufc.om',
    assignedApplications: [
      'Pro People', 'Pro Biz', 'Pro Pupil', 'Flexcube', 'Atomverse',
      'Laptops & Workstations', 'Printers & Scanners', 'Monitors & Displays',
      'Keyboards, Mice & Peripherals', 'Network Equipment & Routers',
    ],
  },
  {
    name: 'Security & Compliance',
    hodName: 'Khalfan Al-Busaidi',
    hodEmail: 'kbusaidi@ufc.om',
    assignedApplications: ['Network Equipment & Routers', 'Laptops & Workstations', 'Pro Biz'],
  },
  {
    name: 'Finance & Risk',
    hodName: 'Grace Nsubuga',
    hodEmail: 'gnsubuga@ufc.om',
    assignedApplications: ['Pro Biz', 'Flexcube', 'Laptops & Workstations', 'Printers & Scanners'],
  },
  {
    name: 'Operations',
    hodName: 'Grace Nsubuga',
    hodEmail: 'gnsubuga@ufc.om',
    assignedApplications: ['Pro People', 'Pro Biz', 'Flexcube', 'Laptops & Workstations', 'Printers & Scanners'],
  },
  {
    name: 'People & Talent',
    hodName: 'Grace Nsubuga',
    hodEmail: 'gnsubuga@ufc.om',
    assignedApplications: ['Pro People', 'Pro Pupil', 'Laptops & Workstations', 'Printers & Scanners'],
  },
  {
    name: 'Business Development',
    hodName: 'Grace Nsubuga',
    hodEmail: 'gnsubuga@ufc.om',
    assignedApplications: ['Pro People', 'Pro Biz', 'Laptops & Workstations'],
  },
]

export interface ADUser {
  id: string
  name: string
  email: string
  department: string
  manager: string // HOD from AD (read-only)
  role: Role
  isVendor?: boolean
  status: 'Active' | 'Inactive'
  syncedFromAD: boolean
}

export const usersDirectory: ADUser[] = [
  { id: 'UFC-0104', name: 'Tariq Bello', email: 'tbello@ufc.om', department: 'Finance & Risk', manager: 'Grace Nsubuga', role: 'End User', status: 'Active', syncedFromAD: true },
  { id: 'UFC-0082', name: 'Grace Nsubuga', email: 'gnsubuga@ufc.om', department: 'Finance & Risk', manager: 'Khalfan Al-Busaidi', role: 'HOD', status: 'Active', syncedFromAD: true },
  { id: 'UFC-0045', name: 'Daniel Mensah', email: 'dmensah@ufc.om', department: 'Infrastructure', manager: 'Amara Okafor', role: 'Technician', status: 'Active', syncedFromAD: true },
  { id: 'UFC-0062', name: 'Maya Patel', email: 'mpatel@ufc.om', department: 'Core Banking', manager: 'Amara Okafor', role: 'Technician', status: 'Active', syncedFromAD: true },
  { id: 'UFC-0071', name: 'Ibrahim Sani', email: 'isani@ufc.om', department: 'Infrastructure', manager: 'Amara Okafor', role: 'Technician', status: 'Active', syncedFromAD: true },
  { id: 'UFC-0012', name: 'Amara Okafor', email: 'aokafor@ufc.om', department: 'IT Service Management', manager: 'Khalfan Al-Busaidi', role: 'Admin Team', status: 'Active', syncedFromAD: true },
  { id: 'UFC-0003', name: 'Khalfan Al-Busaidi', email: 'kbusaidi@ufc.om', department: 'Executive Management', manager: 'Board of Directors', role: 'Management', status: 'Active', syncedFromAD: true },
  { id: 'UFC-0099', name: 'Fatima Al-Zadjali', email: 'falzadjali@ufc.om', department: 'Quality Assurance', manager: 'Amara Okafor', role: 'Testing Team', status: 'Active', syncedFromAD: true },
  { id: 'VND-001', name: 'TechServe Support Lead', email: 'techserve-lead@partners.ufc.om', department: 'TechServe Solutions Ltd', manager: 'External Partner Lead', role: 'External Vendor', isVendor: true, status: 'Active', syncedFromAD: false },
  { id: 'VND-002', name: 'SecureNet Ops Lead', email: 'ops@securenet.partner', department: 'SecureNet Managed Security', manager: 'External Partner Lead', role: 'External Vendor', isVendor: true, status: 'Active', syncedFromAD: false },
]

export const vendorAccounts = [
  { id: 'VND-001', name: 'TechServe Solutions Ltd', contractRef: 'UFC-MSA-2024-089', leadContact: 'TechServe Support Lead', email: 'support@techservesolutions.com', activeTickets: 3, status: 'Active Certified Partner' },
  { id: 'VND-002', name: 'SecureNet Managed Security', contractRef: 'UFC-SOC-2025-012', leadContact: 'SecureNet Ops Lead', email: 'ops@securenet.partner', activeTickets: 1, status: 'Active Certified Partner' },
]

export const ticketTypesList = [
  { id: 'Incident', name: 'Incident', code: 'INC', description: 'Unplanned interruption or reduction in quality of an IT service', defaultWorkflow: 'Standard Ticket Workflow (Published)', defaultPriority: 'High', active: true },
  { id: 'Service Request', name: 'Service Request', code: 'SRQ', description: 'User request for service provisioning, access permissions, or standard information', defaultWorkflow: 'Standard Ticket Workflow (Published)', defaultPriority: 'Normal', active: true },
  { id: 'Issue', name: 'Technical Issue', code: 'ISS', description: 'Underlying hardware, peripheral, or application defect requiring troubleshooting', defaultWorkflow: 'Standard Ticket Workflow (Published)', defaultPriority: 'Normal', active: true },
  { id: 'Change Request', name: 'Change Request', code: 'CR', description: 'Addition, modification, or removal of IT services, configurations, or infrastructure', defaultWorkflow: 'Change Request Workflow (Draft)', defaultPriority: 'Urgent', active: true },
]

export const ticketStatusesList = [
  { id: 'Draft', name: 'Draft', category: 'Open', color: '#64748B', desc: 'Saved by the requester, not yet submitted for approval', terminal: false, allowReopen: false },
  { id: 'Pending Approval', name: 'Pending Approval', category: 'Waiting', color: '#D97706', desc: 'Awaiting Department Head (HOD) decision, within the SLA time limit of the issue type', terminal: false, allowReopen: false },
  { id: 'Admin Review', name: 'Admin Review', category: 'Waiting', color: '#7C3AED', desc: 'With the Admin team: HOD did not approve, Change Request review, or implementation assignment', terminal: false, allowReopen: false },
  { id: 'Assigned', name: 'Assigned', category: 'Open', color: '#3B82F6', desc: 'Auto-assigned to the technician of the sub-classification', terminal: false, allowReopen: false },
  { id: 'In Progress', name: 'In Progress', category: 'In Progress', color: '#0284C7', desc: 'Active work with ETA and due date', terminal: false, allowReopen: false },
  { id: 'Awaiting Clarification', name: 'Awaiting Clarification', category: 'Waiting', color: '#F59E0B', desc: 'Waiting for the requester, a department or a vendor to answer', terminal: false, allowReopen: false },
  { id: 'Management Approval', name: 'Management Approval', category: 'Waiting', color: '#9333EA', desc: 'Change Request waiting for Management decision', terminal: false, allowReopen: false },
  { id: 'In Testing', name: 'In Testing', category: 'In Progress', color: '#BE185D', desc: 'Change Request implemented, tester is verifying', terminal: false, allowReopen: false },
  { id: 'Resolved', name: 'Resolved', category: 'Waiting', color: '#059669', desc: 'Work complete. Stays Resolved until the end user closes it', terminal: false, allowReopen: true },
  { id: 'Closed', name: 'Closed', category: 'Closed', color: '#475569', desc: 'Closed by the end user after verification', terminal: true, allowReopen: false },
  { id: 'Rejected', name: 'Rejected', category: 'Closed', color: '#B91C1C', desc: 'Change Request rejected at Admin, HOD or Management stage', terminal: true, allowReopen: false },
  { id: 'Reopened', name: 'Reopened', category: 'Open', color: '#DC2626', desc: 'End user reopened a Resolved ticket. Goes directly to the Admin team', terminal: false, allowReopen: false },
]

export const auditLogEntries = [
  { id: 'AUD-9912', timestamp: '2026-11-04 11:22:14', actor: 'Daniel Mensah (Technician)', event: 'Resolved Ticket', target: 'INC-2026-9041', ip: '10.240.4.18' },
  { id: 'AUD-9911', timestamp: '2026-11-04 11:15:02', actor: 'Amara Okafor (Admin Team)', event: 'Updated Routing SLA Matrix', target: 'Flexcube / Transaction timeout', ip: '10.240.2.10' },
  { id: 'AUD-9910', timestamp: '2026-11-04 11:02:45', actor: 'Grace Nsubuga (HOD)', event: 'Approved Request', target: 'INC-2026-8812', ip: '10.240.12.91' },
  { id: 'AUD-9909', timestamp: '2026-11-04 10:48:19', actor: 'System Daemon', event: 'Active Directory Scheduled Sync', target: '148 Objects Synchronized', ip: '127.0.0.1' },
  { id: 'AUD-9908', timestamp: '2026-11-04 10:30:00', actor: 'Tariq Bello (End User)', event: 'Created Ticket', target: 'INC-2026-8841', ip: '10.240.14.55' },
  { id: 'AUD-9907', timestamp: '2026-11-04 09:55:12', actor: 'Fatima Al-Zadjali (Testing)', event: 'QA Verification Passed', target: 'CR-2026-0042', ip: '10.240.8.22' },
  { id: 'AUD-9906', timestamp: '2026-11-04 09:12:30', actor: 'Khalfan Al-Busaidi (Management)', event: 'Approved Change Request', target: 'CR-2026-0042', ip: '10.240.1.5' },
]



/* =====================================================================
   Masters: severity, priority, SLA policies and business calendars.
   Nothing about severity, priority or SLA is fixed in code any more.
   ===================================================================== */

export interface SeverityMaster {
  /** Stable key stored on tickets and issue types. Never changes. */
  id: string
  name: string
  /** 1 is the most serious */
  rank: number
  color: string
  active: boolean
  description: string
  /** Priority a new ticket of this severity starts with */
  defaultPriorityId: string
}

export interface PriorityMaster {
  id: string
  name: string
  rank: number
  color: string
  active: boolean
  description: string
}

export interface BusinessCalendar {
  id: string
  name: string
  /** True: the clock runs all day, every day */
  is24x7: boolean
  /** 0 = Sunday ... 6 = Saturday */
  workDays: number[]
  start: string
  end: string
  holidays: { date: string; name: string }[]
}

export interface SlaPriorityOverride {
  responseHours?: number
  resolutionHours?: number
}

export interface SlaPolicy {
  id: string
  name: string
  responseHours: number
  resolutionHours: number
  /** How long the HOD has to approve or reject */
  hodLimitHours: number
  /** Stop the clock while waiting for a clarification */
  pauseOnClarification: boolean
  calendarId: string
  /** Warn when this share of the resolution time is used */
  warnPercent: number
  /** Escalate when the resolution time is passed by this many hours */
  escalateAfterHours: number
  escalateTo: string
  /** Optional shorter or longer times for a given priority id */
  overrides: Record<string, SlaPriorityOverride>
  active: boolean
}

export interface MastersSettings {
  /** If false, only staff roles can change the priority a ticket starts with */
  endUserCanChangePriority: boolean
}

export interface SlaSnapshot {
  policyId: string
  policyName: string
  calendarId: string
  responseHours: number
  resolutionHours: number
  hodLimitHours: number
  /** Epoch ms, counted on the calendar */
  resolutionDue: number
}

export const initialPriorities: PriorityMaster[] = [
  { id: 'P1', name: 'P1 Urgent', rank: 1, color: '#DC2626', active: true, description: 'Service down or customers affected. Work starts at once.' },
  { id: 'P2', name: 'P2 High', rank: 2, color: '#EA580C', active: true, description: 'Major function impaired. Same-day attention.' },
  { id: 'P3', name: 'P3 Normal', rank: 3, color: '#CA8A04', active: true, description: 'Limited impact with a workaround.' },
  { id: 'P4', name: 'P4 Low', rank: 4, color: '#2563EB', active: true, description: 'Minor issue or a routine request.' },
]

export const initialSeverities: SeverityMaster[] = [
  { id: 'Critical', name: 'Critical', rank: 1, color: '#DC2626', active: true, description: 'Core banking or channel outage, security incident.', defaultPriorityId: 'P1' },
  { id: 'High', name: 'High', rank: 2, color: '#EA580C', active: true, description: 'A major function is impaired for many users.', defaultPriorityId: 'P2' },
  { id: 'Medium', name: 'Medium', rank: 3, color: '#CA8A04', active: true, description: 'Limited impact, a workaround exists.', defaultPriorityId: 'P3' },
  { id: 'Low', name: 'Low', rank: 4, color: '#2563EB', active: true, description: 'Minor issue or routine request.', defaultPriorityId: 'P4' },
]

/** Example calendars. Working days and hours are placeholders until UFC confirms them. */
export const initialCalendars: BusinessCalendar[] = [
  { id: 'cal-24x7', name: '24 x 7 (always)', is24x7: true, workDays: [0, 1, 2, 3, 4, 5, 6], start: '00:00', end: '23:59', holidays: [] },
  {
    id: 'cal-office',
    name: 'Office hours (example)',
    is24x7: false,
    workDays: [0, 1, 2, 3, 4],
    start: '08:00',
    end: '16:00',
    holidays: [{ date: '2026-11-18', name: 'National Day (example)' }],
  },
]

export const initialMastersSettings: MastersSettings = { endUserCanChangePriority: false }

function fmtH(h: number): string {
  return h < 1 ? `${Math.round(h * 60)}m` : `${h}h`
}

/**
 * Starting SLA policies. One policy for every distinct set of times already used
 * by the issue types, and each issue type is pointed at its policy.
 */
function buildInitialSlaPolicies(): SlaPolicy[] {
  const byKey = new Map<string, SlaPolicy>()
  for (const main of classificationTree) {
    for (const sub of main.subClassifications) {
      for (const issue of sub.issueTypes) {
        const key = `${issue.slaResponseHours}-${issue.slaResolutionHours}-${issue.hodApprovalLimitHours}`
        let policy = byKey.get(key)
        if (!policy) {
          policy = {
            id: `sla-${key.replace(/\./g, 'p')}`,
            name: `Respond ${fmtH(issue.slaResponseHours)} / Resolve ${fmtH(issue.slaResolutionHours)} / HOD ${fmtH(issue.hodApprovalLimitHours)}`,
            responseHours: issue.slaResponseHours,
            resolutionHours: issue.slaResolutionHours,
            hodLimitHours: issue.hodApprovalLimitHours,
            pauseOnClarification: true,
            calendarId: 'cal-24x7',
            warnPercent: 80,
            escalateAfterHours: 0,
            escalateTo: 'Admin Team',
            overrides: {},
            active: true,
          }
          byKey.set(key, policy)
        }
        issue.slaPolicyId = policy.id
      }
    }
  }
  return [...byKey.values()].sort((a, b) => a.resolutionHours - b.resolutionHours)
}

export const initialSlaPolicies: SlaPolicy[] = buildInitialSlaPolicies()
