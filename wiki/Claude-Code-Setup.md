# Claude Code Setup & Integration

City App Framework is specifically optimized for AI-assisted development with Claude Code. This guide covers setup, usage, and best practices for maximum productivity.

## 🤖 Installation & Setup

### Installing Claude Code

```bash
# Install Claude Code CLI globally
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### Framework Integration

Every City App project includes Claude Code optimization:

```bash
# Generate project with AI context
create-city-app my-project --template=blog --yes

# Navigate to project
cd my-project

# Start AI-assisted development
npm run ai:start
```

## 🚀 Automatic Setup Process

### What `npm run ai:start` Does

The generated `scripts/ai-setup.sh` script:

1. **Detects Claude Code**: Checks if CLI is installed
2. **Shows Optimal Prompt**: Provides perfect startup context
3. **Launches Claude Code**: Starts with project awareness
4. **Provides Instructions**: Guides first-time users

### The Generated Startup Prompt

```bash
🤖 Setting up AI development environment...
✅ Claude Code CLI detected
🚀 Starting Claude Code with project context...

Recommended Claude Code startup prompt:
────────────────────────────────────────────────────
Hi! I just generated this Redux blog/CMS project using City App Framework.
Please read the CLAUDE.md file and .claude/commands/ directory to understand
the project structure and help me develop this interview-ready blog application.

Key areas I'd like help with:
- Redux Toolkit patterns and best practices
- Advanced Redux state management
- Material UI component composition
- TypeScript implementation
- Testing strategy and implementation
────────────────────────────────────────────────────

Starting Claude Code...
```

## 📁 Generated AI Context

### CLAUDE.md Structure

Every project includes comprehensive context:

```markdown
# Claude Code Context: [project-name]

## Project Overview
**Type**: Blog/CMS Application
**Framework**: React + TypeScript + Vite
**State Management**: Redux Toolkit
**UI Framework**: Material UI

## Architecture
- Modern React with functional components
- TypeScript strict mode
- Redux Toolkit for state management
- Material UI for components
- Rich text editor for content

## AI Development Guidelines
### CRITICAL: Anti-Overengineering Rules
- Build exactly what's asked for
- Prefer simple solutions
- No premature optimization
- Stop at working code
- Ask before adding features

## Key Features
- Blog post CRUD operations
- Rich text editing
- Category management
- Responsive design
- Professional code structure
```

### .claude/commands/ Directory

Specific workflow commands:

#### add-post.md
```markdown
# Add Blog Post Command
Usage: Add new blog post with Redux state management

## Steps:
1. Create post type in types/blog.ts
2. Add to blogSlice reducer
3. Create post component
4. Add route and navigation
5. Test CRUD operations
```

#### setup-crud.md
```markdown
# Blog CRUD Setup
Complete CRUD operations for blog management

## Components to Create:
- PostList: Display all posts
- PostEditor: Create/edit posts
- PostViewer: Read single post
- PostManager: Admin interface
```

#### anti-overengineering.md
```markdown
# Anti-Overengineering Guidelines

## STOP Signs for AI Development
### ❌ DO NOT:
- Add features not explicitly requested
- Create abstractions before 3+ patterns
- Suggest improvements unless asked

### ✅ DO:
- Build exactly what was asked for
- Use simplest solution that works
- Ask permission before adding extras
```

## 🎯 Optimal Usage Patterns

### Starting a Development Session

```bash
# 1. Navigate to project
cd my-city-app

# 2. Start AI environment
npm run ai:start

# 3. Copy the provided prompt into Claude Code
# 4. Begin development with AI assistance
```

### Effective AI Collaboration

#### Good Prompts
```markdown
✅ "Add a delete post functionality to the PostViewer component"
✅ "Create a user profile component with Material UI styling"
✅ "Add form validation to the PostEditor"
```

#### Avoid Vague Prompts
```markdown
❌ "Make the app better"
❌ "Add some features"
❌ "Optimize everything"
```

### Development Workflow

1. **Start with Context**: Use `npm run ai:start` prompt
2. **Specific Requests**: Ask for one feature at a time
3. **Review Generated Code**: Check against anti-overengineering guidelines
4. **Test Immediately**: Verify functionality before next request
5. **Iterate**: Build features incrementally

## 🧠 Context Management

### Keeping AI Context Fresh

#### Update CLAUDE.md When:
- Adding major new features
- Changing architecture decisions
- Adding new dependencies
- Modifying coding standards

#### Example Context Update:
```markdown
## Recent Changes
- Added user authentication system
- Integrated Firebase for data persistence
- Updated Material UI to v5.15
- Added React Query for data fetching

## Current Focus
Working on user profile management:
- User registration/login
- Profile editing
- Avatar upload
- Settings management
```

### .claude/commands/ Maintenance

Add new command files for recurring tasks:

#### firebase-integration.md
```markdown
# Firebase Integration Command
Steps for adding Firebase features

## Setup:
1. Install Firebase SDK
2. Configure environment variables
3. Initialize Firebase app
4. Create database rules

## Implementation:
- Authentication service
- Firestore data layer
- Storage for file uploads
```

## 🎨 Template-Specific Context

### Blog Template AI Context

The blog template includes:
- **Redux patterns**: Slice creation, action patterns
- **Material UI usage**: Component composition, theming
- **CRUD operations**: Create, read, update, delete flows
- **TypeScript patterns**: Interface design, type safety

### Minimal Template AI Context

The minimal template includes:
- **Basic React patterns**: Component structure, hooks
- **TypeScript setup**: Configuration, type definitions
- **Testing patterns**: Unit test examples
- **Build configuration**: Vite setup, development tools

## 🚀 Advanced AI Workflows

### Multi-Session Context

For longer projects:

```markdown
# Session Context Template
## Previous Sessions
- Session 1: Set up basic blog structure
- Session 2: Added user authentication
- Session 3: Implemented post categories

## Current Session Goals
- Add user profile management
- Implement post comments
- Create admin dashboard

## Known Issues
- Need to fix responsive design on mobile
- Performance optimization needed for large post lists
```

### Code Review with AI

```markdown
# Code Review Request
Please review the following component for:
- Redux Toolkit best practices
- Material UI pattern compliance
- TypeScript type safety
- Anti-overengineering violations
- Testing coverage gaps

[paste component code]
```

### Refactoring Sessions

```markdown
# Refactoring Session
Current problem: Post list component is getting complex

Goals:
- Break into smaller components
- Improve performance
- Maintain existing functionality
- Don't over-engineer the solution

Please suggest refactoring approach following our anti-overengineering guidelines.
```

## 🔧 Troubleshooting

### Claude Code Not Starting

```bash
# Check if Claude Code is installed
which claude

# If not found, install
npm install -g @anthropic-ai/claude-code

# Verify PATH includes npm global bin
echo $PATH | grep -o $(npm bin -g)
```

### Context Not Loading

```bash
# Check if CLAUDE.md exists
ls -la CLAUDE.md

# Check .claude directory
ls -la .claude/commands/

# Regenerate if missing
create-city-app . --template=blog --force
```

### AI Giving Unexpected Responses

Common causes:
- **Vague prompts**: Be more specific
- **Missing context**: Update CLAUDE.md
- **Outdated information**: Refresh AI with recent changes
- **Conflicting instructions**: Check anti-overengineering guidelines

## 🎯 Best Practices

### Do's
- ✅ Start every session with `npm run ai:start` prompt
- ✅ Keep requests specific and focused
- ✅ Update context regularly
- ✅ Follow anti-overengineering guidelines
- ✅ Test generated code immediately
- ✅ Use .claude/commands/ for recurring patterns

### Don'ts
- ❌ Skip the startup prompt
- ❌ Make vague requests
- ❌ Let AI add unnecessary features
- ❌ Accept overengineered solutions
- ❌ Forget to update project context
- ❌ Work without clear goals

## 📊 Measuring AI Productivity

### Success Metrics
- **Time to Feature**: How quickly AI helps implement requests
- **Code Quality**: Does generated code meet standards?
- **Understanding**: How well does AI grasp project context?
- **Efficiency**: Are you building faster with AI assistance?

### Improvement Areas
- **Context Quality**: Better documentation leads to better AI responses
- **Prompt Clarity**: Specific requests get better results
- **Workflow Optimization**: Streamlined development process
- **Knowledge Transfer**: Teaching AI project-specific patterns

---

*Claude Code integration transforms City App projects into AI-assisted development environments optimized for productivity and quality.* 🤖✨