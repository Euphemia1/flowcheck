"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Workflow, Building2, Users, Settings, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface SetupData {
  organizationType: string
  industryType: string
  companySize: string
  workflowTemplates: string[]
  approvalLevels: number
  notificationSettings: {
    email: boolean
    slack: boolean
    sms: boolean
  }
  customFields: Array<{ name: string; type: string; required: boolean }>
}

const ORGANIZATION_TYPES = [
  { value: "startup", label: "Startup", description: "Fast-moving, flexible approval processes" },
  { value: "enterprise", label: "Enterprise", description: "Complex, multi-level approval hierarchies" },
  { value: "nonprofit", label: "Non-Profit", description: "Grant and donation approval workflows" },
  { value: "government", label: "Government", description: "Compliance-focused approval processes" },
]

const INDUSTRY_TYPES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Construction",
  "Other",
]

const WORKFLOW_TEMPLATES = [
  { id: "expense", name: "Expense Approval", description: "Employee expense reimbursements" },
  { id: "purchase", name: "Purchase Orders", description: "Vendor and equipment purchases" },
  { id: "hr", name: "HR Processes", description: "Hiring, promotions, time-off requests" },
  { id: "marketing", name: "Marketing Campaigns", description: "Campaign budgets and content approval" },
  { id: "legal", name: "Legal Reviews", description: "Contract and document approvals" },
  { id: "it", name: "IT Requests", description: "Software licenses and system access" },
]

export default function OrganizationSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState<SetupData>({
    organizationType: "",
    industryType: "",
    companySize: "",
    workflowTemplates: [],
    approvalLevels: 2,
    notificationSettings: { email: true, slack: false, sms: false },
    customFields: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    // Simulate API call to save organization setup
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/dashboard")
  }

  const toggleWorkflowTemplate = (templateId: string) => {
    setSetupData((prev) => ({
      ...prev,
      workflowTemplates: prev.workflowTemplates.includes(templateId)
        ? prev.workflowTemplates.filter((id) => id !== templateId)
        : [...prev.workflowTemplates, templateId],
    }))
  }

  const addCustomField = () => {
    setSetupData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { name: "", type: "text", required: false }],
    }))
  }

  const updateCustomField = (index: number, field: string, value: any) => {
    setSetupData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeCustomField = (index: number) => {
    setSetupData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">ApprovalFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Setup</h1>
          <p className="text-gray-600">Let's configure your approval workflows to match your organization's needs</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            {/* Step 1: Organization Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Details</h2>
                  <p className="text-gray-600">Tell us about your organization to customize your experience</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Organization Type</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {ORGANIZATION_TYPES.map((type) => (
                        <div
                          key={type.value}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            setupData.organizationType === type.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSetupData((prev) => ({ ...prev, organizationType: type.value }))}
                        >
                          <h3 className="font-medium text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select onValueChange={(value) => setSetupData((prev) => ({ ...prev, industryType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRY_TYPES.map((industry) => (
                            <SelectItem key={industry} value={industry.toLowerCase()}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="size">Company Size</Label>
                      <Select onValueChange={(value) => setSetupData((prev) => ({ ...prev, companySize: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Workflow Templates */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Workflow Templates</h2>
                  <p className="text-gray-600">Choose the approval workflows your organization needs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {WORKFLOW_TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        setupData.workflowTemplates.includes(template.id)
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleWorkflowTemplate(template.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                        {setupData.workflowTemplates.includes(template.id) && (
                          <CheckCircle className="w-5 h-5 text-blue-600 ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {setupData.workflowTemplates.length} workflow templates
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    You can add more workflows or customize these later from your dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Approval Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Approval Configuration</h2>
                  <p className="text-gray-600">Configure approval levels and notification preferences</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Default Approval Levels</Label>
                    <p className="text-sm text-gray-600 mb-3">How many approval steps should most workflows have?</p>
                    <Select
                      value={setupData.approvalLevels.toString()}
                      onValueChange={(value) =>
                        setSetupData((prev) => ({ ...prev, approvalLevels: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Level (Direct approval)</SelectItem>
                        <SelectItem value="2">2 Levels (Manager → Director)</SelectItem>
                        <SelectItem value="3">3 Levels (Manager → Director → Executive)</SelectItem>
                        <SelectItem value="4">4+ Levels (Complex hierarchy)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Notification Preferences</Label>
                    <p className="text-sm text-gray-600 mb-3">How should users be notified about approvals?</p>
                    <div className="space-y-3">
                      {[
                        {
                          key: "email",
                          label: "Email Notifications",
                          description: "Send email alerts for pending approvals",
                        },
                        {
                          key: "slack",
                          label: "Slack Integration",
                          description: "Post notifications to Slack channels",
                        },
                        { key: "sms", label: "SMS Alerts", description: "Send text messages for urgent approvals" },
                      ].map((option) => (
                        <div key={option.key} className="flex items-start space-x-3">
                          <Checkbox
                            id={option.key}
                            checked={
                              setupData.notificationSettings[option.key as keyof typeof setupData.notificationSettings]
                            }
                            onCheckedChange={(checked) =>
                              setSetupData((prev) => ({
                                ...prev,
                                notificationSettings: {
                                  ...prev.notificationSettings,
                                  [option.key]: checked,
                                },
                              }))
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={option.key}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Custom Fields */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Custom Fields & Review</h2>
                  <p className="text-gray-600">Add custom fields and review your configuration</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-medium">Custom Fields (Optional)</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                        Add Field
                      </Button>
                    </div>

                    {setupData.customFields.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                        No custom fields added. Click "Add Field" to create organization-specific fields.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {setupData.customFields.map((field, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Input
                              placeholder="Field name"
                              value={field.name}
                              onChange={(e) => updateCustomField(index, "name", e.target.value)}
                              className="flex-1"
                            />
                            <Select
                              value={field.type}
                              onValueChange={(value) => updateCustomField(index, "type", value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                              </SelectContent>
                            </Select>
                            <Checkbox
                              checked={field.required}
                              onCheckedChange={(checked) => updateCustomField(index, "required", checked)}
                            />
                            <Label className="text-sm">Required</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomField(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Configuration Summary */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Configuration Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Organization Type:</span>
                        <span className="ml-2 font-medium">{setupData.organizationType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Industry:</span>
                        <span className="ml-2 font-medium">{setupData.industryType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Company Size:</span>
                        <span className="ml-2 font-medium">{setupData.companySize}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Approval Levels:</span>
                        <span className="ml-2 font-medium">{setupData.approvalLevels}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Workflow Templates:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {setupData.workflowTemplates.map((templateId) => {
                            const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId)
                            return (
                              <Badge key={templateId} variant="secondary" className="text-xs">
                                {template?.name}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 &&
                      (!setupData.organizationType || !setupData.industryType || !setupData.companySize)) ||
                    (currentStep === 2 && setupData.workflowTemplates.length === 0)
                  }
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleFinish} disabled={isLoading} className="flex items-center gap-2">
                  {isLoading ? "Setting up..." : "Complete Setup"}
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
