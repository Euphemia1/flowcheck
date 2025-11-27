"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Eye,
  MessageSquare,
  Forward,
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface ApprovalRequest {
  id: string
  title: string
  description: string
  requester: {
    name: string
    email: string
    avatar?: string
    department: string
  }
  workflow: {
    name: string
    currentStep: string
    totalSteps: number
    stepNumber: number
  }
  status: "pending" | "approved" | "rejected" | "escalated" | "delegated"
  priority: "low" | "medium" | "high" | "urgent"
  amount?: number
  category: string
  submittedAt: string
  dueDate: string
  assignedTo: string[]
  attachments: number
  comments: number
  tags: string[]
}

const MOCK_REQUESTS: ApprovalRequest[] = [
  {
    id: "REQ-001",
    title: "Marketing Campaign Budget Q1 2024",
    description:
      "Budget approval for digital marketing campaigns including social media ads, Google Ads, and content creation for Q1 2024",
    requester: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "/diverse-woman-portrait.png",
      department: "Marketing",
    },
    workflow: {
      name: "Marketing Campaign Approval",
      currentStep: "Budget Review",
      totalSteps: 4,
      stepNumber: 2,
    },
    status: "pending",
    priority: "high",
    amount: 15000,
    category: "Marketing",
    submittedAt: "2024-01-15T10:30:00Z",
    dueDate: "2024-01-18T17:00:00Z",
    assignedTo: ["John Admin", "Finance Team"],
    attachments: 3,
    comments: 2,
    tags: ["budget", "q1", "digital"],
  },
  {
    id: "REQ-002",
    title: "Software License Renewal - Adobe Creative Suite",
    description: "Annual renewal of Adobe Creative Suite licenses for the design team (10 licenses)",
    requester: {
      name: "Mike Chen",
      email: "mike.chen@company.com",
      avatar: "/thoughtful-man.png",
      department: "IT",
    },
    workflow: {
      name: "Purchase Order Approval",
      currentStep: "Manager Approval",
      totalSteps: 3,
      stepNumber: 1,
    },
    status: "pending",
    priority: "medium",
    amount: 2400,
    category: "IT",
    submittedAt: "2024-01-14T14:20:00Z",
    dueDate: "2024-01-20T17:00:00Z",
    assignedTo: ["IT Manager"],
    attachments: 2,
    comments: 1,
    tags: ["software", "renewal", "adobe"],
  },
  {
    id: "REQ-003",
    title: "New Employee Onboarding - Jane Smith",
    description: "Complete onboarding process for new Senior Developer starting January 22nd",
    requester: {
      name: "Lisa HR",
      email: "lisa.hr@company.com",
      avatar: "/professional-woman.png",
      department: "Human Resources",
    },
    workflow: {
      name: "Employee Onboarding",
      currentStep: "IT Setup",
      totalSteps: 5,
      stepNumber: 3,
    },
    status: "pending",
    priority: "urgent",
    category: "HR",
    submittedAt: "2024-01-13T09:15:00Z",
    dueDate: "2024-01-19T17:00:00Z",
    assignedTo: ["IT Team", "Facilities"],
    attachments: 4,
    comments: 5,
    tags: ["onboarding", "developer", "urgent"],
  },
  {
    id: "REQ-004",
    title: "Office Equipment Purchase",
    description: "Purchase of standing desks and ergonomic chairs for the development team",
    requester: {
      name: "David Manager",
      email: "david.manager@company.com",
      avatar: "/man-manager.jpg",
      department: "Operations",
    },
    workflow: {
      name: "Purchase Order Approval",
      currentStep: "Finance Review",
      totalSteps: 3,
      stepNumber: 2,
    },
    status: "escalated",
    priority: "low",
    amount: 8500,
    category: "Operations",
    submittedAt: "2024-01-12T16:45:00Z",
    dueDate: "2024-01-25T17:00:00Z",
    assignedTo: ["Finance Director"],
    attachments: 1,
    comments: 3,
    tags: ["equipment", "ergonomic", "development"],
  },
  {
    id: "REQ-005",
    title: "Time Off Request - Vacation",
    description: "Vacation request for February 5-16, 2024 (10 business days)",
    requester: {
      name: "Alex Developer",
      email: "alex.dev@company.com",
      avatar: "/developer-working.png",
      department: "Engineering",
    },
    workflow: {
      name: "Time Off Request",
      currentStep: "Manager Approval",
      totalSteps: 2,
      stepNumber: 1,
    },
    status: "approved",
    priority: "low",
    category: "HR",
    submittedAt: "2024-01-10T11:30:00Z",
    dueDate: "2024-01-17T17:00:00Z",
    assignedTo: ["Engineering Manager"],
    attachments: 0,
    comments: 1,
    tags: ["vacation", "time-off"],
  },
]

export default function ApprovalsPage() {
  const [requests] = useState<ApprovalRequest[]>(MOCK_REQUESTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "escalated":
        return "bg-orange-100 text-orange-800"
      case "delegated":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <X className="w-4 h-4" />
      case "escalated":
        return <AlertTriangle className="w-4 h-4" />
      case "delegated":
        return <Forward className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId) ? prev.filter((id) => id !== requestId) : [...prev, requestId],
    )
  }

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(filteredRequests.map((r) => r.id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length
  const escalatedCount = requests.filter((r) => r.status === "escalated").length

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Approval Requests</h1>
              <p className="text-gray-600">Manage and review approval requests across your organization</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
              <Link href="/requests/new">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  {selectedRequests.length} request{selectedRequests.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Bulk Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Bulk Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    <Forward className="w-4 h-4 mr-2" />
                    Bulk Delegate
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved ({approvedCount})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Rejected ({rejectedCount})
            </TabsTrigger>
            <TabsTrigger value="escalated" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Escalated ({escalatedCount})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              All ({requests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <Checkbox
                checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                Select all {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <Checkbox
                        checked={selectedRequests.includes(request.id)}
                        onCheckedChange={() => handleSelectRequest(request.id)}
                        className="mt-1"
                      />

                      {/* Request Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Link href={`/approvals/${request.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                                  {request.title}
                                </h3>
                              </Link>
                              <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                                {getStatusIcon(request.status)}
                                {request.status}
                              </Badge>
                              <Badge className={`${getPriorityColor(request.priority)}`}>{request.priority}</Badge>
                              <Badge variant="outline">{request.category}</Badge>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>

                            {/* Request Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="text-gray-500">Requester:</span>
                                  <div className="font-medium">{request.requester.name}</div>
                                  <div className="text-gray-500 text-xs">{request.requester.department}</div>
                                </div>
                              </div>

                              {request.amount && (
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <span className="text-gray-500">Amount:</span>
                                    <div className="font-medium">{formatCurrency(request.amount)}</div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="text-gray-500">Due:</span>
                                  <div className="font-medium">{formatDate(request.dueDate)}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="text-gray-500">Assigned:</span>
                                  <div className="font-medium">{request.assignedTo.join(", ")}</div>
                                </div>
                              </div>
                            </div>

                            {/* Workflow Progress */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">
                                  {request.workflow.name} - Step {request.workflow.stepNumber} of{" "}
                                  {request.workflow.totalSteps}
                                </span>
                                <span className="text-sm font-medium text-blue-600">
                                  {request.workflow.currentStep}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{
                                    width: `${(request.workflow.stepNumber / request.workflow.totalSteps) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Tags and Metadata */}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {request.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {request.attachments > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    {request.attachments}
                                  </span>
                                )}
                                {request.comments > 0 && (
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    {request.comments}
                                  </span>
                                )}
                                <span>ID: {request.id}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            {request.status === "pending" && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Forward className="w-4 h-4 mr-2" />
                                  Delegate
                                </Button>
                              </>
                            )}
                            <Link href={`/approvals/${request.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? "Try adjusting your search criteria" : `No ${statusFilter} requests at the moment`}
                </p>
                <Link href="/requests/new">
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Create New Request
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
