"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Copy,
  Users,
  Clock,
  DollarSign,
  FileText,
  Briefcase,
  Building2,
  Heart,
  Landmark,
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  organizationType: string
  steps: number
  estimatedTime: string
  popularity: number
  tags: string[]
  preview: {
    steps: Array<{
      name: string
      type: string
      icon: any
    }>
  }
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "expense-approval",
    name: "Expense Approval",
    description: "Standard employee expense reimbursement workflow with manager and finance approval",
    category: "Finance",
    organizationType: "All",
    steps: 3,
    estimatedTime: "2-4 hours",
    popularity: 95,
    tags: ["expenses", "reimbursement", "finance"],
    preview: {
      steps: [
        { name: "Submit Request", type: "start", icon: FileText },
        { name: "Manager Approval", type: "approval", icon: Users },
        { name: "Finance Review", type: "approval", icon: DollarSign },
        { name: "Complete", type: "end", icon: Clock },
      ],
    },
  },
  {
    id: "purchase-order",
    name: "Purchase Order Approval",
    description: "Multi-level approval for equipment and service purchases based on amount thresholds",
    category: "Procurement",
    organizationType: "Enterprise",
    steps: 4,
    estimatedTime: "1-3 days",
    popularity: 87,
    tags: ["procurement", "purchasing", "budget"],
    preview: {
      steps: [
        { name: "Purchase Request", type: "start", icon: FileText },
        { name: "Budget Check", type: "condition", icon: DollarSign },
        { name: "Manager Approval", type: "approval", icon: Users },
        { name: "Finance Approval", type: "approval", icon: Building2 },
        { name: "Complete", type: "end", icon: Clock },
      ],
    },
  },
  {
    id: "hr-onboarding",
    name: "Employee Onboarding",
    description: "Complete new hire onboarding process with IT setup and documentation",
    category: "HR",
    organizationType: "All",
    steps: 5,
    estimatedTime: "3-5 days",
    popularity: 78,
    tags: ["hr", "onboarding", "new hire"],
    preview: {
      steps: [
        { name: "New Hire Request", type: "start", icon: FileText },
        { name: "HR Review", type: "approval", icon: Users },
        { name: "IT Setup", type: "approval", icon: Building2 },
        { name: "Manager Assignment", type: "approval", icon: Users },
        { name: "Complete", type: "end", icon: Clock },
      ],
    },
  },
  {
    id: "time-off-request",
    name: "Time Off Request",
    description: "Simple vacation and sick leave approval workflow",
    category: "HR",
    organizationType: "All",
    steps: 2,
    estimatedTime: "1-2 hours",
    popularity: 92,
    tags: ["hr", "vacation", "time off"],
    preview: {
      steps: [
        { name: "Submit Request", type: "start", icon: FileText },
        { name: "Manager Approval", type: "approval", icon: Users },
        { name: "Complete", type: "end", icon: Clock },
      ],
    },
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign Approval",
    description: "Creative and budget approval for marketing campaigns and content",
    category: "Marketing",
    organizationType: "All",
    steps: 4,
    estimatedTime: "2-5 days",
    popularity: 71,
    tags: ["marketing", "creative", "budget"],
    preview: {
      steps: [
        { name: "Campaign Proposal", type: "start", icon: FileText },
        { name: "Creative Review", type: "approval", icon: Users },
        { name: "Budget Approval", type: "approval", icon: DollarSign },
        { name: "Final Approval", type: "approval", icon: Building2 },
        { name: "Complete", type: "end", icon: Clock },
      ],
    },
  },
  {
    id: "contract-review",
    name: "Contract Review",
    description: "Legal and business review process for contracts and agreements",
    category: "Legal",
    organizationType: "Enterprise",
    steps: 3,
    estimatedTime: "3-7 days",
    popularity: 65,
    tags: ["legal", "contracts", "compliance"],
    preview: {
      steps: [
        { name: "Contract Submission", type: "start", icon: FileText },
        { name: "Legal Review", type: "approval", icon: Users },
        { name: "Business Approval", type: "approval", icon: Building2 },
        { name: "Complete", type: "end", icon: Clock },
      ],
    },
  },
]

const CATEGORIES = [
  { id: "all", name: "All Templates", icon: FileText },
  { id: "finance", name: "Finance", icon: DollarSign },
  { id: "hr", name: "Human Resources", icon: Users },
  { id: "procurement", name: "Procurement", icon: Briefcase },
  { id: "marketing", name: "Marketing", icon: Heart },
  { id: "legal", name: "Legal", icon: Landmark },
]

const ORG_TYPES = [
  { id: "all", name: "All Organizations" },
  { id: "startup", name: "Startup" },
  { id: "enterprise", name: "Enterprise" },
  { id: "nonprofit", name: "Non-Profit" },
  { id: "government", name: "Government" },
]

export default function WorkflowTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedOrgType, setSelectedOrgType] = useState("all")

  const useTemplate = (templateId: string) => {
    // In a real app, this would create a new workflow from the template
    console.log("Using template:", templateId)
    // For now, redirect to designer with template data
    window.location.href = `/workflows/designer?template=${templateId}`
  }

  const duplicateTemplate = (templateId: string) => {
    console.log("Duplicating template:", templateId)
  }

  const filteredTemplates = WORKFLOW_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory

    const matchesOrgType =
      selectedOrgType === "all" ||
      template.organizationType.toLowerCase() === selectedOrgType ||
      template.organizationType === "All"

    return matchesSearch && matchesCategory && matchesOrgType
  })

  const WorkflowPreview = ({ template }: { template: WorkflowTemplate }) => (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        {template.preview.steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-blue-200">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600 mt-1 max-w-16 text-center">{step.name}</span>
              </div>
              {index < template.preview.steps.length - 1 && <div className="w-6 h-0.5 bg-blue-200 mt-4" />}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Templates</h1>
              <p className="text-gray-600">Choose from pre-built templates or create your own custom workflow</p>
            </div>
            <Link href="/workflows/designer">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Custom Workflow
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedOrgType}
                onChange={(e) => setSelectedOrgType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {ORG_TYPES.map((orgType) => (
                  <option key={orgType.id} value={orgType.id}>
                    {orgType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Sort by:</span>
                <select className="border border-gray-300 rounded px-2 py-1">
                  <option>Popularity</option>
                  <option>Name</option>
                  <option>Category</option>
                  <option>Steps</option>
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {template.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Workflow Preview */}
                    <WorkflowPreview template={template} />

                    {/* Template Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>{template.steps} steps</span>
                        <span>{template.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{template.popularity}% popular</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => useTemplate(template.id)} className="flex-1">
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => duplicateTemplate(template.id)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or create a custom workflow</p>
                <Link href="/workflows/designer">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Custom Workflow
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
