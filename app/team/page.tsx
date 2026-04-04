"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  User,
  Building,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/contexts/auth-context"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  position: string  // NEW: Position from database
  status: "active" | "inactive" | "pending"
  joinedDate: string
  avatar?: string
}

const DEPARTMENTS = [
  "All Departments",
  "Finance",
  "HR",
  "Operations",
  "Procurement",
  "IT",
  "Marketing",
  "Management",
  "Engineering",
  "Product",
  "Design",
  "Sales",
]

const ROLES = [
  { value: "admin", label: "Administrator", description: "Full access to all features" },
  { value: "manager", label: "Manager", description: "Can manage team and approve workflows" },
  { value: "editor", label: "Editor", description: "Can create and edit workflows" },
  { value: "viewer", label: "Viewer", description: "Can view and submit requests only" },
]

export default function TeamPage() {
  const { toast } = useToast()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null)
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null)
  const [delegatingMember, setDelegatingMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === "admin"
  const isManager = currentUser?.role === "manager"
  const canManage = isAdmin || isManager

  // Fetch team members from Supabase via API
  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (currentUser?.organizationId) {
        params.set("organizationId", currentUser.organizationId)
      }

      console.log("Fetching team members with URL:", `/api/team?${params.toString()}`)
      
      const response = await fetch(`/api/team?${params.toString()}`)
      const data = await response.json()

      console.log("Team fetch response:", { status: response.status, data })

      if (response.ok && data.members) {
        console.log("Team members loaded:", data.members.length)
        setTeam(data.members)
      } else {
        console.error("Failed to fetch team members:", data.message)
        // Show a toast error
        toast({
          title: "Failed to load team members",
          description: data.message || "Could not fetch team data",
          variant: "destructive",
        })
        setTeam([])
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      })
      setTeam([])
    } finally {
      setIsLoading(false)
    }
  }, [currentUser?.organizationId, toast])

  // Load team from Supabase on mount
  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer",
    department: "Engineering",
  })
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({})

  // Form state for delegation
  const [delegateData, setDelegateData] = useState({
    department: "",
    role: "",
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = () => {
    const errors: { name?: string; email?: string } = {}
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "viewer",
      department: isManager ? (currentUser?.department || "HR") : "Engineering"
    })
    setFormErrors({})
  }

  const filteredTeam = team.filter((member) => {
    // Visibility logic: Admins and Managers (any department) see all team members
    const isVisible = isAdmin || isManager
    if (!isVisible) return false

    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment =
      selectedDepartment === "All Departments" || member.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getRoleLabel = (role: string) => {
    return ROLES.find((r) => r.value === role)?.label || role
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-500">
            <X className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-600">
            <Shield className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const handleAddMember = async () => {
    if (!validateForm()) return

    try {
      const response = await fetch("/api/team/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
          department: formData.department,
          organizationId: currentUser?.organizationId,
          organizationName: currentUser?.organizationName
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFormErrors({ ...formErrors, email: data.message })
        return
      }

      // Re-fetch team from database to stay in sync
      await fetchTeamMembers()
      resetForm()
      setIsAddDialogOpen(false)

      toast({
        title: "Team member added successfully",
        description: `${data.user.name} has been added. Temporary password: ${data.tempPassword}`,
      })
    } catch (error) {
      console.error('Error adding team member:', error)
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleEditMember = async () => {
    if (!editingMember) return
    if (!validateForm()) return

    // Check for duplicate email (excluding current member)
    if (team.some((m) => m.id !== editingMember.id && m.email.toLowerCase() === formData.email.toLowerCase())) {
      setFormErrors({ ...formErrors, email: "This email is already registered" })
      return
    }

    try {
      const response = await fetch(`/api/team/update-member/${editingMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: formData.department,
          role: formData.role,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update member")
      }

      // Re-fetch from database
      await fetchTeamMembers()
      setEditingMember(null)
      resetForm()
      toast({
        title: "Member updated",
        description: "Changes have been saved.",
      })
    } catch (error) {
      console.error("Error updating member:", error)
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMember = async () => {
    if (!deletingMember) return

    try {
      // Call API to delete member
      const response = await fetch(`/api/team/delete-member/${deletingMember.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete member")
      }

      // Re-fetch from database to stay in sync
      await fetchTeamMembers()
      setDeletingMember(null)

      toast({
        title: "Member removed",
        description: `${deletingMember.name} has been removed from the team.`,
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openDelegateDialog = (member: TeamMember) => {
    setDelegatingMember(member)
    setDelegateData({
      department: member.department,
      role: member.role,
    })
  }

  const handleDelegateMember = async () => {
    if (!delegatingMember) return

    try {
      // Call API to update database
      const response = await fetch(`/api/team/update-member/${delegatingMember.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: delegateData.department,
          role: delegateData.role,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update member")
      }

      // Re-fetch from database
      await fetchTeamMembers()
      setDelegatingMember(null)
      toast({
        title: "Member delegated",
        description: `${delegatingMember.name} has been moved to ${delegateData.department} department.`,
      })
    } catch (error) {
      console.error("Error delegating member:", error)
      toast({
        title: "Error",
        description: "Failed to delegate member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = (member: TeamMember) => {
    const newStatus = member.status === "active" ? "inactive" : "active"
    setTeam(
      team.map((m) =>
        m.id === member.id ? { ...m, status: newStatus } : m
      )
    )
    toast({
      title: member.status === "active" ? "Member deactivated" : "Member activated",
      description: `${member.name} is now ${newStatus}.`,
    })
  }

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
    })
    setFormErrors({})
  }

  const handleCancelAdd = () => {
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleCancelEdit = () => {
    setEditingMember(null)
    resetForm()
  }

  const stats = {
    total: team.length,
    active: team.filter((m) => m.status === "active").length,
    pending: team.filter((m) => m.status === "pending").length,
    admins: team.filter((m) => m.role === "admin").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isAdmin ? "Team Management" : `${currentUser?.department} Team`}
            </h1>
            <p className="text-slate-500 font-medium">
              {isAdmin
                ? "Manage members and permissions across the organization."
                : isManager
                ? "View and manage all team members across the organization."
                : "View team members"}
            </p>
          </div>
          {canManage && (
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                      Invite a new member to your organization
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500">{formErrors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500">{formErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                        disabled={isManager && !isAdmin}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCancelAdd}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember} disabled={!formData.name || !formData.email}>
                      Add Member
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={fetchTeamMembers} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.admins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Admin Warning for Viewers */}
        {!canManage && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
            <Shield className="w-5 h-5" />
            <p className="text-sm font-medium">
              You are viewing the team as a member. Only <strong>Administrators</strong> or <strong>Department Managers</strong> can manage team members.
            </p>
          </div>
        )}

        {/* Team List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoading ? (
                <div className="space-y-3 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {filteredTeam.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.position}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            {member.department}
                          </div>
                          <Badge variant="outline" className={member.role === "admin" ? "bg-blue-50 text-blue-700 border-blue-200" : "border-gray-300"}>
                            {member.role === "admin" ? "Super Admin" : getRoleLabel(member.role)}
                          </Badge>
                          {getStatusBadge(member.status)}
                        </div>

                        {canManage && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 outline-none">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onSelect={() => setViewingMember(member)}>
                                <User className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openEditDialog(member)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleToggleStatus(member)}
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                {member.status === "active" ? "Deactivate User" : "Activate User"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openDelegateDialog(member)}>
                                <Building className="w-4 h-4 mr-2" />
                                Delegate Department
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onSelect={() => setDeletingMember(member)}
                                disabled={member.id === currentUser?.id}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove from Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredTeam.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">No members found</h3>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingMember}
          onOpenChange={(open) => {
            if (!open) handleCancelEdit()
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>Update member details and permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter((d) => d !== "All Departments").map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleEditMember}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingMember} onOpenChange={(open) => !open && setDeletingMember(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {deletingMember?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingMember(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMember} className="bg-red-600 hover:bg-red-700">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delegate Department Dialog */}
        <Dialog open={!!delegatingMember} onOpenChange={(open) => !open && setDelegatingMember(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delegate Department</DialogTitle>
              <DialogDescription>
                Change the department and role for {delegatingMember?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="delegate-department">Department</Label>
                <Select
                  value={delegateData.department}
                  onValueChange={(value) => setDelegateData({ ...delegateData, department: value })}
                >
                  <SelectTrigger id="delegate-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter(dept => dept !== "All Departments").map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delegate-role">Role</Label>
                <Select
                  value={delegateData.role}
                  onValueChange={(value) => setDelegateData({ ...delegateData, role: value })}
                >
                  <SelectTrigger id="delegate-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDelegatingMember(null)}>
                Cancel
              </Button>
              <Button onClick={handleDelegateMember}>
                Delegate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />

        {/* View Profile Dialog */}
        <Dialog open={!!viewingMember} onOpenChange={(open) => !open && setViewingMember(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Team Member Profile</DialogTitle>
            </DialogHeader>
            {viewingMember && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                    {viewingMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{viewingMember.name}</h3>
                    <p className="text-gray-500">{viewingMember.email}</p>
                  </div>
                </div>
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium text-gray-900">{getRoleLabel(viewingMember.role)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department</span>
                    <span className="font-medium text-gray-900">{viewingMember.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span>{getStatusBadge(viewingMember.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Joined Date</span>
                    <span className="font-medium text-gray-900">{new Date(viewingMember.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingMember(null)}>Close</Button>
              <Button onClick={() => {
                const member = viewingMember
                setViewingMember(null)
                if (member) openEditDialog(member)
              }}>Edit Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
