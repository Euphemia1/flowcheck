"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  CheckCircle,
  X,
  Clock,
  FileText,
  Download,
  MessageSquare,
  Forward,
  UserCheck,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface ApprovalRequestDetail {
  id: string
  title: string
  description: string
  requester: {
    name: string
    email: string
    avatar?: string
    department: string
    role: string
  }
  workflow: {
    name: string
    currentStep: string
    totalSteps: number
    stepNumber: number
    steps: Array<{
      name: string
      status: "completed" | "current" | "pending"
      assignee: string
      completedAt?: string
      comments?: string
    }>
  }
  status: "pending" | "approved" | "rejected" | "escalated" | "delegated"
  priority: "low" | "medium" | "high" | "urgent"
  amount?: number
  category: string
  submittedAt: string
  dueDate: string
  assignedTo: string[]
  attachments: Array<{
    name: string
    size: string
    type: string
    url: string
  }>
  comments: Array<{
    id: string
    author: string
    content: string
    timestamp: string
    type: "comment" | "approval" | "rejection" | "delegation"
  }>
  tags: string[]
  customFields: Array<{
    label: string
    value: string
    type: string
  }>
  history: Array<{
    action: string
    user: string
    timestamp: string
    details?: string
  }>
}

// Mock data for demonstration
const MOCK_REQUEST: ApprovalRequestDetail = {
  id: "REQ-001",
  title: "Marketing Campaign Budget Q1 2024",
  description:
    "Budget approval for digital marketing campaigns including social media ads, Google Ads, and content creation for Q1 2024. This campaign aims to increase brand awareness by 25% and generate 500 new qualified leads. The budget breakdown includes: Social Media Advertising ($8,000), Google Ads ($5,000), Content Creation ($2,000).",
  requester: {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "/diverse-woman-portrait.png",
    department: "Marketing",
    role: "Marketing Manager",
  },
  workflow: {
    name: "Marketing Campaign Approval",
    currentStep: "Budget Review",
    totalSteps: 4,
    stepNumber: 2,
    steps: [
      {
        name: "Initial Review",
        status: "completed",
        assignee: "Marketing Director",
        completedAt: "2024-01-15T11:30:00Z",
        comments: "Campaign strategy looks solid. Approved for budget review.",
      },
      {
        name: "Budget Review",
        status: "current",
        assignee: "Finance Manager",
      },
      {
        name: "Executive Approval",
        status: "pending",
        assignee: "VP Marketing",
      },
      {
        name: "Final Sign-off",
        status: "pending",
        assignee: "CMO",
      },
    ],
  },
  status: "pending",
  priority: "high",
  amount: 15000,
  category: "Marketing",
  submittedAt: "2024-01-15T10:30:00Z",
  dueDate: "2024-01-18T17:00:00Z",
  assignedTo: ["John Admin", "Finance Team"],
  attachments: [
    {
      name: "Q1_Marketing_Strategy.pdf",
      size: "2.4 MB",
      type: "PDF",
      url: "#",
    },
    {
      name: "Budget_Breakdown.xlsx",
      size: "156 KB",
      type: "Excel",
      url: "#",
    },
    {
      name: "Campaign_Mockups.zip",
      size: "8.7 MB",
      type: "Archive",
      url: "#",
    },
  ],
  comments: [
    {
      id: "1",
      author: "Marketing Director",
      content:
        "The campaign strategy aligns well with our Q1 objectives. The target metrics are realistic and achievable.",
      timestamp: "2024-01-15T11:30:00Z",
      type: "approval",
    },
    {
      id: "2",
      author: "Sarah Johnson",
      content:
        "Added additional budget breakdown in the Excel file. Happy to discuss any questions about the allocation.",
      timestamp: "2024-01-15T12:15:00Z",
      type: "comment",
    },
  ],
  tags: ["budget", "q1", "digital", "campaigns"],
  customFields: [
    {
      label: "Campaign Duration",
      value: "3 months (Jan-Mar 2024)",
      type: "text",
    },
    {
      label: "Target Audience",
      value: "B2B SaaS companies, 50-500 employees",
      type: "text",
    },
    {
      label: "Expected ROI",
      value: "300%",
      type: "text",
    },
  ],
  history: [
    {
      action: "Request Submitted",
      user: "Sarah Johnson",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      action: "Assigned to Marketing Director",
      user: "System",
      timestamp: "2024-01-15T10:31:00Z",
    },
    {
      action: "Approved by Marketing Director",
      user: "Marketing Director",
      timestamp: "2024-01-15T11:30:00Z",
      details: "Campaign strategy looks solid. Approved for budget review.",
    },
    {
      action: "Assigned to Finance Manager",
      user: "System",
      timestamp: "2024-01-15T11:31:00Z",
    },
  ],
}

export default function ApprovalRequestDetailPage({ params }: { params: { id: string } }) {
  const [request] = useState<ApprovalRequestDetail>(MOCK_REQUEST)
  const [comment, setComment] = useState("")
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [showDelegationModal, setShowDelegationModal] = useState(false)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const handleApprove = () => {
    console.log("Approving request:", request.id)
    setShowApprovalModal(false)
  }

  const handleReject = () => {
    console.log("Rejecting request:", request.id)
    setShowRejectionModal(false)
  }

  const handleDelegate = () => {
    console.log("Delegating request:", request.id)
    setShowDelegationModal(false)
  }

  const addComment = () => {
    if (comment.trim()) {
      console.log("Adding comment:", comment)
      setComment("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/approvals">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Approvals
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                <Clock className="w-4 h-4" />
                {request.status}
              </Badge>
              <Badge className={`${getPriorityColor(request.priority)}`}>{request.priority} priority</Badge>
              <Badge variant="outline">{request.category}</Badge>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{request.title}</h1>
              <p className="text-gray-600">Request ID: {request.id}</p>
            </div>

            {request.status === "pending" && (
              <div className="flex gap-2">
                <Button onClick={() => setShowApprovalModal(true)} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => setShowRejectionModal(true)}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => setShowDelegationModal(true)} variant="outline">
                  <Forward className="w-4 h-4 mr-2" />
                  Delegate
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{request.description}</p>
                </div>

                {request.customFields.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {request.customFields.map((field, index) => (
                        <div key={index}>
                          <Label className="text-sm text-gray-600">{field.label}</Label>
                          <p className="font-medium">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {request.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {request.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workflow Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Progress</CardTitle>
                <CardDescription>
                  {request.workflow.name} - Step {request.workflow.stepNumber} of {request.workflow.totalSteps}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {request.workflow.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : step.status === "current"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : step.status === "current" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 bg-current rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{step.name}</h4>
                          <span className="text-sm text-gray-500">{step.assignee}</span>
                        </div>
                        {step.completedAt && (
                          <p className="text-sm text-gray-500 mt-1">Completed on {formatDate(step.completedAt)}</p>
                        )}
                        {step.comments && (
                          <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">{step.comments}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {request.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments ({request.attachments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {request.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-sm text-gray-500">
                              {attachment.type} • {attachment.size}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments & Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Label htmlFor="comment">Add Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Add your comment or feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={addComment} disabled={!comment.trim()}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {request.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/abstract-geometric-shapes.png" />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
                          {comment.type === "approval" && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
                          )}
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={request.requester.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{request.requester.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{request.requester.name}</p>
                    <p className="text-sm text-gray-500">{request.requester.role}</p>
                    <p className="text-sm text-gray-500">{request.requester.department}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Submitted</span>
                    <span className="font-medium">{formatDate(request.submittedAt)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Due Date</span>
                    <span className="font-medium">{formatDate(request.dueDate)}</span>
                  </div>

                  {request.amount && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium text-lg">{formatCurrency(request.amount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Assigned To</span>
                    <span className="font-medium">{request.assignedTo.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full History
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Request
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Change Assignee
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50 bg-transparent">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel Request
                </Button>
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {request.history.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-500">
                          {item.user} • {formatDate(item.timestamp)}
                        </p>
                        {item.details && <p className="text-xs text-gray-600 mt-1">{item.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
