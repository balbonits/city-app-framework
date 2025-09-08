# Framework Architecture

Deep dive into the technical architecture of City App Framework, including CLI design, template system, and AI integration patterns.

## 🏗️ System Overview

```
City App Framework Architecture
├── CLI Package (create-city-app)
│   ├── Interactive Prompts
│   ├── Template Engine
│   ├── File Generation
│   └── AI Context Setup
├── Template System
│   ├── Base Template
│   ├── Specialized Templates
│   ├── State Management Layers
│   └── AI Context Templates
├── Generated Projects
│   ├── Framework Structure
│   ├── AI Context Files
│   ├── Quality Gates
│   └── Development Scripts
└── AI Integration
    ├── Claude Code Optimization
    ├── Context Management
    ├── Workflow Commands
    └── Anti-Overengineering Guidelines
```

## 🚀 CLI Architecture

### Core Components

#### 1. Entry Point (`src/index.ts`)
```typescript
// Command parsing and option handling
interface ProjectOptions {
  projectName: string;
  template: 'blog' | 'minimal';
  stateManagement: 'redux' | 'zustand';
  styling: 'mui' | 'tailwind';
  yes?: boolean;
  force?: boolean;
}

// Main execution flow
async function main() {
  // Parse arguments
  // Run interactive prompts or use flags
  // Validate options
  // Generate project
}
```

#### 2. Generator Engine (`src/generator.ts`)
```typescript
export async function generateProject(targetDir: string, options: ProjectOptions) {
  // 1. Create directory structure
  await createDirectoryStructure(targetDir);
  
  // 2. Generate based on template
  if (template === 'blog') {
    await generateBlogTemplate(targetDir, options);
  }
  
  // 3. Generate AI context
  await generateClaudeContext(targetDir, options);
  
  // 4. Set up development tools
  await setupDevelopmentTools(targetDir, options);
  
  // 5. Configure AI environment
  await setupAIEnvironment(targetDir, options);
}
```

#### 3. Template Processing
```typescript
// Multi-layer template system
async function generateBlogTemplate(targetDir: string, config: TemplateConfig) {
  // Base layer: Core React + TypeScript setup
  await generateBaseTemplate(targetDir, config);
  
  // Template layer: Blog-specific components
  await generateBlogFiles(targetDir, config);
  
  // State management layer: Redux/Zustand setup
  if (config.stateManagement === 'redux') {
    await generateReduxStore(targetDir);
  }
  
  // UI layer: Material UI/Tailwind setup
  await generateUIComponents(targetDir, config);
}
```

### Build System

#### TypeScript Compilation
```typescript
// scripts/build.ts
export async function buildFramework() {
  // 1. Clean previous build
  await fs.remove('./dist');
  
  // 2. Compile TypeScript
  execSync('tsc --project tsconfig.json');
  
  // 3. Copy template files
  await fs.copy('./templates', './dist/templates');
  
  // 4. Process package.json for distribution
  await processPackageJson();
  
  // 5. Create executable bin scripts
  await createBinScripts();
}
```

#### Package Distribution
```json
{
  "name": "create-city-app",
  "bin": {
    "create-city-app": "./bin/create-city-app.js"
  },
  "files": [
    "dist/",
    "templates/",
    "bin/"
  ]
}
```

## 🎨 Template System Architecture

### Template Hierarchy

```
Template Inheritance
├── Base Template
│   ├── package.json structure
│   ├── TypeScript configuration
│   ├── Build system (Vite)
│   ├── Testing setup (Vitest)
│   └── Basic project structure
├── Template-Specific Layer
│   ├── Blog Template
│   │   ├── Components (PostList, PostEditor, etc.)
│   │   ├── Routing setup
│   │   └── Content management features
│   └── Minimal Template
│       ├── Basic App component
│       └── Minimal setup
├── State Management Layer
│   ├── Redux Toolkit
│   │   ├── Store configuration
│   │   ├── Slices (blog, ui)
│   │   └── Typed hooks
│   └── Zustand
│       ├── Store creation
│       └── Hook patterns
└── Styling Layer
    ├── Material UI
    │   ├── Theme configuration
    │   ├── Component library
    │   └── Professional styling
    └── Tailwind CSS
        ├── Configuration
        ├── Utility classes
        └── Custom components
```

### Template Processing Engine

```typescript
class TemplateProcessor {
  async processTemplate(
    templateName: string,
    targetDir: string,
    variables: Record<string, any>
  ) {
    // 1. Process base template
    await this.processBaseTemplate(targetDir, variables);
    
    // 2. Process template-specific files
    await this.processSpecificTemplate(templateName, targetDir, variables);
    
    // 3. Process state management layer
    await this.processStateManagement(targetDir, variables);
    
    // 4. Process styling layer
    await this.processStyling(targetDir, variables);
  }
  
  private async processFile(sourcePath: string, targetPath: string, variables: any) {
    const content = await fs.readFile(sourcePath, 'utf8');
    
    // Handle Handlebars templates
    if (sourcePath.endsWith('.hbs')) {
      const template = Handlebars.compile(content);
      const processed = template(variables);
      const finalPath = targetPath.replace('.hbs', '');
      await fs.writeFile(finalPath, processed);
    } else {
      // Simple variable replacement
      const processed = this.replaceVariables(content, variables);
      await fs.writeFile(targetPath, processed);
    }
  }
}
```

## 🤖 AI Integration Architecture

### Context Generation System

```typescript
async function generateClaudeContext(targetDir: string, options: ProjectOptions) {
  // 1. Generate comprehensive CLAUDE.md
  const claudeContent = `
# Claude Code Context: ${options.projectName}

## Project Overview
**Type**: ${options.template === 'blog' ? 'Blog/CMS Application' : 'React Application'}
**Framework**: React + TypeScript + Vite
**State Management**: ${options.stateManagement}

## AI Development Guidelines
### CRITICAL: Anti-Overengineering Rules
- Build exactly what's asked for
- Prefer simple solutions
- Ask before adding features

## Architecture
${generateArchitectureSection(options)}

## Key Features
${generateFeaturesList(options)}
  `;
  
  await fs.writeFile(path.join(targetDir, 'CLAUDE.md'), claudeContent);
  
  // 2. Generate workflow commands
  await generateWorkflowCommands(targetDir, options);
}
```

### AI Workflow Commands

```typescript
const workflowCommands = {
  'add-feature.md': generateAddFeatureWorkflow(options),
  'fix-bug.md': generateBugFixWorkflow(options),
  'optimize-performance.md': generateOptimizationWorkflow(options),
  'anti-overengineering.md': generateAntiOverengineeringGuidelines(),
};

// Dynamic command generation based on template
function generateAddFeatureWorkflow(options: ProjectOptions) {
  if (options.template === 'blog') {
    return `
# Add Blog Feature Command
Steps for adding new blog functionality

## Redux Integration:
1. Define types in types/blog.ts
2. Add reducers to blogSlice.ts
3. Create UI components
4. Connect with typed hooks

## Testing:
1. Unit tests for new reducers
2. Component tests for UI
3. Integration tests for full flow
    `;
  }
  // Different workflow for other templates
}
```

### AI Environment Setup

```bash
#!/bin/bash
# scripts/ai-setup.sh - Generated for each project

echo "🤖 Setting up AI development environment..."

if command -v claude &> /dev/null; then
    echo "✅ Claude Code CLI detected"
    echo "🚀 Starting Claude Code with project context..."
    echo ""
    echo "Recommended startup prompt:"
    echo "────────────────────────────────"
    echo "Hi! I just generated this ${TEMPLATE} project using City App Framework."
    echo "Please read CLAUDE.md and .claude/commands/ to understand the project."
    echo ""
    echo "Key areas I'd like help with:"
    echo "- ${STATE_MANAGEMENT} patterns and best practices"
    echo "- ${UI_FRAMEWORK} component composition"
    echo "- TypeScript implementation"
    echo "────────────────────────────────"
    claude
else
    echo "❌ Claude Code CLI not found"
    echo "Install with: npm install -g @anthropic-ai/claude-code"
fi
```

## 📁 Generated Project Architecture

### File Structure Philosophy

```
Generated Project Structure
├── src/                    # Application source
│   ├── components/         # React components
│   │   ├── BlogApp.tsx    # Main app (template-specific)
│   │   ├── Header.tsx     # Navigation
│   │   └── ...            # Feature components
│   ├── store/             # State management
│   │   ├── index.ts       # Store configuration
│   │   └── slices/        # Redux slices or Zustand stores
│   ├── hooks/             # Custom React hooks
│   │   └── redux.ts       # Typed Redux hooks
│   ├── types/             # TypeScript definitions
│   │   └── blog.ts        # Domain types
│   ├── utils/             # Helper functions
│   │   └── blog.ts        # Domain utilities
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── .claude/               # AI development context
│   └── commands/          # Workflow commands
├── scripts/               # Development scripts
│   └── ai-setup.sh       # AI environment setup
├── public/                # Static assets
├── CLAUDE.md             # Comprehensive AI context
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Build configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

### Configuration Philosophy

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,           // Strict mode for AI validation
    "noUnusedLocals": true,   // Catch dead code
    "noUnusedParameters": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]      // Clean imports for AI
    }
  }
}
```

#### Vite Configuration
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // AI-friendly imports
    },
  },
  server: {
    port: 3000,
    open: true    // Auto-open for development
  },
  test: {
    globals: true,
    environment: 'jsdom',  // React testing environment
  },
});
```

## 🔧 Quality Gates Architecture

### ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "complexity": ["error", 10],        // Prevent overengineering
    "max-params": ["error", 3],         // Limit function parameters
    "max-lines-per-function": ["error", 50]  // Keep functions small
  }
}
```

### Package.json Scripts Architecture
```json
{
  "scripts": {
    // Core development
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    
    // Quality gates
    "test": "vitest --run --reporter=verbose",
    "test:watch": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    
    // AI development
    "ai:start": "./scripts/ai-setup.sh",
    "ai:context": "echo 'AI Context Ready!'",
    "dev:ai": "concurrently \"npm run dev\" \"npm run ai:start\""
  }
}
```

## 🚀 Performance Considerations

### CLI Performance
- **Incremental Generation**: Only regenerate changed templates
- **Template Caching**: Cache processed templates during development
- **Parallel Processing**: Generate multiple files concurrently
- **Minimal Dependencies**: Keep CLI package size small

### Generated Project Performance
- **Code Splitting**: Route-based splitting ready
- **Bundle Optimization**: Tree shaking enabled
- **Development Speed**: Fast HMR with Vite
- **Production Builds**: Optimized builds with sensible defaults

### AI Integration Performance
- **Context Efficiency**: Optimized context files for AI parsing
- **Command Caching**: Reusable workflow patterns
- **Token Optimization**: Minimal context for maximum AI effectiveness

## 🔄 Extension Architecture

### Adding New Templates
```typescript
// 1. Create template directory
templates/
└── new-template/
    ├── components/
    ├── styles/
    └── config/

// 2. Add to CLI options
interface ProjectOptions {
  template: 'blog' | 'minimal' | 'new-template';
}

// 3. Add generation logic
async function generateNewTemplate(targetDir: string, config: TemplateConfig) {
  // Template-specific generation
}
```

### Custom State Management
```typescript
// Add new state management option
interface ProjectOptions {
  stateManagement: 'redux' | 'zustand' | 'jotai';
}

// Add generation logic
async function generateJotaiStore(targetDir: string) {
  // Jotai-specific setup
}
```

### Plugin System (Future)
```typescript
interface CityFrameworkPlugin {
  name: string;
  version: string;
  apply: (context: GenerationContext) => void;
}

// Plugin registration
const plugins = [
  new AuthenticationPlugin(),
  new FirebasePlugin(),
  new AnalyticsPlugin()
];
```

## 📊 Metrics and Monitoring

### Framework Metrics
- **Generation Time**: How long CLI takes to generate projects
- **Template Usage**: Which templates are most popular
- **Error Rates**: CLI failures and common issues
- **AI Context Effectiveness**: How well AI understands generated context

### Generated Project Metrics
- **Build Performance**: Time to build and bundle size
- **Development Experience**: Hot reload speed, error clarity
- **Code Quality**: Linting passes, TypeScript strict compliance
- **AI Productivity**: How effectively AI assists with development

---

*The architecture is designed for scalability, maintainability, and optimal AI collaboration while maintaining simplicity and performance.* 🏗️✨