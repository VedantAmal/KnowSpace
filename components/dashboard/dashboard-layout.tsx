"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { BookOpen, MessageSquare, Search, Plus, Settings, LogOut, Home, Users, Hash, Calendar } from "lucide-react"
import Link from "next/link"
import { SearchDialog } from "@/components/search/search-dialog"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  workspaces: any[]
}

export function DashboardLayout({ children, user, workspaces }: DashboardLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  // Calculate user initials for avatar
  const userInitials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U'

  const handleSignOut = async () => {
    try {
      console.log("[v0] Starting sign out process")
      await supabase.auth.signOut()
      console.log("[v0] Sign out successful, redirecting")
      // Force a hard redirect to the login page
      window.location.href = "/auth/login"
    } catch (err) {
      console.error("[v0] Sign out exception:", err)
      // In case of error, force a redirect to login
      window.location.href = "/auth/login"
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault()
      setSearchOpen(true)
    }
  }

  // Remove this declaration as we already have it above

  return (
    <div className="min-h-screen bg-background" onKeyDown={handleSearchKeyDown}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">KnowSpace</h1>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/documents">
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documents
                </Button>
              </Link>
              <Link href="/dashboard/forums">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Forums
                </Button>
              </Link>
              <Link href="/dashboard/categories">
                <Button variant="ghost" size="sm">
                  <Hash className="w-4 h-4 mr-2" />
                  Categories
                </Button>
              </Link>
              <Link href="/dashboard/activity">
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Activity
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search knowledge... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="pl-10 w-64"
              />
            </div>

            {/* Mobile Search Button */}
            <Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="w-4 h-4" />
            </Button>

            {/* Create Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/documents/new">
                    <BookOpen className="w-4 h-4 mr-2" />
                    New Document
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/forums/new">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    New Discussion
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/workspaces/new">
                    <Users className="w-4 h-4 mr-2" />
                    New Workspace
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu - always render, with safe fallbacks */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full border-2 border-primary" aria-label="Open user menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{userInitials || "?"}</AvatarFallback>
                  </Avatar>
                  {/* Debug: show fallback if user missing */}
                  {!user && <span className="absolute left-0 top-0 text-xs bg-red-500 text-white px-1 rounded">No user</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.display_name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
