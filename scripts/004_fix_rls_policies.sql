-- Fix infinite recursion in workspace_members policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "workspace_members_select_member" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_admin" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_admin" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete_admin" ON public.workspace_members;

-- Create fixed policies without recursion
-- Allow users to see workspace members in workspaces they belong to
CREATE POLICY "workspace_members_select_member" ON public.workspace_members FOR SELECT USING (
  user_id = auth.uid() OR 
  workspace_id IN (
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
  )
);

-- Allow workspace owners to add members
CREATE POLICY "workspace_members_insert_owner" ON public.workspace_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = workspace_members.workspace_id AND owner_id = auth.uid()
  )
);

-- Allow workspace owners and admins to update member roles
CREATE POLICY "workspace_members_update_admin" ON public.workspace_members FOR UPDATE USING (
  workspace_id IN (
    SELECT w.id FROM public.workspaces w
    WHERE w.id = workspace_members.workspace_id AND w.owner_id = auth.uid()
  ) OR
  workspace_id IN (
    SELECT wm.workspace_id FROM public.workspace_members wm
    WHERE wm.workspace_id = workspace_members.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.role = 'admin'
  )
);

-- Allow workspace owners and admins to remove members
CREATE POLICY "workspace_members_delete_admin" ON public.workspace_members FOR DELETE USING (
  workspace_id IN (
    SELECT w.id FROM public.workspaces w
    WHERE w.id = workspace_members.workspace_id AND w.owner_id = auth.uid()
  ) OR
  workspace_id IN (
    SELECT wm.workspace_id FROM public.workspace_members wm
    WHERE wm.workspace_id = workspace_members.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.role = 'admin'
  ) OR
  user_id = auth.uid() -- Users can remove themselves
);
