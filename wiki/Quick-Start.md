# Quick Start Guide

Get up and running with City App Framework in under 5 minutes!

## 🚀 Generate Your First Project

```bash
# Create a new blog/CMS project (recommended for demos)
create-city-app my-blog --template=blog --yes

# Navigate to your project
cd my-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

Your blog will be running at `http://localhost:3000` with:
- ✅ Redux Toolkit state management
- ✅ Material UI components
- ✅ Complete CRUD operations
- ✅ Professional project structure
- ✅ AI-optimized context files

## 🎯 Template Options

### Blog Template (Perfect for Interviews)
```bash
create-city-app portfolio-blog --template=blog --yes
```
**Includes**: Redux Toolkit, Material UI, CRUD operations, rich text editing

### Minimal Template (Clean Slate)
```bash
create-city-app simple-app --template=minimal --yes
```
**Includes**: React, TypeScript, Vite, basic testing setup

## 🤖 AI-Assisted Development

Start AI development immediately:

```bash
# Start Claude Code with optimized context
npm run ai:start

# Or start dev server + AI together
npm run dev:ai

# Check AI context status
npm run ai:context
```

The framework provides Claude Code with:
- Comprehensive project context in `CLAUDE.md`
- Specific workflows in `.claude/commands/`
- Anti-overengineering guidelines
- Interview-focused development tips

## 📁 Generated Project Structure

```
my-blog/
├── src/
│   ├── components/         # React components
│   ├── store/             # Redux Toolkit slices
│   ├── hooks/             # Custom hooks (including typed Redux hooks)
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Helper functions
│   └── pages/             # Route components
├── .claude/
│   └── commands/          # AI development workflows
├── scripts/
│   └── ai-setup.sh        # Automated AI environment setup
├── CLAUDE.md              # Comprehensive AI context
├── package.json           # With AI development scripts
└── README.md              # Project-specific guide
```

## 🎨 Available Scripts

Every generated project includes:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
npm run ai:start     # Launch Claude Code with context
```

## ✨ Key Features Out of the Box

### For Blog Template:
- **CRUD Operations**: Create, read, update, delete blog posts
- **Rich Text Editing**: Built-in content editor
- **State Management**: Redux Toolkit with proper TypeScript integration
- **UI Components**: Professional Material UI design
- **Routing**: React Router for navigation

### For All Templates:
- **TypeScript**: Strict mode enabled
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript rules
- **AI Context**: Rich documentation for AI assistance
- **Quality Gates**: Professional development standards

## 🎯 Interview Preparation

If using for interview demonstrations:

```bash
# Generate interview-ready project
create-city-app interview-demo --template=blog --yes

# Key talking points:
# ✅ Redux Toolkit patterns and best practices
# ✅ TypeScript implementation
# ✅ Material UI component composition
# ✅ Professional project structure
# ✅ CRUD operations and state management
```

## 🛠️ CLI Options

```bash
# Interactive mode (walks through all options)
create-city-app my-project

# Quick generation with flags
create-city-app my-project --template=blog --yes

# Force overwrite existing directory
create-city-app my-project --template=minimal --force

# Available flags:
# --template=blog|minimal
# --yes (skip prompts)
# --force (overwrite existing)
```

## 🔧 Customization

After generation, customize your project:

1. **Update project info** in `package.json`
2. **Modify components** in `src/components/`
3. **Extend Redux state** in `src/store/slices/`
4. **Add new routes** in your routing setup
5. **Customize theme** in Material UI configuration

## 📚 Next Steps

- [[CLI Usage]] - Complete command reference
- [[Blog Template]] - Deep dive into the blog template
- [[AI Integration]] - Maximize AI-assisted development
- [[Architecture]] - Understanding the framework design

## 💡 Tips

- **Use `--force` flag** when regenerating into existing directories
- **Run `npm run ai:start`** for optimal AI development experience
- **Check `.claude/commands/`** for specific development workflows
- **Read the generated `README.md`** for project-specific instructions

---

*Ready to build? The framework is optimized for AI-driven development - let Claude Code be your pair programming partner!* 🤖✨