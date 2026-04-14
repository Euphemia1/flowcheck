"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle,
    Clock,
    Users,
    MessageSquare,
    Check,
    X,
    ArrowRight,
    TrendingUp,
    UserCheck,
    UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ManagerDashboard() {
    return (
        <div className="space-y-8">
            {/* Manager Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">My Team's Requests</CardTitle>
                        <Users className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">7</div>
                        <p className="text-xs text-slate-500 font-medium mt-1">Across 3 active workflows</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white border-l-4 border-gray-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Awaiting My Action</CardTitle>
                        <Clock className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">5</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">2 are past SLA deadline</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white border-l-4 border-gray-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Team Leave Balance</CardTitle>
                        <UserCheck className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">85%</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">Team availability high</p>
                    </CardContent>
                </Card>
            </div>

            {/* Manager Quick Actions */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/team">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Manage My Team
                                </Button>
                            </Link>
                            <Link href="/requests/new">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    New Flow Request
                                </Button>
                            </Link>
                            <Link href="/analytics">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Team Analytics
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Bar */}
                <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/40">
                    <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Inbox: Approvals Needed</CardTitle>
                            <CardDescription>Items waiting for your sign-off</CardDescription>
                        </div>
                        <Badge className="bg-gray-600">{5} Pending</Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {[
                                { title: "Team Lunch Reimbursement", requester: "Sarah J.", type: "Expense", priority: "normal", date: "2h ago" },
                                { title: "Annual Leave (5 days)", requester: "Alex D.", type: "Leave", priority: "urgent", date: "5h ago" },
                                { title: "Productivity Tool Renewal", requester: "Mike C.", type: "Purchase", priority: "normal", date: "Yesterday" },
                                { title: "Overtime Claim - Jan Week 2", requester: "Sarah J.", type: "Finance", priority: "normal", date: "2 days ago" },
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-gray-600 transition-colors text-sm">{item.title}</h4>
                                            {item.priority === 'urgent' && <Badge className="bg-gray-500 text-[10px] h-4">URGENT</Badge>}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium tracking-tight">
                                            <span>{item.requester}</span>
                                            <span className="opacity-30">•</span>
                                            <span>{item.type}</span>
                                            <span className="opacity-30">•</span>
                                            <span className="uppercase text-[10px]">{item.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href="/approvals">
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full border-slate-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href="/approvals">
                                            <Button size="sm" className="h-8 rounded-full bg-gray-600 hover:bg-gray-700 font-bold px-4 text-xs transition-transform active:scale-95">
                                                <Check className="h-4 w-4 mr-1.5" />
                                                Approve
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-4 border-t border-slate-50 text-center">
                        <Link href="/approvals" className="text-xs font-bold text-gray-600 hover:underline">
                            View full approval pipeline
                        </Link>
                    </div>
                </Card>

                {/* Team Snapshot */}
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl shadow-slate-200/40">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-bold">Team Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Active Requests</span>
                                <span className="font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">12</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Approval Rate</span>
                                <span className="font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">94.5%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Avg. My Speed</span>
                                <span className="font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">1.5h</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-200/40 bg-gray-800 text-white overflow-hidden relative">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Direct Message</CardTitle>
                            <CardDescription className="text-slate-400">Ask your team for clarification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                <MessageSquare className="w-3 h-3" />
                                Latest Chat on REQ-042
                            </div>
                            <p className="text-xs text-slate-300 italic">"Sarah, please attach the receipt for the team lunch."</p>
                            <Link href="/approvals">
                                <Button className="w-full bg-gray-600 hover:bg-gray-700 h-9 font-bold text-xs mt-2 transition-all shadow-lg shadow-gray-900/40">
                                    Reply Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
