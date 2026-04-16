"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Plus, CheckCircle, Clock, XCircle, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface MyRequest {
  id: string
  title: string
  status: string
  urgency_level?: string
  total_amount?: string | number
  created_at?: string
  items?: unknown[]
  approval_steps?: Array<{
    id: string
    step_order: number
    approver_role: string
    status: string
    comments?: string
    actioned_at?: string
    approver?: { name?: string }
  }>
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-900 border-amber-200"
    case "approved":
      return "bg-emerald-50 text-emerald-900 border-emerald-200"
    case "rejected":
      return "bg-red-50 text-red-900 border-red-200"
    case "draft":
      return "bg-slate-100 text-slate-700 border-slate-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

export function RequesterDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<MyRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/procurement/requests?requester_id=${user.id}&limit=100`)
        const data = await res.json()
        setRequests(data.requests || [])
      } catch (e) {
        console.error("Requester dashboard load failed", e)
        setRequests([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    draft: requests.filter((r) => r.status === "draft").length,
  }

  const recent = [...requests].sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-slate-200 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-3 bg-slate-200 rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 rounded w-12 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-slate-500">Submitted</CardTitle>
            <Send className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{counts.total}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">All your requests</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-slate-500">In progress</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{counts.pending}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Awaiting approvals</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-slate-500">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{counts.approved}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Completed successfully</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wide text-slate-500">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{counts.rejected}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Not approved</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/requests/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            New request
          </Button>
        </Link>
        <Link href="/requests">
          <Button variant="outline" className="border-slate-200 font-semibold rounded-xl">
            <FileText className="w-4 h-4 mr-2" />
            View all my requests
          </Button>
        </Link>
      </div>

      <Card className="border border-slate-200 bg-white">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Your requests</CardTitle>
            <CardDescription>Open a request to see line items and every approval action.</CardDescription>
          </div>
          {counts.draft > 0 && (
            <Badge variant="outline" className="shrink-0">
              {counts.draft} draft{counts.draft !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="text-center py-14 px-4">
              <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">You have not submitted any requests yet.</p>
              <Link href="/requests/new" className="inline-block mt-4">
                <Button size="sm" className="font-bold">
                  Create your first request
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((req) => {
                const steps = [...(req.approval_steps || [])].sort((a, b) => a.step_order - b.step_order)
                const lastAction = [...steps]
                  .reverse()
                  .find((s) => s.status === "approved" || s.status === "rejected")
                return (
                  <li key={req.id} className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 truncate">{req.title}</h3>
                        <Badge className={`text-[10px] uppercase font-bold border ${statusBadgeClass(req.status)}`}>
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        ${Number(req.total_amount || 0).toLocaleString()}
                        {(req.items?.length ?? 0) > 0 && (
                          <span> · {(req.items?.length ?? 0)} line item{(req.items?.length ?? 0) !== 1 ? "s" : ""}</span>
                        )}
                      </p>
                      {steps.length > 0 && (
                        <p className="text-xs text-slate-400 mt-2">
                          {steps.filter((s) => s.status === "pending").length > 0
                            ? `Waiting on: ${steps.find((s) => s.status === "pending")?.approver_role || "approver"}`
                            : lastAction
                              ? `Last action: ${lastAction.approver_role} — ${lastAction.status}`
                              : "Approval workflow started"}
                        </p>
                      )}
                    </div>
                    <Link href={`/requests/${req.id}`}>
                      <Button variant="outline" size="sm" className="font-semibold rounded-xl shrink-0">
                        View detail
                      </Button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
