import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, organizationName } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Email, password, and name are required" },
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

    const emailLower = email.toLowerCase()

    // Check if user exists in users table first
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", emailLower)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailLower,
      password: password,
    })

    if (authError || !authData.user) {
      console.error("Supabase Auth signup error:", authError)
      
      // Check for rate limiting error
      if (authError?.message && authError.message.includes("seconds")) {
        return NextResponse.json(
          { 
            message: "Please wait a moment before trying again. This is a security measure to prevent abuse.",
            error: "rate_limit",
            details: authError.message
          },
          { status: 429 } // Too Many Requests
        )
      }
      
      // Check if user already exists
      if (authError?.message && (
        authError.message.includes("already") || 
        authError.message.includes("exists") ||
        authError.message.includes("registered")
      )) {
        return NextResponse.json(
          { message: "An account with this email already exists. Please try logging in instead." },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { 
          message: authError?.message || "Failed to create user account. Please try again.",
          error: authError?.message
        },
        { status: 400 }
      )
    }

    const userId = authData.user.id

    // Create organization if provided
    let organizationId = null
    if (organizationName) {
      const orgId = `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Try to create organization in database (if organizations table exists)
      const { error: orgError } = await supabase
        .from("organizations")
        .insert({
          id: orgId,
          name: organizationName,
          domain: emailLower.split("@")[1] || "example.com",
          settings: {
            allowSelfRegistration: true,
            defaultRole: "employee",
            requireEmailVerification: false,
          },
          created_at: new Date().toISOString(),
        })
        .single()

      if (!orgError) {
        organizationId = orgId
      }
    }

    // Enhanced department detection based on email patterns
    let userDepartment = "Operations" // default department
    let userRole = "employee" // default role
    
    // Extract username and domain for better analysis
    const emailUsername = emailLower.split("@")[0] || ""
    const emailDomain = emailLower.split("@")[1] || "example.com"
    
    // Check for organization creator (admin role)
    if (organizationName) {
      userRole = "admin"
      userDepartment = "Management"
    } else {
      // Department detection based on email patterns
      // Pattern 1: Department prefix (finance.john@company.com)
      if (emailUsername.includes("finance") || emailUsername.includes("accounting") || emailUsername.includes("billing")) {
        userDepartment = "Finance"
        userRole = "employee"
      }
      // Pattern 2: HR prefix (hr.sarah@company.com)  
      else if (emailUsername.includes("hr") || emailUsername.includes("people") || emailUsername.includes("recruit")) {
        userDepartment = "HR"
        userRole = "employee"
      }
      // Pattern 3: IT prefix (it.tech@company.com)
      else if (emailUsername.includes("it") || emailUsername.includes("tech") || emailUsername.includes("dev")) {
        userDepartment = "IT"
        userRole = "employee"
      }
      // Pattern 4: Marketing prefix (marketing.team@company.com)
      else if (emailUsername.includes("marketing") || emailUsername.includes("sales") || emailUsername.includes("growth")) {
        userDepartment = "Marketing"
        userRole = "employee"
      }
      // Pattern 5: Operations prefix (ops.team@company.com)
      else if (emailUsername.includes("ops") || emailUsername.includes("operations") || emailUsername.includes("logistics")) {
        userDepartment = "Operations"
        userRole = "employee"
      }
      // Pattern 6: Procurement prefix (procurement@company.com)
      else if (emailUsername.includes("procurement") || emailUsername.includes("purchasing") || emailUsername.includes("vendor")) {
        userDepartment = "Procurement"
        userRole = "employee"
      }
      // Pattern 7: Management detection (manager, director, executive)
      else if (emailUsername.includes("manager") || emailUsername.includes("director") || emailUsername.includes("exec") || emailUsername.includes("lead")) {
        userDepartment = "Management"
        userRole = "manager"
      }
      // Pattern 8: Domain-based detection (if using subdomains)
      else if (emailDomain.includes("finance") || emailDomain.includes("accounting")) {
        userDepartment = "Finance"
        userRole = "employee"
      }
      else if (emailDomain.includes("hr") || emailDomain.includes("people")) {
        userDepartment = "HR"
        userRole = "employee"
      }
      else if (emailDomain.includes("it") || emailDomain.includes("tech")) {
        userDepartment = "IT"
        userRole = "employee"
      }
      else if (emailDomain.includes("marketing") || emailDomain.includes("sales")) {
        userDepartment = "Marketing"
        userRole = "employee"
      }
      else if (emailDomain.includes("ops") || emailDomain.includes("operations")) {
        userDepartment = "Operations"
        userRole = "employee"
      }
      else if (emailDomain.includes("procurement") || emailDomain.includes("purchasing")) {
        userDepartment = "Procurement"
        userRole = "employee"
      }
      // Default: Operations department for general employees
      else {
        userDepartment = "Operations"
        userRole = "employee"
      }
    }
    
    // Build insert object with flexible column names
    const userData: any = {
      id: userId,
      email: emailLower,
      role: userRole,
      department: userDepartment,
      created_at: new Date().toISOString(),
    }
    
    // Use 'name' column (matching your database schema)
    userData.name = name
    
    // Add organization fields if provided
    if (organizationId) {
      userData.organization_id = organizationId
      userData.organization_name = organizationName || null
    }
    
    const { data: insertedUser, error: userInsertError } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single()

    if (userInsertError) {
      console.error("Error inserting user into users table:", userInsertError)
      console.error("Error details:", JSON.stringify(userInsertError, null, 2))
      
      // Try to get more details about the error
      let errorMessage = "Failed to create user profile in database"
      
      if (userInsertError.code === "PGRST116") {
        errorMessage = "Table 'users' not found. Please check your Supabase database schema."
      } else if (userInsertError.code === "42501") {
        errorMessage = "Permission denied. Please check Row Level Security (RLS) policies."
      } else if (userInsertError.message) {
        errorMessage = `Database error: ${userInsertError.message}`
      }
      
      // Return error - don't proceed if we can't create the user record
      return NextResponse.json(
        { 
          message: errorMessage,
          error: userInsertError.message,
          code: userInsertError.code,
          hint: userInsertError.hint
        },
        { status: 500 }
      )
    }

    // Verify user was created
    if (!insertedUser) {
      return NextResponse.json(
        { message: "User account created but profile could not be saved. Please contact support." },
        { status: 500 }
      )
    }

    // Return success (don't return user data since we're not auto-logging in)
    return NextResponse.json(
      {
        message: "Account created successfully",
        success: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

