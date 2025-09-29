<<<<<<< HEAD
# KnowSpace - Modular Knowledge Workspace

A comprehensive knowledge collaboration platform that combines structured document creation with integrated forum discussions, built with Next.js and Supabase.

## Features

### Core Functionality
- **Modular Document Editor**: Create structured content using flexible blocks (headings, paragraphs, lists, code, checklists, media)
- **Threaded Forum Discussions**: Engage in organized conversations with categories, threading, and voting
- **Cross-Linking System**: Seamlessly connect documents and discussions to create a web of knowledge
- **Workspace Management**: Organize content in dedicated workspaces with role-based access control
- **Powerful Search**: Full-text search across documents and discussions with advanced filtering
- **Smart Organization**: Tag-based categorization and hierarchical content organization

### User Experience
- **Authentication System**: Secure email-based authentication with profile management
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Collaboration**: Live updates and collaborative features
- **Rich Text Editing**: Intuitive block-based editor for creating structured content
- **Advanced Filtering**: Filter content by tags, categories, authors, and date ranges

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd knowspace
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts/` folder in order:
     - `001_create_database_schema.sql`
     - `002_create_rls_policies.sql` 
     - `003_create_profile_trigger.sql`

4. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **workspaces**: Team workspaces for organizing content
- **workspace_members**: User memberships in workspaces with roles
- **documents**: Structured documents with block-based content
- **forum_categories**: Discussion categories within workspaces
- **forum_threads**: Discussion threads with metadata
- **forum_replies**: Threaded replies to discussions
- **content_links**: Cross-references between documents and discussions

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── editor/            # Document editor components
│   ├── forums/            # Forum-related components
│   ├── search/            # Search functionality
│   ├── ui/                # Reusable UI components
│   └── workspaces/        # Workspace management
├── lib/                   # Utility libraries
│   └── supabase/          # Supabase client configuration
└── scripts/               # Database setup scripts
\`\`\`

## Key Features Implementation

### Document Editor
- Block-based content creation
- Support for headings, paragraphs, lists, code blocks, quotes, and checklists
- Real-time saving and publishing
- Tag-based organization

### Forum System
- Threaded discussions with categories
- Voting and reply functionality
- Pinned threads and moderation features
- Tag-based categorization

### Search & Filtering
- Full-text search across all content
- Advanced filtering by tags, categories, authors, and dates
- Real-time search suggestions
- Cross-content linking

### Workspace Management
- Role-based access control (owner, admin, member)
- Workspace-specific content organization
- Member invitation and management
- Activity tracking and analytics

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Ensure environment variables are configured

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the database schema and API routes

## Roadmap

- [ ] Real-time collaborative editing
- [ ] AI-powered content suggestions
- [ ] Export functionality (Markdown, PDF)
- [ ] Advanced analytics and insights
- [ ] Mobile application
- [ ] Integration with external tools
\`\`\`

```json file="" isHidden
=======
# KnowSpace
>>>>>>> b6c36986a26b36ab5bb86240dc1ca1b7e946d615
