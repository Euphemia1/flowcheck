"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Copy,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface Workflow {
  id: string
  name: string
  description: string
  status: "active" | "draft" | "paused"
  category: string
  steps: number
  activeRequests: number
  completedRequests: number
  averageTime: string
  lastModified: string
  createdBy: string
}

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "1",
    name: "Expense Approval",
    description: "Standard employee expense reimbursement workflow",
    status: "active",
    category: "Finance",
    steps: 3,
    activeRequests: 12,
    completedRequests: 156,
    averageTime: "2.3 hours",
    lastModified: "2 days ago",
    createdBy: "John Admin",
  },
  {
    id: "2",
    name: "Purchase Order Approval",
    description: "Multi-level approval for equipment purchases",
    status: "active",
    category: "Procurement",
    steps: 4,
    activeRequests: 5,
    completedRequests: 89,
    averageTime: "1.2 days",
    lastModified: "1 week ago",
    createdBy: "Sarah Manager",
  },
  {
    id: "3",
    name: "Time Off Request",
    description: "Vacation and sick leave approval process",
    status: "active",
    category: "HR",
    steps: 2,
    activeRequests: 8,
    completedRequests: 234,
    averageTime: "45 minutes",
    lastModified: "3 days ago",
    createdBy: "Mike HR",
  },
  {
    id: "4",
    name: "Marketing Campaign Review",
    description: "Creative and budget approval for campaigns",
    status: "draft",
    category: "Marketing",
    steps: 4,
    activeRequests: 0,
    completedRequests: 0,
    averageTime: "-",
    lastModified: "1 day ago",
    createdBy: "Lisa Marketing",
  },
  {
    id: "5",
    name: "Contract Review Process",
    description: "Legal review for vendor contracts",
    status: "paused",
    category: "Legal",
    steps: 3,
    activeRequests: 2,
    completedRequests: 45,
    averageTime: "3.5 days",
    lastModified: "5 days ago",
    createdBy: "David Legal",
  },
]

export default function WorkflowsPage() {
  const [workflows] = useState<Workflow[]>(MOCK_WORKFLOWS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "draft":
        return <Edit className="w-4 h-4" />
      case "paused":
        return <Pause className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows</h1>
              <p className="text-gray-600">Manage your organization's approval workflows</p>
            </div>
            <div className="flex gap-2">
              <Link href="/workflows/templates">
                <Button variant="outline">Browse Templates</Button>
              </Link>
              <Link href="/workflows/designer">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Workflow
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.length}</div>
              <p className="text-xs text-muted-foreground">
                {workflows.filter((w) => w.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.reduce((sum, w) => sum + w.activeRequests, 0)}</div>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workflows.reduce((sum, w) => sum + w.completedRequests, 0)}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.8 hours</div>
              <p className="text-xs text-muted-foreground">-15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <Badge className={`${getStatusColor(workflow.status)} flex items-center gap-1`}>
                        {getStatusIcon(workflow.status)}
                        {workflow.status}
                      </Badge>
                      <Badge variant="outline">{workflow.category}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{workflow.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Steps:</span>
                        <span className="ml-1 font-medium">{workflow.steps}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Active:</span>
                        <span className="ml-1 font-medium text-orange-600">{workflow.activeRequests}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <span className="ml-1 font-medium text-green-600">{workflow.completedRequests}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg. Time:</span>
                        <span className="ml-1 font-medium">{workflow.averageTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Modified:</span>
                        <span className="ml-1 font-medium">{workflow.lastModified}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {workflow.status === "active" && (
                      <Button variant="outline" size="sm">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    {workflow.status === "paused" && (
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Link href={`/workflows/designer?id=${workflow.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first workflow"}
            </p>
            <div className="flex justify-center gap-2">
              <Link href="/workflows/templates">
                <Button variant="outline">Browse Templates</Button>
              </Link>
              <Link href="/workflows/designer">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
