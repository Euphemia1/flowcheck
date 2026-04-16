"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, CheckSquare, ShoppingCart, ShieldCheck, Users, BarChart3, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const ALL_NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, requester: true },
  { href: "/requests", label: "Requests", icon: FileText, requester: true },
  { href: "/approvals", label: "Approvals", icon: CheckSquare, requester: false },
  { href: "/purchase-orders", label: "Purchase Orders", icon: ShoppingCart, requester: false },
  { href: "/audit", label: "Audit Trail", icon: ShieldCheck, requester: false },
  { href: "/team", label: "Team", icon: Users, requester: false },
  { href: "/analytics", label: "Analytics", icon: BarChart3, requester: false },
] as const

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const isRequester = user?.role === "requester"
  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => !isRequester || item.requester)

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {isRequester ? "My workspace" : "Workspace"}
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.href === "/requests" && isRequester ? "My requests" : item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
