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
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Workflow className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {getFirstName(user?.name)}
          </h1>
          <p className="text-gray-600">Here's what's happening with your approval workflows today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-tight">Pending Approvals</CardTitle>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">12</div>
              <p className="text-xs text-orange-600 font-bold mt-1">4 urgent requests</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-tight">Completed Today</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">24</div>
              <p className="text-xs text-emerald-600 font-bold mt-1">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-tight">Active Workflows</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Workflow className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">8</div>
              <p className="text-xs text-slate-500 font-medium mt-1">Across 4 departments</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-tight opacity-80">Paper Saved</CardTitle>
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tighter">1,240</div>
              <p className="text-xs font-bold mt-1">Sheets this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Approvals */}
          <Card className="border-none shadow-2xl shadow-slate-200/40">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-xl font-bold">Pending Approvals</CardTitle>
              <CardDescription>Latest requests requiring your review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {[
                {
                  title: "Q1 Marketing Budget",
                  requester: "Sarah Johnson",
                  amount: "$15,000",
                  status: "urgent",
                  time: "2h ago",
                },
                {
                  title: "Annual Leave - 10 Days",
                  requester: "Alex Developer",
                  amount: "HR/Leave",
                  status: "pending",
                  time: "5h ago",
                },
                {
                  title: "Adobe Suite Renewal",
                  requester: "Mike Chen",
                  amount: "$2,400",
                  status: "pending",
                  time: "Yesterday",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors group">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">By {item.requester} • {item.amount}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      item.status === "urgent"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }>{item.status}</Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/approvals">
                  <Button variant="outline" className="w-full font-bold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl">
                    View All Approvals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Impact */}
          <div className="space-y-6">
            <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                <CardDescription>Common tasks and workflow management</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/requests/new">
                  <Button className="w-full h-24 flex-col gap-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border-none shadow-none group" variant="outline">
                    <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs">New Request</span>
                  </Button>
                </Link>
                <Link href="/workflows/designer">
                  <Button className="w-full h-24 flex-col gap-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-none shadow-none group" variant="outline">
                    <Workflow className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs">Build Flow</span>
                  </Button>
                </Link>
                <Link href="/audit">
                  <Button className="w-full h-24 flex-col gap-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border-none shadow-none group" variant="outline">
                    <History className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs">Audit Log</span>
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button className="w-full h-24 flex-col gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-none shadow-none group" variant="outline">
                    <TrendingUp className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs">Reports</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="w-32 h-32" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Organization Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Avg. Response Time</span>
                  <span className="font-bold text-indigo-600">1.4 Hours</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-[85%]" />
                </div>
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-slate-500 font-medium">Compliance Score</span>
                  <span className="font-bold text-emerald-600">98%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full w-[98%]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}