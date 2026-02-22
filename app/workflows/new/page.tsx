"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  FileText,
  ArrowRight,
  Sparkles,
  Workflow,
  FileCheck,
  DollarSign,
  Users,
  Clock,
  Zap,
  ChevronLeft,
  ArrowLeft,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: string
  steps: number
  color: string
  bgColor: string
  borderColor: string
  gradient: string
}

const QUICK_TEMPLATES: Template[] = [
  {
    id: "expense",
    name: "Expense Approval",
    description: "Standard employee expense reimbursement with manager approval",
    icon: DollarSign,
    category: "Finance",
    steps: 3,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50/50",
    borderColor: "group-hover:border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "purchase",
    name: "Purchase Order",
    description: "Multi-level approval for equipment and service purchases",
    icon: FileCheck,
    category: "Procurement",
    steps: 4,
    color: "text-blue-600",
    bgColor: "bg-blue-50/50",
    borderColor: "group-hover:border-blue-200",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "timeoff",
    name: "Time Off Request",
    description: "Vacation, sick leave, and PTO approval process",
    icon: Clock,
    category: "HR",
    steps: 2,
    color: "text-orange-600",
    bgColor: "bg-orange-50/50",
    borderColor: "group-hover:border-orange-200",
    gradient: "from-orange-500 to-rose-500",
  },
  {
    id: "hiring",
    name: "New Hire Approval",
    description: "Job requisition and candidate approval workflow",
    icon: Users,
    category: "HR",
    steps: 3,
    color: "text-purple-600",
    bgColor: "bg-purple-50/50",
    borderColor: "group-hover:border-purple-200",
    gradient: "from-purple-500 to-violet-600",
  },
]

export default function NewWorkflowPage() {
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [step, setStep] = useState<"select" | "configure">("select")

  const handleTemplateSelect = (templateId: string) => {
    const template = QUICK_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setWorkflowName(template.name)
      setWorkflowDescription(template.description)
      setSelectedTemplate(templateId)
      setStep("configure")
    }
  }

  const handleStartFromScratch = () => {
    setWorkflowName("")
    setWorkflowDescription("")
    setSelectedTemplate(null)
    setStep("configure")
  }

  const getCreateUrl = () => {
    const params = new URLSearchParams()
    if (workflowName) params.set("name", workflowName)
    if (workflowDescription) params.set("description", workflowDescription)
    if (selectedTemplate) params.set("template", selectedTemplate)
    return `/workflows/designer?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] selection:bg-indigo-100">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-12 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-gradient-to-b from-indigo-50/40 to-transparent blur-3xl rounded-full opacity-60" />
        <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-gradient-to-t from-blue-50/40 to-transparent blur-3xl rounded-full opacity-60" />

        {/* Navigation & Progress */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/workflows">
              <Button variant="ghost" size="sm" className="group text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Workflows
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
                step === "select" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-emerald-500 text-white"
              )}>
                {step === "select" ? "1" : <FileCheck className="w-4 h-4" />}
              </div>
              <div className={cn(
                "h-px w-8 transition-colors duration-500",
                step === "configure" ? "bg-emerald-500" : "bg-slate-200"
              )} />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
                step === "configure" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400"
              )}>
                2
              </div>
            </div>
          </div>

          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {step === "select" ? (
                <>Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">masterpiece</span></>
              ) : (
                <>Finalize your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">setup</span></>
              )}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {step === "select"
                ? "Designing a powerful approval process has never been easier. Choose a starting point to begin your journey."
                : "Give your workflow a name and some context before diving into the visual designer."}
            </p>
          </div>
        </div>

        {step === "select" ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in zoom-in-95 duration-700 delay-200">
            {/* Start from Scratch */}
            <div className="lg:col-span-2">
              <Card
                className="h-full cursor-pointer relative overflow-hidden group border-0 shadow-2xl shadow-indigo-100/50 hover:shadow-indigo-200/60 transition-all duration-500 text-white"
                onClick={handleStartFromScratch}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-0 right-0 -m-8 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
                <div className="absolute bottom-0 left-0 -m-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
                
                <CardContent className="relative p-10 h-full flex flex-col items-start justify-between min-h-[400px]">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 border border-white/30 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Start from Scratch</h3>
                    <p className="text-indigo-50 mb-8 leading-relaxed opacity-90">
                      Unleash your creativity. Build a completely custom approval process tailored exactly to your organization's unique needs.
                    </p>
                    <div className="flex items-center gap-2 font-semibold text-white/90 group-hover:text-white transition-colors">
                      <span className="text-lg">Create custom workflow</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Use Template */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden h-full">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Popular Templates</h3>
                      <p className="text-slate-500 text-sm">Jumpstart your productivity with pre-built flows</p>
                    </div>
                  </div>
                  <Link href="/workflows/templates">
                    <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold transition-all">
                      View all
                    </Button>
                  </Link>
                </div>
                
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {QUICK_TEMPLATES.map((template) => {
                    const Icon = template.icon
                    return (
                      <div
                        key={template.id}
                        className={cn(
                          "group p-5 rounded-2xl border border-slate-100 hover:bg-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md",
                          template.bgColor,
                          template.borderColor
                        )}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                            "bg-gradient-to-br",
                            template.gradient
                          )}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <Badge variant="outline" className="bg-white/50 border-slate-200 text-[10px] font-bold tracking-wider uppercase">
                            {template.category}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{template.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Workflow className="w-3 h-3" />
                            {template.steps} steps
                          </span>
                          <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-600">
                            Use template <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
                
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Tip: Most users save over 2 hours by starting with a template.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Configure Step */
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card className="border-0 shadow-2xl shadow-indigo-100/50 overflow-hidden rounded-[2.5rem]">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-10 py-12 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    {selectedTemplate ? (
                      <Sparkles className="w-7 h-7 text-white" />
                    ) : (
                      <Plus className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Details & Context</h2>
                    <p className="text-indigo-100 opacity-80">
                      {selectedTemplate
                        ? "Great choice! Let's personalize this template."
                        : "Almost there! Let's name your creation."}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-10 space-y-8 bg-white">
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-slate-700 font-bold text-base">
                    What should we call this workflow?
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Workflow className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <Input
                      id="name"
                      placeholder="e.g. Executive Travel Reimbursement"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      className="h-14 pl-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 rounded-2xl text-lg transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="description" className="text-slate-700 font-bold text-base">
                    Tell us a bit about its purpose
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="This workflow is used when someone needs to request..."
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    rows={4}
                    className="bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 rounded-2xl text-lg p-5 transition-all resize-none"
                  />
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Lightbulb className="w-4 h-4" />
                    <span>A clear description helps team members know when to use this flow.</span>
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-amber-900 block mb-1">Turbo-charged Start</span>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        We'll pre-load this workflow with standard steps, approvers, and logic. You can fully customize every detail in the designer.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("select")} 
                    className="w-full sm:w-auto px-8 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  >
                    Go Back
                  </Button>
                  <Link href={getCreateUrl()} className="w-full">
                    <Button
                      className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:translate-y-0 group"
                      disabled={!workflowName.trim()}
                    >
                      <Workflow className="w-5 h-5 mr-3" />
                      Step into Designer
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer info - shown only on select step */}
        {step === "select" && (
          <div className="max-w-5xl mx-auto mt-24 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-12">Building for success</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Keep it Simple",
                  desc: "Start with 2-3 essential steps. You can always add complex branching logic later.",
                  icon: Zap,
                  color: "text-amber-500",
                  bg: "bg-amber-100/50"
                },
                {
                  title: "Role-based Access",
                  desc: "Assign steps to roles (e.g., 'Finance Manager') rather than specific individuals.",
                  icon: Users,
                  color: "text-blue-500",
                  bg: "bg-blue-100/50"
                },
                {
                  title: "SLA Timeouts",
                  desc: "Add auto-escalation or reminders to ensure requests never get stuck in limbo.",
                  icon: Clock,
                  color: "text-emerald-500",
                  bg: "bg-emerald-100/50"
                }
              ].map((tip, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white border border-slate-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-500", tip.bg)}>
                    <tip.icon className={cn("w-7 h-7", tip.color)} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-3">{tip.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
