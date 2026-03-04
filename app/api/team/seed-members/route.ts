import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Test team members for TeachMeHow organization
const SEED_MEMBERS = [
    {
        name: "Kalonde Masheke",
        email: "kalonde@teachmehow.com",
        department: "Finance",
        role: "manager",
    },
    {
        name: "Kunda Mwansa",
        email: "kunda@teachmehow.com",
        department: "HR",
        role: "manager",
    },
    {
        name: "Mapalo Chanda",
        email: "mapalo@teachmehow.com",
        department: "Operations",
        role: "manager",
    },
    {
        name: "Veronica Banda",
        email: "veronica@teachmehow.com",
        department: "Procurement",
        role: "manager",
    },
    {
        name: "Sam Tembo",
        email: "sam@teachmehow.com",
        department: "Management",
        role: "manager",
    },
]

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { organizationId, organizationName } = body

        if (!organizationId || !organizationName) {
            return NextResponse.json(
                { message: "organizationId and organizationName are required" },
                { status: 400 }
            )
        }

        const results: Array<{
            name: string
            email: string
            department: string
            status: string
            tempPassword?: string
            error?: string
        }> = []

        for (const member of SEED_MEMBERS) {
            try {
                // Check if user already exists in the users table
                const { data: existingUser } = await supabase
                    .from("users")
                    .select("id, email")
                    .eq("email", member.email)
                    .single()

                if (existingUser) {
                    results.push({
                        name: member.name,
                        email: member.email,
                        department: member.department,
                        status: "already_exists",
                    })
                    continue
                }

                // Create user using signUp (works with anon key, no service role needed)
                const firstName = member.name.split(" ")[0].toLowerCase()
                const tempPassword = `${firstName}2026!`

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: member.email,
                    password: tempPassword,
                    options: {
                        data: {
                            name: member.name,
                            department: member.department,
                            role: member.role,
                            added_by_admin: true,
                        },
                    },
                })

                if (authError || !authData.user) {
                    console.error(`Error creating auth user ${member.email}:`, authError)
                    results.push({
                        name: member.name,
                        email: member.email,
                        department: member.department,
                        status: "auth_error",
                        error: authError?.message || "Failed to create auth user",
                    })
                    // Wait 3 seconds to avoid rate limiting
                    await new Promise((resolve) => setTimeout(resolve, 3000))
                    continue
                }

                // Create user record in users table
                const { error: insertError } = await supabase.from("users").insert({
                    id: authData.user.id,
                    email: member.email,
                    name: member.name,
                    role: member.role,
                    department: member.department,
                    organization_id: organizationId,
                    organization_name: organizationName,
                    created_at: new Date().toISOString(),
                })

                if (insertError) {
                    console.error(`Error inserting user ${member.email}:`, insertError)
                    results.push({
                        name: member.name,
                        email: member.email,
                        department: member.department,
                        status: "db_error",
                        error: insertError.message,
                    })
                    // Wait before next iteration
                    await new Promise((resolve) => setTimeout(resolve, 3000))
                    continue
                }

                results.push({
                    name: member.name,
                    email: member.email,
                    department: member.department,
                    status: "created",
                    tempPassword,
                })

                // Wait 3 seconds between each signUp to avoid Supabase rate limiting
                await new Promise((resolve) => setTimeout(resolve, 3000))
            } catch (err) {
                console.error(`Unexpected error for ${member.email}:`, err)
                results.push({
                    name: member.name,
                    email: member.email,
                    department: member.department,
                    status: "error",
                    error: String(err),
                })
            }
        }

        const created = results.filter((r) => r.status === "created").length
        const alreadyExist = results.filter(
            (r) => r.status === "already_exists"
        ).length
        const errors = results.filter(
            (r) => !["created", "already_exists"].includes(r.status)
        ).length

        return NextResponse.json({
            message: `Seed complete: ${created} created, ${alreadyExist} already existed, ${errors} errors`,
            results,
            success: true,
        })
    } catch (error) {
        console.error("Seed members error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
