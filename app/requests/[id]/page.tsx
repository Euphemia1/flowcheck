"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RequestDetail {
  id: string
  title: string
  description: string
  status: string
  urgency_level: string
  total_amount: number
  created_at: string
  requester?: { name?: string; email?: string; department?: string }
  items?: Array<{ id: string; item_name: string; quantity: number; unit_price: number; total_price?: number; category?: string }>
  approval_steps?: Array<{ id: string; step_order: number; approver_role: string; status: string; comments?: string; approver?: { name?: string } }>
}

export default function RequestDetailPage({ params }: { params: { id: string } }) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 max-w-5xl">Loading request...</main>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <p className="text-slate-600">Request not found.</p>
          <Link href="/requests" className="inline-block mt-4">
            <Button variant="outline">Back to Requests</Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <Link href="/requests" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Requests
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{request.title}</span>
              <Badge variant="outline" className="uppercase">{request.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">{request.description || "No description provided."}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-slate-500">Requester</p><p className="font-semibold">{request.requester?.name || "N/A"}</p></div>
              <div><p className="text-slate-500">Department</p><p className="font-semibold">{request.requester?.department || "N/A"}</p></div>
              <div><p className="text-slate-500">Urgency</p><p className="font-semibold capitalize">{request.urgency_level}</p></div>
              <div><p className="text-slate-500">Amount</p><p className="font-semibold">${Number(request.total_amount || 0).toLocaleString()}</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(request.items || []).map((item) => (
              <div key={item.id} className="rounded-xl border p-3 bg-white">
                <div className="font-semibold">{item.item_name}</div>
                <div className="text-sm text-slate-600">Qty: {item.quantity} x ${Number(item.unit_price).toLocaleString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Approval Flow</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {sortedSteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm">
                  <p className="font-semibold">Step {step.step_order}: {step.approver_role}</p>
                  <p className="text-slate-500">Approver: {step.approver?.name || "Unassigned"}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {step.status === "approved" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {step.status === "rejected" && <XCircle className="w-4 h-4 text-red-600" />}
                  {step.status === "pending" && <Clock className="w-4 h-4 text-amber-600" />}
                  <span className="capitalize">{step.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
