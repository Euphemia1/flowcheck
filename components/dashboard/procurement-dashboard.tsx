"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, FileText, TrendingUp, Plus, Workflow, History, DollarSign, ShoppingCart, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface DashboardStats {
  myRequests: number
  pendingApprovals: number
  approvedRequests: number
  totalValue: number
  recentRequests: any[]
  pendingApprovalItems: any[]
}

export function ProcurementDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    myRequests: 0,
    pendingApprovals: 0,
    approvedRequests: 0,
    totalValue: 0,
    recentRequests: [],
    pendingApprovalItems: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's requests
      const requestsResponse = await fetch(`/api/procurement/requests?requester_id=${user?.id}&limit=5`)
      const requestsData = await requestsResponse.json()
      
      // Fetch pending approvals for this user
      const approvalsResponse = await fetch(`/api/procurement/approvals?approver_id=${user?.id}&status=pending&limit=5`)
      const approvalsData = await approvalsResponse.json()

      // Fetch overall stats
      const allRequestsResponse = await fetch(`/api/procurement/requests?limit=100`)
      const allRequestsData = await allRequestsResponse.json()

      const myRequestsCount = requestsData.requests?.length || 0
      const pendingApprovalsCount = approvalsData.approvals?.length || 0
      const allRequests = allRequestsData.requests || []
      const approvedRequestsCount = allRequests.filter((r: any) => r.status === 'approved').length
      const totalValue = allRequests
        .filter((r: any) => r.status === 'approved')
        .reduce((sum: number, r: any) => sum + (parseFloat(r.total_amount) || 0), 0)

      setStats({
        myRequests: myRequestsCount,
        pendingApprovals: pendingApprovalsCount,
        approvedRequests: approvedRequestsCount,
        totalValue,
        recentRequests: requestsData.requests || [],
        pendingApprovalItems: approvalsData.approvals || []
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-blue-500 text-white'
      case 'low': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-none shadow-xl shadow-slate-200/50">
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-tight">My Requests</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tighter">{stats.myRequests}</div>
            <p className="text-xs text-gray-600 font-bold mt-1">Total requests submitted</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-tight">Pending Approvals</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tighter">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-600 font-bold mt-1">Awaiting your action</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-tight">Approved Requests</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tighter">{stats.approvedRequests}</div>
            <p className="text-xs text-gray-600 font-bold mt-1">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-tight">Total Value</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-gray-900 tracking-tighter">
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 font-bold mt-1">In approved requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/requests/new">
          <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
        {stats.pendingApprovals > 0 && (
          <Link href="/approvals">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-xl">
              <AlertCircle className="w-4 h-4 mr-2" />
              Review Pending Approvals ({stats.pendingApprovals})
            </Button>
          </Link>
        )}
        <Link href="/purchase-orders">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-xl">
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Purchase Orders
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Recent Requests</CardTitle>
              <CardDescription>Your latest procurement requests</CardDescription>
            </div>
            <Link href="/requests">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No requests yet</p>
                <Link href="/requests/new">
                  <Button className="mt-4" size="sm">Create Your First Request</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentRequests.map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{request.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                          {request.status}
                        </Badge>
                        {request.urgency_level !== 'medium' && (
                          <Badge className={`text-xs ${getUrgencyColor(request.urgency_level)}`}>
                            {request.urgency_level}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        ${parseFloat(request.total_amount || 0).toLocaleString()} · {request.items?.length || 0} items
                      </p>
                    </div>
                    <Link href={`/requests/${request.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Your Approval</CardTitle>
              <CardDescription>Requests requiring your attention</CardDescription>
            </div>
            <Link href="/approvals">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.pendingApprovalItems.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500">All caught up!</p>
                <p className="text-sm text-gray-400">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.pendingApprovalItems.map((approval: any) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{approval.request?.title}</h4>
                        <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                          Step {approval.step_order}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Requested by {approval.request?.requester?.name} · 
                        ${parseFloat(approval.request?.total_amount || 0).toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/approvals/${approval.id}`}>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-800">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
