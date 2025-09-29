-- Drop existing policies
DROP POLICY IF EXISTS "workspace_members_select_member" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert_owner" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_admin" ON public.workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete_admin" ON public.workspace_members;

-- Enable RLS if not already enabled
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Create simplified policies without recursion
-- Allow users to see workspace members where they are either:
-- 1. The member themselves
-- 2. A member of the same workspace
CREATE POLICY "workspace_members_select_policy" ON public.workspace_members
FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.workspace_members AS wm
        WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
    )
);

-- Allow workspace owners to add members
CREATE POLICY "workspace_members_insert_policy" ON public.workspace_members
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE id = workspace_members.workspace_id 
        AND owner_id = auth.uid()
    )
);

-- Allow workspace owners and admins to update member roles
-- But prevent them from updating their own role
CREATE POLICY "workspace_members_update_policy" ON public.workspace_members
FOR UPDATE USING (
    -- Cannot update your own membership
    user_id != auth.uid() AND
    (
        -- Workspace owner can update
        EXISTS (
            SELECT 1 FROM public.workspaces
            WHERE id = workspace_members.workspace_id 
            AND owner_id = auth.uid()
        ) OR
        -- Workspace admin can update
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = workspace_members.workspace_id
            AND user_id = auth.uid()
            AND role = 'admin'
        )
    )
);

-- Allow workspace owners and admins to remove members
-- But prevent them from removing themselves
CREATE POLICY "workspace_members_delete_policy" ON public.workspace_members
FOR DELETE USING (
    -- Cannot delete your own membership
    user_id != auth.uid() AND
    (
        -- Workspace owner can delete
        EXISTS (
            SELECT 1 FROM public.workspaces
            WHERE id = workspace_members.workspace_id 
            AND owner_id = auth.uid()
        ) OR
        -- Workspace admin can delete
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = workspace_members.workspace_id
            AND user_id = auth.uid()
            AND role = 'admin'
        )
    )
);