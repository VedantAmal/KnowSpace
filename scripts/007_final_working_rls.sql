-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view workspaces they own or are members of" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspace members for workspaces they belong to" ON workspace_members;
DROP POLICY IF EXISTS "Users can view documents in workspaces they belong to" ON documents;
DROP POLICY IF EXISTS "Users can view forum categories in workspaces they belong to" ON forum_categories;
DROP POLICY IF EXISTS "Users can view forum posts in workspaces they belong to" ON forum_posts;

-- Create simple, non-recursive policies for workspaces
CREATE POLICY "Users can view workspaces they own" ON workspaces
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view workspaces they are members of" ON workspaces
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspaces.id 
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Simple workspace_members policies
CREATE POLICY "Users can view workspace members" ON workspace_members
  FOR SELECT USING (user_id = auth.uid() OR workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert workspace members" ON workspace_members
  FOR INSERT WITH CHECK (user_id = auth.uid() OR workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Simple document policies
CREATE POLICY "Users can view documents" ON documents
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents" ON documents
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Simple forum category policies
CREATE POLICY "Users can view forum categories" ON forum_categories
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create forum categories" ON forum_categories
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Simple forum post policies
CREATE POLICY "Users can view forum posts" ON forum_posts
  FOR SELECT USING (
    category_id IN (
      SELECT id FROM forum_categories WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create forum posts" ON forum_posts
  FOR INSERT WITH CHECK (
    category_id IN (
      SELECT id FROM forum_categories WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      )
    )
  );
