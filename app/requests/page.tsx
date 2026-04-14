"use client"

import { useState, useEffect } from "react"
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
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

interface Request {
  id: string
  title: string
  description: string
  requester: {
    name: string
    email: string
    department: string
  }
  status: "pending" | "approved" | "rejected" | "draft"
  priority: "low" | "medium" | "high" | "critical"
  amount?: number
  category: string
  submittedAt: string
  updatedAt: string
  items: number
  workflow: {
    currentStep: string
    totalSteps: number
    stepNumber: number
  }
}

export default function RequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true)
      try {
        const query = new URLSearchParams()
        if (user?.role !== "admin" && user?.id) {
          query.set("requester_id", user.id)
        }

        const response = await fetch(`/api/procurement/requests?${query.toString()}`)
        const data = await response.json()
        const apiRequests = data?.requests || []

        const mappedRequests: Request[] = apiRequests.map((request: any) => {
          const sortedSteps = (request.approval_steps || []).sort((a: any, b: any) => a.step_order - b.step_order)
          const completedSteps = sortedSteps.filter((step: any) => step.status === "approved").length
          const currentStep = sortedSteps.find((step: any) => step.status === "pending")

          return {
            id: request.id,
            title: request.title,
            description: request.description || "",
            requester: {
              name: request.requester?.name || "Unknown",
              email: request.requester?.email || "",
              department: request.requester?.department || "General",
            },
            status: request.status,
            priority: request.urgency_level || "medium",
            amount: Number(request.total_amount || 0),
            category: request.items?.[0]?.category || "General",
            submittedAt: request.created_at,
            updatedAt: request.updated_at,
            items: request.items?.length || 0,
            workflow: {
              currentStep: currentStep?.approver_role || (request.status === "approved" ? "Completed" : "Draft"),
              totalSteps: sortedSteps.length || 1,
              stepNumber: request.status === "approved" ? sortedSteps.length : completedSteps + (currentStep ? 1 : 0),
            },
          }
        })

        setRequests(mappedRequests)
      } catch (error) {
        console.error("Failed to load requests:", error)
        setRequests([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) loadRequests()
  }, [user])

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending": return "bg-slate-100 text-slate-600 border-slate-200"
      case "approved": return "bg-slate-100 text-slate-600 border-slate-200"
      case "rejected": return "bg-slate-100 text-slate-600 border-slate-200"
      case "draft": return "bg-slate-50 text-slate-500 border-slate-200"
      default: return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-slate-700 text-white"
      case "high": return "bg-slate-600 text-white"
      case "medium": return "bg-slate-500 text-white"
      default: return "bg-slate-400 text-white"
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await fetch(`/api/procurement/requests/${requestId}?user_id=${user?.id || ""}`, {
          method: "DELETE",
        })
        setRequests(prev => prev.filter(req => req.id !== requestId))
      } catch (error) {
        console.error("Failed to delete request:", error)
      }
    }
  }

  const handleExportCsv = () => {
    const headers = ["Title", "Requester", "Department", "Status", "Priority", "Amount"]
    const rows = filteredRequests.map((request) => [
      request.title,
      request.requester.name,
      request.requester.department,
      request.status,
      request.priority,
      request.amount || 0,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "requests.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500">Loading requests...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex gap-6">
          <DashboardSidebar />
          <section className="min-w-0 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Requests</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage and track all procurement requests.</p>
          </div>
          <Link href="/requests/new">
            <Button className="bg-slate-700 hover:bg-slate-800 h-11 px-6 rounded-xl font-bold shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          {/* Status Tabs */}
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-hidden inline-flex">
            {[
              { id: "all", label: "All Requests", icon: FileText },
              { id: "pending", label: "Pending", icon: Clock },
              { id: "approved", label: "Approved", icon: CheckCircle },
              { id: "draft", label: "Drafts", icon: Edit }
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

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-slate-500"
                placeholder="Search by title or requester..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setPriorityFilter("all") }} className="h-12 border-slate-200 rounded-xl font-bold bg-white px-6">
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <div className="col-span-4">Request Details</div>
                <div className="col-span-2">Requester</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Value</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50 transition-colors group">
                    <div className="col-span-4">
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors cursor-pointer">
                          {request.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5">
                            {request.category}
                          </Badge>
                          <span className="text-[10px] text-slate-400">
                            {request.items} items
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className="h-full bg-slate-400 rounded-full"
                              style={{ width: `${(request.workflow.stepNumber / request.workflow.totalSteps) * 100}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">
                            {request.workflow.currentStep}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm">
                        <p className="font-bold text-slate-900">{request.requester.name}</p>
                        <p className="text-[10px] text-slate-500">{request.requester.department}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-2">
                        <Badge className={`${getStatusStyles(request.status)} border rounded-full px-3 py-1 text-[10px] font-bold uppercase`}>
                          {request.status}
                        </Badge>
                        <div>
                          <Badge className={`${getPriorityStyles(request.priority)} text-[9px] px-2 py-0.5`}>
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 font-black text-slate-900">
                      {request.amount ? `$${request.amount.toLocaleString()}` : '---'}
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/requests/${request.id}`}>
                          <Button variant="ghost" size="sm" className="rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {request.status === "draft" && (
                          <>
                            <Link href={`/requests/${request.id}/edit`}>
                              <Button variant="ghost" size="sm" className="rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-xl font-bold text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteRequest(request.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredRequests.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-900">No requests found</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {searchQuery ? "Try adjusting your search filters" : "Get started by creating your first request"}
                    </p>
                    {!searchQuery && (
                      <Link href="/requests/new" className="inline-block mt-4">
                        <Button className="bg-slate-700 hover:bg-slate-800">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Request
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-4 pt-4">
              <p>Showing {filteredRequests.length} of {requests.length} requests</p>
              <div className="flex gap-4">
                <button type="button" onClick={handleExportCsv} className="hover:text-slate-600">Export CSV</button>
                <span>•</span>
                <button type="button" onClick={() => window.print()} className="hover:text-slate-600">Print Report</button>
              </div>
            </div>
          </div>
        </div>
          </section>
        </div>
      </main>
    </div>
  )
}
