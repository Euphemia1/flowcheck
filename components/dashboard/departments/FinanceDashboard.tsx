"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DollarSign,
    CreditCard,
    PieChart,
    AlertTriangle,
    TrendingUp,
    Download,
    CheckCircle,
    FileText,
    Clock,
    UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FinanceDashboard() {
    return (
        <div className="space-y-8">
            {/* Finance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Pending Expenses</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">$4,250</div>
                        <p className="text-xs text-orange-600 font-bold mt-1">12 claims awaiting review</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Budget Utilized</CardTitle>
                        <PieChart className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">68%</div>
                        <p className="text-xs text-emerald-600 font-bold mt-1">Ahead of plan by 4%</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Purchase Requests</CardTitle>
                        <FileText className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">15</div>
                        <p className="text-xs text-slate-500 font-medium mt-1">Total $42,000 this week</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-rose-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold uppercase opacity-80">Policy Flags</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold">2</div>
                        <p className="text-xs font-bold mt-1 text-rose-100">Unjustified spend detected</p>
                    </CardContent>
                </Card>
            </div>

            {/* Finance Quick Actions */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/team">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Add/Manage Finance Team
                                </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <DollarSign className="w-4 h-4" />
                                Budget Summary
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <PieChart className="w-4 h-4" />
                                Spend Analysis
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expense Management OS */}
                <Card className="border-none shadow-2xl shadow-slate-200/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Expense Claims</CardTitle>
                            <CardDescription>Review receipts and policy compliance</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 text-slate-600 font-bold gap-2">
                            <Download className="w-3 h-3" />
                            Export
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        {[
                            { requester: "Sarah Johnson", category: "Software", amount: 240, status: "Review Required", date: "2h ago" },
                            { requester: "Michael Chen", category: "Travel", amount: 1200, status: "Escalated", date: "5h ago" },
                            { requester: "Emily Davis", category: "Hardware", amount: 85, status: "Policy Clear", date: "Yesterday" },
                        ].map((claim, idx) => (
                            <div key={idx} className="flex flex-col p-4 border border-slate-100 rounded-xl group hover:bg-slate-50 transition-all gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{claim.requester}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{claim.category} • {claim.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold text-slate-900">${claim.amount}</p>
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-1.5 h-4 ${claim.status === 'Escalated' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                            {claim.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <Button size="sm" className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-xs flex-1">Approve</Button>
                                    <Button size="sm" variant="outline" className="h-8 rounded-lg border-slate-200 text-slate-600 font-bold text-xs flex-1">Reject</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Budget & Spend Insights */}
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl shadow-slate-200/40">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-bold">Budget Health</CardTitle>
                            <CardDescription>Live tracking by department</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            {[
                                { name: "Marketing", spent: 42000, total: 50000 },
                                { name: "Engineering", spent: 115000, total: 200000 },
                                { name: "Design", spent: 18000, total: 20000 },
                            ].map((budget) => (
                                <div key={budget.name} className="space-y-2">
                                    <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-700">
                                        <span>{budget.name}</span>
                                        <span>${budget.spent.toLocaleString()} / ${budget.total.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${budget.spent / budget.total > 0.9 ? 'bg-rose-500' : 'bg-blue-600'}`}
                                            style={{ width: `${(budget.spent / budget.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-200/40 bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <TrendingUp className="w-24 h-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Spend Forecasting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400 mb-4 font-medium">Predicted spend for Q1 based on current approval velocity.</p>
                            <div className="text-2xl font-extrabold">$245,000</div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-emerald-500 text-[10px] h-4">ON TARGET</Badge>
                                <span className="text-[10px] text-slate-500 font-bold">Estimated 1.2% variance</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
