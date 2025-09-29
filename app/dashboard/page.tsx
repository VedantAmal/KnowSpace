import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's workspaces
  const { data: workspaces } = await supabase
    .from("workspace_members")
    .select(`
      workspace_id,
      role,
      workspaces (
        id,
        name,
        description,
        slug,
        created_at
      )
    `)
    .eq("user_id", user.id)

  return (
    <DashboardLayout user={user} workspaces={workspaces || []}>
      <DashboardOverview workspaces={workspaces || []} />
    </DashboardLayout>
  )
}
