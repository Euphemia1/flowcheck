import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entity_type = searchParams.get("entity_type")
    const entity_id = searchParams.get("entity_id")
    const user_id = searchParams.get("user_id")
    const action = searchParams.get("action")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    let query = supabase
      .from("audit_log")
      .select(`
        *,
        user:users(id, name, email)
      `, { count: 'exact' })

    // Apply filters
    if (entity_type) {
      query = query.eq("entity_type", entity_type)
    }
    if (entity_id) {
      query = query.eq("entity_id", entity_id)
    }
    if (user_id) {
      query = query.eq("user_id", user_id)
    }
    if (action) {
      query = query.like("action", `%${action}%`)
    }

    const { data: auditLogs, error, count } = await query
      .order("timestamp", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching audit logs:", error)
      return NextResponse.json(
        { message: "Failed to fetch audit logs" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      audit_logs: auditLogs,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("Error in GET /api/audit:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      entity_type,
      entity_id,
      action,
      old_values,
      new_values,
      user_id,
      metadata
    }: {
      entity_type?: string
      entity_id?: string
      action?: string
      old_values?: Record<string, any>
      new_values?: Record<string, any>
      user_id?: string
      metadata?: Record<string, any>
    } = body

    if (!entity_type || !entity_id || !action || !user_id) {
      return NextResponse.json(
        { message: "Entity type, entity ID, action, and user ID are required" },
        { status: 400 }
      )
    }

    // Get user IP and user agent from request headers
    const ip_address = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const user_agent = request.headers.get("user-agent") || "unknown"

    const { data: auditLog, error } = await supabase
      .from("audit_log")
      .insert({
        entity_type,
        entity_id,
        action,
        old_values,
        new_values,
        user_id,
        ip_address,
        user_agent,
        metadata: metadata || {}
      })
      .select(`
        *,
        user:users(id, name, email)
      `)
      .single()

    if (error) {
      console.error("Error creating audit log:", error)
      return NextResponse.json(
        { message: "Failed to create audit log" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Audit log created successfully",
      audit_log: auditLog
    }, { status: 201 })

  } catch (error) {
    console.error("Error in POST /api/audit:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
