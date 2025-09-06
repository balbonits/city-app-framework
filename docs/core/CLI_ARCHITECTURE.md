# City App Framework: CLI Architecture

## Overview

The City App Framework CLI is built as a Node.js command-line tool that follows the proven patterns of `create-next-app` and `create vite`, while adding comprehensive Claude Code integration and AI context generation.

## Architecture Principles

### **1. Simplicity First**
- 8 focused prompts (not overwhelming questionnaires)
- Smart defaults for rapid setup
- `--yes` flag support for automation
- Clear error messages and recovery paths

### **2. Claude Code Optimization**
- CLAUDE.md generation as core feature
- Custom Claude commands out of the box
- Rich project context from day one
- AI-readable documentation throughout

### **3. Template-Driven Generation**
- Multi-layer template system
- Dynamic content generation
- Conditional file inclusion
- Type-safe template processing

---

## Core CLI Components

### **Entry Point & Bootstrapping**

#### **`bin/create-city-app.js`**
```javascript
#!/usr/bin/env node

/**
 * Main CLI entry point
 * Features:
 * - Node.js version checking (18+)
 * - Shebang for Unix-like systems
 * - Minimal error handling
 * - Passes control to main logic
 */

const { execSync } = require('child_process')
const semver = require('semver')

// Check Node.js version
const nodeVersion = process.version
const requiredVersion = '18.0.0'

if (!semver.gte(nodeVersion, requiredVersion)) {
  console.error(`Node.js ${requiredVersion} or higher is required. You have ${nodeVersion}.`)
  process.exit(1)
}

// Check if running via npx vs local installation
const isNpx = process.env.npm_config_user_config?.includes('_npx')

// Import and run main CLI
require('../dist/index.js').main(process.argv).catch(error => {
  console.error('Error:', error.message)
  process.exit(1)
})
```

#### **`src/index.ts`**
```typescript
/**
 * Main CLI orchestrator
 * Coordinates all CLI operations in sequence
 */

import { Command } from 'commander'
import { createCityApp } from './cli/create-city-app'
import { version } from '../package.json'

export async function main(argv: string[]) {
  const program = new Command()

  program
    .name('create-city-app')
    .description('Create a new City App Framework project')
    .version(version)
    .argument('[project-name]', 'Name of the project')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .option('--template <template>', 'Template to use (minimal, dashboard, ecommerce, blog)')
    .option('--no-install', 'Skip dependency installation')
    .option('--no-git', 'Skip git initialization')
    .option('--verbose', 'Show verbose output')
    .action(async (projectName, options) => {
      await createCityApp(projectName, options)
    })

  await program.parseAsync(argv)
}
```

---

## Interactive Prompt System

### **`src/prompts/index.ts`**
```typescript
/**
 * Interactive prompting system
 * Uses 'prompts' package for user interaction
 */

import prompts from 'prompts'
import chalk from 'chalk'
import { validateNpmPackageName } from './validators'

export interface PromptResponses {
  projectName: string
  typescript: boolean
  stateManagement: 'zustand' | 'redux' | 'context' | 'none'
  tailwind: boolean
  claudeContext: boolean
  audits: boolean
  template: 'minimal' | 'dashboard' | 'ecommerce' | 'blog'
}

export async function runPrompts(
  initialName?: string,
  options: any = {}
): Promise<PromptResponses> {
  
  // Skip prompts if --yes flag
  if (options.yes) {
    return getDefaults(initialName)
  }

  console.log()
  console.log(chalk.blue('🏙️ Welcome to City App Framework!'))
  console.log(chalk.gray('Let\'s set up your AI-optimized project...'))
  console.log()

  const questions = [
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project named?',
      initial: initialName || 'my-city-app',
      validate: (name: string) => {
        const validation = validateNpmPackageName(name)
        if (!validation.valid) {
          return `Invalid package name: ${validation.problems[0]}`
        }
        return true
      }
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      initial: true
    },
    {
      type: 'select',
      name: 'stateManagement',
      message: 'Which state management would you like?',
      choices: [
        {
          title: 'Zustand (Recommended)',
          value: 'zustand',
          description: 'Lightweight, TypeScript-first state management'
        },
        {
          title: 'Redux Toolkit',
          value: 'redux',
          description: 'Predictable state with DevTools support'
        },
        {
          title: 'Context API',
          value: 'context',
          description: 'Built-in React state management'
        },
        {
          title: 'None',
          value: 'none',
          description: 'Manual state management'
        }
      ],
      initial: 0
    },
    {
      type: 'confirm',
      name: 'tailwind',
      message: 'Would you like to use Tailwind CSS?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'claudeContext',
      message: 'Would you like Claude Code context setup? (Recommended)',
      initial: true
    },
    {
      type: 'confirm',
      name: 'audits',
      message: 'Would you like Commission on Audits health monitoring?',
      initial: true
    },
    {
      type: 'select',
      name: 'template',
      message: 'Choose a starting template:',
      choices: [
        {
          title: 'Minimal',
          value: 'minimal',
          description: 'Basic setup with essential structure'
        },
        {
          title: 'Dashboard',
          value: 'dashboard',
          description: 'Admin panel with authentication'
        },
        {
          title: 'E-commerce',
          value: 'ecommerce',
          description: 'Online store with cart functionality'
        },
        {
          title: 'Blog',
          value: 'blog',
          description: 'Content management with MDX support'
        }
      ],
      initial: 0
    }
  ]

  const responses = await prompts(questions, {
    onCancel: () => {
      console.log(chalk.red('\n✗ Operation cancelled'))
      process.exit(1)
    }
  })

  return responses as PromptResponses
}

function getDefaults(projectName?: string): PromptResponses {
  return {
    projectName: projectName || 'my-city-app',
    typescript: true,
    stateManagement: 'zustand',
    tailwind: true,
    claudeContext: true,
    audits: true,
    template: 'minimal'
  }
}
```

### **`src/prompts/validators.ts`**
```typescript
/**
 * Input validation utilities
 */

import validateNpmName from 'validate-npm-package-name'
import fs from 'fs-extra'
import path from 'path'

export function validateNpmPackageName(name: string) {
  return validateNpmName(name)
}

export function validateProjectPath(projectPath: string): { valid: boolean; error?: string } {
  if (fs.existsSync(projectPath)) {
    const stat = fs.statSync(projectPath)
    if (stat.isDirectory()) {
      const contents = fs.readdirSync(projectPath)
      if (contents.length > 0) {
        return {
          valid: false,
          error: `Directory ${projectPath} is not empty`
        }
      }
    } else {
      return {
        valid: false,
        error: `${projectPath} already exists and is not a directory`
      }
    }
  }

  return { valid: true }
}

export function validateNodeVersion(required: string = '18.0.0'): { valid: boolean; error?: string } {
  const current = process.version.slice(1) // Remove 'v' prefix
  const semver = require('semver')
  
  if (!semver.gte(current, required)) {
    return {
      valid: false,
      error: `Node.js ${required} or higher is required. You have ${current}.`
    }
  }
  
  return { valid: true }
}
```

---

## Project Generation Engine

### **`src/generator/index.ts`**
```typescript
/**
 * Main project generation orchestrator
 * Coordinates all generation steps
 */

import ora from 'ora'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs-extra'

import { PromptResponses } from '../prompts'
import { copyTemplateFiles } from './copy-files'
import { generateDynamicFiles } from './dynamic-files'
import { generateClaudeContext } from './claude-context'
import { setupAudits } from './audits'
import { installDependencies } from './dependencies'
import { initializeGit } from './git'

export interface GenerationConfig extends PromptResponses {
  projectPath: string
  verbose: boolean
  skipInstall: boolean
  skipGit: boolean
}

export async function generateProject(config: GenerationConfig) {
  const { projectName, projectPath } = config
  
  console.log()
  console.log(`🏗️ Creating City App ${chalk.cyan(projectName)} in ${chalk.gray(projectPath)}`)
  console.log()

  try {
    // 1. Create project directory
    const spinner1 = ora('Creating project directory...').start()
    await fs.ensureDir(projectPath)
    spinner1.succeed('Project directory created')

    // 2. Copy template files
    const spinner2 = ora('Copying template files...').start()
    await copyTemplateFiles(config)
    spinner2.succeed('Template files copied')

    // 3. Generate dynamic files
    const spinner3 = ora('Generating configuration files...').start()
    await generateDynamicFiles(config)
    spinner3.succeed('Configuration files generated')

    // 4. Setup Claude context
    if (config.claudeContext) {
      const spinner4 = ora('Setting up Claude Code context...').start()
      await generateClaudeContext(config)
      spinner4.succeed('Claude Code context configured')
    }

    // 5. Setup Commission on Audits
    if (config.audits) {
      const spinner5 = ora('Configuring Commission on Audits...').start()
      await setupAudits(config)
      spinner5.succeed('Commission on Audits configured')
    }

    // 6. Install dependencies
    if (!config.skipInstall) {
      const spinner6 = ora('Installing dependencies...').start()
      try {
        await installDependencies(config)
        spinner6.succeed('Dependencies installed')
      } catch (error) {
        spinner6.warn('Dependency installation failed - you can install manually')
        if (config.verbose) {
          console.log(chalk.yellow('Error details:'), error.message)
        }
      }
    }

    // 7. Initialize git
    if (!config.skipGit) {
      const spinner7 = ora('Initializing git repository...').start()
      try {
        await initializeGit(config)
        spinner7.succeed('Git repository initialized')
      } catch (error) {
        spinner7.warn('Git initialization failed - you can initialize manually')
      }
    }

    // Success message
    console.log()
    console.log(chalk.green('✅ Success!'), `Created ${projectName} at ${projectPath}`)
    console.log()
    console.log('Inside that directory, you can run several commands:')
    console.log()
    console.log(chalk.cyan('  npm run dev'))
    console.log('    Starts the development server')
    console.log()
    console.log(chalk.cyan('  npm run build'))
    console.log('    Builds the app for production')
    console.log()
    
    if (config.audits) {
      console.log(chalk.cyan('  npm run audit:all'))
      console.log('    Runs all health checks')
      console.log()
    }

    if (config.claudeContext) {
      console.log(chalk.blue('🤖 Claude Code is ready!'))
      console.log('   Your project has comprehensive AI context in CLAUDE.md')
      console.log('   Custom commands available in .claude/commands/')
      console.log()
    }

    console.log('We suggest that you begin by typing:')
    console.log()
    console.log(chalk.cyan(`  cd ${projectName}`))
    console.log(chalk.cyan('  npm run dev'))
    console.log()
    console.log('Happy coding! 🏙️')

  } catch (error) {
    console.log()
    console.log(chalk.red('❌ Failed to create City App'))
    console.log(chalk.red('Error:'), error.message)
    
    if (config.verbose) {
      console.log(chalk.gray('Stack trace:'))
      console.log(error.stack)
    }
    
    process.exit(1)
  }
}
```

---

## Template System Architecture

### **`src/generator/copy-files.ts`**
```typescript
/**
 * Template file copying and processing system
 * Handles multi-layer template inheritance
 */

import fs from 'fs-extra'
import path from 'path'
import { GenerationConfig } from './index'

const TEMPLATES_DIR = path.join(__dirname, '../../templates')

export async function copyTemplateFiles(config: GenerationConfig) {
  const { projectPath, template, stateManagement } = config

  // 1. Copy base template (shared files)
  const basePath = path.join(TEMPLATES_DIR, 'base')
  await copyTemplate(basePath, projectPath, config)

  // 2. Copy template-specific files
  const templatePath = path.join(TEMPLATES_DIR, template)
  if (await fs.pathExists(templatePath)) {
    await copyTemplate(templatePath, projectPath, config, { overwrite: true })
  }

  // 3. Copy state management template
  if (stateManagement !== 'none') {
    const statePath = path.join(TEMPLATES_DIR, 'state', stateManagement)
    if (await fs.pathExists(statePath)) {
      await copyTemplate(statePath, path.join(projectPath, 'src/store'), config, { overwrite: true })
    }
  }
}

async function copyTemplate(
  sourcePath: string,
  targetPath: string,
  config: GenerationConfig,
  options: { overwrite?: boolean } = {}
) {
  const files = await fs.readdir(sourcePath, { withFileTypes: true })

  for (const file of files) {
    const sourceFile = path.join(sourcePath, file.name)
    const targetFile = path.join(targetPath, file.name)

    if (file.isDirectory()) {
      await fs.ensureDir(targetFile)
      await copyTemplate(sourceFile, targetFile, config, options)
    } else {
      // Skip certain files conditionally
      if (shouldSkipFile(file.name, config)) {
        continue
      }

      // Process template files
      if (file.name.endsWith('.template')) {
        const processedName = file.name.replace('.template', '')
        const processedPath = path.join(targetPath, processedName)
        await processTemplateFile(sourceFile, processedPath, config)
      } else {
        await fs.copy(sourceFile, targetFile, { overwrite: options.overwrite })
      }
    }
  }
}

function shouldSkipFile(fileName: string, config: GenerationConfig): boolean {
  // Skip TypeScript files if TypeScript not selected
  if (!config.typescript && fileName.endsWith('.ts') && !fileName.endsWith('.d.ts')) {
    return true
  }

  // Skip Tailwind config if Tailwind not selected
  if (!config.tailwind && fileName.includes('tailwind')) {
    return true
  }

  return false
}

async function processTemplateFile(sourcePath: string, targetPath: string, config: GenerationConfig) {
  const content = await fs.readFile(sourcePath, 'utf-8')
  const processed = processTemplateContent(content, config)
  await fs.ensureDir(path.dirname(targetPath))
  await fs.writeFile(targetPath, processed)
}

function processTemplateContent(content: string, config: GenerationConfig): string {
  const replacements = {
    '{{PROJECT_NAME}}': config.projectName,
    '{{PROJECT_NAME_KEBAB}}': config.projectName.toLowerCase().replace(/\s+/g, '-'),
    '{{PROJECT_NAME_PASCAL}}': toPascalCase(config.projectName),
    '{{TYPESCRIPT}}': config.typescript.toString(),
    '{{STATE_MANAGEMENT}}': config.stateManagement,
    '{{TAILWIND}}': config.tailwind.toString(),
    '{{TEMPLATE}}': config.template,
    '{{CURRENT_DATE}}': new Date().toISOString().split('T')[0],
    '{{CLAUDE_CONTEXT}}': config.claudeContext.toString(),
    '{{AUDITS}}': config.audits.toString()
  }

  let processed = content
  for (const [placeholder, value] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(escapeRegExp(placeholder), 'g'), value)
  }

  // Handle conditional blocks
  processed = processConditionalBlocks(processed, config)

  return processed
}

function processConditionalBlocks(content: string, config: GenerationConfig): string {
  // Process {{#if typescript}} ... {{/if}} blocks
  content = content.replace(/{{#if typescript}}([\s\S]*?){{\/if}}/g, 
    config.typescript ? '$1' : '')

  // Process {{#if tailwind}} ... {{/if}} blocks
  content = content.replace(/{{#if tailwind}}([\s\S]*?){{\/if}}/g, 
    config.tailwind ? '$1' : '')

  // Process {{#if claudeContext}} ... {{/if}} blocks
  content = content.replace(/{{#if claudeContext}}([\s\S]*?){{\/if}}/g, 
    config.claudeContext ? '$1' : '')

  return content
}

function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toUpperCase())
    .replace(/\s+/g, '')
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
```

---

## Claude Code Integration System

### **`src/generator/claude-context.ts`**
```typescript
/**
 * Claude Code context generation
 * Creates comprehensive AI context files
 */

import fs from 'fs-extra'
import path from 'path'
import { GenerationConfig } from './index'

export async function generateClaudeContext(config: GenerationConfig) {
  const { projectPath } = config

  // 1. Generate root CLAUDE.md
  await generateRootClaudeFile(config)

  // 2. Generate Claude commands
  await generateClaudeCommands(config)

  // 3. Generate additional AI context
  await generateAIContext(config)
}

async function generateRootClaudeFile(config: GenerationConfig) {
  const { projectPath, projectName, template, typescript, stateManagement, tailwind, audits } = config

  const claudeContent = `# ${projectName} - City App Framework Project

## Project Overview
This is a ${template} application built with the City App Framework, designed for AI-assisted development with Claude Code.

## Tech Stack
- **Framework**: React ${typescript ? '+ TypeScript' : '+ JavaScript'}
- **State Management**: ${getStateManagementDescription(stateManagement)}
- **Styling**: ${tailwind ? 'Tailwind CSS' : 'CSS Modules'}
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
${audits ? '- **Monitoring**: Commission on Audits health tracking' : ''}

## City Framework Structure
Our project follows the City metaphor for organization:

- \`src/context/\` - **City Hall** (State management and providers)
- \`src/components/\` - **Buildings** (Reusable UI components)
- \`src/utils/\` - **Works** (Utilities and helper functions)
- \`src/audits/\` - **Commission on Audits** (Health monitoring and reports)
- \`src/types/\` - **Models** (TypeScript type definitions)
- \`src/app/\` - **Districts** (Application routes and pages)

## Available Commands
- \`npm run dev\` - Start development server (http://localhost:5173)
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build locally
- \`npm run test\` - Run test suite
- \`npm run test:coverage\` - Run tests with coverage report
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking
${audits ? `
## Audit Commands
- \`npm run audit:all\` - Run all health checks
- \`npm run audit:lighthouse\` - Performance audit
- \`npm run audit:security\` - Security vulnerability scan
- \`npm run audit:bundle\` - Bundle size analysis
` : ''}

## Development Guidelines

### Code Style Rules
1. **Use functional components with hooks** - No class components
2. **Follow React best practices** - Hooks rules, proper key props, etc.
3. **Maintain TypeScript strict mode** - No \`any\` types, explicit interfaces
4. **Ensure accessibility** - WCAG AA compliance, proper ARIA labels
5. **Write tests for critical features** - Especially business logic and user flows

### File Organization
- **Components**: One component per file, named exports preferred
- **Hooks**: Custom hooks in \`src/hooks/\` or colocated with components
- **Utilities**: Pure functions in \`src/utils/\` with comprehensive JSDoc
- **Types**: Shared types in \`src/types/\`, component-specific types colocated

### State Management Guidelines
${getStateManagementGuidelines(stateManagement)}

## Security Guidelines
- **Validate all user inputs** - Use proper validation libraries
- **Use parameterized queries** - Never string concatenation for DB queries
- **Never expose API keys** - Use environment variables, never commit secrets
- **Escape output properly** - Prevent XSS in HTML/JS contexts
- **Implement proper authentication** - Use secure session management

## Testing Strategy
- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Test critical user journeys
- **Accessibility Tests**: Automated a11y testing with axe

## Performance Guidelines
- **Lazy load routes** - Use React.lazy() for code splitting
- **Optimize images** - Use appropriate formats and sizes
- **Minimize bundle size** - Tree shake unused code
- **Use React.memo() judiciously** - For expensive re-renders only

## DO NOT
- **Modify files in \`node_modules/\`** - Always use proper dependency management
- **Commit sensitive data** - API keys, passwords, personal information
- **Skip accessibility attributes** - Always include proper ARIA labels
- **Ignore TypeScript errors** - Fix all type errors before committing
- **Use \`any\` type** - Always provide proper types
- **Commit directly to main** - Use feature branches and pull requests

## Claude Code Commands
Custom commands are available in \`.claude/commands/\`:
- \`/project:add-feature\` - Scaffold a new feature
- \`/project:fix-bug\` - Debug workflow assistance
- \`/project:run-audit\` - Trigger health checks
- \`/project:refactor\` - Refactoring guidelines

## Project Context
This project was generated with City App Framework, designed specifically for AI-assisted development. The structure and patterns are optimized for Claude Code understanding and productive collaboration.

For questions about the City framework patterns, refer to the documentation in \`.ai/context/\`.
`

  await fs.writeFile(path.join(projectPath, 'CLAUDE.md'), claudeContent)
}

async function generateClaudeCommands(config: GenerationConfig) {
  const commandsPath = path.join(config.projectPath, '.claude/commands')
  await fs.ensureDir(commandsPath)

  // Add Feature Command
  const addFeatureCommand = `# Add Feature Command
Usage: /project:add-feature <feature-name>

## Steps to Add a New Feature:

### 1. Plan the Feature
- Define clear requirements and acceptance criteria
- Identify which components and state management are needed
- Plan any new API endpoints or data structures
- Consider accessibility and performance implications

### 2. Create Feature Structure
Create a new feature folder following City framework patterns:
\`\`\`
src/features/<feature-name>/
├── components/          # Feature-specific components
├── hooks/              # Feature-specific hooks
├── types.ts            # Feature-specific TypeScript types
├── index.ts            # Feature exports
└── __tests__/          # Feature tests
\`\`\`

### 3. Implement Components
- Follow existing component patterns in \`src/components/\`
- Use TypeScript interfaces for all props
- Implement proper accessibility attributes
- Follow naming conventions (PascalCase for components)

### 4. Add State Management
${getFeatureStateGuidelines(config.stateManagement)}

### 5. Add Routing (if needed)
- Add route definitions in \`src/app/\`
- Implement proper navigation patterns
- Add route guards if authentication required

### 6. Write Tests
- Unit tests for components (\`*.test.tsx\`)
- Integration tests for feature workflows
- Accessibility tests using @testing-library/jest-dom

### 7. Update Documentation
- Update CLAUDE.md if architectural changes
- Add JSDoc comments for public APIs
- Update README if user-facing changes

## City Framework Integration
- **State**: Use \`src/context/\` for shared state
- **Utilities**: Add helpers to \`src/utils/\`
- **Components**: Reuse from \`src/components/\`
- **Types**: Share types via \`src/types/\`
- **Testing**: Follow existing test patterns

Always run \`npm run audit:all\` after implementing to ensure code quality.
`

  await fs.writeFile(path.join(commandsPath, 'add-feature.md'), addFeatureCommand)

  // Fix Bug Command
  const fixBugCommand = `# Fix Bug Command
Usage: /project:fix-bug [issue-description]

## Debugging Workflow:

### 1. Reproduce the Issue
- Create a minimal reproduction case
- Document steps to reproduce
- Identify affected components/features
- Check if issue exists in different browsers/devices

### 2. Analyze the Problem
- Check browser console for errors
- Review network tab for failed requests
- Examine component props and state
- Check TypeScript errors in IDE

### 3. Common Issue Categories

#### State Management Issues
${getDebuggingGuidelines(config.stateManagement)}

#### Component Issues
- Props not being passed correctly
- Missing key props in lists
- Incorrect conditional rendering
- Missing cleanup in useEffect

#### Performance Issues
- Unnecessary re-renders
- Large bundle sizes
- Unoptimized images
- Memory leaks in subscriptions

#### Accessibility Issues
- Missing ARIA labels
- Incorrect heading hierarchy
- Color contrast problems
- Keyboard navigation issues

### 4. Testing the Fix
- Write a test that reproduces the bug
- Fix the issue
- Ensure the test passes
- Run full test suite
- Test manually in browser

### 5. Prevention
- Add TypeScript types to prevent similar issues
- Add validation for user inputs
- Implement proper error boundaries
- Add monitoring/logging for production

## Debugging Tools
- **React DevTools**: Component inspection
- **Network Tab**: API request debugging
- **Console**: Error messages and logging
- **Lighthouse**: Performance analysis
- **axe DevTools**: Accessibility checking

Always run \`npm run audit:all\` after fixing to ensure no regressions.
`

  await fs.writeFile(path.join(commandsPath, 'fix-bug.md'), fixBugCommand)

  // Run Audit Command
  if (config.audits) {
    const runAuditCommand = `# Run Audit Command
Usage: /project:run-audit [audit-type]

## Available Audits:

### Performance Audit
\`npm run audit:lighthouse\`
- Measures Core Web Vitals
- Checks performance best practices
- Provides optimization recommendations
- Generates detailed performance report

### Security Audit
\`npm run audit:security\`
- Scans for vulnerable dependencies
- Checks for security best practices
- Reports potential security issues
- Provides remediation guidance

### Bundle Analysis
\`npm run audit:bundle\`
- Analyzes bundle composition
- Identifies large dependencies
- Shows code splitting opportunities
- Provides size optimization tips

### Test Coverage
\`npm run test:coverage\`
- Measures test coverage percentage
- Identifies untested code paths
- Provides coverage reports
- Ensures quality standards

### Complete Audit
\`npm run audit:all\`
Runs all audits in sequence and generates comprehensive report.

## Reading Audit Results

### Performance Metrics
- **LCP (Largest Contentful Paint)**: Should be < 2.5s
- **FID (First Input Delay)**: Should be < 100ms
- **CLS (Cumulative Layout Shift)**: Should be < 0.1
- **Performance Score**: Aim for 90+ (green)

### Security Issues
- **Critical**: Fix immediately
- **High**: Fix within 1 week
- **Moderate**: Fix within 1 month
- **Low**: Fix when convenient

### Coverage Thresholds
- **Statements**: Aim for 80%+
- **Branches**: Aim for 75%+
- **Functions**: Aim for 80%+
- **Lines**: Aim for 80%+

## Audit Schedule
- **Daily**: Run during development
- **Pre-commit**: Basic checks before commit
- **Pre-deployment**: Full audit before release
- **Weekly**: Complete audit review

Results are stored in \`src/audits/reports/\` for historical tracking.
`

    await fs.writeFile(path.join(commandsPath, 'run-audit.md'), runAuditCommand)
  }
}

async function generateAIContext(config: GenerationConfig) {
  const aiPath = path.join(config.projectPath, '.ai')
  await fs.ensureDir(aiPath)

  // City Charter
  const cityCharter = `# ${config.projectName} City Charter

## Project Vision
This ${config.template} application represents a digital city built with the City App Framework. Every component, utility, and feature follows the city metaphor for intuitive organization and AI understanding.

## City Governance
- **Mayor**: The developer (you) who makes high-level decisions
- **Citizens**: AI agents (like Claude) who help build and maintain the city
- **Policies**: Code standards, patterns, and architectural decisions
- **Infrastructure**: The framework structure that supports all development

## Architectural Decisions

### Why This Tech Stack?
- **React**: Mature, well-documented, great AI support
- **TypeScript**: Type safety helps both humans and AI understand code
- **Vite**: Fast development experience, good AI context
- **${getStateManagementDescription(config.stateManagement)}**: ${getStateManagementRationale(config.stateManagement)}

### City Districts (Folders)
Each folder represents a district in our digital city:

#### City Hall (\`src/context/\`)
The seat of government where city-wide decisions and state are managed.

#### Buildings (\`src/components/\`)  
The structures that citizens (users) interact with daily.

#### Works Department (\`src/utils/\`)
The infrastructure that keeps the city running smoothly.

#### Commission on Audits (\`src/audits/\`)
Independent oversight ensuring city health and transparency.

#### Models Department (\`src/types/\`)
The official documentation and contracts that govern city operations.

## Development Philosophy
1. **AI-First**: Every decision considers how AI agents can best understand and contribute
2. **Quality Over Speed**: Better to build right than rebuild later
3. **Accessibility Always**: Every citizen should access our digital city
4. **Test-Driven Confidence**: Tests are our city's safety inspectors
5. **Documentation as Infrastructure**: Good docs are as important as good code

## Success Metrics
- Code that AI agents can understand and extend
- Maintainable architecture that scales with the team
- Accessible features that work for all users
- Performance that delights users
- Tests that provide confidence in changes

This charter guides all development decisions and helps AI agents understand not just what we built, but why we built it this way.
`

  await fs.writeFile(path.join(aiPath, 'city-charter.md'), cityCharter)

  // Architecture Context
  const contextPath = path.join(aiPath, 'context')
  await fs.ensureDir(contextPath)

  const architectureDoc = `# Technical Architecture

## System Overview
${config.projectName} is built as a modern React application following City App Framework patterns for AI-optimized development.

## Technology Decisions

### Frontend Architecture
- **React 18**: Latest stable with concurrent features
- **TypeScript**: Strict mode for type safety
- **Vite**: Fast development and optimized builds
- **${tailwindDescription(config.tailwind)}**: Styling approach

### State Architecture
${getArchitectureStateDescription(config.stateManagement)}

### Build Architecture
- **Vite**: Build tool and dev server
- **TypeScript Compiler**: Type checking and compilation
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
${config.audits ? '- **Commission on Audits**: Quality monitoring and reporting' : ''}

## File Organization Strategy

### Component Organization
Components are organized by scope and reusability:
- **Global components** (\`src/components/\`): Reused across features
- **Feature components** (\`src/features/*/components/\`): Feature-specific
- **Page components** (\`src/app/\`): Route-level components

### State Organization
${getArchitectureStateOrganization(config.stateManagement)}

### Utility Organization
- **General utilities** (\`src/utils/\`): Shared across features
- **Feature utilities** (\`src/features/*/utils/\`): Feature-specific
- **Type utilities** (\`src/types/\`): Shared TypeScript utilities

## Development Patterns

### Component Patterns
1. **Function components only** - No class components
2. **Named exports preferred** - Better for tree shaking
3. **Props interfaces** - Always define prop types
4. **Accessibility first** - Include ARIA attributes

### Testing Patterns
1. **Test behavior, not implementation** - Focus on user interactions
2. **Unit tests for logic** - Pure functions and hooks
3. **Integration tests for flows** - User journeys
4. **Accessibility tests** - Automated a11y checking

### Performance Patterns
1. **Lazy loading** - Code splitting at route level
2. **Memoization** - React.memo() for expensive components
3. **Bundle optimization** - Tree shaking and code splitting
4. **Image optimization** - Proper formats and lazy loading

This architecture supports both current development needs and future scaling requirements.
`

  await fs.writeFile(path.join(contextPath, 'architecture.md'), architectureDoc)
}

// Helper functions for content generation
function getStateManagementDescription(stateManagement: string): string {
  const descriptions = {
    'zustand': 'Zustand (lightweight state management)',
    'redux': 'Redux Toolkit (predictable state container)',
    'context': 'React Context API (built-in state management)',
    'none': 'Local component state'
  }
  return descriptions[stateManagement] || descriptions.none
}

function getStateManagementGuidelines(stateManagement: string): string {
  const guidelines = {
    'zustand': `
#### Zustand Guidelines
- Create stores in \`src/store/\` with descriptive names
- Use TypeScript interfaces for store state
- Keep stores focused on single concerns
- Use subscriptions sparingly to avoid performance issues
- Leverage devtools for debugging in development`,

    'redux': `
#### Redux Toolkit Guidelines  
- Create slices in \`src/store/slices/\` following naming conventions
- Use createSlice() for all state logic
- Keep reducers pure with no side effects
- Use RTK Query for API state management
- Configure Redux DevTools for debugging`,

    'context': `
#### Context API Guidelines
- Create contexts in \`src/context/\` with providers
- Use useReducer for complex state logic
- Avoid prop drilling with strategic context placement  
- Split contexts by concern to optimize re-renders
- Provide default values and error boundaries`,

    'none': `
#### Local State Guidelines
- Use useState for component-local state
- Use useReducer for complex state logic
- Lift state up when needed by multiple components
- Consider extraction to custom hooks for reusability`
  }
  return guidelines[stateManagement] || guidelines.none
}

function getStateManagementRationale(stateManagement: string): string {
  const rationales = {
    'zustand': 'Chosen for simplicity and TypeScript integration',
    'redux': 'Chosen for predictability and debugging capabilities', 
    'context': 'Chosen for simplicity and React ecosystem integration',
    'none': 'Chosen for maximum flexibility and minimal dependencies'
  }
  return rationales[stateManagement] || rationales.none
}

function tailwindDescription(tailwind: boolean): string {
  return tailwind ? 'Tailwind CSS' : 'CSS Modules'
}

function getFeatureStateGuidelines(stateManagement: string): string {
  const guidelines = {
    'zustand': '- Create feature-specific stores if needed\n- Use global store for shared state\n- Follow naming conventions (useFeatureStore)',
    'redux': '- Create feature slices in store/slices/\n- Use RTK Query for feature API needs\n- Follow duck pattern for organization',
    'context': '- Create feature context if complex state needed\n- Use global contexts for shared state\n- Implement proper error boundaries',
    'none': '- Use local state within components\n- Lift state up when sharing needed\n- Consider custom hooks for complex logic'
  }
  return guidelines[stateManagement] || guidelines.none
}

function getDebuggingGuidelines(stateManagement: string): string {
  const guidelines = {
    'zustand': '- Use Zustand DevTools for state inspection\n- Check store subscriptions for performance\n- Verify state updates are triggering re-renders',
    'redux': '- Use Redux DevTools for time-travel debugging\n- Check action dispatching and reducer logic\n- Verify selectors are memoized properly',  
    'context': '- Use React DevTools to inspect context values\n- Check provider placement and nesting\n- Verify context dependencies and re-renders',
    'none': '- Use React DevTools to inspect component state\n- Check useState and useEffect dependencies\n- Verify state lifting and prop passing'
  }
  return guidelines[stateManagement] || guidelines.none
}

function getArchitectureStateDescription(stateManagement: string): string {
  const descriptions = {
    'zustand': 'Zustand provides lightweight state management with TypeScript support and minimal boilerplate.',
    'redux': 'Redux Toolkit provides predictable state management with excellent DevTools and middleware support.',
    'context': 'React Context API provides built-in state management suitable for most application needs.',
    'none': 'Local component state with useState and useReducer provides maximum flexibility.'
  }
  return descriptions[stateManagement] || descriptions.none
}

function getArchitectureStateOrganization(stateManagement: string): string {
  const organizations = {
    'zustand': 'Zustand stores are organized by domain in `src/store/` with TypeScript interfaces.',
    'redux': 'Redux slices are organized by feature in `src/store/slices/` with RTK Query for API state.',
    'context': 'React contexts are organized by scope in `src/context/` with provider components.',
    'none': 'State is managed locally in components with custom hooks for reusable logic.'
  }
  return organizations[stateManagement] || organizations.none
}
```

---

## Build System & Publishing

### **`scripts/build.ts`**
```typescript
/**
 * Build script for CLI packaging
 * Prepares CLI for npm publishing
 */

import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'

export async function buildCLI() {
  console.log(chalk.blue('🏗️ Building City App Framework CLI...'))

  try {
    // 1. Clean dist directory
    console.log('Cleaning dist directory...')
    await fs.remove('./dist')

    // 2. Compile TypeScript
    console.log('Compiling TypeScript...')
    execSync('tsc --project tsconfig.build.json', { stdio: 'inherit' })

    // 3. Copy templates
    console.log('Copying templates...')
    await fs.copy('./templates', './dist/templates')

    // 4. Copy package.json and update paths
    console.log('Processing package.json...')
    const packageJson = await fs.readJson('./package.json')
    packageJson.bin = {
      'create-city-app': './bin/create-city-app.js'
    }
    packageJson.main = './index.js'
    delete packageJson.devDependencies
    delete packageJson.scripts.dev
    delete packageJson.scripts.build
    
    await fs.writeJson('./dist/package.json', packageJson, { spaces: 2 })

    // 5. Copy other necessary files
    await fs.copy('./README.md', './dist/README.md')
    await fs.copy('./LICENSE', './dist/LICENSE').catch(() => {
      console.log(chalk.yellow('No LICENSE file found'))
    })

    // 6. Make bin script executable
    await fs.chmod('./dist/bin/create-city-app.js', 0o755)

    // 7. Validate build
    console.log('Validating build...')
    const distExists = await fs.pathExists('./dist/index.js')
    const templatesExist = await fs.pathExists('./dist/templates')
    const binExists = await fs.pathExists('./dist/bin/create-city-app.js')

    if (!distExists || !templatesExist || !binExists) {
      throw new Error('Build validation failed - missing required files')
    }

    console.log(chalk.green('✅ Build completed successfully!'))
    console.log(chalk.gray('Ready for npm publish from ./dist directory'))

  } catch (error) {
    console.log(chalk.red('❌ Build failed:'), error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  buildCLI()
}
```

### **`scripts/test-cli.ts`**
```typescript
/**
 * CLI testing script
 * Tests CLI functionality end-to-end
 */

import fs from 'fs-extra'
import path from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'
import os from 'os'

export async function testCLI() {
  console.log(chalk.blue('🧪 Testing CLI functionality...'))

  const testDir = path.join(os.tmpdir(), 'city-app-cli-test')
  const projectName = 'test-city-app'
  const projectPath = path.join(testDir, projectName)

  try {
    // 1. Clean test directory
    await fs.remove(testDir)
    await fs.ensureDir(testDir)

    // 2. Build CLI
    console.log('Building CLI...')
    execSync('npm run build', { stdio: 'inherit' })

    // 3. Test CLI with --yes flag
    console.log('Testing CLI with defaults...')
    process.chdir(testDir)
    
    execSync(`node ${path.join(__dirname, '../dist/index.js')} ${projectName} --yes`, {
      stdio: 'inherit'
    })

    // 4. Validate generated project
    console.log('Validating generated project...')
    
    const packageJsonExists = await fs.pathExists(path.join(projectPath, 'package.json'))
    const claudeMdExists = await fs.pathExists(path.join(projectPath, 'CLAUDE.md'))
    const srcExists = await fs.pathExists(path.join(projectPath, 'src'))
    
    if (!packageJsonExists || !claudeMdExists || !srcExists) {
      throw new Error('Generated project is missing required files')
    }

    // 5. Test project builds
    console.log('Testing generated project builds...')
    process.chdir(projectPath)
    
    execSync('npm install', { stdio: 'inherit' })
    execSync('npm run build', { stdio: 'inherit' })
    execSync('npm run test', { stdio: 'inherit' })

    console.log(chalk.green('✅ All CLI tests passed!'))

  } catch (error) {
    console.log(chalk.red('❌ CLI test failed:'), error.message)
    process.exit(1)
  } finally {
    // Cleanup
    await fs.remove(testDir).catch(() => {})
  }
}

if (require.main === module) {
  testCLI()
}
```

---

This CLI architecture provides a robust, extensible foundation for the City App Framework, specifically optimized for Claude Code integration while maintaining the simplicity that makes tools like create-next-app and create-vite successful.