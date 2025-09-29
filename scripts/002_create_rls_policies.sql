-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Allow users to view other profiles in their workspaces
CREATE POLICY "profiles_select_workspace_members" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm1
    JOIN public.workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
    WHERE wm1.user_id = auth.uid() AND wm2.user_id = profiles.id
  )
);

-- Workspaces policies
CREATE POLICY "workspaces_select_member" ON public.workspaces FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = workspaces.id AND user_id = auth.uid()
  )
);
CREATE POLICY "workspaces_insert_own" ON public.workspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "workspaces_update_admin" ON public.workspaces FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = workspaces.id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "workspaces_delete_owner" ON public.workspaces FOR DELETE USING (auth.uid() = owner_id);

-- Workspace members policies
CREATE POLICY "workspace_members_select_member" ON public.workspace_members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm
    WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "workspace_members_insert_admin" ON public.workspace_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = workspace_members.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "workspace_members_update_admin" ON public.workspace_members FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = workspace_members.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "workspace_members_delete_admin" ON public.workspace_members FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = workspace_members.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Documents policies
CREATE POLICY "documents_select_workspace_member" ON public.documents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = documents.workspace_id AND user_id = auth.uid()
  )
);
CREATE POLICY "documents_insert_workspace_member" ON public.documents FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = documents.workspace_id AND user_id = auth.uid()
  ) AND auth.uid() = author_id
);
CREATE POLICY "documents_update_author_or_admin" ON public.documents FOR UPDATE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = documents.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "documents_delete_author_or_admin" ON public.documents FOR DELETE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = documents.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Forum categories policies
CREATE POLICY "forum_categories_select_workspace_member" ON public.forum_categories FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_categories.workspace_id AND user_id = auth.uid()
  )
);
CREATE POLICY "forum_categories_insert_admin" ON public.forum_categories FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_categories.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "forum_categories_update_admin" ON public.forum_categories FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_categories.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "forum_categories_delete_admin" ON public.forum_categories FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_categories.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Forum threads policies
CREATE POLICY "forum_threads_select_workspace_member" ON public.forum_threads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_threads.workspace_id AND user_id = auth.uid()
  )
);
CREATE POLICY "forum_threads_insert_workspace_member" ON public.forum_threads FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_threads.workspace_id AND user_id = auth.uid()
  ) AND auth.uid() = author_id
);
CREATE POLICY "forum_threads_update_author_or_admin" ON public.forum_threads FOR UPDATE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_threads.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "forum_threads_delete_author_or_admin" ON public.forum_threads FOR DELETE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = forum_threads.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Forum posts policies
CREATE POLICY "forum_posts_select_workspace_member" ON public.forum_posts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm
    JOIN public.forum_threads ft ON wm.workspace_id = ft.workspace_id
    WHERE ft.id = forum_posts.thread_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "forum_posts_insert_workspace_member" ON public.forum_posts FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members wm
    JOIN public.forum_threads ft ON wm.workspace_id = ft.workspace_id
    WHERE ft.id = forum_posts.thread_id AND wm.user_id = auth.uid()
  ) AND auth.uid() = author_id
);
CREATE POLICY "forum_posts_update_author_or_admin" ON public.forum_posts FOR UPDATE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.workspace_members wm
    JOIN public.forum_threads ft ON wm.workspace_id = ft.workspace_id
    WHERE ft.id = forum_posts.thread_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')
  )
);
CREATE POLICY "forum_posts_delete_author_or_admin" ON public.forum_posts FOR DELETE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.workspace_members wm
    JOIN public.forum_threads ft ON wm.workspace_id = ft.workspace_id
    WHERE ft.id = forum_posts.thread_id AND wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')
  )
);

-- Tags policies
CREATE POLICY "tags_select_workspace_member" ON public.tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = tags.workspace_id AND user_id = auth.uid()
  )
);
CREATE POLICY "tags_insert_workspace_member" ON public.tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = tags.workspace_id AND user_id = auth.uid()
  )
);
CREATE POLICY "tags_update_admin" ON public.tags FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = tags.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
CREATE POLICY "tags_delete_admin" ON public.tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = tags.workspace_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Document tags policies
CREATE POLICY "document_tags_select_workspace_member" ON public.document_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON d.workspace_id = wm.workspace_id
    WHERE d.id = document_tags.document_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "document_tags_insert_workspace_member" ON public.document_tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON d.workspace_id = wm.workspace_id
    WHERE d.id = document_tags.document_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "document_tags_delete_workspace_member" ON public.document_tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON d.workspace_id = wm.workspace_id
    WHERE d.id = document_tags.document_id AND wm.user_id = auth.uid()
  )
);

-- Thread tags policies
CREATE POLICY "thread_tags_select_workspace_member" ON public.thread_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.forum_threads ft
    JOIN public.workspace_members wm ON ft.workspace_id = wm.workspace_id
    WHERE ft.id = thread_tags.thread_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "thread_tags_insert_workspace_member" ON public.thread_tags FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.forum_threads ft
    JOIN public.workspace_members wm ON ft.workspace_id = wm.workspace_id
    WHERE ft.id = thread_tags.thread_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "thread_tags_delete_workspace_member" ON public.thread_tags FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.forum_threads ft
    JOIN public.workspace_members wm ON ft.workspace_id = wm.workspace_id
    WHERE ft.id = thread_tags.thread_id AND wm.user_id = auth.uid()
  )
);

-- Document links policies
CREATE POLICY "document_links_select_workspace_member" ON public.document_links FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON d.workspace_id = wm.workspace_id
    WHERE d.id = document_links.source_document_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "document_links_insert_workspace_member" ON public.document_links FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON d.workspace_id = wm.workspace_id
    WHERE d.id = document_links.source_document_id AND wm.user_id = auth.uid()
  )
);
CREATE POLICY "document_links_delete_workspace_member" ON public.document_links FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.workspace_members wm ON d.workspace_id = wm.workspace_id
    WHERE d.id = document_links.source_document_id AND wm.user_id = auth.uid()
  )
);
