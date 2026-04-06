"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingCart,
    Truck,
    Building2,
    FileText,
    DollarSign,
    Clock,
    ArrowRight,
    TrendingUp,
    History,
    UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ProcurementDashboard() {
    return (
        <div className="space-y-8">
            {/* Procurement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Pending POs</CardTitle>
                        <FileText className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">14</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">Value: $28,400</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Vendor Requests</CardTitle>
                        <Truck className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">5</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">3 awaiting compliance check</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Approved (MTD)</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">32</div>
                        <p className="text-xs text-gray-600 font-bold mt-1">Total spend: $142,500</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Cycle Time</CardTitle>
                        <Clock className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold text-slate-900">2.4d</div>
                        <p className="text-xs font-bold mt-1 text-gray-600">Target: 2.0 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Procurement Quick Actions */}
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/team">
                                <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Add/Manage Procurement Team
                                </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <Building2 className="w-4 h-4" />
                                Vendor Registry
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 border-slate-200 text-slate-600 font-bold gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Spend Insights
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vendor & PO Management */}
                <Card className="border-none shadow-2xl shadow-slate-200/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Vendor Management</CardTitle>
                            <CardDescription>Onboard and monitor supply partners</CardDescription>
                        </div>
                        <Button size="sm" className="bg-gray-600 font-bold text-xs h-8">Add Vendor</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "CloudScale Systems", category: "IT Infrastructure", status: "Active", spend: "$45k" },
                            { name: "Creative Edge", category: "Marketing Services", status: "Pending Review", spend: "$0" },
                            { name: "Global Logistics", category: "Operations", status: "Active", spend: "$12k" },
                        ].map((vendor, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl group hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                        <Building2 className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">{vendor.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase">{vendor.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900">{vendor.spend}</p>
                                    <Badge variant="outline" className={`text-[9px] h-4 px-1 bg-gray-100 text-gray-800 border-gray-300`}>
                                        {vendor.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Purchase Order Generator & Tracking */}
                <div className="space-y-6">
                    <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">PO tracking by Vendor</CardTitle>
                            <CardDescription>Spending distribution across top partners</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {[
                                { name: "CloudScale", value: 65, color: "bg-gray-600" },
                                { name: "Global Log", value: 20, color: "bg-gray-600" },
                                { name: "Others", value: 15, color: "bg-gray-400" },
                            ].map((item) => (
                                <div key={item.name} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{item.name}</span>
                                        <span>{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <ShoppingCart className="w-24 h-24 text-slate-900" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900">PO Generator</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-gray-600 mb-4 font-medium leading-relaxed">Instantly generate a purchase order from an approved request.</p>
                            <Button className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200 h-9 font-bold text-xs rounded-xl shadow-lg border border-slate-200">
                                Generate PO #8442
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
