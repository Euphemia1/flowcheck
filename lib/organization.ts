// Organization configuration and workflow templates

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  steps: WorkflowStep[]
  fields: CustomField[]
  settings: WorkflowSettings
}

export interface WorkflowStep {
  id: string
  name: string
  type: "approval" | "notification" | "condition"
  approvers: ApproverConfig[]
  conditions?: StepCondition[]
  timeout?: number
  escalation?: EscalationConfig
}

export interface ApproverConfig {
  type: "role" | "user" | "manager" | "department"
  value: string
  required: boolean
  order: number
}

export interface StepCondition {
  field: string
  operator: "equals" | "greater_than" | "less_than" | "contains"
  value: any
}

export interface EscalationConfig {
  timeoutHours: number
  escalateTo: ApproverConfig[]
  notifyOriginal: boolean
}

export interface CustomField {
  id: string
  name: string
  type: "text" | "number" | "date" | "select" | "textarea" | "file"
  required: boolean
  options?: string[]
  validation?: FieldValidation
}

export interface FieldValidation {
  min?: number
  max?: number
  pattern?: string
  message?: string
}

export interface WorkflowSettings {
  allowDelegation: boolean
  requireComments: boolean
  autoAssign: boolean
  parallelApproval: boolean
  notificationSettings: NotificationSettings
}

export interface NotificationSettings {
  onSubmit: boolean
  onApproval: boolean
  onRejection: boolean
  onEscalation: boolean
  channels: ("email" | "slack" | "sms")[]
}

// Pre-built workflow templates for different organization types
export const WORKFLOW_TEMPLATES: Record<string, WorkflowTemplate[]> = {
  startup: [
    {
      id: "startup-expense",
      name: "Expense Approval",
      description: "Simple expense approval for startups",
      category: "Finance",
      steps: [
        {
          id: "manager-approval",
          name: "Manager Approval",
          type: "approval",
          approvers: [{ type: "manager", value: "direct", required: true, order: 1 }],
          timeout: 24,
        },
      ],
      fields: [
        { id: "amount", name: "Amount", type: "number", required: true },
        { id: "description", name: "Description", type: "textarea", required: true },
        { id: "receipt", name: "Receipt", type: "file", required: true },
      ],
      settings: {
        allowDelegation: true,
        requireComments: false,
        autoAssign: true,
        parallelApproval: false,
        notificationSettings: {
          onSubmit: true,
          onApproval: true,
          onRejection: true,
          onEscalation: true,
          channels: ["email"],
        },
      },
    },
    {
      id: "startup-purchase",
      name: "Purchase Request",
      description: "Equipment and software purchases",
      category: "Procurement",
      steps: [
        {
          id: "budget-check",
          name: "Budget Approval",
          type: "approval",
          approvers: [{ type: "role", value: "finance-manager", required: true, order: 1 }],
          conditions: [{ field: "amount", operator: "greater_than", value: 1000 }],
        },
      ],
      fields: [
        { id: "item", name: "Item Description", type: "text", required: true },
        { id: "vendor", name: "Vendor", type: "text", required: true },
        { id: "amount", name: "Cost", type: "number", required: true },
        { id: "justification", name: "Business Justification", type: "textarea", required: true },
      ],
      settings: {
        allowDelegation: false,
        requireComments: true,
        autoAssign: true,
        parallelApproval: false,
        notificationSettings: {
          onSubmit: true,
          onApproval: true,
          onRejection: true,
          onEscalation: false,
          channels: ["email", "slack"],
        },
      },
    },
  ],
  enterprise: [
    {
      id: "enterprise-expense",
      name: "Enterprise Expense Approval",
      description: "Multi-level expense approval for large organizations",
      category: "Finance",
      steps: [
        {
          id: "manager-approval",
          name: "Direct Manager",
          type: "approval",
          approvers: [{ type: "manager", value: "direct", required: true, order: 1 }],
          timeout: 48,
        },
        {
          id: "finance-approval",
          name: "Finance Review",
          type: "approval",
          approvers: [{ type: "department", value: "finance", required: true, order: 1 }],
          conditions: [{ field: "amount", operator: "greater_than", value: 5000 }],
          timeout: 72,
          escalation: {
            timeoutHours: 72,
            escalateTo: [{ type: "role", value: "finance-director", required: true, order: 1 }],
            notifyOriginal: true,
          },
        },
        {
          id: "executive-approval",
          name: "Executive Approval",
          type: "approval",
          approvers: [{ type: "role", value: "cfo", required: true, order: 1 }],
          conditions: [{ field: "amount", operator: "greater_than", value: 25000 }],
          timeout: 120,
        },
      ],
      fields: [
        { id: "amount", name: "Amount", type: "number", required: true },
        {
          id: "category",
          name: "Expense Category",
          type: "select",
          required: true,
          options: ["Travel", "Meals", "Office Supplies", "Software", "Training", "Other"],
        },
        { id: "description", name: "Description", type: "textarea", required: true },
        { id: "business-purpose", name: "Business Purpose", type: "textarea", required: true },
        { id: "receipt", name: "Receipt", type: "file", required: true },
        { id: "cost-center", name: "Cost Center", type: "text", required: true },
      ],
      settings: {
        allowDelegation: true,
        requireComments: true,
        autoAssign: true,
        parallelApproval: false,
        notificationSettings: {
          onSubmit: true,
          onApproval: true,
          onRejection: true,
          onEscalation: true,
          channels: ["email", "slack"],
        },
      },
    },
  ],
  nonprofit: [
    {
      id: "nonprofit-grant",
      name: "Grant Application Review",
      description: "Multi-stage grant application approval process",
      category: "Grants",
      steps: [
        {
          id: "program-review",
          name: "Program Manager Review",
          type: "approval",
          approvers: [{ type: "role", value: "program-manager", required: true, order: 1 }],
          timeout: 120,
        },
        {
          id: "finance-review",
          name: "Financial Review",
          type: "approval",
          approvers: [{ type: "role", value: "finance-director", required: true, order: 1 }],
          timeout: 168,
        },
        {
          id: "board-approval",
          name: "Board Approval",
          type: "approval",
          approvers: [{ type: "role", value: "board-chair", required: true, order: 1 }],
          conditions: [{ field: "amount", operator: "greater_than", value: 50000 }],
          timeout: 336,
        },
      ],
      fields: [
        { id: "grant-title", name: "Grant Title", type: "text", required: true },
        { id: "funder", name: "Funding Organization", type: "text", required: true },
        { id: "amount", name: "Grant Amount", type: "number", required: true },
        {
          id: "program-area",
          name: "Program Area",
          type: "select",
          required: true,
          options: ["Education", "Health", "Environment", "Community Development", "Arts"],
        },
        { id: "proposal", name: "Grant Proposal", type: "file", required: true },
        { id: "budget", name: "Budget Document", type: "file", required: true },
      ],
      settings: {
        allowDelegation: false,
        requireComments: true,
        autoAssign: true,
        parallelApproval: false,
        notificationSettings: {
          onSubmit: true,
          onApproval: true,
          onRejection: true,
          onEscalation: true,
          channels: ["email"],
        },
      },
    },
  ],
}

export class OrganizationService {
  static getWorkflowTemplates(organizationType: string): WorkflowTemplate[] {
    return WORKFLOW_TEMPLATES[organizationType] || []
  }

  static createCustomWorkflow(template: Partial<WorkflowTemplate>): WorkflowTemplate {
    return {
      id: `custom-${Date.now()}`,
      name: template.name || "Custom Workflow",
      description: template.description || "",
      category: template.category || "Custom",
      steps: template.steps || [],
      fields: template.fields || [],
      settings: {
        allowDelegation: true,
        requireComments: false,
        autoAssign: true,
        parallelApproval: false,
        notificationSettings: {
          onSubmit: true,
          onApproval: true,
          onRejection: true,
          onEscalation: true,
          channels: ["email"],
        },
        ...template.settings,
      },
    }
  }

  static validateWorkflow(workflow: WorkflowTemplate): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!workflow.name.trim()) {
      errors.push("Workflow name is required")
    }

    if (workflow.steps.length === 0) {
      errors.push("At least one workflow step is required")
    }

    workflow.steps.forEach((step, index) => {
      if (!step.name.trim()) {
        errors.push(`Step ${index + 1} name is required`)
      }
      if (step.approvers.length === 0) {
        errors.push(`Step ${index + 1} must have at least one approver`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
