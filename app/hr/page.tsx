"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { HRDashboard } from "@/components/dashboard/departments/HRDashboard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function HRPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not in HR department
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }
    
    if (!isLoading && isAuthenticated && user?.department !== "HR" && user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, isLoading, user, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold">HR</span>
          </div>
          <p className="text-gray-600">Loading HR Dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated or not authorized
  if (!isAuthenticated || !user || (user.department !== "HR" && user.role !== "admin")) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* HR-specific header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">👥</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Human Resources</h1>
            <span className="text-sm text-gray-500 ml-2">• People & Culture Management</span>
          </div>
          <p className="text-gray-600">Manage leave requests, employee onboarding, and HR workflows.</p>
        </div>

        <HRDashboard />
      </main>
    </div>
  )
}
