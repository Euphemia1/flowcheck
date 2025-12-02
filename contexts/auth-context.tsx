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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    organization: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem("auth_user") : null
      const orgStr = typeof window !== 'undefined' ? localStorage.getItem("auth_organization") : null

      if (userStr && orgStr) {
        const user = JSON.parse(userStr)
        const organization = JSON.parse(orgStr)
        
        setAuthState({
          user,
          organization,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setAuthState({
          user: null,
          organization: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setAuthState({
        user: null,
        organization: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Invalid credentials")
    }

    const { user, organization } = await res.json()

    if (typeof window !== 'undefined') {
      localStorage.setItem("auth_user", JSON.stringify(user))
      localStorage.setItem("auth_organization", JSON.stringify(organization))
    }

    setAuthState({
      user,
      organization,
      isLoading: false,
      isAuthenticated: true,
    })
  }

  const register = async (data: { email: string; password: string; name: string; organizationName?: string }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      
      // Handle rate limiting error specifically
      if (res.status === 429 || error.error === "rate_limit") {
        throw new Error("Too many registration attempts. Please wait a moment and try again.")
      }
      
      throw new Error(error.message || "Registration failed")
    }

    // Just verify registration was successful - don't log the user in automatically
    // User will need to log in separately after registration
    await res.json()
    
    // Don't set auth state - user must log in manually
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_organization")
    }
    
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}