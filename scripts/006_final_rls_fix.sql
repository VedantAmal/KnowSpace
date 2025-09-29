-- Complete RLS policy fix based on actual database schema
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "workspace_members_select" ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_insert" ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_update" ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete" ON workspace_members;

DROP POLICY IF EXISTS "workspaces_select" ON workspaces;
DROP POLICY IF EXISTS "workspaces_insert" ON workspaces;
DROP POLICY IF EXISTS "workspaces_update" ON workspaces;
DROP POLICY IF EXISTS "workspaces_delete" ON workspaces;

-- Create simple, non-recursive policies for workspaces
CREATE POLICY "workspaces_select" ON workspaces
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "workspaces_insert" ON workspaces
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspaces_update" ON workspaces
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "workspaces_delete" ON workspaces
  FOR DELETE USING (owner_id = auth.uid());

-- Create simple policies for workspace_members
CREATE POLICY "workspace_members_select" ON workspace_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_insert" ON workspace_members
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_update" ON workspace_members
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_delete" ON workspace_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- Fix other table policies to avoid recursion
DROP POLICY IF EXISTS "documents_select" ON documents;
CREATE POLICY "documents_select" ON documents
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "forum_threads_select" ON forum_threads;
CREATE POLICY "forum_threads_select" ON forum_threads
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "forum_categories_select" ON forum_categories;
CREATE POLICY "forum_categories_select" ON forum_categories
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );
