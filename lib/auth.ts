// Authentication utilities and types
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "employee"
  organizationId: string
  organizationName: string
  avatar?: string
  createdAt: string
}

export interface Organization {
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

export interface AuthState {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  isAuthenticated: boolean
}

export class AuthService {
  // 🔵 LOGIN (real API)
  static async login(email: string, password: string): Promise<{ user: User; organization: Organization }> {
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

    localStorage.setItem("auth_user", JSON.stringify(user))
    localStorage.setItem("auth_organization", JSON.stringify(organization))

    return { user, organization }
  }

  // 🟢 REGISTER (real API)
  static async register(data: {
    email: string
    password: string
    name: string
    organizationName?: string
  }): Promise<{ user: User; organization: Organization }> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Registration failed")
    }

    const { user, organization } = await res.json()

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