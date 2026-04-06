"use client"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, FileText, TrendingUp, Plus, Workflow, History } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"
import { AdminDashboard } from "@/components/dashboard/departments/AdminDashboard"
import { HRDashboard } from "@/components/dashboard/departments/HRDashboard"
import { FinanceDashboard } from "@/components/dashboard/departments/FinanceDashboard"
import { OperationsDashboard } from "@/components/dashboard/departments/OperationsDashboard"
import { ProcurementDashboard } from "@/components/dashboard/departments/ProcurementDashboard"
import { ManagerDashboard } from "@/components/dashboard/departments/ManagerDashboard"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Extract first name from full name
  const getFirstName = (name: string | undefined) => {
    if (!name) return "there"
    return name.split(" ")[0]
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Workflow className="w-6 h-6 text-black animate-pulse" />
          </div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  // Determine which dashboard to show
  const renderDashboard = () => {
    if (user.role === "admin") return <AdminDashboard />

    switch (user.department) {
      case "HR":
        return <HRDashboard />
      case "Finance":
        return <FinanceDashboard />
      case "Operations":
        return <OperationsDashboard />
      case "Procurement":
        return <ProcurementDashboard />
      case "Management":
        return <ManagerDashboard />
      default:
        // Default view for employees with no specific department assigned
        return <DefaultEmployeeView user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 uppercase font-bold text-[10px]">
                {user.role === 'admin' ? 'Organization Admin' : `${user.department || 'Team'} Workspace`}
              </Badge>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.organizationName}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {getFirstName(user?.name)}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Here's your daily operating system overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/requests/new">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Dashboard Content */}
        {renderDashboard()}

      </main>
    </div>
  )
}

function DefaultEmployeeView({ user }: { user: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Fallback to original stats grid if no specialized view */}
      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-tight">My Pending Approvals</CardTitle>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">12</div>
          <p className="text-xs text-gray-600 font-bold mt-1">4 urgent requests</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-tight">Completed Today</CardTitle>
          <div className="p-2 bg-gray-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">24</div>
          <p className="text-xs text-gray-600 font-bold mt-1">+12% from yesterday</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-tight">Active Workflows</CardTitle>
          <div className="p-2 bg-gray-100 rounded-lg">
            <Workflow className="h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">8</div>
          <p className="text-xs text-slate-500 font-medium mt-1">Across your department</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl shadow-slate-200/50 bg-gray-200 text-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-tight opacity-80">Paper Saved</CardTitle>
          <div className="p-2 bg-gray-300 rounded-lg">
            <TrendingUp className="h-4 w-4 text-black" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold tracking-tighter">1,240</div>
          <p className="text-xs font-bold mt-1">Sheets this month</p>
        </CardContent>
      </Card>

      {/* Add a simplified list for employees */}
      <div className="lg:col-span-4 mt-4">
        <Card className="border-none shadow-2xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-center py-12">No recent activity to show in your department dashboard.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}