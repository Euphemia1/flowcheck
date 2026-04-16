"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface RequestDetail {
  id: string
  title: string
  description: string
  status: string
  urgency_level: string
  total_amount: number
  created_at: string
  updated_at?: string
  requester?: { id?: string; name?: string; email?: string; department?: string }
  items?: Array<{ id: string; item_name: string; quantity: number; unit_price: number; total_price?: number; category?: string }>
  approval_steps?: Array<{
    id: string
    step_order: number
    approver_role: string
    status: string
    comments?: string
    actioned_at?: string
    approver?: { name?: string; email?: string }
  }>
}

function formatTs(iso?: string) {
  if (!iso) return null
  try {
    return format(new Date(iso), "MMM d, yyyy · h:mm a")
  } catch {
    return iso
  }
}

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const isRequester = user?.role === "requester"
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/procurement/requests/${params.id}`)
        const data = await response.json()
        setRequest(data?.request || null)
      } catch (error) {
        console.error("Failed to fetch request detail:", error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [params.id])

  const sortedSteps = useMemo(
    () => [...(request?.approval_steps || [])].sort((a, b) => a.step_order - b.step_order),
    [request?.approval_steps]
  )

  const layout = (body: ReactNode) => (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          <DashboardSidebar />
          <section className="min-w-0 flex-1 space-y-6">{body}</section>
        </div>
      </main>
    </div>
  )

  if (isLoading) {
    return layout(<p className="text-slate-600">Loading request...</p>)
  }

  if (!request) {
    return layout(
      <>
        <p className="text-slate-600">Request not found or you don&apos;t have access.</p>
        <Link href="/requests" className="inline-block mt-4">
          <Button variant="outline">Back to requests</Button>
        </Link>
      </>
    )
  }

  return layout(
    <>
      <Link href="/requests" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {isRequester ? "Back to my requests" : "Back to requests"}
      </Link>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xl">{request.title}</span>
            <Badge variant="outline" className="uppercase w-fit">
              {request.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">{request.description || "No description provided."}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Requester</p>
              <p className="font-semibold">{request.requester?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500">Department</p>
              <p className="font-semibold">{request.requester?.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-500">Urgency</p>
              <p className="font-semibold capitalize">{request.urgency_level}</p>
            </div>
            <div>
              <p className="text-slate-500">Amount</p>
              <p className="font-semibold">${Number(request.total_amount || 0).toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Submitted {formatTs(request.created_at) || "—"}
            {request.updated_at && request.updated_at !== request.created_at && (
              <> · Updated {formatTs(request.updated_at)}</>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Line items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(request.items || []).length === 0 ? (
            <p className="text-sm text-slate-500">No line items.</p>
          ) : (
            (request.items || []).map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 p-3 bg-white">
                <div className="font-semibold">{item.item_name}</div>
                <div className="text-sm text-slate-600">
                  Qty: {item.quantity} × ${Number(item.unit_price).toLocaleString()}
                  {item.total_price != null && (
                    <span className="font-medium text-slate-800"> · ${Number(item.total_price).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Approval actions</CardTitle>
          <p className="text-sm text-slate-500 font-normal">
            Each step shows who acts, the decision, comments, and when it was recorded.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedSteps.length === 0 ? (
            <p className="text-sm text-slate-500">
              No approval steps yet (for example, amount under threshold or still draft).
            </p>
          ) : (
            sortedSteps.map((step) => (
              <div
                key={step.id}
                className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="text-sm space-y-1 min-w-0">
                  <p className="font-semibold">
                    Step {step.step_order}: <span className="capitalize">{step.approver_role}</span>
                  </p>
                  <p className="text-slate-600">
                    Approver: {step.approver?.name || "—"}
                    {step.approver?.email && (
                      <span className="text-slate-400"> ({step.approver.email})</span>
                    )}
                  </p>
                  {step.comments ? (
                    <p className="text-slate-700 mt-2 pl-3 border-l-2 border-slate-200">
                      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Comment · </span>
                      {step.comments}
                    </p>
                  ) : step.status !== "pending" ? (
                    <p className="text-xs text-slate-400 mt-1">No comment provided for this action.</p>
                  ) : null}
                  {step.actioned_at && (
                    <p className="text-xs text-slate-400 mt-1">Actioned {formatTs(step.actioned_at)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm shrink-0">
                  {step.status === "approved" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {step.status === "rejected" && <XCircle className="w-4 h-4 text-red-600" />}
                  {step.status === "pending" && <Clock className="w-4 h-4 text-amber-600" />}
                  <span className="capitalize font-medium">{step.status}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  )
}
