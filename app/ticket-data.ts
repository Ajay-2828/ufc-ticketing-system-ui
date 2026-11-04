export const roles = ['End User', 'Technician', 'HOD', 'Admin Team', 'Management', 'Testing Team', 'External Vendor'] as const
export type Role = (typeof roles)[number]

export const workflowConfig = {
  classifications: ['Applications', 'Networking', 'Security', 'Hardware'],
  subClassifications: ['Flexcube', 'Atomverse', 'Firewall', 'End User Computing'],
  issueTypes: ['Application not opening', 'Password reset', 'Login not working', 'Network connectivity'],
  changeSteps: ['Admin Review', 'HOD Approval', 'Management Approval', 'Implementation', 'Testing', 'Closure'],
}

export const tickets = [
  { id: 'INC-2024-0842', subject: 'Unable to access Flexcube after password reset', app: 'Flexcube', severity: 'High', status: 'Pending Approval', priority: 'P1', assignee: 'Unassigned', department: 'Core Banking', age: '2h 14m', sla: '06:42:18', created: 'Today, 09:42', creator: 'Amara Okafor', vendor: '—' },
  { id: 'INC-2024-0841', subject: 'VPN connection drops intermittently', app: 'Network Access', severity: 'Medium', status: 'In Progress', priority: 'P2', assignee: 'Daniel Mensah', department: 'Infrastructure', age: '5h 31m', sla: '01:18:42', created: 'Today, 06:25', creator: 'Chinedu Okoro', vendor: '—' },
  { id: 'INC-2024-0839', subject: 'Transaction timeout on customer onboarding', app: 'Atomverse', severity: 'Critical', status: 'Resolved', priority: 'P1', assignee: 'Maya Patel', department: 'Digital Banking', age: '1d 3h', sla: 'Breached', created: 'Yesterday, 14:08', creator: 'Tariq Bello', vendor: 'TechServe' },
  { id: 'INC-2024-0836', subject: 'New starter laptop and account setup', app: 'End User Computing', severity: 'Low', status: 'Closed', priority: 'P3', assignee: 'Ibrahim Sani', department: 'People Ops', age: '2d 6h', sla: 'Closed', created: 'Mon, 11:32', creator: 'Lena Woods', vendor: '—' },
  { id: 'INC-2024-0832', subject: 'Firewall rule request for partner API', app: 'Firewall', severity: 'High', status: 'In Progress', priority: 'P2', assignee: 'Daniel Mensah', department: 'Security', age: '3d 1h', sla: '12:09:33', created: 'Fri, 16:21', creator: 'Moses Adeyemi', vendor: 'SecureNet' },
]
