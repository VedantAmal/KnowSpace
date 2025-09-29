import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ThreadEditor } from "@/components/forums/thread-editor"

export default async function NewThreadPage() {
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
        slug
      )
    `)
    .eq("user_id", user.id)

  // Get categories for all workspaces
  const { data: categories } = await supabase
    .from("forum_categories")
    .select("*")
    .in("workspace_id", workspaces?.map((w) => w.workspace_id) || [])

  return (
    <DashboardLayout user={user} workspaces={workspaces || []}>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Start New Discussion</h1>
          <p className="text-muted-foreground">Create a new forum thread to engage with your community.</p>
        </div>

        <ThreadEditor workspaces={workspaces || []} categories={categories || []} userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
