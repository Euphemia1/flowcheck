import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const organizationId = searchParams.get("organizationId")

        // Build the query
        let query = supabase
            .from("users")
            .select("id, email, name, role, department, organization_id, organization_name, created_at")
            .order("created_at", { ascending: false })

        // Filter by organization if provided
        if (organizationId) {
            query = query.eq("organization_id", organizationId)
        }

        const { data: users, error } = await query

        if (error) {
            console.error("Error fetching team members:", error)
            return NextResponse.json(
                { message: "Failed to fetch team members", error: error.message },
                { status: 500 }
            )
        }

        // Map database fields to the TeamMember format expected by the frontend
        const teamMembers = (users || []).map((user: any) => ({
            id: user.id,
            name: user.name || user.email.split("@")[0],
            email: user.email,
            role: user.role || "viewer",
            department: user.department || "Operations",
            status: "active" as const, // All DB users are considered active
            joinedDate: user.created_at ? user.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        }))

        return NextResponse.json({
            members: teamMembers,
            total: teamMembers.length,
            success: true,
        })
    } catch (error) {
        console.error("Fetch team error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
