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
  Forward,
  ChevronRight,
  ShieldAlert,
  Calendar,
  DollarSign,
  History,
  AlertCircle,
  Plus
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

const MOCK_REQUEST: ApprovalRequestDetail = {
  id: "REQ-001",
  title: "Marketing Campaign Budget Q1 2024",
  description: "Comprehensive budget approval for Q1 2024 digital marketing initiatives across Social Media, Search, and Display channels.",
  requester: {
    name: "Sarah Johnson",
    email: "s.johnson@flowcheck.io",
    department: "Marketing",
    role: "Senior Manager",
  },
  workflow: {
    name: "Budget Finalization",
    currentStep: "Finance Review",
    totalSteps: 4,
    stepNumber: 3,
    steps: [
      { name: "Concept Sync", status: "completed", assignee: "Marketing Lead", completedAt: "2024-01-14T09:00:00Z" },
      { name: "Legal T&Cs", status: "completed", assignee: "Org Counsel", completedAt: "2024-01-15T11:30:00Z" },
      { name: "Finance Review", status: "current", assignee: "Finance Team" },
      { name: "CEO Sign-off", status: "pending", assignee: "Executive Board" },
    ],
  },
  status: "pending",
  priority: "high",
  amount: 15000,
  category: "Finance",
  submittedAt: "2024-01-15T10:30:00Z",
  dueDate: "2024-01-22T17:00:00Z",
  assignedTo: ["Finance Team", "Management"],
  attachments: [
    { name: "Q1_Strategy.pdf", size: "2.4 MB", type: "PDF", url: "#" },
    { name: "Detailed_Budgets.xlsx", size: "156 KB", type: "Excel", url: "#" },
  ],
  comments: [
    { id: "1", author: "Legal Counsel", content: "Terms of service for the third-party agencies are approved.", timestamp: "2024-01-15T11:25:00Z", type: "approval" }
  ],
  tags: ["q1", "finance", "budget"],
  customFields: [
    { label: "Project Phase", value: "Execution", type: "text" },
    { label: "Expected ROI", value: "x4.5", type: "text" }
  ],
  history: [
    { action: "Submitted", user: "Sarah Johnson", timestamp: "2024-01-15T10:30:00Z" },
    { action: "Legal Approval", user: "Org Counsel", timestamp: "2024-01-15T11:30:00Z" },
  ]
}

export default function ApprovalRequestDetailPage({ params }: { params: { id: string } }) {
  const [request] = useState<ApprovalRequestDetail>(MOCK_REQUEST)
  const [comment, setComment] = useState("")

  // Use params.id if needed for fetching, for now we log it to avoid lint errors
  console.log("Viewing request:", params.id)

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-rose-50 text-rose-600 border-rose-100"
      case "high": return "bg-orange-50 text-orange-600 border-orange-100"
      default: return "bg-blue-50 text-blue-600 border-blue-100"
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/approvals" className="p-2 hover:bg-white rounded-xl transition-all group">
            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
          </Link>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Approvals</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">{request.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Info - Left 8 columns */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${getPriorityStyle(request.priority)} border rounded-full px-3 py-1 text-[10px] font-bold uppercase`}>
                  {request.priority} Priority
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-bold uppercase border-slate-200 text-slate-500">
                  {request.category}
                </Badge>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{request.title}</h1>
              <p className="text-slate-500 mt-4 text-lg leading-relaxed font-medium">{request.description}</p>
            </div>

            {/* Dynamic Fields Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Request ID</span>
                <span className="font-bold text-slate-900">{request.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Target Date</span>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {new Date(request.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Value</span>
                <div className="flex items-center gap-1 font-black text-slate-900 text-xl">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  {request.amount?.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Status</span>
                <div className="flex items-center gap-2 font-bold text-amber-600">
                  <Clock className="w-4 h-4" />
                  In Review
                </div>
              </div>
            </div>

            {/* Document/Attachment Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Documentation & Files
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {request.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{file.name}</p>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase">{file.type} • {file.size}</span>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity & Workflow Visualization */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Workflow Progression
              </h3>
              <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {request.workflow.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`absolute -left-[30px] top-1 h-[22px] w-[22px] rounded-full border-4 border-[#f8fafc] z-10 
                            ${step.status === 'completed' ? 'bg-emerald-500' : step.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`}
                    />
                    <div className={`p-6 rounded-[32px] border transition-all 
                            ${step.status === 'current' ? 'bg-white border-blue-100 shadow-xl shadow-blue-200/30 ring-1 ring-blue-50' : 'bg-transparent border-transparent opacity-60'}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-black text-slate-900 text-lg">{step.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Assigned: {step.assignee}</span>
                            {step.completedAt && (
                              <>
                                <span className="text-[10px] font-extrabold text-slate-300">•</span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase">Passed</span>
                              </>
                            )}
                          </div>
                        </div>
                        {step.completedAt && (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(step.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Control Panel - Right 4 columns */}
          <div className="lg:col-span-4 space-y-8">
            {/* Decision Box */}
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldAlert className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-black mb-6 relative z-10">Action Required</h3>
              <div className="space-y-4 relative z-10">
                <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Approve Request
                </Button>
                <Button className="w-full h-14 bg-rose-500 hover:bg-rose-600 rounded-2xl font-black text-lg shadow-lg shadow-rose-500/20">
                  <X className="w-6 h-6 mr-3" />
                  Reject
                </Button>
                <Button variant="ghost" className="w-full h-14 hover:bg-white/10 rounded-2xl font-bold border border-white/20">
                  <Forward className="w-5 h-5 mr-3" />
                  Delegate to Peer
                </Button>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current SLA Target</p>
                <p className="font-bold text-emerald-400">On Track (Due in 3 days)</p>
              </div>
            </div>

            {/* Requester Profile */}
            <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/40 p-2 overflow-hidden">
              <div className="p-8 bg-slate-50/50">
                <div className="flex items-center gap-5 mb-6">
                  <Avatar className="h-16 w-16 rounded-2xl font-black border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-blue-600 text-white text-xl">{request.requester.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl">{request.requester.name}</h4>
                    <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{request.requester.role}</p>
                  </div>
                </div>
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Department</span>
                    <span className="text-sm font-bold text-slate-900 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">{request.requester.department}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Approval Rating</span>
                    <span className="text-sm font-black text-emerald-600">98% High</span>
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-slate-100">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Internal Discussion</h5>
                <div className="space-y-4">
                  {request.comments.map(c => (
                    <div key={c.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative italic">
                      <p className="text-xs text-slate-600 leading-relaxed font-bold">"{c.content}"</p>
                    </div>
                  ))}
                  <div className="relative mt-6">
                    <Textarea
                      className="bg-slate-50 border-transparent rounded-[24px] min-h-[120px] focus:ring-blue-500 font-medium placeholder:text-slate-400"
                      placeholder="Add a secure comment..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    />
                    <Button onClick={() => setComment("")} disabled={!comment} className="absolute bottom-4 right-4 h-10 w-10 p-0 rounded-xl bg-slate-900 shadow-xl shadow-slate-400/20">
                      <Plus className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Safety & Compliance Card */}
            <div className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] flex items-start gap-4 shadow-lg shadow-blue-100/50">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-black text-blue-900 text-sm">Policy Verified</h4>
                <p className="text-xs text-blue-700 leading-relaxed mt-1 font-medium">This request aligns with the Corporate Expenditure Policy (V2.4). Routing is fully automated based on department logic.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

