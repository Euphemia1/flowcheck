"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "inactive" | "pending"
  joinedDate: string
  avatar?: string
}

const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
]

const ROLES = [
  { value: "admin", label: "Administrator", description: "Full access to all features" },
  { value: "manager", label: "Manager", description: "Can manage team and approve workflows" },
  { value: "editor", label: "Editor", description: "Can create and edit workflows" },
  { value: "viewer", label: "Viewer", description: "Can view and submit requests only" },
]

const MOCK_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "admin",
    department: "Engineering",
    status: "active",
    joinedDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@company.com",
    role: "manager",
    department: "Engineering",
    status: "active",
    joinedDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.d@company.com",
    role: "editor",
    department: "Product",
    status: "active",
    joinedDate: "2023-03-10",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.w@company.com",
    role: "viewer",
    department: "Marketing",
    status: "active",
    joinedDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@company.com",
    role: "manager",
    department: "Finance",
    status: "active",
    joinedDate: "2023-05-12",
  },
  {
    id: "6",
    name: "David Brown",
    email: "david.b@company.com",
    role: "editor",
    department: "Design",
    status: "inactive",
    joinedDate: "2023-06-01",
  },
  {
    id: "7",
    name: "Rachel Green",
    email: "rachel.g@company.com",
    role: "viewer",
    department: "Sales",
    status: "pending",
    joinedDate: "2024-01-10",
  },
]

export default function TeamPage() {
  const { toast } = useToast()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load team from localStorage on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem("team_members")
    if (savedTeam) {
      setTeam(JSON.parse(savedTeam))
    } else {
      // Initialize with mock data if no saved team
      setTeam(MOCK_TEAM)
      localStorage.setItem("team_members", JSON.stringify(MOCK_TEAM))
    }
    setIsLoading(false)
  }, [])

  // Save team to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("team_members", JSON.stringify(team))
    }
  }, [team, isLoading])

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer",
    department: "Engineering",
  })
  const [formErrors, setFormErrors] = useState<{name?: string; email?: string}>({})

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = () => {
    const errors: {name?: string; email?: string} = {}
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
    setFormData({ name: "", email: "", role: "viewer", department: "Engineering" })
    setFormErrors({})
  }

  const filteredTeam = team.filter((member) => {
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

  const handleAddMember = () => {
    if (!validateForm()) return

    // Check for duplicate email
    if (team.some((m) => m.email.toLowerCase() === formData.email.toLowerCase())) {
      setFormErrors({ ...formErrors, email: "This email is already registered" })
      return
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      department: formData.department,
      status: "pending",
      joinedDate: new Date().toISOString().split("T")[0],
    }
    setTeam([...team, newMember])
    resetForm()
    setIsAddDialogOpen(false)
    toast({
      title: "Member added",
      description: `${newMember.name} has been invited and will receive an email.`,
    })
  }

  const handleEditMember = () => {
    if (!editingMember) return
    if (!validateForm()) return

    // Check for duplicate email (excluding current member)
    if (team.some((m) => m.id !== editingMember.id && m.email.toLowerCase() === formData.email.toLowerCase())) {
      setFormErrors({ ...formErrors, email: "This email is already registered" })
      return
    }

    setTeam(
      team.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: formData.name.trim(),
              email: formData.email.trim().toLowerCase(),
              role: formData.role,
              department: formData.department,
            }
          : m
      )
    )
    setEditingMember(null)
    resetForm()
    toast({
      title: "Member updated",
      description: "Changes have been saved.",
    })
  }

  const handleDeleteMember = () => {
    if (!deletingMember) return
    setTeam(team.filter((m) => m.id !== deletingMember.id))
    setDeletingMember(null)
    toast({
      title: "Member removed",
      description: `${deletingMember.name} has been removed from the team.`,
      variant: "destructive",
    })
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
            <p className="text-gray-600">Manage your organization&apos;s team and their access levels</p>
          </div>
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

        {/* Team List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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
                      <div className="flex items-center gap-2 text-sm text-gray-500">
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
                      <Badge variant="outline" className="border-gray-300">
                        {getRoleLabel(member.role)}
                      </Badge>
                      {getStatusBadge(member.status)}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(member)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(member)}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          {member.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeletingMember(member)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

        <Toaster />
      </main>
    </div>
  )
}
