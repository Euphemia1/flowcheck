"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Workflow,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    Activity,
    BarChart3,
    Clock,
    ArrowRight,
    UserPlus,
    Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Executive Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Org Efficiency</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">92%</div>
                        <p className="text-xs text-emerald-600 font-bold mt-1">+4% this month</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Avg. Approval Time</CardTitle>
                        <Clock className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">1.8h</div>
                        <p className="text-xs text-indigo-600 font-bold mt-1">Goal: {"<"} 2h</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Compliance Rate</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">100%</div>
                        <p className="text-xs text-slate-500 font-medium mt-1">Audit-ready status</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-rose-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase opacity-80">Budget Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold">3</div>
                        <p className="text-xs font-bold mt-1 text-rose-100">Pending escalations</p>
                    </CardContent>
                </Card>
            </div>

            {/* Admin Quick Actions */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/team">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Manage Team
                                </Button>
                            </Link>
                            <Link href="/audit">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Audit Logs
                                </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <Settings className="w-4 h-4" />
                                Org Settings
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Department Efficiency Ranking */}
                <Card className="border-none shadow-2xl shadow-slate-200/40">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Department Performance</CardTitle>
                        <CardDescription>Approval velocity by organization unit</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: "Finance", score: 98, time: "0.8h", color: "bg-emerald-500" },
                            { name: "Operations", score: 85, time: "2.1h", color: "bg-blue-500" },
                            { name: "HR", score: 72, time: "4.5h", color: "bg-amber-500" },
                            { name: "Procurement", score: 64, time: "6.2h", color: "bg-rose-500" },
                        ].map((dept) => (
                            <div key={dept.name} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-700">{dept.name}</span>
                                    <span className="text-slate-500">{dept.time} avg response</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className={`h-2.5 rounded-full ${dept.color}`} style={{ width: `${dept.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Global Bottleneck Analyzer */}
                <Card className="border-none shadow-2xl shadow-slate-200/40">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">System Bottlenecks</CardTitle>
                        <CardDescription>Identifying friction in the approval chain</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-orange-900 text-sm">Procurement Slowdown</h4>
                                <p className="text-xs text-orange-700">Vendor approvals are taking 30% longer than average. Suggested action: Add a secondary reviewer layer.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Finance Velocity High</h4>
                                <p className="text-xs text-blue-700">Expense approvals are at an all-time high speed. Consider automating low-value ({"<"}$100) requests.</p>
                            </div>
                        </div>
                        <Link href="/analytics" className="block mt-4">
                            <Button variant="outline" className="w-full border-slate-200 text-slate-600 group">
                                Full Efficiency Report
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Org-Wide Active Flows */}
            <Card className="border-none shadow-2xl shadow-slate-200/40">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold">Organization-Wide Active Flows</CardTitle>
                        <CardDescription>Real-time oversight across all departments</CardDescription>
                    </div>
                    <Badge className="bg-blue-600">LIVE</Badge>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase">Workflow</th>
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase">Department</th>
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase">Active Requests</th>
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase">SLA Status</th>
                                    <th className="py-4 text-xs font-bold text-slate-500 uppercase"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: "Employee Onboarding", dept: "HR", count: 8, status: "Healthy" },
                                    { name: "Marketing Budget Prep", dept: "Finance", count: 3, status: "At Risk" },
                                    { name: "Vendor Contract Review", dept: "Procurement", count: 12, status: "Healthy" },
                                    { name: "IT Assets Request", dept: "Operations", count: 5, status: "Healthy" },
                                ].map((flow) => (
                                    <tr key={flow.name} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-bold text-slate-800 text-sm">{flow.name}</td>
                                        <td className="py-4">
                                            <Badge variant="outline" className="border-slate-200 text-slate-600">{flow.dept}</Badge>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600">{flow.count} pending</td>
                                        <td className="py-4">
                                            <span className={`text-xs font-bold ${flow.status === 'Healthy' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {flow.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-8 font-bold">
                                                Oversee
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
