"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    UserPlus,
    Calendar,
    FileCheck,
    Clock,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HRDashboard() {
    return (
        <div className="space-y-8">
            {/* HR Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Pending Leave</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">8</div>
                        <p className="text-xs text-orange-600 font-bold mt-1">3 require immediate review</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Hiring Approvals</CardTitle>
                        <UserPlus className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">4</div>
                        <p className="text-xs text-emerald-600 font-bold mt-1">+2 from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">On Leave Today</CardTitle>
                        <Users className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">12</div>
                        <p className="text-xs text-slate-500 font-medium mt-1">Across all departments</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Policy Compliance</CardTitle>
                        <FileCheck className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">95%</div>
                        <p className="text-xs text-emerald-600 font-bold mt-1">Top Score: Engineering</p>
                    </CardContent>
                </Card>
            </div>

            {/* HR Quick Actions */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/team">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Add/Manage HR Team
                                </Button>
                            </Link>
                            <Link href="/requests/new">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <FileText className="w-4 h-4" />
                                    New Policy Flow
                                </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Hiring Report
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Leave Requests OS */}
                <Card className="border-none shadow-2xl shadow-slate-200/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Leave Management</CardTitle>
                            <CardDescription>Review and balance team time-off</CardDescription>
                        </div>
                        <Link href="/approvals?category=HR">
                            <Button variant="ghost" size="sm" className="text-blue-600 font-bold">View All</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Sarah Johnson", type: "Vacation", days: 5, status: "pending", avatar: "SJ" },
                            { name: "Alex Developer", type: "Sick Leave", days: 1, status: "urgent", avatar: "AD" },
                            { name: "Mike Chen", type: "Personal", days: 2, status: "pending", avatar: "MC" },
                        ].map((request) => (
                            <div key={request.name} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl group hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{request.avatar}</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{request.name}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{request.type} • {request.days} days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={request.status === 'urgent' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>
                                        {request.status}
                                    </Badge>
                                    <Button size="sm" className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-xs">Approve</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Hiring & Policy Control */}
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl shadow-slate-200/40">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-bold">Hiring Track</CardTitle>
                            <CardDescription>Candidates in approval pipeline</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-700 font-bold">Senior Product Designer</span>
                                    <Badge className="bg-emerald-500">Step 3/4</Badge>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full w-[75%]" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Awaiting: CEO Sign-off</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-200/40">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-bold">Document Hub</CardTitle>
                            <CardDescription>Policy sign-offs and compliance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">Remote Work Policy 2024</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600">88% Signed</span>
                            </div>
                            <Button variant="outline" className="w-full h-9 text-xs font-bold border-slate-200 text-slate-600">
                                Send Reminders (12 Pending)
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
