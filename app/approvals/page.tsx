"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  FileText,
  ChevronRight,
  Plus
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"

// Simple checkbox component to avoid RovingFocusGroup issues
const SimpleCheckbox = ({ checked, onCheckedChange }: { checked?: boolean; onCheckedChange?: (checked: boolean) => void }) => (
  <div 
    className="w-4 h-4 border-2 border-slate-300 rounded cursor-pointer hover:border-blue-500 transition-colors"
    onClick={() => onCheckedChange?.(!checked)}
  >
    {checked && (
      <div className="w-full h-full bg-blue-500 rounded flex items-center justify-center">
        <CheckCircle className="w-2 h-2 text-white" />
      </div>
    )}
  </div>
)

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
    description: "Budget approval for digital marketing campaigns including social media ads.",
    requester: {
      name: "Sarah Johnson",
      email: "s.johnson@company.com",
      department: "Marketing",
    },
    workflow: { name: "Marketing Campaign", currentStep: "Final Review", totalSteps: 4, stepNumber: 3 },
    status: "pending",
    priority: "high",
    amount: 15000,
    category: "Finance",
    submittedAt: "2024-01-15T10:30:00Z",
    dueDate: "2024-01-18T17:00:00Z",
    assignedTo: ["John Admin"],
    attachments: 3,
    comments: 2,
    tags: ["budget", "q1"],
  },
  {
    id: "REQ-002",
    title: "Software License Renewal - Adobe",
    description: "Annual renewal of Adobe Creative Suite licenses.",
    requester: {
      name: "Mike Chen",
      email: "m.chen@company.com",
      department: "IT",
    },
    workflow: { name: "Purchase Order", currentStep: "Manager Approval", totalSteps: 2, stepNumber: 1 },
    status: "approved",
    priority: "medium",
    amount: 2400,
    category: "Procurement",
    submittedAt: "2024-01-14T14:20:00Z",
    dueDate: "2024-01-20T17:00:00Z",
    assignedTo: ["IT Manager"],
    attachments: 2,
    comments: 1,
    tags: ["software"],
  },
]

export default function ApprovalsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const isManager = user?.role === "manager"

  const [requests] = useState<ApprovalRequest[]>(MOCK_REQUESTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])

  const filteredRequests = requests.filter((request) => {
    const canSee = isAdmin || (isManager && request.requester.department === user?.department) || request.requester.name === user?.name || request.assignedTo.includes(user?.name || "")
    if (!canSee) return false
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) || request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100"
      case "approved": return "bg-emerald-50 text-emerald-600 border-emerald-100"
      case "rejected": return "bg-rose-50 text-rose-600 border-rose-100"
      case "escalated": return "bg-orange-50 text-orange-600 border-orange-100"
      default: return "bg-slate-50 text-slate-600 border-slate-100"
    }
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-rose-500 text-white"
      case "high": return "bg-orange-400 text-white"
      case "medium": return "bg-blue-400 text-white"
      default: return "bg-slate-300 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Approvals</h1>
            <p className="text-slate-500 mt-2 font-medium">Review, track, and manage all organizational requests in one place.</p>
          </div>
          <Link href="/requests/new">
            <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-xl font-bold shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4 mr-2" />
              New Submission
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-hidden inline-flex">
            {[
              { id: "pending", label: "Pending", icon: Clock },
              { id: "approved", label: "Completed", icon: CheckCircle },
              { id: "all", label: "Historical", icon: FileText }
            ].map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                  statusFilter === tab.id 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-blue-500"
                placeholder="Filter by subject or requester..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold bg-white px-6">
              <Filter className="w-4 h-4 mr-2" />
              Refine Search
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <div className="col-span-1 flex items-center"><SimpleCheckbox /></div>
                <div className="col-span-5">Subject & Requester</div>
                <div className="col-span-2">Value</div>
                <div className="col-span-2">Progress</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-50/30 transition-colors group">
                    <div className="col-span-1">
                      <SimpleCheckbox 
                        checked={selectedRequests.includes(request.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRequests([...selectedRequests, request.id])
                          } else {
                            setSelectedRequests(selectedRequests.filter(id => id !== request.id))
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs shadow-inner">
                          {request.requester.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">{request.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{request.requester.name}</span>
                            <span className="text-[10px] font-extrabold text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{request.requester.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 font-black text-slate-900">
                      {request.amount ? `$${request.amount.toLocaleString()}` : '---'}
                    </div>
                    <div className="col-span-2">
                      <Badge className={`${getStatusStyles(request.status)} border rounded-full px-3 py-1 text-[10px] font-bold uppercase`}>
                        {request.status}
                      </Badge>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(request.workflow.stepNumber / request.workflow.totalSteps) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{request.workflow.stepNumber}/{request.workflow.totalSteps}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <Link href={`/approvals/${request.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-xl font-bold text-blue-600 hover:bg-blue-50">
                          Manage
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}

                {filteredRequests.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Clock className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-900">Zero active requests</h3>
                    <p className="text-slate-500 text-sm mt-1">Everything is up to date in this view.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-4 pt-4">
              <p>Showing {filteredRequests.length} results</p>
              <div className="flex gap-4 cursor-pointer hover:text-blue-600">
                <span>Export CSV</span>
                <span>•</span>
                <span>Print Report</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

