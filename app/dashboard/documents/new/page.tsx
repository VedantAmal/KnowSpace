import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DocumentEditor } from "@/components/editor/document-editor"

export default async function NewDocumentPage() {
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

  return (
    <DashboardLayout user={user} workspaces={workspaces || []}>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create New Document</h1>
          <p className="text-muted-foreground">Build structured content with our modular block editor.</p>
        </div>

        <DocumentEditor workspaces={workspaces || []} userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
