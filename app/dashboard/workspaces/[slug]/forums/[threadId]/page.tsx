import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ThreadView } from "@/components/forums/thread-view"

interface ThreadPageProps {
  params: Promise<{
    slug: string
    threadId: string
  }>
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { slug, threadId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get workspace
  const { data: workspace } = await supabase.from("workspaces").select("*").eq("slug", slug).single()

  if (!workspace) {
    notFound()
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    redirect("/dashboard")
  }

  // Get thread with author and category info
  const { data: thread } = await supabase
    .from("forum_threads")
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      ),
      forum_categories (
        name,
        color
      )
    `)
    .eq("id", threadId)
    .eq("workspace_id", workspace.id)
    .single()

  if (!thread) {
    notFound()
  }

  // Get posts for this thread
  const { data: posts } = await supabase
    .from("forum_posts")
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })

  // Increment view count
  await supabase
    .from("forum_threads")
    .update({ view_count: thread.view_count + 1 })
    .eq("id", threadId)

  // Get user's workspaces for layout
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
      <ThreadView
        thread={thread}
        posts={posts || []}
        workspace={workspace}
        currentUser={user}
        userRole={membership.role}
      />
    </DashboardLayout>
  )
}
