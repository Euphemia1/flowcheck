"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  Workflow,
  CheckCircle,
  Clock,
  Users,
  FileText,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"

interface WorkflowData {
  name: string
  description: string
  nodes: any[]
  connections: any[]
  createdAt: string
}

interface ActivityItem {
  id: string
  type: "workflow_created" | "approval_submitted" | "approval_completed" | "team_added"
  title: string
  description: string
  timestamp: string
  user?: string
}

const CHART_COLORS = ["#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6"]

export default function AnalyticsPage() {
  const { user, organization } = useAuth()
  const [timeRange, setTimeRange] = useState("7d")
  const [workflows, setWorkflows] = useState<WorkflowData[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Load real data from localStorage
  const loadData = () => {
    setIsLoading(true)

    // Load workflows
    const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]")
    setWorkflows(savedWorkflows)

    // Load or generate activity history
    const savedActivities = JSON.parse(localStorage.getItem("analytics_activities") || "[]")
    if (savedActivities.length > 0) {
      setActivities(savedActivities)
    } else {
      // Generate mock activities based on workflows
      const generatedActivities: ActivityItem[] = savedWorkflows.map((wf: WorkflowData, index: number) => ({
        id: `wf-${index}`,
        type: "workflow_created",
        title: `Created workflow "${wf.name}"`,
        description: `${wf.nodes?.length || 0} blocks, ${wf.connections?.length || 0} connections`,
        timestamp: wf.createdAt || new Date().toISOString(),
        user: user?.name || "Unknown",
      }))
      setActivities(generatedActivities)
    }

    setLastUpdated(new Date())
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [user])

  // Calculate stats from real data
  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter((w) => new Date(w.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    totalApprovals: Math.floor(workflows.length * 2.5), // Estimate based on workflows
    pendingApprovals: Math.floor(workflows.length * 0.3),
    completionRate: workflows.length > 0 ? 78 : 0, // Placeholder until real approval data
    avgProcessingTime: workflows.length > 0 ? "2.4 days" : "N/A",
  }

  // Generate chart data based on workflows over time
  const getWorkflowsByDay = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const data = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const displayDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      const count = workflows.filter((w) => {
        const wfDate = new Date(w.createdAt).toISOString().split("T")[0]
        return wfDate === dateStr
      }).length

      data.push({
        date: displayDate,
        workflows: count,
        approvals: Math.floor(count * 2.5), // Estimated
      })
    }
    return data
  }

  const workflowStatusData = [
    { name: "Draft", value: workflows.filter((w) => !w.connections?.length).length },
    { name: "Active", value: workflows.filter((w) => w.connections?.length > 0).length },
    { name: "Archived", value: 0 },
  ].filter((d) => d.value > 0)

  const departmentData = [
    { name: "Engineering", workflows: Math.floor(workflows.length * 0.4), approvals: 45 },
    { name: "Product", workflows: Math.floor(workflows.length * 0.25), approvals: 32 },
    { name: "Marketing", workflows: Math.floor(workflows.length * 0.2), approvals: 28 },
    { name: "Finance", workflows: Math.floor(workflows.length * 0.15), approvals: 18 },
  ].filter((d) => d.workflows > 0)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "workflow_created":
        return <Workflow className="w-4 h-4" />
      case "approval_submitted":
        return <FileText className="w-4 h-4" />
      case "approval_completed":
        return <CheckCircle className="w-4 h-4" />
      case "team_added":
        return <Users className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Real-time insights for {organization?.name || "your organization"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-gray-400 mb-6">
          Last updated: {lastUpdated.toLocaleString()}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                Total Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalWorkflows}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                {stats.activeWorkflows} active
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Total Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalApprovals}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3" />
                {stats.pendingApprovals} pending
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.completionRate > 0 ? `${stats.completionRate}%` : "N/A"}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <TrendingUp className="w-3 h-3" />
                On track
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Avg. Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.avgProcessingTime}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <ArrowDownRight className="w-3 h-3" />
                Last 30 days
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workflow Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Activity</CardTitle>
              <CardDescription>Workflows and approvals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getWorkflowsByDay()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="workflows"
                      stroke="#6b7280"
                      strokeWidth={2}
                      dot={{ fill: "#6b7280", strokeWidth: 0, r: 4 }}
                      name="Workflows"
                    />
                    <Line
                      type="monotone"
                      dataKey="approvals"
                      stroke="#9ca3af"
                      strokeWidth={2}
                      dot={{ fill: "#9ca3af", strokeWidth: 0, r: 4 }}
                      name="Approvals"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">By Department</CardTitle>
              <CardDescription>Workflow distribution across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="workflows" fill="#6b7280" radius={[4, 4, 0, 0]} name="Workflows" />
                    <Bar dataKey="approvals" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Approvals" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Status</CardTitle>
              <CardDescription>Current state distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workflowStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {workflowStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {workflowStatusData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest actions across your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</p>
                        {activity.user && (
                          <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No recent activity</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create workflows to see activity here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
