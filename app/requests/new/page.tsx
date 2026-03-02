"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {

  ArrowLeft,
  Upload,
  X,
  FileText,
  DollarSign,
  Calendar,
  Users,
  ShoppingCart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock


} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Separator } from "@/components/ui/separator"

interface RequestForm {
  workflow: string
  title: string
  description: string
  priority: string
  amount?: number
  dueDate: string
  category: string
  tags: string[]
  attachments: File[]
  customFields: Record<string, string>
}

const WORKFLOWS = [
  { id: "expense", name: "Expense Approval", category: "Finance", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", fields: ["amount", "receiptType", "department"] },
  { id: "purchase", name: "Purchase Order", category: "Procurement", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", fields: ["amount", "vendorName", "budgetLine"] },
  { id: "leave", name: "Leave Request", category: "HR", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50", fields: ["startDate", "endDate", "leaveType"] },
  { id: "audit", name: "Audit Access", category: "Compliance", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50", fields: ["recordType", "reason", "accessLevel"] },
  { id: "inventory", name: "Asset Request", category: "Operations", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", fields: ["itemDescription", "quantity", "location"] },
  { id: "hiring", name: "Personnel Request", category: "HR", icon: Users, color: "text-rose-600", bg: "bg-rose-50", fields: ["positionTitle", "reason", "budgetScale"] },
]

export default function NewRequestPage() {
  const [form, setForm] = useState<RequestForm>({
    workflow: "",
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    category: "",
    tags: [],
    attachments: [],
    customFields: {},
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedWorkflow = WORKFLOWS.find((w) => w.id === form.workflow)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    window.location.href = "/approvals"
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }))
  }

  const removeAttachment = (index: number) => {
    setForm((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }))
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <Link href="/approvals" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Approvals
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Request</h1>
            <p className="text-slate-500 font-medium">Standardize your organizational workflows with intelligent routing.</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <div className="px-4 py-2 border-r border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Selected Workflow</p>
              <p className="text-xs font-bold text-slate-900">{selectedWorkflow?.name || 'Incomplete'}</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Priority</p>
              <Badge className="bg-blue-600 text-[10px] uppercase">{form.priority}</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2.5 space-y-10">
            {/* Workflow Picking Component - Visual Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">What are you requesting?</h3>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step 1 of 3</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WORKFLOWS.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setForm(prev => ({ ...prev, workflow: w.id, category: w.category }))}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group ${form.workflow === w.id
                      ? "border-blue-600 bg-white shadow-xl shadow-blue-100/50"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"
                      }`}
                  >
                    <div className="flex gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${w.bg} ${w.color}`}>
                        <w.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{w.name}</h4>
                          {form.workflow === w.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{w.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Details Form */}
            <Card className={`border-none shadow-2xl shadow-slate-200/50 transition-opacity ${!form.workflow ? 'opacity-50 pointer-events-none' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Request Content</CardTitle>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step 2 of 3</span>
                </div>
                <CardDescription>Provide the fundamental details for the approvers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">Request Title</Label>
                  <Input
                    className="h-12 rounded-xl text-lg font-medium border-slate-200 focus:ring-blue-500"
                    placeholder="e.g., Marketing Assets for Q4 Campaign"
                    value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Urgency Level</Label>
                    <Select value={form.priority} onValueChange={v => setForm(prev => ({ ...prev, priority: v }))}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Standard</SelectItem>
                        <SelectItem value="medium">Important</SelectItem>
                        <SelectItem value="high">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Target Resolution (Optional)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="date"
                        className="pl-10 h-11 rounded-xl border-slate-200"
                        value={form.dueDate}
                        onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">Detailed Context</Label>
                  <Textarea
                    className="rounded-xl border-slate-200 min-h-[120px]"
                    placeholder="Why is this request necessary? Include any relevant project codes or references."
                    value={form.description}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Smart Conditional Fields */}
            {selectedWorkflow && (
              <Card className="border-none shadow-2xl shadow-slate-200/50 border-t-4 border-blue-600 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    {selectedWorkflow.name} Details
                  </CardTitle>
                  <CardDescription>Intelligent fields required for this specific process.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {selectedWorkflow.fields.includes('amount') && (
                      <div className="space-y-3 col-span-2">
                        <Label className="text-sm font-bold text-blue-900 uppercase tracking-wider">Requested Amount</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                          <Input
                            type="number"
                            className="pl-8 h-12 text-xl font-bold rounded-2xl border-blue-100 bg-blue-50/30"
                            placeholder="0.00"
                            onChange={e => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                          />
                        </div>
                      </div>
                    )}

                    {selectedWorkflow.fields.map((field) => (
                      field !== 'amount' && (
                        <div key={field} className="space-y-3">
                          <Label className="text-sm font-bold text-slate-700 capitalize">
                            {field.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                          <Input
                            className="h-11 rounded-xl border-slate-200"
                            placeholder={`Enter ${field.toLowerCase()}...`}
                            onChange={e => setForm(prev => ({
                              ...prev,
                              customFields: { ...prev.customFields, [field]: e.target.value }
                            }))}
                          />
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attachment System */}
            <Card className="border-none shadow-2xl shadow-slate-200/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Documentation</CardTitle>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step 3 of 3</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center hover:bg-slate-50/50 hover:border-blue-200 transition-all cursor-pointer group" onClick={() => document.getElementById('file-upload')?.click()}>
                  <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="font-bold text-slate-900">Upload internal documentation</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">PDF, Excel, or high-res images up to 50MB</p>
                  <input type="file" multiple id="file-upload" className="hidden" onChange={handleFileUpload} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{file.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeAttachment(idx); }}>
                        <X className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1.5 space-y-6">
            <div className="sticky top-24">
              <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-slate-900 text-white">
                <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                  <CardTitle className="text-lg font-bold">Request Summary</CardTitle>
                  <CardDescription className="text-slate-400">Live preview of your submission</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</span>
                      <span className="text-sm font-bold text-right">{selectedWorkflow?.name || '---'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</span>
                      <p className="text-sm font-bold text-right max-w-[120px] truncate">{form.title || '---'}</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Value</span>
                      <span className="text-xl font-extrabold text-blue-400">{form.amount ? `$${form.amount.toLocaleString()}` : '$0'}</span>
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-xs font-bold text-slate-300">Intelligent Routing Ready</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!form.workflow || !form.title || isSubmitting}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 group"
                  >
                    {isSubmitting ? "Finalizing..." : "Submit for Approval"}
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">Signed digitally as {form.title || 'User'}</p>
                </CardContent>
              </Card>

              <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-blue-900 uppercase">Pro Tip</h5>
                  <p className="text-xs text-blue-700 font-medium leading-relaxed mt-1">Attachments increase approval speed by 40% on average.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
