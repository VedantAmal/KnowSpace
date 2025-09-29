-- Create users profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace members table
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB DEFAULT '[]'::jsonb,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, slug)
);

-- Create forum categories table
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum threads table
CREATE TABLE IF NOT EXISTS public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.forum_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum posts table (replies to threads)
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, name)
);

-- Create document tags junction table
CREATE TABLE IF NOT EXISTS public.document_tags (
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- Create thread tags junction table
CREATE TABLE IF NOT EXISTS public.thread_tags (
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (thread_id, tag_id)
);

-- Create document links table (for cross-referencing)
CREATE TABLE IF NOT EXISTS public.document_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  target_document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  target_thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  link_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (target_document_id IS NOT NULL AND target_thread_id IS NULL) OR
    (target_document_id IS NULL AND target_thread_id IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_links ENABLE ROW LEVEL SECURITY;
