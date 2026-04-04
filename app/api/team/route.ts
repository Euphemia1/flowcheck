import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
    try {
        console.log("=== TEAM API DEBUG ===")

<<<<<<< HEAD
        // Build the query - simple select without complex filters
        const { data: users, error } = await supabase
=======
        console.log("Fetching team members with organizationId:", organizationId)

        // Build the query - fetch all users
        const { data: users, error } = await supabase
>>>>>>> eaff38a428e4792fa61c409b571ad88514f48347
            .from("users")
            .select("id, email, name, role, department, position, created_at")

        if (error) {
            console.error("❌ Supabase Error:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
            })
            return NextResponse.json(
                { 
                    message: "Failed to fetch team members",
                    error: error.message,
                    code: error.code,
                 },
                { status: 500 }
            )
        }

<<<<<<< HEAD
        console.log("✅ Successfully fetched users:", users?.length)

=======
        console.log("Fetched users count:", users?.length)

>>>>>>> eaff38a428e4792fa61c409b571ad88514f48347
        // Map database fields to the TeamMember format expected by the frontend
        const teamMembers = (users || []).map((user: any) => ({
            id: user.id,
            name: user.name || user.email.split("@")[0],
            email: user.email,
            role: user.role || "viewer",
            department: user.department || "Operations",
            position: user.position || "Team Member",
            status: "active" as const,
            joinedDate: user.created_at ? user.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        }))

        return NextResponse.json({
            members: teamMembers,
            total: teamMembers.length,
            success: true,
        })
    } catch (error: any) {
        console.error("❌ Catch Error:", error?.message || error)
        return NextResponse.json(
            { 
                message: "Internal server error",
                error: error?.message,
            },
            { status: 500 }
        )
    }

}