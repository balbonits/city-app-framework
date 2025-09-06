# City App Framework: MVP Specification

## Vision: Next.js/Vite Simplicity + AI Context Excellence

Based on research into how vibe coders actually work with AI tools like Cursor, our MVP will combine the proven simplicity of `create-next-app` and `create vite` with the AI context setup that developers actually need.

## Research Insights

### **How Vibe Coders Actually Work**
1. **Context Files Are Everything**: `.cursorrules`, `.cursor/rules/`, project context files
2. **Codebase Indexing**: AI needs to understand entire project structure
3. **Incremental Development**: Small changes, constant testing, fresh chats per feature
4. **Rules & Guidelines**: Project-specific instructions to prevent repeated mistakes
5. **Security & Quality**: 25-70% of AI code has vulnerabilities without guidance

### **What Next.js/Vite Do Right**
- **Simple Prompts**: 6-8 focused questions, not overwhelming
- **Smart Defaults**: Sensible choices with `--yes` flag for speed
- **Template Selection**: Preset options vs custom configuration
- **Fast Setup**: <1 minute to working project

---

## MVP Features (Copy Next.js/Vite + AI Context)

### **1. CLI Experience**
```bash
npx create-city-app my-project
```

#### **Prompts (Next.js/Vite Style)**
```
? What is your project named? › my-app
? Would you like to use TypeScript? › Yes
? Which framework would you like to use? › React
? Which state management would you like? › Zustand
? Would you like to use Tailwind CSS? › Yes  
? Would you like AI context setup? (recommended) › Yes
? Would you like Commission on Audits? › Yes
? Choose a starting template:
  › Minimal (blank slate)
  › Dashboard (admin panel)
  › E-commerce (shop)
  › Blog (CMS)
  › Custom (your own template)
```

### **2. Claude Code Context Setup (The Secret Sauce)**

Our MVP is specifically optimized for Claude Code, generating comprehensive context files that make Claude immediately productive with your project.

#### **Generated CLAUDE.md (Root Context)**
```markdown
# {{PROJECT_NAME}} - City App Framework Project

## Project Overview
{{PROJECT_DESCRIPTION}}

## Tech Stack
- Framework: React {{#if typescript}}+ TypeScript{{/if}}
- State Management: {{stateManagement}}
- Styling: {{#if tailwind}}Tailwind CSS{{else}}CSS Modules{{/if}}
- Build Tool: Vite
- Testing: Vitest + React Testing Library

## City Framework Structure
- `src/context/` - City Hall (State management)
- `src/components/` - Buildings (UI components) 
- `src/utils/` - Works (Utilities)
- `src/audits/` - Commission on Audits (Health monitoring)
- `src/types/` - Models (TypeScript definitions)

## Commands & Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run audit:all` - Run all audits

## Code Style Rules
1. Use functional components with hooks
2. Follow React best practices and hooks rules
3. Maintain TypeScript strict mode
4. Ensure accessibility (WCAG AA compliance)
5. Write tests for critical functionality

## Security Guidelines
- Validate all user inputs
- Use parameterized queries for database access
- Never expose API keys or secrets in code
- Escape output in HTML/JS/SQL contexts

## DO NOT
- Modify files in `node_modules/`
- Commit sensitive data to git
- Skip accessibility attributes
- Ignore TypeScript errors
```

#### **Generated .claude/commands/ Structure**
```
.claude/
└── commands/
    ├── add-feature.md      # Template for adding new features
    ├── fix-bug.md         # Debugging workflow guide
    ├── run-audit.md       # Trigger Commission on Audits
    ├── refactor.md        # Refactoring guidelines
    └── deploy.md          # Deployment workflow
```

**Example Command: `.claude/commands/add-feature.md`**
```markdown
# Add Feature Command
Usage: /project:add-feature <feature-name>

## Steps to Add a New Feature:
1. **Plan the Feature**
   - Define requirements and acceptance criteria
   - Identify components and state needs
   - Plan API endpoints if needed

2. **Create Feature Structure**
   - Create folder in `src/features/<feature-name>/`
   - Add component files with TypeScript interfaces
   - Create hooks if state management needed

3. **Implement Feature**
   - Follow City framework patterns
   - Use existing components from `src/components/`
   - Ensure accessibility compliance

4. **Add Tests**
   - Unit tests for components
   - Integration tests for workflows
   - E2E tests for critical paths

5. **Update Documentation**
   - Update CLAUDE.md if architecture changes
   - Add to project README if user-facing
   
## City Framework Guidelines:
- Use `src/context/` for shared state
- Add utilities to `src/utils/`
- Create reusable components in `src/components/`
- Monitor with `src/audits/` health checks
```

#### **Sample project.mdc**
```markdown
---
title: Project Rules
scope: global
---

# {{PROJECT_NAME}} Development Rules

## Project Context
This is a {{PROJECT_TYPE}} built with {{TECH_STACK}}.

## Core Principles
1. Always use TypeScript strict mode
2. Follow React best practices and hooks rules
3. Use {{STATE_MANAGEMENT}} for state management
4. Ensure accessibility (WCAG AA compliance)
5. Write tests for critical functionality

## Security Requirements
- Validate all user inputs
- Use parameterized queries for database access
- Never expose API keys or secrets in code
- Escape output in HTML/JS/SQL contexts

## File Structure
Follow the City App Framework structure:
- src/context/ - State management (City Hall)
- src/components/ - UI components
- src/utils/ - Utilities (Works)
- src/audits/ - Health monitoring (Commission)

## AI Assistance Notes
- Read @codebase before making architectural changes
- Check @docs for existing patterns before creating new ones
- Test locally after each feature implementation
- Open fresh chat for each new feature
```

#### **Generated .ai/ Structure (City Charter)**
```
.ai/
├── city-charter.md      # Project vision and requirements
├── context/
│   ├── architecture.md  # Technical architecture decisions
│   ├── patterns.md      # Code patterns and examples
│   └── domain.md        # Domain-specific knowledge
└── prompts/
    ├── feature.md       # Template for adding features
    ├── debug.md         # Template for debugging
    └── refactor.md      # Template for refactoring
```

### **3. Generated Project Structure (Claude Code Optimized)**

```
my-app/
├── CLAUDE.md           # Root Claude context file
├── .claude/            # Claude Code configuration
│   └── commands/       # Custom Claude commands
├── .ai/                # Additional AI context files
│   ├── city-charter.md # Project vision and context
│   ├── context/        # Technical architecture docs
│   └── prompts/        # Reusable AI prompts
├── src/
│   ├── app/            # App router (Next.js style)
│   ├── components/     # UI components (Buildings)
│   ├── context/        # State management (City Hall)
│   ├── utils/          # Utilities (Works)
│   ├── types/          # TypeScript definitions (Models)
│   └── audits/         # Health monitoring (Commission)
├── public/             # Static assets
├── package.json        # Generated with audit scripts
├── tsconfig.json       # Strict TypeScript config
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind setup (if selected)
└── README.md           # Generated project documentation
```

### **4. Template Options (Like Vite)**

#### **Minimal Template**
- Basic React + TypeScript setup
- Essential folder structure
- AI context files

#### **Dashboard Template**
- Auth setup (Firebase/Supabase)
- Admin layout components
- User management
- Charts and analytics

#### **E-commerce Template**
- Product catalog
- Shopping cart (Zustand)
- Checkout flow
- Payment integration stubs

#### **Blog Template**
- MDX support
- Post management
- Categories and tags
- SEO optimization

### **5. State Management (Smart Selection)**

Based on user choice, generate appropriate state structure:

#### **Zustand (Default)**
```typescript
// src/store/index.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  // Generated based on template
  user: User | null
  setUser: (user: User) => void
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
      }),
      { name: 'app-storage' }
    )
  )
)
```

### **6. Commission on Audits (Optional but Recommended)**

#### **Basic Setup**
```json
// package.json scripts
{
  "audit:lighthouse": "lighthouse http://localhost:3000 --output=json --output-path=./src/audits/lighthouse.json",
  "audit:coverage": "vitest run --coverage",
  "audit:security": "npm audit",
  "audit:all": "npm run audit:lighthouse && npm run audit:coverage && npm run audit:security"
}
```

#### **Simple Dashboard**
```typescript
// src/audits/dashboard.tsx
export function AuditDashboard() {
  // Simple component showing:
  // - Lighthouse scores
  // - Test coverage %
  // - Security vulnerabilities
  // - Bundle size
}
```

---

## MVP Implementation Priorities

### **Phase 1: Core CLI (Week 1)**
1. Basic CLI with prompts (copy create-next-app flow)
2. Template selection and generation
3. Folder structure creation
4. Package.json generation with scripts

### **Phase 2: AI Context (Week 2)**
1. Generate .cursor/rules/ files
2. Create .ai/ charter and context
3. Add project-specific prompts
4. Include security and performance rules

### **Phase 3: Templates (Week 3)**
1. Minimal template (baseline)
2. Dashboard template (most requested)
3. State management integration
4. Basic Commission on Audits

### **Phase 4: Polish (Week 4)**
1. Error handling and validation
2. Documentation and README generation
3. Testing the CLI with real projects
4. npm publication preparation

---

## Success Metrics

### **Developer Experience**
- Setup time: <2 minutes (vs 30+ minutes manual)
- Working project on first run
- AI immediately productive with context

### **Code Quality**
- Generated code passes linting
- TypeScript strict mode works
- No security vulnerabilities in templates

### **AI Effectiveness**
- Cursor/AI tools understand project structure
- Security rules prevent common vulnerabilities
- Context prevents repeated mistakes

---

## What Makes This Different

### **vs create-next-app/vite**
- **Built-in AI context** from day one
- **Security rules** to prevent AI vulnerabilities
- **Commission on Audits** for monitoring
- **City metaphor** for better mental model

### **vs Other AI Frameworks**
- **Simpler setup** (6-8 questions vs 25+)
- **Proven patterns** from Next.js/Vite
- **Practical templates** based on real use cases
- **Vibe coding optimized** with proper context files

---

## Technical Stack

### **CLI Development**
```json
{
  "dependencies": {
    "commander": "^12.0.0",      // CLI framework
    "prompts": "^2.4.2",         // Interactive prompts
    "chalk": "^5.3.0",           // Colored output
    "ora": "^8.0.1",             // Spinner for progress
    "fs-extra": "^11.2.0",       // File operations
    "execa": "^8.0.1",           // Run shell commands
    "validate-npm-package-name": "^5.0.0"
  }
}
```

### **Template Engine**
- Handlebars for dynamic content
- Simple string replacement for basic values
- Copy static files directly

---

## **CLI Architecture & Implementation**

### **Core CLI Components**

#### **1. Entry Point (`bin/create-city-app.js`)**
```javascript
#!/usr/bin/env node
// Main executable entry point
- Node.js version checking (requires 18+)
- Command line argument parsing
- Error handling and graceful exits
- Passes control to main CLI logic
```

#### **2. CLI Orchestrator (`src/index.ts`)**
```typescript
// Main workflow coordination
async function createCityApp() {
  1. Parse and validate arguments
  2. Check target directory availability
  3. Run interactive prompts
  4. Generate project structure
  5. Install dependencies
  6. Initialize git repository
  7. Display success message with next steps
}
```

#### **3. Interactive Prompt System (`src/prompts/index.ts`)**
```typescript
// 8 focused questions (not 25!)
const questions = [
  { name: 'projectName', type: 'text', validate: validateNpmName },
  { name: 'typescript', type: 'confirm', initial: true },
  { name: 'stateManagement', type: 'select', choices: ['zustand', 'redux', 'context'] },
  { name: 'tailwind', type: 'confirm', initial: true },
  { name: 'claudeContext', type: 'confirm', initial: true },
  { name: 'audits', type: 'confirm', initial: true },
  { name: 'template', type: 'select', choices: ['minimal', 'dashboard', 'ecommerce', 'blog'] }
]
```

### **Project Generation Pipeline**

#### **4. Template System (`src/generator/`)**
```typescript
// Multi-layer template processing
1. Copy base template files (shared structure)
2. Copy template-specific files (dashboard, ecommerce, etc.)
3. Copy state management templates (zustand, redux, context)
4. Process template variables ({{projectName}}, {{typescript}})
5. Generate dynamic files (package.json, configs)
```

#### **5. Claude Context Generation (`src/claude/`)**
```typescript
// Comprehensive Claude Code setup
1. Generate CLAUDE.md with project context
2. Create .claude/commands/ with workflow templates
3. Build .ai/city-charter.md with vision and architecture
4. Add .ai/context/ with technical documentation
5. Create .ai/prompts/ with reusable AI prompts
```

#### **6. Commission on Audits Setup (`src/audits/`)**
```typescript
// Automated quality monitoring
1. Add audit scripts to package.json
2. Create audit configuration files
3. Generate audit dashboard component
4. Set up reporting structure
5. Configure CI/CD integration hooks
```

### **Build System Architecture**

#### **7. Development Scripts**
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",              // Development mode
    "build": "tsx scripts/build.ts",              // Build for npm
    "test": "vitest",                             // Unit tests
    "test:e2e": "tsx test/e2e.ts",               // E2E CLI testing
    "create-test-app": "tsx src/index.ts test-app" // Quick testing
  }
}
```

#### **8. Build Pipeline (`scripts/build.ts`)**
```typescript
// Prepares CLI for npm publishing
1. Clean dist directory
2. Compile TypeScript to JavaScript
3. Copy template files to dist/templates
4. Copy package.json and README
5. Make bin script executable
6. Validate build output
```

#### **9. Template Processing Engine**
```typescript
// Handles dynamic content generation
- Handlebars for complex templating
- String replacement for simple variables
- Conditional file inclusion based on choices
- File permission handling
- Binary file copying
```

### **Error Handling & Recovery**

#### **10. Validation System**
```typescript
// Comprehensive input validation
- NPM package name validation
- Directory availability checking
- Node.js version compatibility
- Internet connectivity for dependencies
- File system permissions
```

#### **11. Graceful Failure Recovery**
```typescript
// Handles common failure scenarios
- Dependency installation failures
- File permission errors
- Git initialization problems
- Template corruption
- User interruption handling
```

### **Testing Strategy**

#### **12. Unit Tests (`test/unit/`)**
```typescript
// Component-level testing
- Prompt validation logic
- Template processing functions
- File generation utilities
- Configuration builders
```

#### **13. Integration Tests (`test/e2e/`)**
```typescript
// End-to-end CLI testing
- Complete project generation flows
- Template rendering verification
- Dependency installation testing
- Generated project validation
```

---

## Example Usage

```bash
$ npx create-city-app my-saas

? What is your project named? › my-saas
? Would you like to use TypeScript? › Yes
? Which framework would you like to use? › React
? Which state management would you like? › Zustand
? Would you like to use Tailwind CSS? › Yes
? Would you like AI context setup? › Yes
? Would you like Commission on Audits? › Yes
? Choose a starting template: › Dashboard

✨ Creating your City App in ./my-saas

📦 Installing dependencies...
🤖 Setting up AI context...
🏛️ Configuring Commission on Audits...
📝 Generating documentation...

✅ Success! Created my-saas at /Users/dev/my-saas

Inside that directory, you can run:

  npm run dev
    Starts the development server

  npm run audit:all
    Runs all health checks

  npm run build
    Builds for production

Happy vibe coding! 🏙️
```

---

*This MVP combines the proven simplicity of Next.js/Vite with the AI context setup that vibe coders actually need, creating the perfect foundation for AI-driven development.* 🚀