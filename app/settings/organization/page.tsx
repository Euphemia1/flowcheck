"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Settings,
  Bell,
  Shield,
  Workflow,
  Save,
  Plus,
  Trash2,
  Palette,
  DollarSign,
  Globe,
  Lock,
  MessageSquare
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface OrganizationSettings {
  general: {
    name: string
    domain: string
    description: string
    timezone: string
    currency: string
    logo: string
    primaryColor: string
  }
  workflows: {
    defaultApprovalLevels: number
    autoAssignApprovers: boolean
    requireComments: boolean
    allowDelegation: boolean
    escalationTimeout: number
    highValueThreshold: number
    ceoApprovalRequired: boolean
  }
  notifications: {
    email: boolean
    slack: boolean
    sms: boolean
    digestFrequency: string
    urgentOnly: boolean
  }
  security: {
    requireMFA: boolean
    sessionTimeout: number
    allowSelfRegistration: boolean
    defaultRole: string
    passwordPolicy: string
  }
  customFields: Array<{
    id: string
    name: string
    type: string
    required: boolean
    options?: string[]
  }>
}

export default function OrganizationSettingsPage() {
  const [settings, setSettings] = useState<OrganizationSettings>({
    general: {
      name: "Acme Corporation",
      domain: "acme.com",
      description: "Leading technology company focused on innovation",
      timezone: "America/New_York",
      currency: "USD",
      logo: "https://va-approval-flow.vercel.app/logo.png",
      primaryColor: "#2563eb",
    },
    workflows: {
      defaultApprovalLevels: 2,
      autoAssignApprovers: true,
      requireComments: false,
      allowDelegation: true,
      escalationTimeout: 24,
      highValueThreshold: 5000,
      ceoApprovalRequired: true,
    },
    notifications: {
      email: true,
      slack: false,
      sms: false,
      digestFrequency: "daily",
      urgentOnly: false,
    },
    security: {
      requireMFA: false,
      sessionTimeout: 480,
      allowSelfRegistration: true,
      defaultRole: "employee",
      passwordPolicy: "standard",
    },
    customFields: [
      {
        id: "1",
        name: "Department",
        type: "select",
        required: true,
        options: ["Engineering", "Marketing", "Sales", "HR"],
      },
      { id: "2", name: "Cost Center", type: "text", required: false },
    ],
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Organization Settings</h1>
            <p className="text-slate-500 mt-2 font-medium">Configure global defaults, branding, and approval logic.</p>
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 h-11 px-8 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 space-y-2 md:col-span-1">
            {[
              { id: "general", label: "General & Branding", icon: Building2 },
              { id: "workflows", label: "Workflow Logic", icon: Workflow },
              { id: "notifications", label: "Communication", icon: Bell },
              { id: "security", label: "Security & MFA", icon: Shield },
              { id: "custom", label: "Custom Attributes", icon: Settings },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="justify-start px-4 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-bold rounded-xl transition-all border border-transparent hover:border-slate-200"
              >
                <tab.icon className="w-4 h-4 mr-3" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="md:col-span-3">
            {/* General Settings */}
            <TabsContent value="general" className="m-0 space-y-6">
              <Card className="border-none shadow-2xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Profile & Branding</CardTitle>
                  <CardDescription>Tailor FlowCheck to your organization's identity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700">Organization Name</Label>
                      <Input
                        className="h-11 rounded-xl border-slate-200 focus:ring-blue-500"
                        value={settings.general.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, name: e.target.value } }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700">Primary Domain</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-blue-500"
                          value={settings.general.domain}
                          onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, domain: e.target.value } }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Logo URL</Label>
                    <Input
                      className="h-11 rounded-xl border-slate-200"
                      value={settings.general.logo}
                      onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, logo: e.target.value } }))}
                    />
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700">Brand Color</Label>
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-xl border-4 border-white shadow-md cursor-pointer"
                          style={{ backgroundColor: settings.general.primaryColor }}
                        />
                        <Input
                          className="h-11 rounded-xl border-slate-200"
                          value={settings.general.primaryColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, general: { ...prev.general, primaryColor: e.target.value } }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700">Reporting Currency</Label>
                      <Select
                        value={settings.general.currency}
                        onValueChange={(v) => setSettings(prev => ({ ...prev, general: { ...prev.general, currency: v } }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD (US Dollar)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                          <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflow Settings */}
            <TabsContent value="workflows" className="m-0 space-y-6">
              <Card className="border-none shadow-2xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Governance & Thresholds</CardTitle>
                  <CardDescription>Global rules for how approvals are handled.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                      <Label className="text-sm font-extrabold text-blue-900 uppercase tracking-wider">High Value Threshold</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                        <Input
                          type="number"
                          className="pl-10 h-11 rounded-xl border-blue-200 bg-white"
                          value={settings.workflows.highValueThreshold}
                          onChange={(e) => setSettings(prev => ({ ...prev, workflows: { ...prev.workflows, highValueThreshold: Number(e.target.value) } }))}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-blue-700 uppercase">Alert triggers for requests above this amount</p>
                    </div>

                    <div className="space-y-3 flex flex-col justify-center px-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-bold text-slate-900">CEO Final Sign-off</Label>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">Require executive approval for all high-value requests</p>
                        </div>
                        <Switch
                          checked={settings.workflows.ceoApprovalRequired}
                          onCheckedChange={(v) => setSettings(prev => ({ ...prev, workflows: { ...prev.workflows, ceoApprovalRequired: v } }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="space-y-6">
                    {[
                      {
                        title: "Auto-assign Approvers",
                        desc: "Automatically route based on hierarchy",
                        key: "autoAssignApprovers"
                      },
                      {
                        title: "Mandatory Comments",
                        desc: "Require reason for every approval decision",
                        key: "requireComments"
                      },
                      {
                        title: "Delegation Policy",
                        desc: "Allow approvers to nominate substitutes",
                        key: "allowDelegation"
                      }
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-bold text-slate-900">{feature.title}</Label>
                          <p className="text-xs text-slate-500 font-medium">{feature.desc}</p>
                        </div>
                        <Switch
                          checked={(settings.workflows as any)[feature.key]}
                          onCheckedChange={(v) => setSettings(prev => ({ ...prev, workflows: { ...prev.workflows, [feature.key]: v } }))}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="m-0 space-y-6">
              <Card className="border-none shadow-2xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Communication preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "email", label: "Email", icon: Bell },
                      { id: "slack", label: "Slack", icon: MessageSquare },
                      { id: "sms", label: "SMS", icon: Globe },
                    ].map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${(settings.notifications as any)[channel.id]
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-slate-100 hover:border-slate-200"
                          }`}
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, [channel.id]: !(prev.notifications as any)[channel.id] }
                        }))}
                      >
                        <channel.icon className={`w-8 h-8 mb-4 ${(settings.notifications as any)[channel.id] ? "text-blue-600" : "text-slate-300"}`} />
                        <h4 className="font-bold text-slate-900">{channel.label}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                          {(settings.notifications as any)[channel.id] ? "Active" : "Disabled"}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="m-0 space-y-6">
              <Card className="border-none shadow-2xl shadow-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <Lock className="w-5 h-5 text-indigo-600" />
                    Security & Access Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="p-6 bg-slate-900 rounded-2xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold">Organization-wide MFA</h4>
                        <p className="text-slate-400 text-sm">Require all employees to use 2FA for account login</p>
                      </div>
                      <Switch
                        checked={settings.security.requireMFA}
                        onCheckedChange={(v) => setSettings(prev => ({ ...prev, security: { ...prev.security, requireMFA: v } }))}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700">Password Policy</Label>
                      <Select
                        value={settings.security.passwordPolicy}
                        onValueChange={(v) => setSettings(prev => ({ ...prev, security: { ...prev.security, passwordPolicy: v } }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Standard Complexity</SelectItem>
                          <SelectItem value="strong">High Security (12+ symbols)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (SAML Only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700">Default Sandbox Role</Label>
                      <Select
                        value={settings.security.defaultRole}
                        onValueChange={(v) => setSettings(prev => ({ ...prev, security: { ...prev.security, defaultRole: v } }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee View</SelectItem>
                          <SelectItem value="viewer">Ready-Only Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Attributes Content remains focused but cleaner */}
            <TabsContent value="custom" className="m-0">
              <Card className="border-none shadow-2xl shadow-slate-200/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Global Attributes</CardTitle>
                    <CardDescription>Custom fields added to all request forms.</CardDescription>
                  </div>
                  <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Attribute
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl group hover:shadow-lg transition-all">
                      <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                        {field.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{field.name}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{field.type} • {field.required ? 'Required' : 'Optional'}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

