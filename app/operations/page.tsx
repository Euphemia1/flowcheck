"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { OperationsDashboard } from "@/components/dashboard/departments/OperationsDashboard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function OperationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not in Operations department
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }
    
    if (!isLoading && isAuthenticated && user?.department !== "Operations" && user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, isLoading, user, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-black font-bold">⚙</span>
          </div>
          <p className="text-gray-600">Loading Operations Dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated or not authorized
  if (!isAuthenticated || !user || (user.department !== "Operations" && user.role !== "admin")) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Operations-specific header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">⚙</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
            <span className="text-sm text-gray-500 ml-2">• Process & Workflow Management</span>
          </div>
          <p className="text-gray-600">Manage daily operations, process improvements, and operational workflows.</p>
        </div>

        <OperationsDashboard />
      </main>
    </div>
  )
}
