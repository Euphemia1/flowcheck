import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const approverId = searchParams.get('approver_id')
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    if (!approverId) {
      return NextResponse.json({ error: 'Approver ID is required' }, { status: 400 })
    }

    let query = supabase
      .from("approval_steps")
      .select(`
        *,
        request:procurement_requests(
          *,
          requester:users(id, name, email, department),
          items:procurement_request_items(*),
          approval_steps:approval_steps(
            *,
            approver:users(id, name, email)
          )
        ),
        approver:users(id, name, email)
      `, { count: 'exact' })
      .eq("approver_id", approverId)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: approvals, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching approvals:", error)
      return NextResponse.json(
        { message: "Failed to fetch approvals" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      approvals,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("Error in GET /api/procurement/approvals:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { approval_step_id, action, comments, approver_id }: {
      approval_step_id?: string
      action?: string
      comments?: string
      approver_id?: string
    } = body

    if (!approval_step_id || !action || !approver_id) {
      return NextResponse.json(
        { message: "Approval step ID, action, and approver ID are required" },
        { status: 400 }
      )
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    // Get the approval step and related request
    const { data: approvalStep, error: approvalError } = await supabase
      .from('approval_steps')
      .select(`
        *,
        request:procurement_requests(
          *,
          requester:users(id, name, email, department),
          items:procurement_request_items(*),
          approval_steps:approval_steps(
            *,
            approver:users(id, name, email)
          )
        ),
        approver:users(id, name, email)
      `)
      .eq('id', approval_step_id)
      .single()

    if (approvalError || !approvalStep) {
      return NextResponse.json({ error: 'Approval step not found' }, { status: 404 })
    }

    // Check if the step is still pending
    if (approvalStep.status !== "pending") {
      return NextResponse.json(
        { message: "This approval step has already been processed" },
        { status: 400 }
      )
    }

    // Enforce strict sequence: only the lowest pending step can be actioned.
    const { data: earliestPendingStep } = await supabase
      .from("approval_steps")
      .select("id")
      .eq("request_id", (approvalStep.request as any).id)
      .eq("status", "pending")
      .order("step_order", { ascending: true })
      .limit(1)
      .single()

    if (earliestPendingStep && earliestPendingStep.id !== approval_step_id) {
      return NextResponse.json(
        { message: "This request must be approved in sequence by earlier approvers first" },
        { status: 400 }
      )
    }

    // Check if the user is the assigned approver
    if (approvalStep.approver_id !== approver_id) {
      return NextResponse.json(
        { message: "You are not authorized to approve this request" },
        { status: 403 }
      )
    }

    // Update the approval step
    const { data: updatedStep, error: updateError } = await supabase
      .from("approval_steps")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        comments,
        actioned_at: new Date().toISOString()
      })
      .eq("id", approval_step_id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating approval step:", updateError)
      return NextResponse.json(
        { message: "Failed to update approval step" },
        { status: 500 }
      )
    }

    // Update the request status based on the approval action
    const request = approvalStep.request as any
    let newRequestStatus = request.status

    if (action === "reject") {
      // If rejected, mark the request as rejected
      newRequestStatus = "rejected"
    } else if (action === "approve") {
      // If approved, check if this is the final step
      const { data: remainingSteps } = await supabase
        .from("approval_steps")
        .select("*")
        .eq("request_id", request.id)
        .eq("status", "pending")
        .order("step_order", { ascending: true })

      if (!remainingSteps || remainingSteps.length === 0) {
        // This was the final approval step
        newRequestStatus = "approved"
        
        // Generate purchase order automatically
        await generatePurchaseOrder(request.id)
      }
    }

    // Update the request status
    if (newRequestStatus !== request.status) {
      await supabase
        .from("procurement_requests")
        .update({ status: newRequestStatus })
        .eq("id", request.id)
    }

    // Log the action
    await supabase
      .from("audit_log")
      .insert({
        entity_type: "approval_step",
        entity_id: approval_step_id,
        action: `${action}d_by_${approvalStep.approver_role}`,
        new_values: {
          status: action === "approve" ? "approved" : "rejected",
          comments,
          actioned_at: new Date().toISOString()
        },
        user_id: approver_id,
        metadata: {
          request_id: request.id,
          request_title: request.title,
          approver_role: approvalStep.approver_role,
          step_order: approvalStep.step_order
        }
      })

    return NextResponse.json({
      message: `Request ${action}d successfully`,
      approval_step: updatedStep,
      request_status: newRequestStatus
    })

  } catch (error) {
    console.error("Error in POST /api/procurement/approvals:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

async function generatePurchaseOrder(requestId: string) {
  try {
    // Get the request with items
    const { data: requestData, error: requestError } = await supabase
      .from("procurement_requests")
      .select(`
        *,
        items:procurement_request_items(*),
        requester:users(id, name, email)
      `)
      .eq("id", requestId)
      .single()

    if (requestError || !requestData) {
      console.error("Error fetching request for PO generation:", requestError)
      return
    }

    // Create purchase order
    const { data: purchaseOrder, error: poError } = await supabase
      .from("purchase_orders")
      .insert({
        request_id: requestId,
        status: "pending",
        notes: `Auto-generated for request: ${requestData.title}`
      })
      .select()
      .single()

    if (poError) {
      console.error("Error creating purchase order:", poError)
      return
    }

    // Create purchase order items
    const poItems = requestData.items.map((item: any) => ({
      po_id: purchaseOrder.id,
      request_item_id: item.id,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))

    const { error: itemsError } = await supabase
      .from("purchase_order_items")
      .insert(poItems)

    if (itemsError) {
      console.error("Error creating purchase order items:", itemsError)
      return
    }

    // Log the PO generation
    await supabase
      .from("audit_log")
      .insert({
        entity_type: "purchase_order",
        entity_id: purchaseOrder.id,
        action: "po_generated",
        new_values: {
          po_number: purchaseOrder.po_number,
          request_id: requestId,
          total_amount: requestData.total_amount
        },
        user_id: (requestData as any).requester.id,
        metadata: {
          auto_generated: true,
          request_title: requestData.title
        }
      })

    console.log("Purchase order generated successfully:", purchaseOrder.po_number)
  } catch (error) {
    console.error("Error generating purchase order:", error)
  }
}
