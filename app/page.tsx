import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Users, Search, Tag, LinkIcon } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">KnowSpace</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-knowledge-secondary to-knowledge-accent bg-clip-text text-transparent">
            Your Unified Knowledge Workspace
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
            Create structured documents, engage in collaborative discussions, and seamlessly link knowledge across your
            team. Everything you need for effective knowledge management in one place.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8">
                Start Building Knowledge
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Everything You Need</h3>
          <p className="text-muted-foreground text-lg">Powerful features designed for modern knowledge collaboration</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Modular Documents</CardTitle>
              <CardDescription>
                Create structured content with flexible blocks - headings, lists, code, media, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-knowledge-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-knowledge-secondary" />
              </div>
              <CardTitle>Threaded Discussions</CardTitle>
              <CardDescription>
                Engage in organized forum-style conversations with categories, threading, and voting
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-knowledge-accent/10 rounded-lg flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-knowledge-accent" />
              </div>
              <CardTitle>Cross-Linking</CardTitle>
              <CardDescription>
                Seamlessly connect documents and discussions to create a web of knowledge
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Team Workspaces</CardTitle>
              <CardDescription>
                Organize your knowledge in dedicated workspaces with role-based access control
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-knowledge-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-knowledge-secondary" />
              </div>
              <CardTitle>Powerful Search</CardTitle>
              <CardDescription>
                Find anything across documents and discussions with full-text search and filtering
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-knowledge-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Tag className="w-6 h-6 text-knowledge-accent" />
              </div>
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Use tags, categories, and hierarchical organization to keep everything structured
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-knowledge-secondary/5 to-knowledge-accent/5 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Knowledge Management?</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join teams already using KnowSpace to create, collaborate, and connect their knowledge in powerful new
              ways.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 KnowSpace. Built for collaborative knowledge management.</p>
        </div>
      </footer>
    </div>
  )
}
