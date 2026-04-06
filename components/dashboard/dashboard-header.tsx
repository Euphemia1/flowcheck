"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Settings, LogOut, User, Workflow } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { NotificationCenter } from "./notification-center"

export function DashboardHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-bold"><span className="text-blue-600">Flow</span><span className="text-gray-900">Check</span></span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium tracking-tight">
            Dashboard
          </Link>
          <Link href="/workflows" className="text-gray-700 hover:text-gray-900 font-medium tracking-tight">
            Workflows
          </Link>
          <Link href="/approvals" className="text-gray-700 hover:text-gray-900 font-medium tracking-tight">
            Approvals
          </Link>
          <Link href="/team" className="text-gray-700 hover:text-gray-900 font-medium tracking-tight">
            Team
          </Link>
          <Link href="/analytics" className="text-gray-700 hover:text-gray-900 font-medium tracking-tight">
            Analytics
          </Link>
          <Link href="/audit" className="text-gray-700 hover:text-gray-900 font-medium tracking-tight">
            Audit Log
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 rounded-full hover:bg-slate-100"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-gray-400 rounded-full border-2 border-white" />
          </Button>

          <NotificationCenter
            open={showNotifications}
            onOpenChange={setShowNotifications}
          />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src={user?.avatar || "/avatars/01.png"} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gray-200 text-gray-800 font-bold text-xs">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-slate-900">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer font-medium">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer font-medium" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-medium text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

