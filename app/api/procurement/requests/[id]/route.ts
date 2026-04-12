import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: request, error } = await supabase
      .from("procurement_requests")
      .select(`
        *,
        requester:users(id, name, email, department),
        items:procurement_request_items(*),
        approval_steps:approval_steps(
          *,
          approver:users(id, name, email)
        ),
        purchase_orders:purchase_orders(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching procurement request:", error)
      return NextResponse.json(
        { message: "Procurement request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ request })
  } catch (error) {
    console.error("Error in GET /api/procurement/requests/[id]:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      title,
      description,
      urgency_level,
      expected_delivery_date,
      items,
      user_id
    } = body

    // Get current request for audit
    const { data: currentRequest } = await supabase
      .from("procurement_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (!currentRequest) {
      return NextResponse.json(
        { message: "Procurement request not found" },
        { status: 404 }
      )
    }

    // Only allow updates if request is in draft status
    if (currentRequest.status !== "draft") {
      return NextResponse.json(
        { message: "Cannot update request after submission" },
        { status: 400 }
      )
    }

    // Update request
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (urgency_level !== undefined) updateData.urgency_level = urgency_level
    if (expected_delivery_date !== undefined) updateData.expected_delivery_date = expected_delivery_date

    const { data: updatedRequest, error: updateError } = await supabase
      .from("procurement_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating procurement request:", updateError)
      return NextResponse.json(
        { message: "Failed to update procurement request" },
        { status: 500 }
      )
    }

    // Update items if provided
    if (items && Array.isArray(items)) {
      // Delete existing items
      await supabase
        .from("procurement_request_items")
        .delete()
        .eq("request_id", id)

      // Insert new items
      const itemsWithRequestId = items.map(item => ({
        ...item,
        request_id: id
      }))

      const { error: itemsError } = await supabase
        .from("procurement_request_items")
        .insert(itemsWithRequestId)

      if (itemsError) {
        console.error("Error updating request items:", itemsError)
        return NextResponse.json(
          { message: "Failed to update request items" },
          { status: 500 }
        )
      }
    }

    // Log the update
    await supabase
      .from("audit_log")
      .insert({
        entity_type: "request",
        entity_id: id,
        action: "request_updated",
        old_values: {
          title: currentRequest.title,
          description: currentRequest.description,
          urgency_level: currentRequest.urgency_level
        },
        new_values: updateData,
        user_id,
        metadata: { updated_fields: Object.keys(updateData) }
      })

    return NextResponse.json({
      message: "Procurement request updated successfully",
      request: updatedRequest
    })

  } catch (error) {
    console.error("Error in PUT /api/procurement/requests/[id]:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")

    // Get current request for audit
    const { data: currentRequest } = await supabase
      .from("procurement_requests")
      .select("*")
      .eq("id", id)
      .single()

    if (!currentRequest) {
      return NextResponse.json(
        { message: "Procurement request not found" },
        { status: 404 }
      )
    }

    // Only allow deletion if request is in draft status
    if (currentRequest.status !== "draft") {
      return NextResponse.json(
        { message: "Cannot delete request after submission" },
        { status: 400 }
      )
    }

    // Delete the request (cascade will handle related items)
    const { error } = await supabase
      .from("procurement_requests")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting procurement request:", error)
      return NextResponse.json(
        { message: "Failed to delete procurement request" },
        { status: 500 }
      )
    }

    // Log the deletion
    await supabase
      .from("audit_log")
      .insert({
        entity_type: "request",
        entity_id: id,
        action: "request_deleted",
        old_values: currentRequest,
        user_id,
        metadata: { deleted_request_title: currentRequest.title }
      })

    return NextResponse.json({
      message: "Procurement request deleted successfully"
    })

  } catch (error) {
    console.error("Error in DELETE /api/procurement/requests/[id]:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
