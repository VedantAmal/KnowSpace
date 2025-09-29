-- Complete fix for RLS policies to eliminate all recursion issues
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "workspace_members_select_member" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_admin" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_owner" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_admin" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete_admin" ON public.workspace_members;

-- Simple, non-recursive policies for workspace_members
-- Users can see their own memberships
CREATE POLICY "workspace_members_select_own" ON public.workspace_members FOR SELECT USING (
  user_id = auth.uid()
);

-- Users can see other members in workspaces where they are members (using direct workspace ownership check)
CREATE POLICY "workspace_members_select_workspace" ON public.workspace_members FOR SELECT USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

-- Only workspace owners can add members
CREATE POLICY "workspace_members_insert_owner" ON public.workspace_members FOR INSERT WITH CHECK (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

-- Only workspace owners can update member roles
CREATE POLICY "workspace_members_update_owner" ON public.workspace_members FOR UPDATE USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

-- Workspace owners can remove members, users can remove themselves
CREATE POLICY "workspace_members_delete_owner_or_self" ON public.workspace_members FOR DELETE USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  ) OR user_id = auth.uid()
);

-- Fix documents policies to be simpler
DROP POLICY IF EXISTS "documents_select_member" ON public.documents;
CREATE POLICY "documents_select_member" ON public.documents FOR SELECT USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  ) OR
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
);

-- Fix forum_posts policies
DROP POLICY IF EXISTS "forum_posts_select_member" ON public.forum_posts;
CREATE POLICY "forum_posts_select_member" ON public.forum_posts FOR SELECT USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  ) OR
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
);

-- Fix forum_replies policies
DROP POLICY IF EXISTS "forum_replies_select_member" ON public.forum_replies;
CREATE POLICY "forum_replies_select_member" ON public.forum_replies FOR SELECT USING (
  post_id IN (
    SELECT id FROM public.forum_posts WHERE 
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    ) OR
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
    )
  )
);
