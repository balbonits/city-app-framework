# create-city-app CLI Specification

## Overview
`create-city-app` is the official scaffolding tool for the City App Framework. It generates AI-optimized project structures with full context systems, configuration files, and development workflows.

## Installation & Usage

### Global Installation
```bash
npm install -g create-city-app
# or
yarn global add create-city-app
# or
pnpm install -g create-city-app
```

### Direct Usage (Recommended)
```bash
npx create-city-app my-app
# or
yarn create city-app my-app
# or
pnpm create city-app my-app
```

## Command Line Interface

### Basic Usage
```bash
create-city-app [project-name] [options]
```

### Options
```bash
Options:
  -t, --template <template>     Template to use (default: interactive)
  -p, --platform <platform>    Platform target (web|native|hybrid)
  --ts, --typescript           Use TypeScript (default: true)
  --js, --javascript           Use JavaScript
  -s, --style <framework>      Styling framework (tailwind|bootstrap|mui|css)
  -r, --routing <type>         Routing type (react-router|next-app|next-pages|express)
  --state <manager>            State management (context|redux|zustand|hybrid)
  --storage                    Include localStorage/sessionStorage
  --ai-agent <agent>           AI agent to configure (claude|copilot|cursor|all)
  --skip-git                   Skip git initialization
  --skip-install               Skip npm install
  --package-manager <pm>       Package manager (npm|yarn|pnpm)
  -h, --help                   Display help
  -v, --version               Display version
```

### Examples
```bash
# Interactive mode (recommended for first-time users)
npx create-city-app my-app

# Quick setup with defaults
npx create-city-app my-app --template minimal

# Full-stack web app with TypeScript and Tailwind
npx create-city-app my-web-app --platform web --ts --style tailwind --routing next-app

# React Native app with TypeScript
npx create-city-app my-mobile-app --platform native --ts --style native

# Hybrid app for web and mobile
npx create-city-app my-hybrid-app --platform hybrid --style ionic
```

## Interactive CLI Flow

### 1. Welcome & Project Info
```
┌─────────────────────────────────────────────────┐
│                                                 │
│   🏙️  Welcome to City App Framework            │
│                                                 │
│   The AI-first development framework            │
│                                                 │
└─────────────────────────────────────────────────┘

? What's your project name? › my-awesome-app
? Project description? › An AI-built application using City Framework
? Project version? › 1.0.0
? Author name? › John Doe
? License? › MIT
```

### 2. Platform Selection
```
? Which platform(s) do you want to target? 
  ○ Web only (Single-page application)
  ○ Web with SSR (Next.js server-side rendering)  
  ○ Native mobile (React Native for iOS/Android)
  ○ Hybrid (Web + Mobile with Capacitor/Ionic)
  ○ Desktop (Electron/Tauri)
  ● Full-stack (Web frontend + Node.js backend)
```

### 3. Technology Stack
```
? Programming language?
  ● TypeScript (Recommended for AI)
  ○ JavaScript

? Styling framework?
  ● Tailwind CSS (Best for AI generation)
  ○ Bootstrap (Quick prototyping)
  ○ Material-UI (Complete component library)
  ○ CSS Modules + SASS (Traditional approach)

? State management?
  ● Context API (Built-in, simple)
  ○ Zustand (Lightweight, TypeScript-first)  
  ○ Redux Toolkit (Predictable, dev tools)
  ○ Hybrid (Context + Zustand/Redux)

? Include local storage?
  ● Yes (localStorage + sessionStorage)
  ○ No (State only)
```

### 4. AI Agent Configuration
```
? Which AI coding agent will you use? (You can add more later)
  ● Claude Code (Anthropic) - Recommended
  ○ GitHub Copilot
  ○ Cursor
  ○ Multiple agents
  ○ Skip AI setup (not recommended)

? AI context level?
  ● Comprehensive (Detailed context, best results)
  ○ Balanced (Good context, faster setup)
  ○ Minimal (Basic context, fastest setup)
```

### 5. Project Template
```
? Choose a starting template:
  ● Minimal (Basic setup, build from scratch)
  ○ Dashboard (Admin dashboard with auth)
  ○ E-commerce (Product catalog and cart)
  ○ Blog (Content management system)
  ○ Portfolio (Personal/company showcase)
  ○ API Server (Backend only)
  ○ Component Library (Storybook setup)
```

### 6. Testing Strategy
```
? Testing approach? (Critical for AI-driven development)
  ● Comprehensive (Unit + E2E + Visual + AI-generated tests)
  ○ Standard (Unit + E2E tests)
  ○ Minimal (Unit tests only)
  ○ Skip testing (Not recommended)

? Unit testing framework?
  ● Vitest (Fast, Vite-integrated, AI-friendly)
  ○ Jest (Mature, snapshot testing)
  ○ Mocha + Chai (Flexible, BDD support)

? E2E testing framework?
  ● Playwright (Multi-browser, fast, AI-optimized)
  ○ Cypress (Great DX, dashboard)
  ○ Selenium (Legacy/complex requirements)
  ○ Skip E2E testing

? Enable snapshot testing?
  ● Yes (Catch visual regressions)
  ○ No

? Development process?
  ● Test-Driven Development (TDD) - AI writes tests first
  ○ Behavior-Driven Development (BDD) - Natural language specs  
  ○ Component-Driven Development (CDD) - Storybook-first
  ○ Acceptance Test-Driven Development (ATDD) - Business collaboration
  ○ Traditional (Write tests after implementation)
```

### 7. Component Documentation
```
? Component documentation/style guide?
  ● Storybook (Interactive component docs, AI story generation)
  ○ React Styleguidist (Simple, PropTypes-based)
  ○ Docusaurus (Full documentation site)
  ○ Skip style guide

? If using Storybook - Integration options:
  ☑ Component testing (Test runner from stories)
  ☑ Accessibility testing (a11y addon)
  ☑ Visual regression testing (Chromatic integration)
  ☐ Design tokens (Design system integration)
  
? If enabled E2E testing - Connect with Storybook?
  ● Yes (Test components in isolation + full flows)
  ○ No (Separate E2E and component tests)

? If enabled snapshots - Include in Storybook?
  ● Yes (Visual + component snapshots)
  ○ Component snapshots only
```

### 8. AI Context Definition
```
┌─────────────────────────────────────────────────┐
│  🧠 AI Context Setup - The Game Changer!       │
├─────────────────────────────────────────────────┤
│  This is what makes City Framework special:     │
│  Rich context for AI agents to understand       │
│  your project goals, constraints, and patterns. │
└─────────────────────────────────────────────────┘

? How would you like to define your project context?
  ● Interactive Q&A (Guided questions, recommended for first-time)
  ○ Upload existing documentation (We'll analyze and extract context)
  ○ Template-based (Choose from business domain templates)
  ○ Minimal setup (Basic context, expand later)

? Project domain/industry?
  ○ E-commerce (Online store, payments, inventory)
  ○ SaaS/Dashboard (Admin panels, analytics, user management)  
  ○ Content/Blog (CMS, publishing, SEO)
  ○ Social/Community (User-generated content, interactions)
  ○ Finance/Fintech (Banking, trading, compliance)
  ○ Healthcare (Patient data, HIPAA compliance)
  ○ Education (Learning management, assessments)
  ○ Real Estate (Property listings, searches, CRM)
  ● Other/Custom (I'll define my own context)

? Target users?
  ○ End consumers (B2C)
  ○ Business users (B2B)
  ○ Internal teams (Enterprise)
  ○ Developers (Developer tools)
  ● Mixed audience

? Key business goals? (Select up to 3 most important)
  ☑ User acquisition and growth
  ☐ Revenue generation
  ☑ User engagement and retention  
  ☐ Operational efficiency
  ☐ Data collection and insights
  ☐ Brand awareness
  ☐ Cost reduction
  ☐ Compliance and security
```

### 9. Context Deep Dive (If Interactive Q&A selected)
```
? What problem does your app solve? (AI will use this for all decisions)
› "Help users track their fitness goals with personalized workout plans and nutrition tracking."

? Who is your primary user?
› "Fitness enthusiasts aged 25-45 who want data-driven workout optimization"  

? What are the core features? (One per line, AI will prioritize these)
› User registration and profiles
› Workout plan generation
› Exercise tracking and logging
› Nutrition tracking and recommendations
› Progress analytics and reporting
› Social sharing and challenges

? What are your technical constraints?
› Mobile-first design (primary usage on phones)
› Offline capability needed for gym use
› Must integrate with fitness APIs (Strava, MyFitnessPal)
› GDPR compliance for EU users
› Performance critical (sub-3s load times)

? What's your performance budget?
› Bundle size: < 1MB initial load
› Time to interactive: < 3 seconds
› Core Web Vitals: All green scores
› 90%+ mobile performance score

? Accessibility requirements?
› WCAG 2.1 AA compliance
› Screen reader support
› Keyboard navigation
› High contrast mode support

? Security considerations?
› User data encryption at rest
› HTTPS only
› Input sanitization  
› Rate limiting on APIs
› No third-party trackers

? Future roadmap? (AI will structure for extensibility)
› Native mobile apps (iOS/Android)
› Wearable device integrations
› AI-powered workout recommendations  
› Premium subscription tiers
› Corporate wellness programs
```

### 10. Additional Features
```
? Additional development features? (Space to select)
  ☑ ESLint + Prettier (Code formatting)
  ☑ Husky (Git hooks for quality gates)
  ☑ GitHub Actions (CI/CD with testing)
  ☑ Docker (Containerization)
  ☐ PWA (Progressive Web App capabilities)
  ☐ Internationalization (Multi-language support)
  ☐ Analytics integration (Usage tracking)
  ☐ Error monitoring (Sentry, Bugsnag)
```

### 11. Setup Summary
```
┌─────────────────────────────────────────────────┐
│  📋 Project Configuration Summary               │
├─────────────────────────────────────────────────┤
│  Name: fitness-tracker-pro                     │
│  Platform: Full-stack PWA                      │
│  Language: TypeScript                           │
│  Styling: Tailwind CSS                         │
│  State: Zustand + localStorage                  │
│  Testing: Vitest + Playwright + Snapshots      │
│  Dev Process: TDD (AI writes tests first)      │
│  Style Guide: Storybook + Component Testing    │
│  AI Agent: Claude Code                         │
│  Template: Dashboard                            │
│  Domain: Fitness/Health tracking               │
│  Features: PWA, Testing, Storybook, CI/CD      │
│                                                 │
│  🧠 AI Context: Comprehensive                   │
│     • Problem: Fitness goal tracking           │
│     • Users: Fitness enthusiasts 25-45         │
│     • Goals: User growth + engagement          │
│     • Constraints: Mobile-first, offline       │
│     • Performance: <3s load, <1MB bundle      │
└─────────────────────────────────────────────────┘

? Looks good? › Yes, create project with AI context!
```

## Generated Project Structure

### Basic Web App Structure
```
my-app/
├── .ai/                      # AI configuration
│   ├── context.md           # Project context
│   ├── instructions.md      # AI instructions  
│   ├── agents/
│   │   └── claude.yaml     # Claude configuration
│   ├── templates/          # Code templates
│   └── examples/           # Example implementations
├── src/
│   ├── context/            # City Hall (State)
│   │   ├── Providers.tsx
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Works (Custom hooks)
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   ├── utils/              # Works (Utilities)
│   │   ├── ai/            # AI utilities
│   │   ├── validation/    # Input validation
│   │   └── sanitize/      # Security utilities
│   ├── components/         # UI Components
│   │   ├── common/        # Shared components
│   │   ├── forms/         # Form components
│   │   └── layout/        # Layout components
│   ├── styles/            # Arts (Styling)
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── types/             # Models (TypeScript)
│   │   ├── api.ts
│   │   ├── user.ts
│   │   └── common.ts
│   ├── audits/            # Commission on Audits (Health monitoring)
│   │   ├── lighthouse/    # Lighthouse performance reports
│   │   ├── coverage/      # Test coverage reports
│   │   ├── security/      # Security audit results
│   │   └── reports/       # Formatted audit reports
│   ├── routes/            # Districts (Routing)
│   │   ├── AppRoutes.tsx
│   │   └── PrivateRoute.tsx
│   └── App.tsx
├── public/
├── tests/                 # Testing
│   ├── __mocks__/
│   ├── components/
│   └── utils/
├── .storybook/           # Storybook config
├── .github/              # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/                 # Documentation
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── DEPLOYMENT.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── .eslintrc.js
├── .gitignore
└── README.md
```

### Full-Stack Structure (Additional)
```
my-app/
├── server/               # Backend
│   ├── api/             # Store (API endpoints)
│   │   ├── auth/
│   │   ├── users/
│   │   └── data/
│   ├── routes/          # Districts (Backend routing)
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── utils/           # Server utilities
│   └── server.ts
├── database/            # Database
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
└── docker/              # Docker config
    ├── Dockerfile
    └── docker-compose.yml
```

## Template Definitions

### 1. Minimal Template
- Basic React setup
- Essential AI context
- Minimal dependencies
- Ready for custom development

### 2. Dashboard Template
- Authentication system
- Admin layout
- Data tables and charts
- User management
- Settings panel

### 3. E-commerce Template
- Product catalog
- Shopping cart
- Checkout flow
- Payment integration
- Order management

### 4. Blog Template
- Content management
- Rich text editor
- SEO optimization
- Comment system
- Admin interface

### 5. API Server Template
- Express.js setup
- REST API endpoints
- Authentication middleware
- Database integration
- API documentation

## AI Agent Setup

### Claude Code Configuration
```yaml
# .ai/agents/claude.yaml
agent:
  name: claude-code
  version: 1.0.98
  model: claude-opus-4-1

project:
  name: ${projectName}
  type: ${projectType}
  platform: ${platform}
  
preferences:
  style: concise
  typescript: ${useTypeScript}
  comments: minimal
  patterns:
    - hooks-first
    - functional-components
    - error-boundaries

context:
  level: comprehensive
  auto_update: true
  include:
    - project_structure
    - dependencies  
    - patterns
    - constraints

tools:
  enabled:
    - file-operations
    - terminal-access
    - web-search
  preferences:
    - read-before-edit
    - test-after-code
    - review-before-commit
```

## Build & Development Scripts

### Generated package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "ai:context": "node scripts/generate-ai-context.js",
    "ai:validate": "node scripts/validate-ai-context.js"
  }
}
```

## CLI Implementation Architecture

### Core CLI Structure
```typescript
// src/cli/index.ts
interface CLIOptions {
  projectName: string;
  template?: string;
  platform?: Platform;
  typescript?: boolean;
  style?: StyleFramework;
  routing?: RoutingType;
  state?: StateManager;
  aiAgent?: AIAgent;
  skipGit?: boolean;
  skipInstall?: boolean;
  packageManager?: PackageManager;
}

class CreateCityApp {
  async run(options: CLIOptions) {
    // 1. Validate input
    // 2. Collect missing options (interactive)
    // 3. Generate project structure
    // 4. Install dependencies
    // 5. Initialize git
    // 6. Setup AI context
    // 7. Success message
  }
}
```

### Project Generator
```typescript
interface ProjectGenerator {
  generateStructure(config: ProjectConfig): Promise<void>;
  copyTemplateFiles(template: Template): Promise<void>;
  generateAIContext(config: ProjectConfig): Promise<void>;
  installDependencies(packageManager: PackageManager): Promise<void>;
  initializeGit(): Promise<void>;
}
```

## Error Handling

### Common Errors
```typescript
class CLIError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

enum ErrorCodes {
  PROJECT_EXISTS = 'PROJECT_EXISTS',
  INVALID_NAME = 'INVALID_NAME',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DEPENDENCY_FAILED = 'DEPENDENCY_FAILED'
}
```

### Error Messages
```
❌ Error: Project 'my-app' already exists
   → Use a different name or remove the existing directory

❌ Error: Invalid project name 'My App!'  
   → Project names must be valid npm package names (lowercase, no spaces)

❌ Error: Failed to install dependencies
   → Check your internet connection and try again
   → Or run 'npm install' manually after creation
```

## Success Output

### Final Success Message
```
🎉 Success! Created my-app at /path/to/my-app

🏙️ City App Framework is ready to build!

📂 Project Structure:
   City Hall (Context): src/context/
   Works (Hooks):      src/hooks/, src/utils/
   Components:         src/components/
   Arts (Styles):      src/styles/
   Store (State):      src/store/
   Models (Types):     src/types/
   Districts (Routes): src/routes/

🤖 AI Agent: Claude Code configured and ready
📄 Context: Comprehensive AI context generated

🚀 Quick Start:
   cd my-app
   npm run dev      # Start development server
   npm run test     # Run tests
   npm run storybook # Component development

🔗 Next Steps:
   • Review the generated AI context in .ai/context.md
   • Check out the example components in src/components/
   • Start building with your AI agent!

💡 Tips:
   • Use 'npm run ai:context' to regenerate AI context
   • Check docs/ for detailed documentation
   • Join our community at https://github.com/city-app-framework

Happy coding! 🎯
```

## Version Management

### Versioning Strategy
- CLI version tracks framework version
- Template versions separate from CLI
- Backward compatibility for older projects
- Upgrade paths documented

### Update Mechanism
```bash
# Check for updates
npx create-city-app --check-updates

# Update to latest
npm update -g create-city-app

# Upgrade existing project
npx create-city-app upgrade
```

## Analytics & Telemetry

### Anonymous Usage Data (Opt-in)
```typescript
interface TelemetryData {
  cliVersion: string;
  nodeVersion: string;
  platform: string;
  template: string;
  features: string[];
  duration: number;
  success: boolean;
}
```

### Privacy First
- Opt-in only
- No personal information
- Used to improve templates
- Full transparency on data collected

## Future Enhancements

### Planned Features
1. **Template Marketplace**: Community templates
2. **Live Updates**: Update projects to latest framework
3. **AI Integration**: Generate templates from descriptions
4. **Multi-Language**: Support for other languages
5. **Cloud Integration**: Deploy directly from CLI

### Community Features
1. **Template Sharing**: Share custom templates
2. **Plugin System**: Extend CLI functionality
3. **AI Agent Plugins**: Support new AI agents
4. **Template Validation**: Community review system

## Conclusion
The `create-city-app` CLI is the gateway to AI-first development with the City App Framework. It provides an intuitive, interactive experience that generates production-ready applications with comprehensive AI context from the start.