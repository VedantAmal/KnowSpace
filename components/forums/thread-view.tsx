"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { Pin, Eye, MessageSquare, Send, ArrowLeft, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ThreadViewProps {
  thread: any
  posts: any[]
  workspace: any
  currentUser: any
  userRole: string
}

export function ThreadView({ thread, posts, workspace, currentUser, userRole }: ThreadViewProps) {
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [threadPosts, setThreadPosts] = useState(posts)

  const supabase = createClient()

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .insert({
          thread_id: thread.id,
          content: replyContent.trim(),
          author_id: currentUser.id,
        })
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      setThreadPosts([...threadPosts, data])
      setReplyContent("")
    } catch (error) {
      console.error("Error posting reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
        <Link href="/dashboard/forums" className="hover:text-foreground">
          Forums
        </Link>
        <span>/</span>
        <Link href={`/dashboard/workspaces/${workspace.slug}/forums`} className="hover:text-foreground">
          {workspace.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{thread.title}</span>
      </div>

      {/* Back Button */}
      <div className="mb-6">
        <Link href={`/dashboard/workspaces/${workspace.slug}/forums`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
        </Link>
      </div>

      {/* Thread Header */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {thread.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                <h1 className="text-2xl font-bold">{thread.title}</h1>
                {thread.forum_categories && (
                  <Badge
                    variant="secondary"
                    style={{
                      backgroundColor: `${thread.forum_categories.color}20`,
                      color: thread.forum_categories.color,
                    }}
                  >
                    {thread.forum_categories.name}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={thread.profiles.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{getInitials(thread.profiles.display_name)}</AvatarFallback>
                  </Avatar>
                  <span>by {thread.profiles.display_name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{thread.view_count} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{threadPosts.length} replies</span>
                </div>
                <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{thread.content}</p>
              </div>
            </div>

            {(thread.author_id === currentUser.id || ["owner", "admin"].includes(userRole)) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Thread</DropdownMenuItem>
                  <DropdownMenuItem>Pin Thread</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete Thread</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Posts */}
      <div className="space-y-4 mb-8">
        {threadPosts.map((post) => (
          <Card key={post.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{getInitials(post.profiles.display_name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{post.profiles.display_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    {(post.author_id === currentUser.id || ["owner", "admin"].includes(userRole)) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Post</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete Post</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Reply to Discussion</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReply} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[120px]"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !replyContent.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
