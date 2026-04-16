import { NextRequest, NextResponse } from "next/server"
import {
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
  supabase,
  supabaseAdmin,
} from "@/lib/supabase"

/**
 * POST /api/auth/seed-users
 * 
 * Creates all test users in Supabase Auth
 * Matches the users that were already inserted into the users table
 */

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { message: "Supabase is not configured. Check deployment environment variables." },
        { status: 500 }
      )
    }

    if (!isSupabaseAdminConfigured) {
      return NextResponse.json(
        {
          message:
            "SUPABASE_SERVICE_ROLE_KEY is required for seeding auth users. Add it to server environment variables.",
        },
        { status: 500 }
      )
    }

    // Get all users from the users table that need auth accounts
    const { data: dbUsers, error: dbError } = await supabase
      .from("users")
      .select("id, email, name, department")
      .neq("email", null)
      .order("email")

    if (dbError) {
      return NextResponse.json(
        { message: "Failed to fetch users from database", error: dbError.message },
        { status: 500 }
      )
    }

    if (!dbUsers || dbUsers.length === 0) {
      return NextResponse.json(
        { message: "No users found in the database" },
        { status: 400 }
      )
    }

    const results = {
      created: [] as Array<{ email: string; department: string; password: string }>,
      failed: [] as Array<{ email: string; error: string }>,
      skipped: [] as Array<{ email: string; reason: string }>,
    }

    // Default password for all test users
    const defaultPassword = "Test@123!"

    // Create each user in Supabase Auth
    for (const user of dbUsers) {
      try {
        // Check if user already exists in auth
        const { data: existingAuth } = await supabaseAdmin.auth.admin.getUserById(
          user.id
        )

        if (existingAuth.user) {
          results.skipped.push({
            email: user.email,
            reason: "User already exists in Auth",
          })
          continue
        }

        // Create user in Supabase Auth
        const { data: authUser, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            id: user.id,
            email: user.email,
            password: defaultPassword,
            email_confirm: true,
            user_metadata: {
              name: user.name,
              department: user.department,
            },
          })

        if (authError) {
          results.failed.push({
            email: user.email,
            error: authError.message,
          })
          continue
        }

        if (authUser.user) {
          results.created.push({
            email: user.email,
            department: user.department,
            password: defaultPassword,
          })
        }
      } catch (error: any) {
        results.failed.push({
          email: user.email,
          error: error?.message || "Unknown error",
        })
      }
    }

    return NextResponse.json(
      {
        message: `Created ${results.created.length} users in Supabase Auth`,
        summary: {
          total: dbUsers.length,
          created: results.created.length,
          failed: results.failed.length,
          skipped: results.skipped.length,
        },
        results,
        note: `All test users: password is "${defaultPassword}"`,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: "Seeding failed", error: error?.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/seed-users
 * Returns info about what will be created
 */
export async function GET() {
  try {
    const { data: dbUsers } = await supabase
      .from("users")
      .select("email, name, department, role")
      .order("department")

    const grouped = dbUsers?.reduce(
      (acc, user) => {
        if (!acc[user.department]) {
          acc[user.department] = []
        }
        acc[user.department].push(user)
        return acc
      },
      {} as Record<string, any[]>
    )

    return NextResponse.json({
      message: "Test users ready to be created in Supabase Auth",
      totalUsers: dbUsers?.length || 0,
      defaultPassword: "Test@123!",
      byDepartment: grouped,
      instructions: [
        "0. Optional: run scripts/seed-procurement-demo-users.sql for demo.requester + demo.finance users",
        "1. POST /api/auth/seed-users to create all users in Auth",
        "2. Login with any email and password: Test@123!",
        "3. Each user will be auto-redirected to their department dashboard",
      ],
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error?.message },
      { status: 500 }
    )
  }
}
