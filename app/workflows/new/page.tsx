"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  FileText,
  ArrowRight,
  Workflow,
  FileCheck,
  DollarSign,
  Users,
  Clock,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface Template {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: string
  steps: number
}

const QUICK_TEMPLATES: Template[] = [
  {
    id: "leave",
    name: "Leave Request",
    description: "Standard vacation, sick leave, and PTO approval process",
    icon: Clock,
    category: "HR",
    steps: 3,
  },
  {
    id: "audit-access",
    name: "Audit Log Access",
    description: "Request for secure access to historical organizational logs",
    icon: FileText,
    category: "Compliance",
    steps: 4,
  },
  {
    id: "expense",
    name: "Expense Approval",
    description: "Standard employee expense reimbursement with manager approval",
    icon: DollarSign,
    category: "Finance",
    steps: 3,
  },
  {
    id: "inventory",
    name: "Inventory Request",
    description: "Request for hardware, supplies or equipment",
    icon: FileCheck,
    category: "Operations",
    steps: 3,
  },
]

export default function NewWorkflowPage() {
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [step, setStep] = useState<"select" | "configure">("select")

  const handleTemplateSelect = (templateId: string) => {
    const template = QUICK_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setWorkflowName(template.name)
      setWorkflowDescription(template.description)
      setSelectedTemplate(templateId)
      setStep("configure")
    }
  }

  const handleStartFromScratch = () => {
    setWorkflowName("")
    setWorkflowDescription("")
    setSelectedTemplate(null)
    setStep("configure")
  }

  const getCreateUrl = () => {
    const params = new URLSearchParams()
    if (workflowName) params.set("name", workflowName)
    if (workflowDescription) params.set("description", workflowDescription)
    if (selectedTemplate) params.set("template", selectedTemplate)
    return `/workflows/designer?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/workflows">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-4 h-4" />
                Back to Workflows
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === "select" ? "Create New Workflow" : "Configure Workflow"}
          </h1>
          <p className="text-gray-600">
            {step === "select"
              ? "Choose how you want to create your approval workflow"
              : "Enter workflow details and continue to the designer"}
          </p>
        </div>

        {step === "select" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Start from Scratch */}
            <Card
              className="cursor-pointer hover:shadow-md hover:border-gray-400 transition-all group"
              onClick={handleStartFromScratch}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                    <Plus className="w-7 h-7 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start from Scratch</h3>
                    <p className="text-gray-600 mb-4">
                      Build a custom workflow from the ground up using our visual designer. Perfect for unique approval processes.
                    </p>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <span>Create Custom Workflow</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Template */}
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Quick Start Templates</CardTitle>
                    <CardDescription>Pre-built workflows for common use cases</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {QUICK_TEMPLATES.map((template) => {
                  const Icon = template.icon
                  return (
                    <div
                      key={template.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group bg-white"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <Badge variant="secondary" className="text-xs font-normal">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{template.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  )
                })}
                <Link href="/workflows/templates">
                  <Button variant="outline" className="w-full mt-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse All Templates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Configure Step */
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    {selectedTemplate ? (
                      <FileText className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  <div>
                    <CardTitle>Workflow Details</CardTitle>
                    <CardDescription>
                      {selectedTemplate
                        ? "Template selected. Customize the details below."
                        : "Start building your custom workflow"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Workflow Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Marketing Campaign Approval"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this workflow is for and when it should be used..."
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    This helps team members understand when to use this workflow
                  </p>
                </div>

                {selectedTemplate && (
                  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-700" />
                      <span className="font-medium text-gray-900">Template Features</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      This template includes pre-configured approval steps. You can customize everything in the designer.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                    Back
                  </Button>
                  <Link href={getCreateUrl()} className="flex-[2]">
                    <Button
                      className="w-full h-12 text-base"
                      disabled={!workflowName.trim()}
                    >
                      <Workflow className="w-5 h-5 mr-2" />
                      Continue to Designer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
