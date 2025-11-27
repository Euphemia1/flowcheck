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
import { Building2, Settings, Bell, Shield, Workflow, Save, Plus, Trash2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface OrganizationSettings {
  general: {
    name: string
    domain: string
    description: string
    timezone: string
    currency: string
  }
  workflows: {
    defaultApprovalLevels: number
    autoAssignApprovers: boolean
    requireComments: boolean
    allowDelegation: boolean
    escalationTimeout: number
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
    },
    workflows: {
      defaultApprovalLevels: 2,
      autoAssignApprovers: true,
      requireComments: false,
      allowDelegation: true,
      escalationTimeout: 24,
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

  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      name: "",
      type: "text",
      required: false,
    }
    setSettings((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }))
  }

  const updateCustomField = (id: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      customFields: prev.customFields.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeCustomField = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((item) => item.id !== id),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Settings</h1>
          <p className="text-gray-600">Manage your organization's configuration and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Custom Fields
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic organization details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={settings.general.name}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, name: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={settings.general.domain}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, domain: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={settings.general.description}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, description: e.target.value },
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, timezone: value },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.general.currency}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, currency: value },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Settings */}
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Configuration</CardTitle>
                <CardDescription>Default settings for approval workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="approvalLevels">Default Approval Levels</Label>
                    <Select
                      value={settings.workflows.defaultApprovalLevels.toString()}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          workflows: { ...prev.workflows, defaultApprovalLevels: Number.parseInt(value) },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Level</SelectItem>
                        <SelectItem value="2">2 Levels</SelectItem>
                        <SelectItem value="3">3 Levels</SelectItem>
                        <SelectItem value="4">4+ Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="escalationTimeout">Escalation Timeout (hours)</Label>
                    <Input
                      id="escalationTimeout"
                      type="number"
                      value={settings.workflows.escalationTimeout}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          workflows: { ...prev.workflows, escalationTimeout: Number.parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Workflow Behavior</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-assign Approvers</Label>
                      <p className="text-sm text-gray-600">
                        Automatically assign approvers based on organizational hierarchy
                      </p>
                    </div>
                    <Switch
                      checked={settings.workflows.autoAssignApprovers}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          workflows: { ...prev.workflows, autoAssignApprovers: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Comments</Label>
                      <p className="text-sm text-gray-600">
                        Require approvers to provide comments when approving/rejecting
                      </p>
                    </div>
                    <Switch
                      checked={settings.workflows.requireComments}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          workflows: { ...prev.workflows, requireComments: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Delegation</Label>
                      <p className="text-sm text-gray-600">
                        Allow approvers to delegate their approval authority to others
                      </p>
                    </div>
                    <Switch
                      checked={settings.workflows.allowDelegation}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          workflows: { ...prev.workflows, allowDelegation: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how users receive approval notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Send email alerts for approval requests and updates</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Slack Integration</Label>
                      <p className="text-sm text-gray-600">Post notifications to Slack channels</p>
                    </div>
                    <Switch
                      checked={settings.notifications.slack}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, slack: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-gray-600">Send text messages for urgent approvals</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: checked },
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="digestFrequency">Digest Frequency</Label>
                    <Select
                      value={settings.notifications.digestFrequency}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, digestFrequency: value },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Urgent Only</Label>
                      <p className="text-sm text-gray-600">Only send notifications for urgent approvals</p>
                    </div>
                    <Switch
                      checked={settings.notifications.urgentOnly}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: { ...prev.notifications, urgentOnly: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security & Access</CardTitle>
                <CardDescription>Manage security policies and user access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authentication</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Multi-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Require MFA for all users in the organization</p>
                    </div>
                    <Switch
                      checked={settings.security.requireMFA}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: { ...prev.security, requireMFA: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, sessionTimeout: Number.parseInt(e.target.value) },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordPolicy">Password Policy</Label>
                      <Select
                        value={settings.security.passwordPolicy}
                        onValueChange={(value) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: { ...prev.security, passwordPolicy: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="standard">Standard (8+ chars, mixed case)</SelectItem>
                          <SelectItem value="strong">Strong (12+ chars, symbols)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">User Registration</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Self-Registration</Label>
                      <p className="text-sm text-gray-600">Allow users to register with your organization domain</p>
                    </div>
                    <Switch
                      checked={settings.security.allowSelfRegistration}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: { ...prev.security, allowSelfRegistration: checked },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultRole">Default Role for New Users</Label>
                    <Select
                      value={settings.security.defaultRole}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: { ...prev.security, defaultRole: value },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Fields */}
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Custom Fields</CardTitle>
                    <CardDescription>Add organization-specific fields to approval requests</CardDescription>
                  </div>
                  <Button onClick={addCustomField} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {settings.customFields.length === 0 ? (
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No custom fields configured</p>
                    <p className="text-sm text-gray-400">
                      Add custom fields to capture organization-specific information
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {settings.customFields.map((field) => (
                      <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            placeholder="Field name"
                            value={field.name}
                            onChange={(e) => updateCustomField(field.id, "name", e.target.value)}
                          />
                          <Select
                            value={field.type}
                            onValueChange={(value) => updateCustomField(field.id, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="textarea">Long Text</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => updateCustomField(field.id, "required", checked)}
                            />
                            <Label className="text-sm">Required</Label>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </main>
    </div>
  )
}
