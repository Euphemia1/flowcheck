"use client"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, FileText, TrendingUp, Plus, Workflow, History } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { ProcurementDashboard } from "@/components/dashboard/procurement-dashboard"

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

  // Always show procurement dashboard
  const renderDashboard = () => {
    return <ProcurementDashboard />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <DashboardSidebar />
          <section className="min-w-0 flex-1">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 uppercase font-bold text-[10px]">
                    {user.role === "admin" ? "Procurement Admin" : "Procurement Workspace"}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.organizationName}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {getFirstName(user?.name)}
                </h1>
                <p className="text-slate-500 font-medium mt-1">Here&apos;s your procurement workflow overview.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/requests/new">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </Link>
              </div>
            </div>
            {renderDashboard()}
          </section>
        </div>
      </main>
    </div>
  )
}