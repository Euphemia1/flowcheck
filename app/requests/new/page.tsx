"use client"

import React, { useState } from "react"
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
  Plus,
  Trash2,
  CheckCircle2,
  Clock

} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

interface ProcurementItem {
  item_name: string
  description: string
  quantity: number
  unit_price: number
  category: string
  specifications: Record<string, any>
}

interface RequestForm {
  title: string
  description: string
  urgency_level: string
  expected_delivery_date: string
  items: ProcurementItem[]
}

const CATEGORIES = [
  "IT Equipment",
  "Office Supplies", 
  "Software Licenses",
  "Professional Services",
  "Marketing Materials",
  "Facilities",
  "Travel & Entertainment",
  "Training & Development",
  "Other"
]

export default function NewRequestPage() {
  const { user } = useAuth()
  const [form, setForm] = useState<RequestForm>({
    title: "",
    description: "",
    urgency_level: "medium",
    expected_delivery_date: "",
    items: [
      {
        item_name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        category: "",
        specifications: {}
      }
    ]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateTotal = () => {
    return form.items.reduce((total: number, item: ProcurementItem) => total + (item.quantity * item.unit_price), 0)
  }

  const addItem = () => {
    setForm((prev: RequestForm) => ({
      ...prev,
      items: [...prev.items, {
        item_name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        category: "",
        specifications: {}
      }]
    }))
  }

  const removeItem = (index: number) => {
    if (form.items.length > 1) {
      setForm((prev: RequestForm) => ({
        ...prev,
        items: prev.items.filter((_: any, i: number) => i !== index)
      }))
    }
  }

  const updateItem = (index: number, field: keyof ProcurementItem, value: any) => {
    setForm((prev: RequestForm) => ({
      ...prev,
      items: prev.items.map((item: ProcurementItem, i: number) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/procurement/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          requester_id: user?.id,
          urgency_level: form.urgency_level,
          expected_delivery_date: form.expected_delivery_date || null,
          items: form.items.filter((item: ProcurementItem) => item.item_name && item.quantity > 0 && item.unit_price > 0)
        }),
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = `/requests/${data.request.id}`
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create request")
      }
    } catch (error) {
      console.error("Error creating request:", error)
      alert("Failed to create request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Procurement Request</h1>
            <p className="text-slate-500 font-medium">Submit a request for goods or services that require approval.</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <div className="px-4 py-2">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Items</p>
              <p className="text-xs font-bold text-slate-900">{form.items.length}</p>
            </div>
            <div className="px-4 py-2 border-l border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Value</p>
              <p className="text-xs font-bold text-slate-900">${calculateTotal().toLocaleString()}</p>
            </div>
            <div className="px-4 py-2 border-l border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Priority</p>
              <Badge className="bg-blue-600 text-[10px] uppercase">{form.urgency_level}</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-8">
            {/* Request Details */}
            <Card className="border-none shadow-2xl shadow-slate-200/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Request Details</CardTitle>
                <CardDescription>Provide the fundamental details for your procurement request.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">Request Title *</Label>
                  <Input
                    className="h-12 rounded-xl text-lg font-medium border-slate-200 focus:ring-blue-500"
                    placeholder="e.g., New Laptops for Development Team"
                    value={form.title}
                    onChange={(e: any) => setForm((prev: RequestForm) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Urgency Level</Label>
                    <Select value={form.urgency_level} onValueChange={(v: string) => setForm((prev: RequestForm) => ({ ...prev, urgency_level: v }))}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Expected Delivery Date</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="date"
                        className="pl-10 h-11 rounded-xl border-slate-200"
                        value={form.expected_delivery_date}
                        onChange={(e: any) => setForm((prev: RequestForm) => ({ ...prev, expected_delivery_date: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">Description</Label>
                  <Textarea
                    className="rounded-xl border-slate-200 min-h-[120px]"
                    placeholder="Provide a detailed description of why this procurement is necessary..."
                    value={form.description}
                    onChange={(e: any) => setForm((prev: RequestForm) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card className="border-none shadow-2xl shadow-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">Items</CardTitle>
                  <CardDescription>Add the items you need to procure</CardDescription>
                </div>
                <Button type="button" onClick={addItem} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {form.items.map((item: ProcurementItem, index: number) => (
                  <Card key={index} className="border border-slate-200 rounded-xl">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900">Item {index + 1}</h4>
                        {form.items.length > 1 && (
                          <Button type="button" onClick={() => removeItem(index)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Item Name *</Label>
                          <Input
                            placeholder="e.g., Dell Latitude Laptop"
                            value={item.item_name}
                            onChange={(e: any) => updateItem(index, 'item_name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Category</Label>
                          <Select value={item.category} onValueChange={(v: string) => updateItem(index, 'category', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Description</Label>
                        <Textarea
                          placeholder="Additional details about this item..."
                          value={item.description}
                          onChange={(e: any) => updateItem(index, 'description', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Quantity *</Label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            value={item.quantity}
                            onChange={(e: any) => updateItem(index, 'quantity', Number(e.target.value))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Unit Price ($) *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={item.unit_price}
                            onChange={(e: any) => updateItem(index, 'unit_price', Number(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm text-slate-600">Item Total: </span>
                        <span className="text-lg font-bold text-slate-900">
                          ${(item.quantity * item.unit_price).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-slate-900 text-white">
                <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                  <CardTitle className="text-lg font-bold">Request Summary</CardTitle>
                  <CardDescription className="text-slate-400">Review your submission</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Items</span>
                      <span className="text-sm font-bold text-right">{form.items.length}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Value</span>
                      <span className="text-xl font-extrabold text-blue-400">${calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Urgency</span>
                      <Badge className="bg-blue-600 text-[10px] uppercase">{form.urgency_level}</Badge>
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-xs font-bold text-slate-300">Ready for submission</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!form.title || form.items.some((item: ProcurementItem) => !item.item_name || item.quantity <= 0 || item.unit_price <= 0) || isSubmitting}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                  <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">
                    Submitted by {user?.name || 'User'}
                  </p>
                </CardContent>
              </Card>

              <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-blue-900 uppercase">Approval Workflow</h5>
                  <p className="text-xs text-blue-700 font-medium leading-relaxed mt-1">
                    Requests under $500 are auto-approved. Higher amounts require manager and finance approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
