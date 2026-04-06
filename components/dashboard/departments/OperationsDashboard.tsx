"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Settings,
    Workflow,
    Zap,
    AlertCircle,
    Activity,
    Layers,
    Search,
    Timer,
    ArrowRight,
    UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function OperationsDashboard() {
    return (
        <div className="space-y-8">
            {/* Ops Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Live Requests</CardTitle>
                        <Activity className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">42</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">SLA Health: 98.4%</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Avg Response</CardTitle>
                        <Timer className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">2.4h</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">-15m from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Bottlenecks</CardTitle>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">3</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">Requires re-routing</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-gray-100 text-black">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase opacity-80">Flows Active</CardTitle>
                        <Workflow className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold">18</div>
                        <p className="text-xs font-bold mt-1 text-gray-600">Across 6 departments</p>
                    </CardContent>
                </Card>
            </div>

            {/* Ops Quick Actions */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/team">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Add/Manage Ops Team
                                </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <Zap className="w-4 h-4" />
                                Optimize Flow
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <Activity className="w-4 h-4" />
                                System Health
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workflow Manager OS */}
                <Card className="border-none shadow-2xl shadow-slate-200/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Process Control</CardTitle>
                            <CardDescription>Monitor and optimize workflow health</CardDescription>
                        </div>
                        <Link href="/workflows">
                            <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-600 font-bold group">
                                Designer
                                <Workflow className="ml-2 w-3 h-3 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        {[
                            { name: "IT Assets Approval", load: 12, health: 92, status: "stable" },
                            { name: "New Vendor Onboarding", load: 5, health: 64, status: "at-risk" },
                            { name: "Content Review Cycle", load: 24, health: 98, status: "stable" },
                        ].map((flow, idx) => (
                            <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-800">{flow.name}</h4>
                                    <Badge className={flow.status === 'at-risk' ? 'bg-gray-300 text-black' : 'bg-gray-500 text-white'}>
                                        {flow.health}% Health
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <span>Current Load: {flow.load} active steps</span>
                                    <span>SLA Status: {flow.status === 'at-risk' ? 'Alert Triggered' : 'Healthy'}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${flow.status === 'at-risk' ? 'bg-gray-400' : 'bg-gray-600'}`} style={{ width: `${flow.health}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* System Diagnostics & Bottlenecks */}
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl shadow-slate-200/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-bold">Bottleneck Analyzer</CardTitle>
                            <CardDescription>Where approvals are getting stuck</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                <div className="p-2 bg-gray-200 rounded-xl">
                                    <Timer className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Legal Review Layer</h4>
                                    <p className="text-xs text-slate-500">Wait time exceeded 4.5 days (SLA: 2 days). Suggested: Add parallel reviewer.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                <div className="p-2 bg-gray-200 rounded-xl">
                                    <AlertCircle className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Position Approval Flow</h4>
                                    <p className="text-xs text-slate-500">2 requests pending for over 1 week. Check: Budgeting Step #2.</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full text-gray-600 font-bold text-xs">View Full System Diagnostics</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-200/40 bg-gray-800 text-white overflow-hidden relative group">
                        <div className="absolute -bottom-4 -right-4 p-8 opacity-20 transition-transform group-hover:scale-110">
                            <Zap className="w-32 h-32" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Automation Potential</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs opacity-75 mb-4 leading-relaxed font-medium">We found that 40% of your Finance approvals can be fully automated using threshold rules.</p>
                            <Button className="h-9 bg-white text-black hover:bg-slate-100 rounded-xl font-bold text-xs px-6">
                                Enable Smart Rules
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
