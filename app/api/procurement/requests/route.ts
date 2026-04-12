import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const requester_id = searchParams.get("requester_id")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = supabase
      .from("procurement_requests")
      .select(`
        *,
        requester:users(id, name, email, department),
        items:procurement_request_items(*),
        approval_steps:approval_steps(
          *,
          approver:users(id, name, email)
        )
      `, { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }
    if (requester_id) {
      query = query.eq("requester_id", requester_id)
    }

    const { data: requests, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching procurement requests:", error)
      return NextResponse.json(
        { message: "Failed to fetch procurement requests" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("Error in GET /api/procurement/requests:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      requester_id,
      urgency_level = "medium",
      expected_delivery_date,
      items = []
    }: {
      title?: string
      description?: string
      requester_id?: string
      urgency_level?: string
      expected_delivery_date?: string
      items?: Array<{
        item_name: string
        description?: string
        quantity: number
        unit_price: number
        category?: string
        specifications?: Record<string, any>
      }>
    } = body

    // Validate required fields
    if (!title || !requester_id) {
      return NextResponse.json(
        { message: "Title and requester ID are required" },
        { status: 400 }
      )
    }

    // Validate items
    if (!items.length || items.length === 0) {
      return NextResponse.json(
        { message: "At least one item is required" },
        { status: 400 }
      )
    }

    for (const item of items) {
      if (!item.item_name || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { message: "Each item must have name, quantity, and unit price" },
          { status: 400 }
        )
      }
    }

    // Start a transaction
    const { data: request, error: requestError } = await supabase
      .from("procurement_requests")
      .insert({
        title,
        description,
        requester_id,
        urgency_level,
        expected_delivery_date,
        status: "draft"
      })
      .select()
      .single()

    if (requestError) {
      console.error("Error creating procurement request:", requestError)
      return NextResponse.json(
        { message: "Failed to create procurement request" },
        { status: 500 }
      )
    }

    // Insert items
    const itemsWithRequestId = items.map(item => ({
      ...item,
      request_id: request.id
    }))

    const { data: requestItems, error: itemsError } = await supabase
      .from("procurement_request_items")
      .insert(itemsWithRequestId)
      .select()

    if (itemsError) {
      console.error("Error creating request items:", itemsError)
      // Rollback the request
      await supabase
        .from("procurement_requests")
        .delete()
        .eq("id", request.id)
      
      return NextResponse.json(
        { message: "Failed to create request items" },
        { status: 500 }
      )
    }

    // Get total amount and create approval workflow
    const { data: updatedRequest } = await supabase
      .from("procurement_requests")
      .select("total_amount")
      .eq("id", request.id)
      .single()

    const totalAmount = updatedRequest?.total_amount || 0

    // Create approval workflow based on amount
    const approvalSteps = determineApprovalWorkflow(totalAmount)
    const approvalStepsData = approvalSteps.map((step, index) => ({
      request_id: request.id,
      step_order: index + 1,
      approver_role: step.role,
      status: "pending"
    }))

    const { error: approvalError } = await supabase
      .from("approval_steps")
      .insert(approvalStepsData)

    if (approvalError) {
      console.error("Error creating approval steps:", approvalError)
      // This is not critical, the request can still work
    }

    // Update request status to pending if it has approval steps
    if (approvalSteps.length > 0) {
      await supabase
        .from("procurement_requests")
        .update({ status: "pending" })
        .eq("id", request.id)
    } else {
      // Auto-approve for small amounts
      await supabase
        .from("procurement_requests")
        .update({ status: "approved" })
        .eq("id", request.id)
    }

    // Log the action
    await supabase
      .from("audit_log")
      .insert({
        entity_type: "request",
        entity_id: request.id,
        action: "request_created",
        new_values: {
          title,
          total_amount: totalAmount,
          urgency_level,
          items_count: items.length
        },
        user_id: requester_id,
        metadata: {
          items: items.map(item => ({
            name: item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price
          }))
        }
      })

    // Fetch the complete request with all relations
    const { data: completeRequest } = await supabase
      .from("procurement_requests")
      .select(`
        *,
        requester:users(id, name, email, department),
        items:procurement_request_items(*),
        approval_steps:approval_steps(
          *,
          approver:users(id, name, email)
        )
      `)
      .eq("id", request.id)
      .single()

    return NextResponse.json({
      message: "Procurement request created successfully",
      request: completeRequest
    }, { status: 201 })

  } catch (error) {
    console.error("Error in POST /api/procurement/requests:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

function determineApprovalWorkflow(amount: number): { role: string }[] {
  // Simple approval workflow based on amount
  if (amount < 500) {
    // Auto-approve for amounts less than $500
    return []
  } else if (amount >= 500 && amount < 5000) {
    // Manager -> Finance approval
    return [
      { role: "manager" },
      { role: "finance" }
    ]
  } else {
    // Manager -> Finance -> Procurement approval
    return [
      { role: "manager" },
      { role: "finance" },
      { role: "procurement" }
    ]
  }
}
