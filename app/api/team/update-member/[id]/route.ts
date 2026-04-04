import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { department, role } = body
    const userId = params.id

    if (!department && !role) {
      return NextResponse.json(
        { message: "Department or role is required" },
        { status: 400 }
      )
    }

    // Update user in database
    const updateData: any = {}
    if (department) updateData.department = department
    if (role) updateData.role = role

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating user:", updateError)
      return NextResponse.json(
        { message: "Failed to update member", error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Member updated successfully",
      user: updatedUser,
      success: true
    })

  } catch (error) {
    console.error("Update team member error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
