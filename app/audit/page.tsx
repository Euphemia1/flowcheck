"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    Filter,
    Download,
    History,
    Calendar,
    User,
    ArrowRight,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck,
    FileText,
    Building2
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"

interface AuditEntry {
    id: string
    action: string
    category: "HR" | "Finance" | "Operations" | "System" | "Workflow"
    user: {
        name: string
        role: string
        avatar?: string
    }
    entity: string
    details: string
    timestamp: string
    status: "success" | "warning" | "error"
    ipAddress: string
}

const MOCK_AUDIT_LOG: AuditEntry[] = [
    {
        id: "LOG-001",
        action: "Approval Processed",
        category: "Finance",
        user: { name: "John Admin", role: "Finance Director" },
        entity: "REQ-001 (Marketing Budget)",
        details: "Approved budget increase from $12k to $15k",
        timestamp: "2024-01-16T10:45:00Z",
        status: "success",
        ipAddress: "192.168.1.45"
    },
    {
        id: "LOG-002",
        action: "Workflow Modified",
        category: "Workflow",
        user: { name: "Sarah Manager", role: "HR Head" },
        entity: "Employee Onboarding",
        details: "Added 'IT Setup' step to the sequence",
        timestamp: "2024-01-16T09:20:00Z",
        status: "success",
        ipAddress: "192.168.1.12"
    },
    {
        id: "LOG-003",
        action: "Leave Request Submitted",
        category: "HR",
        user: { name: "Alex Developer", role: "Senior Engineer" },
        entity: "REQ-005 (Vacation)",
        details: "Requested 10 days for PTO in February",
        timestamp: "2024-01-15T14:30:00Z",
        status: "success",
        ipAddress: "192.168.1.88"
    },
    {
        id: "LOG-004",
        action: "Unusual Login Activity",
        category: "System",
        user: { name: "Mike Chen", role: "IT Lead" },
        entity: "User Account",
        details: "Login attempt from unrecognized location: Lagos, Nigeria",
        timestamp: "2024-01-15T11:15:00Z",
        status: "warning",
        ipAddress: "41.58.10.156"
    },
    {
        id: "LOG-005",
        action: "Policy Violation",
        category: "Operations",
        user: { name: "System", role: "Automated Audit" },
        entity: "PO-442 Procurement",
        details: "Amount exceeds department threshold without second signature",
        timestamp: "2024-01-14T16:45:00Z",
        status: "error",
        ipAddress: "Internal"
    }
]



export default function AuditLogPage() {
    const { user, isLoading } = useAuth()
    const isAdmin = user?.role === "admin"
    const [entries] = useState<AuditEntry[]>(MOCK_AUDIT_LOG)
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DashboardHeader />
                <main className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
                        <ShieldCheck className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-20" />
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h1>
                        <p className="text-slate-600 mb-6">You do not have the necessary permissions to view the Audit Log. Please contact your organization administrator.</p>
                        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
                    </div>
                </main>
            </div>
        )
    }

    const filteredEntries = entries.filter(entry => {
        const matchesSearch =
            entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.entity.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = categoryFilter === "all" || entry.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success": return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Success</Badge>
            case "warning": return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Warning</Badge>
            case "error": return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Issue</Badge>
            default: return <Badge variant="outline">Logged</Badge>
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "HR": return <User className="w-4 h-4 text-gray-400" />
            case "Finance": return <Building2 className="w-4 h-4 text-gray-400" />
            case "Operations": return <ShieldCheck className="w-4 h-4 text-gray-400" />
            case "System": return <ShieldCheck className="w-4 h-4 text-gray-400" />
            case "Workflow": return <History className="w-4 h-4 text-gray-400" />
            default: return <FileText className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Audit & Trial</h1>
                            <p className="text-slate-600 max-w-2xl">
                                Comprehensive historical records of every action within your organization.
                                Ensure transparency and maintain compliance across HR, Finance, and Operations.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 font-semibold shadow-sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export Log
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="md:col-span-3 border-none shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-xl">
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by action, user, or entity..."
                                    className="pl-10 h-10 border-slate-200 bg-white shadow-none focus-visible:ring-gray-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <select
                                    className="h-10 px-3 py-2 border border-slate-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all font-medium"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="HR">Human Resources</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Workflow">Workflows</option>
                                    <option value="System">System Security</option>
                                </select>
                                <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-200 bg-white">
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-gray-100 text-black">
                        <CardContent className="p-4 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-2">
                                <ShieldCheck className="w-5 h-5 opacity-80" />
                                <Badge variant="outline" className="border-gray-400 text-gray-800 bg-gray-200">Active</Badge>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">100%</div>
                                <div className="text-xs opacity-80">Compliance Rating</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Audit Table */}
                <Card className="border-none shadow-2xl shadow-slate-200/40 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Entry ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User / Action</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Entity</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                                                {entry.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                                                    {entry.user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                        {entry.action}
                                                        <ArrowRight className="w-3 h-3 text-slate-300" />
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium">by {entry.user.name} ({entry.user.role})</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getCategoryIcon(entry.category)}
                                                <span className="text-sm font-semibold text-slate-700">{entry.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">{entry.entity}</div>
                                            <div className="text-xs text-slate-500 max-w-[200px] truncate">{entry.details}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="w-3.5 h-3.5 opacity-60" />
                                                <span className="text-sm font-medium">
                                                    {new Date(entry.timestamp).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1 rounded">
                                                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(entry.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination/Summary Footer */}
                    <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Showing {filteredEntries.length} entries
                        </span>
                        <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-extrabold uppercase tracking-tighter">Previous</Button>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-extrabold uppercase tracking-tighter bg-white">Next</Button>
                        </div>
                    </div>
                </Card>

                {/* Quick Insights Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <Card className="border-none shadow-xl shadow-slate-200/40 bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Audit Stability
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-slate-900 tracking-tighter mb-1">Excellent</div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <CheckCircle className="w-3 h-3" />
                                No tampering detected in last 180 days
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/40 bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                History Retention
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-slate-900 tracking-tighter mb-1">7 Years</div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                Standard regulatory compliance met
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/40 bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-500" />
                                Top Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-extrabold text-slate-900 tracking-tighter mb-1">Finance</div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                                42% of all logged organizational events
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
