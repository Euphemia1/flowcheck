import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, department, role, organizationId, organizationName } = body

    if (!email || !name || !department || !role) {
      return NextResponse.json(
        { message: "Email, name, department, and role are required" },
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

    // Check if user already exists in users table
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

    // Generate a readable temporary password: firstname + "2026!"
    const firstName = name.split(" ")[0].toLowerCase()
    const tempPassword = `${firstName}2026!`

    // Create user in Supabase Auth using signUp (works with anon key)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailLower,
      password: tempPassword,
      options: {
        data: {
          name: name,
          department: department,
          role: role,
          added_by_admin: true,
        },
      },
    })

    if (authError || !authData.user) {
      console.error("Error creating user:", authError)

      // Check for rate limiting
      if (authError?.message?.includes("seconds")) {
        return NextResponse.json(
          {
            message: "Too many requests. Please wait a moment and try again.",
            error: authError.message,
          },
          { status: 429 }
        )
      }

      // Check if user already exists in auth
      if (
        authError?.message?.includes("already") ||
        authError?.message?.includes("exists")
      ) {
        return NextResponse.json(
          { message: "An account with this email already exists in authentication." },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { message: "Failed to create user account", error: authError?.message },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    // Create user record in users table
    const userData = {
      id: userId,
      email: emailLower,
      name: name,
      role: role,
      department: department,
      organization_id: organizationId || null,
      organization_name: organizationName || null,
      created_at: new Date().toISOString(),
    }

    const { data: insertedUser, error: userInsertError } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single()

    if (userInsertError) {
      console.error("Error inserting user:", userInsertError)
      return NextResponse.json(
        { message: "Failed to create user profile", error: userInsertError.message },
        { status: 500 }
      )
    }

    // Return success with the temp password so admin can share it
    return NextResponse.json(
      {
        message: "Team member added successfully",
        user: insertedUser,
        tempPassword: tempPassword,
        success: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Add team member error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
