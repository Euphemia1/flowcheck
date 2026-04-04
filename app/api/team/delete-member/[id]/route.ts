import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Delete user from database
    const { error: dbError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)

    if (dbError) {
      console.error("Error deleting user from database:", dbError)
      return NextResponse.json(
        { message: "Failed to delete member from database", error: dbError.message },
        { status: 500 }
      )
    }

    // Also delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Error deleting user from auth:", authError)
      // Continue even if auth deletion fails - database record is more important
    }

    return NextResponse.json({
      message: "Member deleted successfully",
      success: true
    })

  } catch (error) {
    console.error("Delete team member error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
