import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("id, email, name, role, department, organization_id, organization_name")
            .order("created_at", { ascending: false })
            .limit(20)

        if (error) {
            return NextResponse.json(
                { message: "Failed to fetch users", error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            users: users || [],
            count: users?.length || 0,
        })
    } catch (error) {
        console.error("Debug users error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
