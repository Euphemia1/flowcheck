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
import { ArrowLeft, Upload, X, FileText, DollarSign, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

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
  { id: "expense", name: "Expense Approval", category: "Finance", fields: ["amount", "receipt"] },
  { id: "purchase", name: "Purchase Order", category: "Procurement", fields: ["amount", "vendor", "justification"] },
  { id: "timeoff", name: "Time Off Request", category: "HR", fields: ["startDate", "endDate", "type"] },
  { id: "marketing", name: "Marketing Campaign", category: "Marketing", fields: ["budget", "duration", "audience"] },
  { id: "contract", name: "Contract Review", category: "Legal", fields: ["vendor", "value", "term"] },
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

  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedWorkflow = WORKFLOWS.find((w) => w.id === form.workflow)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Submitting request:", form)

    // Redirect to approvals page
    window.location.href = "/approvals"
  }

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
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
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Approval Request</h1>
          <p className="text-gray-600">Submit a new request for approval through your organization's workflow</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Type</CardTitle>
                  <CardDescription>Choose the appropriate approval workflow for your request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {WORKFLOWS.map((workflow) => (
                      <div
                        key={workflow.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          form.workflow === workflow.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            workflow: workflow.id,
                            category: workflow.category,
                          }))
                        }
                      >
                        <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{workflow.category}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Request Title *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a clear, descriptive title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Provide detailed information about your request..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={form.priority}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="datetime-local"
                        value={form.dueDate}
                        onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  {form.workflow && (
                    <div>
                      <Label htmlFor="amount">Amount (if applicable)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="amount"
                          type="number"
                          value={form.amount || ""}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              amount: e.target.value ? Number(e.target.value) : undefined,
                            }))
                          }
                          placeholder="0.00"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Workflow-Specific Fields */}
              {selectedWorkflow && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>Fields specific to {selectedWorkflow.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedWorkflow.fields.map((field) => (
                      <div key={field}>
                        <Label htmlFor={field} className="capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        {field.includes("Date") ? (
                          <Input
                            id={field}
                            type="date"
                            value={form.customFields[field] || ""}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                customFields: { ...prev.customFields, [field]: e.target.value },
                              }))
                            }
                          />
                        ) : (
                          <Input
                            id={field}
                            value={form.customFields[field] || ""}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                customFields: { ...prev.customFields, [field]: e.target.value },
                              }))
                            }
                            placeholder={`Enter ${field.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>Upload supporting documents, receipts, or other files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>

                  {form.attachments.length > 0 && (
                    <div className="space-y-2">
                      {form.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>Add tags to help categorize and search for this request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>

                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Request Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Workflow</span>
                    <span className="font-medium">{selectedWorkflow?.name || "Not selected"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Priority</span>
                    <Badge
                      className={
                        form.priority === "urgent"
                          ? "bg-red-100 text-red-800"
                          : form.priority === "high"
                            ? "bg-orange-100 text-orange-800"
                            : form.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                      }
                    >
                      {form.priority}
                    </Badge>
                  </div>

                  {form.amount && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium">${form.amount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Attachments</span>
                    <span className="font-medium">{form.attachments.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tags</span>
                    <span className="font-medium">{form.tags.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Info */}
              {selectedWorkflow && (
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        This request will be routed through the {selectedWorkflow.name} workflow
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Estimated processing time: 2-5 business days</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!form.workflow || !form.title || !form.description || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Your request will be sent to the appropriate approvers
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
