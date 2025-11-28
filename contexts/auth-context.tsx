"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "employee"
  organizationId: string
  organizationName: string
  avatar?: string
  createdAt: string
}

interface Organization {
  id: string
  name: string
  domain: string
  settings: {
    allowSelfRegistration: boolean
    defaultRole: "manager" | "employee"
    requireEmailVerification: boolean
  }
  createdAt: string
}

interface AuthState {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; name: string; organizationName?: string }) => Promise<void>
  logout: () => void
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    organization: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
      setAuthState({
        user: currentUser.user,
        organization: currentUser.organization,
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { user, organization } = await AuthService.login(email, password)
      setAuthState({
        user,
        organization,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
      }))
      throw error
    }
  }

  const register = async (data: { email: string; password: string; name: string; organizationName?: string }) => {
    try {
      const { user, organization } = await AuthService.register(data)
      setAuthState({
        user,
        organization,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
      }))
      throw error
    }
  }

  const logout = () => {
    AuthService.logout()
    setAuthState({
      user: null,
      organization: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock data for demonstration (replace with real API calls)
const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Acme Corporation",
    domain: "acme.com",
    settings: {
      allowSelfRegistration: true,
      defaultRole: "employee",
      requireEmailVerification: false,
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
]

const MOCK_USERS: User[] = [
  {
    id: "user-1",
    email: "admin@acme.com",
    name: "John Admin",
    role: "admin",
    organizationId: "org-1",
    organizationName: "Acme Corporation",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

class AuthService {
  static async login(email: string, password: string): Promise<{ user: User; organization: Organization }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = MOCK_USERS.find((u) => u.email === email)
    if (!user || password !== "password") {
      throw new Error("Invalid credentials")
    }

    const organization = MOCK_ORGANIZATIONS.find((o) => o.id === user.organizationId)
    if (!organization) {
      throw new Error("Organization not found")
    }

    // Store in localStorage for persistence
    localStorage.setItem("auth_user", JSON.stringify(user))
    localStorage.setItem("auth_organization", JSON.stringify(organization))

    return { user, organization }
  }

  static async register(data: {
    email: string
    password: string
    name: string
    organizationName?: string
  }): Promise<{ user: User; organization: Organization }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (MOCK_USERS.find((u) => u.email === data.email)) {
      throw new Error("User already exists")
    }

    // Create new organization if provided
    let organization = MOCK_ORGANIZATIONS[0] // Default to first org for demo
    if (data.organizationName) {
      organization = {
        id: `org-${Date.now()}`,
        name: data.organizationName,
        domain: data.email.split("@")[1],
        settings: {
          allowSelfRegistration: true,
          defaultRole: "employee",
          requireEmailVerification: false,
        },
        createdAt: new Date().toISOString(),
      }
      MOCK_ORGANIZATIONS.push(organization)
    }

    // Create new user
    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.organizationName ? "admin" : "employee", // First user in new org is admin
      organizationId: organization.id,
      organizationName: organization.name,
      createdAt: new Date().toISOString(),
    }

    MOCK_USERS.push(user)

    // Store in localStorage
    localStorage.setItem("auth_user", JSON.stringify(user))
    localStorage.setItem("auth_organization", JSON.stringify(organization))

    return { user, organization }
  }

  static logout(): void {
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_organization")
  }

  static getCurrentUser(): { user: User; organization: Organization } | null {
    try {
      const userStr = localStorage.getItem("auth_user")
      const orgStr = localStorage.getItem("auth_organization")

      if (!userStr || !orgStr) return null

      const user = JSON.parse(userStr)
      const organization = JSON.parse(orgStr)

      return { user, organization }
    } catch {
      return null
    }
  }
}