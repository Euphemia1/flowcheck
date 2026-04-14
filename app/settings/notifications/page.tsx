"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Mail,
  Phone,
  Settings,
  Save,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  emailAddress: string
  phoneNumber: string
  cooldownMinutes: number
  notifyOnLandingPage: boolean
  notifyOnDashboard: boolean
  notifyOnRequests: boolean
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    emailAddress: 'euphemia.chikungulu@example.com',
    phoneNumber: '+1234567890',
    cooldownMinutes: 30,
    notifyOnLandingPage: true,
    notifyOnDashboard: false,
    notifyOnRequests: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Here you would save the settings to your backend/database
      console.log('Saving notification settings:', settings)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTestResult('Settings saved successfully!')
      setTimeout(() => setTestResult(null), 3000)
    } catch (error) {
      setTestResult('Failed to save settings')
      setTimeout(() => setTestResult(null), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestNotification = async () => {
    try {
      // Here you would trigger a test notification
      const response = await fetch('/api/visitors/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          settings: settings
        })
      })
      
      if (response.ok) {
        setTestResult('Test notifications sent!')
      } else {
        setTestResult('Failed to send test notifications')
      }
      setTimeout(() => setTestResult(null), 3000)
    } catch (error) {
      setTestResult('Failed to send test notifications')
      setTimeout(() => setTestResult(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Notification Settings</h1>
          <p className="text-slate-600">Configure how you receive alerts when someone visits your FlowCheck website.</p>
        </div>

        {testResult && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            testResult.includes('success') || testResult.includes('sent')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {testResult.includes('success') || testResult.includes('sent') ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{testResult}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* General Settings */}
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                General Settings
              </CardTitle>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cooldown">Cooldown Period (minutes)</Label>
                  <Input
                    id="cooldown"
                    type="number"
                    min="1"
                    max="1440"
                    value={settings.cooldownMinutes}
                    onChange={(e) => setSettings(prev => ({ ...prev, cooldownMinutes: parseInt(e.target.value) || 30 }))}
                    className="h-11"
                  />
                  <p className="text-xs text-slate-500">Minimum time between notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-slate-600" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure email alerts for website visitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable Email Notifications</Label>
                  <p className="text-sm text-slate-500">Receive email alerts when someone visits the site</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.emailAddress}
                  onChange={(e) => setSettings(prev => ({ ...prev, emailAddress: e.target.value }))}
                  className="h-11"
                  placeholder="your.email@example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-600" />
                SMS Notifications
              </CardTitle>
              <CardDescription>Configure SMS alerts for website visitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable SMS Notifications</Label>
                  <p className="text-sm text-slate-500">Receive text message alerts when someone visits the site</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="h-11"
                  placeholder="+1234567890"
                />
              </div>
            </CardContent>
          </Card>

          {/* Page-Specific Notifications */}
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600" />
                Page Notifications
              </CardTitle>
              <CardDescription>Choose which pages trigger notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Landing Page</Label>
                  <p className="text-sm text-slate-500">Notify when someone visits the homepage</p>
                </div>
                <Switch
                  checked={settings.notifyOnLandingPage}
                  onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, notifyOnLandingPage: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Dashboard</Label>
                  <p className="text-sm text-slate-500">Notify when someone accesses the dashboard</p>
                </div>
                <Switch
                  checked={settings.notifyOnDashboard}
                  onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, notifyOnDashboard: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Request Pages</Label>
                  <p className="text-sm text-slate-500">Notify when someone views request forms</p>
                </div>
                <Switch
                  checked={settings.notifyOnRequests}
                  onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, notifyOnRequests: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test and Save */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleTestNotification} variant="outline" className="h-12 px-6">
              <TestTube className="w-4 h-4 mr-2" />
              Test Notifications
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="h-12 px-6 bg-slate-700 hover:bg-slate-800">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>

          {/* Info Card */}
          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>1. Update your email address and phone number above</p>
                    <p>2. Configure your email service (SendGrid, AWS SES, etc.) in the API</p>
                    <p>3. Set up SMS service (Twilio, AWS SNS, etc.) in the API</p>
                    <p>4. Test notifications to ensure they're working properly</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
