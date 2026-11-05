'use client'

import React, { useState, useMemo } from 'react'
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Calendar,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Users,
  ChevronDown,
  Layers,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import { Ticket } from '@/app/ticket-data'

interface ReportsViewProps {
  tickets: Ticket[]
}

interface ReportCardDef {
  id: string
  title: string
  category: 'Volume' | 'Approvals and closures' | 'Performance' | 'Change and external' | 'Lifecycle'
  description: string
  metricLabel: string
  metricValue: string
  chartPreview: string
}

const REPORT_LIBRARY: ReportCardDef[] = [
  {
    id: 'weekly-overview',
    title: 'Weekly Operational Overview',
    category: 'Volume',
    description: 'Executive snapshot of incoming volume, closure velocity, and first-contact resolution rates.',
    metricLabel: 'Weekly Influx',
    metricValue: '142 Tickets',
    chartPreview: 'Bar Trend (+8%)',
  },
  {
    id: 'open-closed',
    title: 'Open and Closed Tickets',
    category: 'Volume',
    description: 'Net ticket balance comparing newly opened requests versus verified closures.',
    metricLabel: 'Net Backlog',
    metricValue: '128 Open',
    chartPreview: 'Split Comparison',
  },
  {
    id: 'by-application',
    title: 'Tickets by Application & Sub-System',
    category: 'Volume',
    description: 'Distribution across Flexcube, Atomverse, SWIFT Gateway, ATM/POS Switch, and Firewalls.',
    metricLabel: 'Top Application',
    metricValue: 'Flexcube (42%)',
    chartPreview: 'Distribution Bar',
  },
  {
    id: 'by-department',
    title: 'Tickets by Department Demand',
    category: 'Volume',
    description: 'Service consumption across Core Banking, Finance & Risk, Operations, and Digital Channels.',
    metricLabel: 'Top Department',
    metricValue: 'Finance & Risk',
    chartPreview: 'Departmental Breakdown',
  },
  {
    id: 'by-severity-assignee',
    title: 'Tickets by Severity & Assignee',
    category: 'Performance',
    description: 'Workload distribution of Critical, High, Medium, and Low incidents per engineer.',
    metricLabel: 'Active Workload',
    metricValue: '3.8 / Engineer',
    chartPreview: 'Workload Matrix',
  },
  {
    id: 'pending-approvals',
    title: 'Pending HOD Approvals',
    category: 'Approvals and closures',
    description: 'Requests awaiting Department Head verification, countdown timers, and overdue escalation tracking.',
    metricLabel: 'Awaiting HOD',
    metricValue: '24 Approvals',
    chartPreview: 'Timer Distribution',
  },
  {
    id: 'outstanding-closures',
    title: 'Outstanding Closures (Resolved Not Closed)',
    category: 'Approvals and closures',
    description: 'Tickets resolved by engineers awaiting end-user verification. Tracks 3-day escalation to HOD.',
    metricLabel: 'Pending Closure',
    metricValue: '18 Unclosed',
    chartPreview: 'Aging Buckets',
  },
  {
    id: 'sla-compliance',
    title: 'SLA Response & Resolution Compliance',
    category: 'Performance',
    description: 'Percentage of tickets fulfilled within issue-type target hours versus breached thresholds.',
    metricLabel: 'SLA Attainment',
    metricValue: '96.4%',
    chartPreview: 'SLA Gauge',
  },
  {
    id: 'resolution-trends',
    title: 'Resolution Turnaround Trends (MTTR)',
    category: 'Performance',
    description: 'Mean time to resolve across standard incidents versus complex Change Requests.',
    metricLabel: 'Average MTTR',
    metricValue: '3.4 Hours',
    chartPreview: 'Time Series Trend',
  },
  {
    id: 'aging-analysis',
    title: 'Ticket Aging Analysis (Days Open)',
    category: 'Performance',
    description: 'Backlog analysis grouped into 0–1 day, 2–3 days, 4–7 days, and 8+ days at-risk brackets.',
    metricLabel: 'Over 8 Days',
    metricValue: '6 Tickets (5%)',
    chartPreview: 'Aging Buckets',
  },
  {
    id: 'escalated-tickets',
    title: 'Escalated Tickets & Exceptions',
    category: 'Performance',
    description: 'Requests that breached SLA timers, required admin reassignment, or were reopened by users.',
    metricLabel: 'Total Exceptions',
    metricValue: '14 Tickets',
    chartPreview: 'Exception Rate',
  },
  {
    id: 'change-requests',
    title: 'Change Requests & Governance',
    category: 'Change and external',
    description: 'Core banking patches, releases, and firewall rules passing through 6-stage change governance.',
    metricLabel: 'Active CRs',
    metricValue: '8 Requests',
    chartPreview: 'Governance Pipeline',
  },
  {
    id: 'vendor-performance',
    title: 'Vendor Performance & External Turnaround',
    category: 'Change and external',
    description: 'Fulfillment speed, resolution rate, and SLA compliance for TechServe Ltd and SecureNet Ops.',
    metricLabel: 'Vendor SLA',
    metricValue: '98.1%',
    chartPreview: 'Partner Comparison',
  },
  {
    id: 'tester-performance',
    title: 'Testing Team QA Verification Velocity',
    category: 'Change and external',
    description: 'Quality assurance throughput: First-time pass rate versus rejected test cases.',
    metricLabel: 'QA Pass Rate',
    metricValue: '92.3%',
    chartPreview: 'Pass/Fail Ratio',
  },
  {
    id: 'by-lifecycle-stage',
    title: 'Tickets Handled by HOD, Admin & Technicians',
    category: 'Lifecycle',
    description: 'Lifecycle bottleneck analysis showing exact time spent in Submission, Approval, Work, QA, and Closure.',
    metricLabel: 'Fastest Stage',
    metricValue: 'Auto-Assign (<1m)',
    chartPreview: 'Stage Duration Map',
  },
]

export function ReportsView({ tickets }: ReportsViewProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Sticky Filters inside Drilldown Report (Section 14)
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [filterDept, setFilterDept] = useState('All')
  const [filterApp, setFilterApp] = useState('All')
  const [filterSeverity, setFilterSeverity] = useState('All')

  // Schedule Report Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleFreq, setScheduleFreq] = useState('Weekly')
  const [scheduleRecipients, setScheduleRecipients] = useState(['Department Head (HOD)', 'Admin Team'])

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Consistent Status Figures required by Section 14:
  // "Status counts required: Open, Resolved, Closed, Pending. Figures must be consistent across screens (mock values: Open 128, Pending approvals 24, Resolved not closed 18, Closed 38)."
  const kpiOpen = 128
  const kpiPending = 24
  const kpiResolvedNotClosed = 18
  const kpiClosed = 38

  const handleExport = (type: 'Excel' | 'PDF') => {
    triggerToast(`Exporting "${selectedReport?.title || 'Report'}" to ${type}... Download starting.`)
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowScheduleModal(false)
    triggerToast(`Scheduled "${scheduleFreq}" automated report dispatch to ${scheduleRecipients.join(', ')}!`)
  }

  const filteredReports = useMemo(() => {
    return REPORT_LIBRARY.filter((r) => {
      const matchCat = selectedCategory === 'All' || r.category === selectedCategory
      const matchSearch =
        searchQuery === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const selectedReport = REPORT_LIBRARY.find((r) => r.id === selectedReportId)

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

      {/* VIEW 1: REPORTS LIBRARY (When no report is selected) */}
      {!selectedReportId ? (
        <div>
          {/* Header */}
          <div className="page-header-flex">
            <div>
              <div className="page-eyebrow">
                <BarChart3 size={14} /> Section 14 · Operational Intelligence Library
              </div>
              <h1 className="page-title-main">Reports & Analytics Library</h1>
              <p className="page-desc-sub">
                Explore standardized ITSM operational metrics, aging trends, SLA compliance, and vendor performance.
              </p>
            </div>

            {/* Main Page Action: Gold Button for Schedule Report (Section 17: One gold accent) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-gold"
                onClick={() => setShowScheduleModal(true)}
              >
                <Calendar size={15} /> Schedule Report
              </button>
            </div>
          </div>

          {/* Consistent KPI Strip (Section 14: Mock Values Open 128, Pending 24, Resolved not closed 18, Closed 38) */}
          <div className="kpi-stat-grid" style={{ marginBottom: '24px' }}>
            <div className="kpi-box-card">
              <div className="kpi-head-row">
                <span className="kpi-label-text">Total Open Tickets</span>
                <div className="kpi-icon-pill" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                  <BarChart3 size={18} />
                </div>
              </div>
              <div className="kpi-value-text">{kpiOpen}</div>
              <div className="kpi-sub-text" style={{ color: 'var(--primary)' }}>
                Across 9 Banking Applications
              </div>
            </div>

            <div className="kpi-box-card">
              <div className="kpi-head-row">
                <span className="kpi-label-text">Pending Approvals</span>
                <div className="kpi-icon-pill" style={{ background: '#FFFBEB', color: '#B45309' }}>
                  <Clock size={18} />
                </div>
              </div>
              <div className="kpi-value-text" style={{ color: 'var(--amber)' }}>
                {kpiPending}
              </div>
              <div className="kpi-sub-text" style={{ color: 'var(--text-muted)' }}>
                Active HOD Timers Running
              </div>
            </div>

            <div className="kpi-box-card">
              <div className="kpi-head-row">
                <span className="kpi-label-text">Resolved Awaiting Closure</span>
                <div className="kpi-icon-pill" style={{ background: '#ECFDF5', color: '#047857' }}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="kpi-value-text" style={{ color: 'var(--emerald)' }}>
                {kpiResolvedNotClosed}
              </div>
              <div className="kpi-sub-text" style={{ color: 'var(--emerald)' }}>
                User Verification Window
              </div>
            </div>

            <div className="kpi-box-card">
              <div className="kpi-head-row">
                <span className="kpi-label-text">Closed This Month</span>
                <div className="kpi-icon-pill" style={{ background: '#F1F5F9', color: '#475569' }}>
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="kpi-value-text">{kpiClosed}</div>
              <div className="kpi-sub-text" style={{ color: 'var(--text-muted)' }}>
                100% Satisfaction Verified
              </div>
            </div>
          </div>

          {/* Search Box & Category Filter Chips (Section 14) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div className="search-input-box" style={{ width: '340px' }}>
              <Search size={16} />
              <input
                type="text"
                placeholder="Search across reports by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'Volume', 'Approvals and closures', 'Performance', 'Change and external', 'Lifecycle'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12.5px',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: selectedCategory === cat ? 'var(--primary-soft)' : 'var(--surface)',
                      color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Reports Card Grid (Section 14) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '18px',
            }}
          >
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="modern-card"
                onClick={() => setSelectedReportId(report.id)}
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.18s ease-in-out',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span
                      className="badge-tag badge-tag-sm"
                      style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600, fontSize: '11px' }}
                    >
                      {report.category}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {report.chartPreview}
                    </span>
                  </div>

                  <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block', lineHeight: 1.3 }}>
                    {report.title}
                  </strong>

                  <p style={{ margin: '8px 0 16px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {report.description}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {report.metricLabel}
                    </span>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>
                      {report.metricValue}
                    </div>
                  </div>

                  <span style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}>
                    Open Report &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW 2: DRILLDOWN REPORT VIEW WITH STICKY FILTERS & EXPORT (Section 14) */
        <div>
          {/* Back Button & Report Header */}
          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ height: '32px', fontSize: '12.5px', padding: '0 10px', marginBottom: '12px' }}
              onClick={() => setSelectedReportId(null)}
            >
              <ArrowLeft size={14} /> Back to Reports Library
            </button>

            <div className="page-header-flex">
              <div>
                <div className="page-eyebrow">
                  {selectedReport?.category} &bull; Operational Report
                </div>
                <h1 className="page-title-main">{selectedReport?.title}</h1>
                <p className="page-desc-sub">{selectedReport?.description}</p>
              </div>

              {/* Export Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleExport('Excel')}
                >
                  <FileSpreadsheet size={15} color="#059669" /> Export to Excel
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleExport('PDF')}
                >
                  <FileText size={15} color="#DC2626" /> Export to PDF
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Filters Strip (Section 14: Date range, Department, Application, Severity, Reset) */}
          <div
            className="modern-card"
            style={{
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '22px',
              position: 'sticky',
              top: '68px',
              zIndex: 20,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                <Filter size={15} color="var(--primary)" /> Filters:
              </div>

              {/* Date Range */}
              <select
                className="form-input-control"
                style={{ width: '150px', height: '36px', fontSize: '12.5px' }}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Q4 2026">Q4 2026</option>
                <option value="Full Year 2026">Full Year 2026</option>
              </select>

              {/* Department Filter */}
              <select
                className="form-input-control"
                style={{ width: '160px', height: '36px', fontSize: '12.5px' }}
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Finance & Risk">Finance & Risk</option>
                <option value="Core Banking">Core Banking</option>
                <option value="Digital Banking">Digital Banking</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Operations">Operations</option>
              </select>

              {/* Application Filter */}
              <select
                className="form-input-control"
                style={{ width: '160px', height: '36px', fontSize: '12.5px' }}
                value={filterApp}
                onChange={(e) => setFilterApp(e.target.value)}
              >
                <option value="All">All Applications</option>
                <option value="Flexcube">Flexcube</option>
                <option value="Atomverse">Atomverse</option>
                <option value="SWIFT">SWIFT Gateway</option>
                <option value="Firewall">Firewall</option>
                <option value="Workstations">Workstations</option>
              </select>

              {/* Severity Filter */}
              <select
                className="form-input-control"
                style={{ width: '140px', height: '36px', fontSize: '12.5px' }}
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ height: '34px', fontSize: '12px' }}
              onClick={() => {
                setDateRange('Last 30 Days')
                setFilterDept('All')
                setFilterApp('All')
                setFilterSeverity('All')
                triggerToast('Filters reset to defaults.')
              }}
            >
              Reset Filters
            </button>
          </div>

          {/* KPI Strip */}
          <div className="kpi-stat-grid" style={{ marginBottom: '22px' }}>
            <div className="kpi-box-card">
              <span className="kpi-label-text">Total Open</span>
              <div className="kpi-value-text">{kpiOpen}</div>
              <span className="kpi-sub-text">Consistent ITIL metric</span>
            </div>
            <div className="kpi-box-card">
              <span className="kpi-label-text">Pending Approvals</span>
              <div className="kpi-value-text" style={{ color: 'var(--amber)' }}>{kpiPending}</div>
              <span className="kpi-sub-text">HOD Decision Required</span>
            </div>
            <div className="kpi-box-card">
              <span className="kpi-label-text">Resolved Awaiting Closure</span>
              <div className="kpi-value-text" style={{ color: 'var(--emerald)' }}>{kpiResolvedNotClosed}</div>
              <span className="kpi-sub-text">End User Verification</span>
            </div>
            <div className="kpi-box-card">
              <span className="kpi-label-text">Closed Total</span>
              <div className="kpi-value-text">{kpiClosed}</div>
              <span className="kpi-sub-text">Successfully Resolved</span>
            </div>
          </div>

          {/* Chart with Labelled Axes (Section 14) */}
          <div className="modern-card" style={{ padding: '24px', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                {selectedReport?.title} &bull; Distribution & Volume Trend
              </h3>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Y-Axis: Ticket Count &bull; X-Axis: Time / System Dimension
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '10px' }}>
              {[
                { label: 'Flexcube Core Banking', count: 48, pct: '75%', color: '#2563EB' },
                { label: 'Atomverse Mobile Channels', count: 34, pct: '53%', color: '#7C3AED' },
                { label: 'Firewall & Security Rules', count: 22, pct: '34%', color: '#D97706' },
                { label: 'SWIFT Alliance & Payments', count: 14, pct: '22%', color: '#059669' },
                { label: 'Workstations & Peripherals', count: 10, pct: '16%', color: '#475569' },
              ].map((row) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <strong>{row.label}</strong>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.count} Tickets</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: row.pct, height: '100%', background: row.color, borderRadius: '5px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sortable Table with Pagination (Section 14) */}
          <div className="modern-card">
            <div className="modern-card-header">
              <h3 className="card-title-lg">Underlying Report Records</h3>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Showing 1 to 5 of 128 matching records
              </span>
            </div>

            <div className="table-responsive-container">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Ticket Number</th>
                    <th>Subject</th>
                    <th>Application</th>
                    <th>Department</th>
                    <th>Severity</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Resolution Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 5).map((t) => (
                    <tr key={t.id}>
                      <td><code style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>{t.id}</code></td>
                      <td><strong style={{ fontSize: '13.5px' }}>{t.subject}</strong></td>
                      <td><span className="badge-tag badge-tag-sm" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>{t.app}</span></td>
                      <td>{t.department}</td>
                      <td>
                        <span
                          className="badge-tag badge-tag-sm"
                          style={{
                            background: t.severity === 'Critical' ? '#FEF2F2' : t.severity === 'High' ? '#FEF3C7' : '#DBEAFE',
                            color: t.severity === 'Critical' ? '#B91C1C' : t.severity === 'High' ? '#B45309' : '#1D4ED8',
                            fontWeight: 700,
                          }}
                        >
                          {t.severity}
                        </span>
                      </td>
                      <td>{t.assignee}</td>
                      <td>
                        <span className="badge-tag badge-tag-sm" style={{ background: '#ECFDF5', color: '#047857' }}>
                          {t.status}
                        </span>
                      </td>
                      <td><strong>{t.resolutionTime || '2h 15m'}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE REPORT DIALOG (Section 14) */}
      {showScheduleModal && (
        <div className="modal-overlay-backdrop" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-dialog-box" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <div>
                <div className="page-eyebrow">Section 14 · Automated Delivery</div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Schedule Automated Report</h2>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="icon-action-btn" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit}>
              <div className="modal-dialog-body">
                <div className="form-field-group">
                  <label className="form-field-label">Report Selection *</label>
                  <select className="form-input-control" defaultValue={selectedReportId || 'weekly-overview'}>
                    {REPORT_LIBRARY.map((r) => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Delivery Frequency *</label>
                  <select
                    className="form-input-control"
                    value={scheduleFreq}
                    onChange={(e) => setScheduleFreq(e.target.value)}
                  >
                    <option value="Daily">Daily Morning Digest (08:00 AM)</option>
                    <option value="Weekly">Weekly Summary (Every Monday 08:00 AM)</option>
                    <option value="Monthly">Monthly Financial Period Closing</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Recipient Roles (Section 14) *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    {['Department Head (HOD)', 'Admin Team', 'Technicians', 'End Users', 'Management'].map((role) => (
                      <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input
                          type="checkbox"
                          checked={scheduleRecipients.includes(role)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setScheduleRecipients([...scheduleRecipients, role])
                            } else {
                              setScheduleRecipients(scheduleRecipients.filter((r) => r !== role))
                            }
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="form-field-label">Export Attachment Format *</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <input type="radio" name="fmt" defaultChecked /> Microsoft Excel (.xlsx)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <input type="radio" name="fmt" /> PDF Document (.pdf)
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-dialog-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold">
                  <Calendar size={14} /> Confirm Automated Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
