"use client"

import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Bell,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    Workflow,
    MoreVertical,
    Trash2
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface Notification {
    id: string
    title: string
    description: string
    timestamp: string
    type: "approval" | "update" | "alert" | "message"
    status: "unread" | "read"
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        title: "New Approval Request",
        description: "Sarah Johnson submitted a vacation request for 5 days.",
        timestamp: "2 minutes ago",
        type: "approval",
        status: "unread",
    },
    {
        id: "2",
        title: "SLA Alert: IT Assets",
        description: "Flow #842 (IT Asset Request) is now past the 2-day SLA.",
        timestamp: "1 hour ago",
        type: "alert",
        status: "unread",
    },
    {
        id: "3",
        title: "Expense Approved",
        description: "Your reimbursement for 'Team Lunch' has been approved by Finance.",
        timestamp: "3 hours ago",
        type: "approval",
        status: "unread",
    },
    {
        id: "4",
        title: "Comment on REQ-042",
        description: "Michael Chen: 'Please attach the PDF receipt.'",
        timestamp: "Yesterday",
        type: "message",
        status: "read",
    },
    {
        id: "5",
        title: "Workflow Updated",
        description: "The 'Marketing Budget' workflow has been updated by Ops.",
        timestamp: "2 days ago",
        type: "update",
        status: "read",
    },
]

interface NotificationCenterProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NotificationCenter({ open, onOpenChange }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

    const unreadCount = notifications.filter(n => n.status === "unread").length

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, status: "read" as const } : n
        ))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, status: "read" as const })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "approval": return <CheckCircle2 className="w-4 h-4 text-gray-600" />
            case "alert": return <AlertCircle className="w-4 h-4 text-gray-600" />
            case "message": return <MessageSquare className="w-4 h-4 text-gray-600" />
            default: return <Workflow className="w-4 h-4 text-slate-600" />
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                <Bell className="w-5 h-5" />
                                Notifications
                            </SheetTitle>
                            <SheetDescription className="text-sm font-medium text-slate-500">
                                You have {unreadCount} unread messages
                            </SheetDescription>
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs font-bold text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto bg-slate-50/30">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 sm:p-6 transition-all hover:bg-white relative group ${notification.status === 'unread' ? 'bg-gray-50/40' : ''
                                        }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex gap-4">
                                        <div className={`mt-1 h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.status === 'unread' ? 'bg-white shadow-sm' : 'bg-slate-100 opacity-60'
                                            }`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <h4 className={`text-sm tracking-tight ${notification.status === 'unread' ? 'font-bold text-slate-900' : 'font-medium text-slate-600'
                                                    }`}>
                                                    {notification.title}
                                                </h4>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="w-3 h-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => deleteNotification(notification.id)} className="text-red-600">
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <p className={`text-xs leading-relaxed ${notification.status === 'unread' ? 'text-slate-700' : 'text-slate-500'
                                                }`}>
                                                {notification.description}
                                            </p>
                                            <div className="flex items-center gap-2 pt-1">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {notification.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                        {notification.status === 'unread' && (
                                            <div className="mt-2 h-2 w-2 rounded-full bg-gray-600 flex-shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">
                                No new notifications at the moment.
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl">
                        View All Activity
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
