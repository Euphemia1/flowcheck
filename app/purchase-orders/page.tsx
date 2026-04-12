"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  FileText,
  ChevronRight,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Truck,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"

interface PurchaseOrder {
  id: string
  poNumber: string
  title: string
  vendor: {
    name: string
    email: string
    phone: string
  }
  request: {
    id: string
    title: string
    requester: string
  }
  status: "draft" | "sent" | "acknowledged" | "fulfilled" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  amount: number
  currency: string
  orderDate: string
  expectedDelivery: string
  actualDelivery?: string
  items: number
  workflow: {
    currentStep: string
    totalSteps: number
    stepNumber: number
  }
  attachments: number
}

const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "PO-001",
    poNumber: "PO-2024-001",
    title: "Marketing Campaign Materials",
    vendor: {
      name: "Creative Edge Agency",
      email: "orders@creativeedge.com",
      phone: "+1-555-0123"
    },
    request: {
      id: "REQ-001",
      title: "Marketing Campaign Budget Q1 2024",
      requester: "Sarah Johnson"
    },
    status: "sent",
    priority: "high",
    amount: 15000,
    currency: "USD",
    orderDate: "2024-01-15T10:30:00Z",
    expectedDelivery: "2024-01-25T00:00:00Z",
    items: 3,
    workflow: { currentStep: "Vendor Confirmation", totalSteps: 4, stepNumber: 2 },
    attachments: 2
  },
  {
    id: "PO-002",
    poNumber: "PO-2024-002",
    title: "Adobe Software Licenses",
    vendor: {
      name: "Adobe Inc.",
      email: "enterprise@adobe.com",
      phone: "+1-555-0456"
    },
    request: {
      id: "REQ-002",
      title: "Software License Renewal - Adobe",
      requester: "Mike Chen"
    },
    status: "fulfilled",
    priority: "medium",
    amount: 2400,
    currency: "USD",
    orderDate: "2024-01-14T14:20:00Z",
    expectedDelivery: "2024-01-20T00:00:00Z",
    actualDelivery: "2024-01-19T00:00:00Z",
    items: 2,
    workflow: { currentStep: "Completed", totalSteps: 4, stepNumber: 4 },
    attachments: 3
  },
  {
    id: "PO-003",
    poNumber: "PO-2024-003",
    title: "Office Furniture Setup",
    vendor: {
      name: "Office Furniture Plus",
      email: "sales@officefurniture.com",
      phone: "+1-555-0789"
    },
    request: {
      id: "REQ-003",
      title: "New Office Furniture",
      requester: "Lisa Wang"
    },
    status: "acknowledged",
    priority: "low",
    amount: 3500,
    currency: "USD",
    orderDate: "2024-01-16T11:00:00Z",
    expectedDelivery: "2024-01-30T00:00:00Z",
    items: 5,
    workflow: { currentStep: "In Production", totalSteps: 4, stepNumber: 3 },
    attachments: 1
  },
  {
    id: "PO-004",
    poNumber: "PO-2024-004",
    title: "Q4 Financial Audit Services",
    vendor: {
      name: "Audit Partners LLP",
      email: "projects@auditpartners.com",
      phone: "+1-555-0234"
    },
    request: {
      id: "REQ-004",
      title: "Q4 Financial Report Review",
      requester: "Tom Rodriguez"
    },
    status: "draft",
    priority: "urgent",
    amount: 8000,
    currency: "USD",
    orderDate: "2024-01-17T09:15:00Z",
    expectedDelivery: "2024-02-15T00:00:00Z",
    items: 1,
    workflow: { currentStep: "Draft", totalSteps: 4, stepNumber: 0 },
    attachments: 0
  }
]

export default function PurchaseOrdersPage() {
  const { user } = useAuth()
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading purchase orders
    const loadPurchaseOrders = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter based on user role
      let filteredOrders = MOCK_PURCHASE_ORDERS
      
      if (user?.role !== "admin" && user?.department !== "Procurement") {
        // Non-admin users can only see POs from their requests
        filteredOrders = MOCK_PURCHASE_ORDERS.filter(po => 
          po.request.requester === user?.name
        )
      }
      
      setPurchaseOrders(filteredOrders)
      setIsLoading(false)
    }

    loadPurchaseOrders()
  }, [user])

  const filteredOrders = purchaseOrders.filter((po) => {
    const matchesSearch = po.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         po.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         po.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || po.status === statusFilter
    const matchesPriority = priorityFilter === "all" || po.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "draft": return "bg-slate-50 text-slate-600 border-slate-200"
      case "sent": return "bg-slate-100 text-slate-600 border-slate-200"
      case "acknowledged": return "bg-slate-100 text-slate-600 border-slate-200"
      case "fulfilled": return "bg-slate-100 text-slate-600 border-slate-200"
      case "cancelled": return "bg-slate-100 text-slate-600 border-slate-200"
      default: return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-slate-700 text-white"
      case "high": return "bg-slate-600 text-white"
      case "medium": return "bg-slate-500 text-white"
      default: return "bg-slate-400 text-white"
    }
  }

  const handleDeletePO = async (poId: string) => {
    if (confirm("Are you sure you want to delete this purchase order?")) {
      setPurchaseOrders(prev => prev.filter(po => po.id !== poId))
    }
  }

  const handleDownloadPO = (po: PurchaseOrder) => {
    // Simulate PDF download
    alert(`Downloading ${po.poNumber} as PDF...`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500">Loading purchase orders...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Purchase Orders</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage and track all purchase orders and vendor deliveries.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-slate-700 hover:bg-slate-800 h-11 px-6 rounded-xl font-bold shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4 mr-2" />
              Create PO
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Total POs</p>
                  <p className="text-2xl font-extrabold text-slate-900">{purchaseOrders.length}</p>
                </div>
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Pending</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {purchaseOrders.filter(po => po.status === "sent" || po.status === "acknowledged").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Total Value</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    ${purchaseOrders.reduce((sum, po) => sum + po.amount, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Fulfilled</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {purchaseOrders.filter(po => po.status === "fulfilled").length}
                  </p>
                </div>
                <Truck className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status Tabs */}
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-hidden inline-flex">
            {[
              { id: "all", label: "All POs", icon: FileText },
              { id: "draft", label: "Draft", icon: Edit },
              { id: "sent", label: "Sent", icon: CheckCircle },
              { id: "fulfilled", label: "Fulfilled", icon: Truck }
            ].map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                  statusFilter === tab.id 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-11 h-12 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-slate-500"
                placeholder="Search by PO number, title, or vendor..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold bg-white px-6">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Purchase Orders List */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <div className="col-span-3">PO Details</div>
                <div className="col-span-2">Vendor</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Delivery</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredOrders.map((po) => (
                  <div key={po.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50 transition-colors group">
                    <div className="col-span-3">
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors cursor-pointer">
                          {po.poNumber}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">{po.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5">
                            {po.items} items
                          </Badge>
                          <span className="text-[9px] text-slate-400">
                            Req: {po.request.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm">
                        <p className="font-bold text-slate-900">{po.vendor.name}</p>
                        <p className="text-[10px] text-slate-500">{po.vendor.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-2">
                        <Badge className={`${getStatusStyles(po.status)} border rounded-full px-3 py-1 text-[10px] font-bold uppercase`}>
                          {po.status}
                        </Badge>
                        <div>
                          <Badge className={`${getPriorityStyles(po.priority)} text-[9px] px-2 py-0.5`}>
                            {po.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 font-black text-slate-900">
                      <div>${po.amount.toLocaleString()}</div>
                      <p className="text-[10px] font-normal text-slate-500">{po.currency}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">
                          {new Date(po.expectedDelivery).toLocaleDateString()}
                        </p>
                        {po.actualDelivery && (
                          <p className="text-[10px] text-green-600">
                            Delivered: {new Date(po.actualDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                          onClick={() => handleDownloadPO(po)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Link href={`/purchase-orders/${po.id}`}>
                          <Button variant="ghost" size="sm" className="rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {po.status === "draft" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl font-bold text-red-600 hover:bg-red-50"
                            onClick={() => handleDeletePO(po.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-900">No purchase orders found</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {searchQuery ? "Try adjusting your search filters" : "Create your first purchase order to get started"}
                    </p>
                    {!searchQuery && (
                      <Button className="bg-slate-700 hover:bg-slate-800 mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Purchase Order
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-4 pt-4">
              <p>Showing {filteredOrders.length} of {purchaseOrders.length} purchase orders</p>
              <div className="flex gap-4 cursor-pointer hover:text-slate-600">
                <span>Export CSV</span>
                <span>•</span>
                <span>Print Report</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
