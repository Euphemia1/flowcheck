import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const request_id = searchParams.get("request_id")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let query = supabase
      .from("purchase_orders")
      .select(`
        *,
        request:procurement_requests(
          *,
          requester:users(id, name, email, department)
        ),
        items:purchase_order_items(
          *,
          request_item:procurement_request_items(*)
        )
      `, { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }
    if (request_id) {
      query = query.eq("request_id", request_id)
    }

    const { data: purchaseOrders, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching purchase orders:", error)
      return NextResponse.json(
        { message: "Failed to fetch purchase orders" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      purchase_orders: purchaseOrders,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("Error in GET /api/procurement/purchase-orders:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json()
    const {
      request_id,
      vendor_name,
      vendor_email,
      shipping_address,
      billing_address,
      notes,
      user_id
    } = requestBody as {
      request_id?: string
      vendor_name?: string
      vendor_email?: string
      shipping_address?: string
      billing_address?: string
      notes?: string
      user_id?: string
    }

    if (!request_id) {
      return NextResponse.json(
        { message: "Request ID is required" },
        { status: 400 }
      )
    }

    // Verify the request is approved
    const { data: request, error: requestError } = await supabase
      .from("procurement_requests")
      .select("*")
      .eq("id", request_id)
      .eq("status", "approved")
      .single()

    if (requestError || !request) {
      return NextResponse.json(
        { message: "Approved procurement request not found" },
        { status: 404 }
      )
    }

    // Check if PO already exists for this request
    const { data: existingPO } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("request_id", request_id)
      .single()

    if (existingPO) {
      return NextResponse.json(
        { message: "Purchase order already exists for this request" },
        { status: 400 }
      )
    }

    // Create purchase order
    const { data: purchaseOrder, error: poError } = await supabase
      .from("purchase_orders")
      .insert({
        request_id,
        vendor_name,
        vendor_email,
        shipping_address,
        billing_address,
        notes: notes || `Purchase order for request: ${request.title}`,
        status: "pending"
      })
      .select()
      .single()

    if (poError) {
      console.error("Error creating purchase order:", poError)
      return NextResponse.json(
        { message: "Failed to create purchase order" },
        { status: 500 }
      )
    }

    // Get request items to create PO items
    const { data: requestItems, error: itemsError } = await supabase
      .from("procurement_request_items")
      .select("*")
      .eq("request_id", request_id)

    if (itemsError) {
      console.error("Error fetching request items:", itemsError)
      return NextResponse.json(
        { message: "Failed to fetch request items" },
        { status: 500 }
      )
    }

    // Create purchase order items
    const poItems = (requestItems || []).map((item: any) => ({
      po_id: purchaseOrder.id,
      request_item_id: item.id,
      item_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))

    const { error: poItemsError } = await supabase
      .from("purchase_order_items")
      .insert(poItems)

    if (poItemsError) {
      console.error("Error creating purchase order items:", poItemsError)
      // Rollback the PO
      await supabase
        .from("purchase_orders")
        .delete()
        .eq("id", purchaseOrder.id)
      
      return NextResponse.json(
        { message: "Failed to create purchase order items" },
        { status: 500 }
      )
    }

    // Log the action
    await supabase
      .from("audit_log")
      .insert({
        entity_type: "purchase_order",
        entity_id: purchaseOrder.id,
        action: "po_created",
        new_values: {
          po_number: purchaseOrder.po_number,
          request_id,
          vendor_name,
          total_amount: request.total_amount
        },
        user_id,
        metadata: {
          request_title: request.title,
          items_count: requestItems.length
        }
      })

    // Fetch the complete PO with relations
    const { data: completePO } = await supabase
      .from("purchase_orders")
      .select(`
        *,
        request:procurement_requests(
          *,
          requester:users(id, name, email, department)
        ),
        items:purchase_order_items(
          *,
          request_item:procurement_request_items(*)
        )
      `)
      .eq("id", purchaseOrder.id)
      .single()

    return NextResponse.json({
      message: "Purchase order created successfully",
      purchase_order: completePO
    }, { status: 201 })

  } catch (error) {
    console.error("Error in POST /api/procurement/purchase-orders:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
