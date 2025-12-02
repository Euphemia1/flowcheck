import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Predefined demo accounts (fallback only)
const DEMO_ACCOUNTS: Record<string, { name: string; role: "admin" | "employee" }> = {
  "admin@example.com": { name: "Admin User", role: "admin" },
  "user@example.com": { name: "Test User", role: "employee" },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Check if password is provided
    if (!password || password.length < 3) {
      return NextResponse.json(
        { message: "Password must be at least 3 characters" },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase()

    // FIRST: Check Supabase database for the user
    try {
      // Try to authenticate with Supabase Auth first (for external-auth users)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: password,
      })

      if (!authError && authData.user) {
        // User authenticated successfully via Supabase Auth
        // Now get user details from the database
        const { data: dbUser, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("email", emailLower)
          .single()

        if (dbError || !dbUser) {
          // User exists in auth but not in users table - try to create it now
          console.log("User exists in Auth but not in users table. Creating user record...")
          
          const userName = emailLower.split("@")[0]
          const emailDomain = emailLower.split("@")[1] || "example.com"
          const organizationId = `org-${emailDomain.replace(/\./g, "-")}`
          const organizationName = emailDomain.split(".")[0].charAt(0).toUpperCase() + emailDomain.split(".")[0].slice(1) + " Organization"

          // Try to create the user record in the database
          const { data: newUser, error: createError } = await supabase
            .from("users")
            .insert({
              id: authData.user.id,
              email: emailLower,
              name: authData.user.user_metadata?.name || userName,
              role: "employee",
              organization_id: null,
              organization_name: null,
              created_at: authData.user.created_at || new Date().toISOString(),
            })
            .select()
            .single()

          if (createError) {
            console.error("Failed to create user record during login:", createError)
            // Continue with minimal user object even if insert fails
          }

          const userRole = (newUser?.role || "employee") as "admin" | "manager" | "employee"
          const user = {
            id: authData.user.id,
            email: emailLower,
            name: authData.user.user_metadata?.name || userName,
            role: userRole,
            organizationId,
            organizationName,
            createdAt: authData.user.created_at || new Date().toISOString(),
          }

          const organization = {
            id: organizationId,
            name: organizationName,
            domain: emailDomain,
            settings: {
              allowSelfRegistration: true,
              defaultRole: "employee" as const,
              requireEmailVerification: false,
            },
            createdAt: new Date().toISOString(),
          }

          return NextResponse.json({
            user,
            organization,
          })
        }

        // User found in database - use 'name' column (matching your schema)
        const userName = dbUser.name || emailLower.split("@")[0]
        const userRole = dbUser.role || "employee"
        const emailDomain = emailLower.split("@")[1] || "example.com"
        const organizationId = dbUser.organization_id || `org-${emailDomain.replace(/\./g, "-")}`
        const organizationName = dbUser.organization_name || emailDomain.split(".")[0].charAt(0).toUpperCase() + emailDomain.split(".")[0].slice(1) + " Organization"

        // Try to get organization from database
        let organization = null
        if (dbUser.organization_id) {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", dbUser.organization_id)
            .single()

          if (orgData) {
            organization = {
              id: orgData.id,
              name: orgData.name || organizationName,
              domain: orgData.domain || emailDomain,
              settings: orgData.settings || {
                allowSelfRegistration: true,
                defaultRole: "employee" as const,
                requireEmailVerification: false,
              },
              createdAt: orgData.created_at || new Date().toISOString(),
            }
          }
        }

        // If organization not found, create default organization object
        if (!organization) {
          organization = {
            id: organizationId,
            name: organizationName,
            domain: emailDomain,
            settings: {
              allowSelfRegistration: true,
              defaultRole: "employee" as const,
              requireEmailVerification: false,
            },
            createdAt: new Date().toISOString(),
          }
        }

        // Return user and organization matching the expected format
        const user = {
          id: dbUser.id || authData.user.id,
          email: emailLower,
          name: userName,
          role: userRole as "admin" | "manager" | "employee",
          organizationId,
          organizationName: organization.name,
          avatar: dbUser.avatar || undefined,
          createdAt: dbUser.created_at || authData.user.created_at || new Date().toISOString(),
        }

        return NextResponse.json({
          user,
          organization,
        })
      }

      // If Supabase Auth fails, check if user exists in database table directly
      // (for cases where users might not be in Supabase Auth yet)
      const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("email", emailLower)
        .single()

      if (!dbError && dbUser) {
        // User exists in database but auth failed - return error
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        )
      }
    } catch (supabaseError) {
      console.error("Supabase query error:", supabaseError)
      // Continue to fallback if database query fails
    }

    // FALLBACK: If user not found in database, check demo accounts
    const demoAccount = DEMO_ACCOUNTS[emailLower]
    
    if (!demoAccount) {
      return NextResponse.json(
        { message: "Invalid email or password. Please check your credentials or register for an account." },
        { status: 401 }
      )
    }

    // Use demo account
    const userName = demoAccount.name
    const userRole = demoAccount.role
    const emailDomain = emailLower.split("@")[1] || "example.com"
    const organizationId = `org-${emailDomain.replace(/\./g, "-")}`
    const organizationName = emailDomain.split(".")[0].charAt(0).toUpperCase() + emailDomain.split(".")[0].slice(1) + " Organization"

    const user = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: emailLower,
      name: userName,
      role: userRole,
      organizationId,
      organizationName,
      createdAt: new Date().toISOString(),
    }

    const organization = {
      id: organizationId,
      name: organizationName,
      domain: emailDomain,
      settings: {
        allowSelfRegistration: true,
        defaultRole: "employee" as const,
        requireEmailVerification: false,
      },
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      user,
      organization,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
